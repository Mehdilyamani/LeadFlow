import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawn } from 'node:child_process'

const baseUrl = (process.env.DEMO_BASE_URL ?? 'http://127.0.0.1:3000').replace(/\/$/, '')
const chromeCandidates = process.platform === 'win32'
  ? [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    ]
  : ['/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
const chromePath = process.env.CHROME_PATH ?? chromeCandidates.find(existsSync)

if (!chromePath) {
  console.error('Chrome/Edge not found. Set CHROME_PATH to run the mobile smoke test.')
  process.exit(1)
}

const debugPort = 9333
const profileDir = mkdtempSync(join(tmpdir(), 'leadflow-mobile-smoke-'))
const browser = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${profileDir}`,
  'about:blank',
], { stdio: 'ignore', windowsHide: true })

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

async function waitForDebugger() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/list`)
      if (response.ok) return response.json()
    } catch {}
    await delay(100)
  }
  throw new Error('Chrome DevTools endpoint did not start')
}

function connect(webSocketUrl) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(webSocketUrl)
    const pending = new Map()
    const listeners = new Map()
    let id = 0

    socket.addEventListener('open', () => {
      resolve({
        send(method, params = {}) {
          id += 1
          const requestId = id
          socket.send(JSON.stringify({ id: requestId, method, params }))
          return new Promise((requestResolve, requestReject) => pending.set(requestId, { resolve: requestResolve, reject: requestReject }))
        },
        on(method, callback) {
          const callbacks = listeners.get(method) ?? []
          callbacks.push(callback)
          listeners.set(method, callbacks)
        },
        close() {
          socket.close()
        },
      })
    })
    socket.addEventListener('error', reject)
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data))
      if (message.id) {
        const request = pending.get(message.id)
        if (!request) return
        pending.delete(message.id)
        if (message.error) request.reject(new Error(message.error.message))
        else request.resolve(message.result)
        return
      }
      for (const callback of listeners.get(message.method) ?? []) callback(message.params)
    })
  })
}

const cases = [
  ...[
    [375, 667],
    [390, 844],
    [393, 852],
    [430, 932],
  ].map(([width, height]) => ({ path: '/demo-preview/good-kech-immo', width, height, brand: 'Good Kech Immo', phone: '212675633077' })),
  { path: '/demo-preview/good-kech-immo/biens', width: 390, height: 844, brand: 'Good Kech Immo', phone: '212675633077' },
  { path: '/demo-preview/good-kech-immo/biens/gki-villa-amelkis', width: 390, height: 844, brand: 'Good Kech Immo', phone: '212675633077' },
  { path: '/demo-preview/immo-built', width: 390, height: 844, brand: 'Immo Built', phone: '212687004021' },
  { path: '/demo-preview/immo-built/biens', width: 390, height: 844, brand: 'Immo Built', phone: '212687004021' },
  { path: '/demo-preview/immo-built/biens/ib-appartement-cfc', width: 390, height: 844, brand: 'Immo Built', phone: '212687004021' },
  { path: '/demo/immo-built', width: 390, height: 844, brand: 'Immo Built', phone: '212687004021' },
  { path: '/demo/immo-built/biens', width: 390, height: 844, brand: 'Immo Built', phone: '212687004021' },
  { path: '/demo/immo-built/biens/ib-appartement-cfc', width: 390, height: 844, brand: 'Immo Built', phone: '212687004021' },
]

let failed = false

try {
  const targets = await waitForDebugger()
  const pageTarget = targets.find((target) => target.type === 'page')
  if (!pageTarget) throw new Error('No Chrome page target found')
  const client = await connect(pageTarget.webSocketDebuggerUrl)
  const runtimeErrors = []
  const failedRequests = []

  client.on('Runtime.exceptionThrown', (event) => runtimeErrors.push(event.exceptionDetails?.text ?? 'Runtime exception'))
  client.on('Network.loadingFailed', (event) => {
    if (!event.canceled) failedRequests.push(event.errorText ?? 'Network request failed')
  })

  await client.send('Page.enable')
  await client.send('Runtime.enable')
  await client.send('Network.enable')

  for (const testCase of cases) {
    runtimeErrors.length = 0
    failedRequests.length = 0
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: testCase.width,
      height: testCase.height,
      deviceScaleFactor: 1,
      mobile: true,
    })
    await client.send('Page.navigate', { url: `${baseUrl}${testCase.path}` })

    for (let attempt = 0; attempt < 50; attempt += 1) {
      const ready = await client.send('Runtime.evaluate', { expression: "document.readyState === 'complete'", returnByValue: true })
      if (ready.result.value) break
      await delay(100)
    }
    for (let attempt = 0; attempt < 40; attempt += 1) {
      const imagesReady = await client.send('Runtime.evaluate', {
        expression: "[...document.images].filter((image) => { const rect = image.getBoundingClientRect(); return rect.width > 0 && rect.height > 0 && rect.top < innerHeight }).every((image) => image.complete && image.naturalWidth > 0)",
        returnByValue: true,
      })
      if (imagesReady.result.value) break
      await delay(100)
    }

    const evaluation = await client.send('Runtime.evaluate', {
      expression: `(() => ({
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        brand: document.body.innerText.includes(${JSON.stringify(testCase.brand)}),
        phone: document.documentElement.innerHTML.includes(${JSON.stringify(testCase.phone)}),
        heroLoaded: [...document.images].filter((image) => { const rect = image.getBoundingClientRect(); return rect.width > 0 && rect.height > 0 && rect.top < innerHeight }).every((image) => image.complete && image.naturalWidth > 0),
        propertyLink: document.querySelector('a[href*="/biens/"]')?.getAttribute('href') ?? null
      }))()`,
      returnByValue: true,
    })
    const result = evaluation.result.value
    const valid = result.width === testCase.width
      && result.scrollWidth <= result.width
      && result.brand
      && result.phone
      && result.heroLoaded
      && runtimeErrors.length === 0
      && failedRequests.length === 0

    console.log(`${valid ? 'PASS' : 'FAIL'} ${testCase.width}x${testCase.height} ${testCase.path} viewport=${result.width} scroll=${result.scrollWidth} hero=${result.heroLoaded}`)
    if (!valid) {
      if (runtimeErrors.length) console.error(`  runtime: ${runtimeErrors.join('; ')}`)
      if (failedRequests.length) console.error(`  network: ${failedRequests.join('; ')}`)
      failed = true
    }
  }

  client.close()
} finally {
  browser.kill()
  await Promise.race([
    new Promise((resolve) => browser.once('exit', resolve)),
    delay(1500),
  ])
  if (profileDir.startsWith(tmpdir())) {
    try {
      rmSync(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
    } catch {
      console.warn(`WARN: temporary Chrome profile could not be removed: ${profileDir}`)
    }
  }
}

if (failed) process.exit(1)
