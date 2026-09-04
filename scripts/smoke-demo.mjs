const baseUrl = (process.env.DEMO_BASE_URL ?? 'http://127.0.0.1:3000').replace(/\/$/, '')

const checks = [
  { path: '/demo-preview/good-kech-immo', brand: 'Good Kech Immo', phone: '212675633077' },
  { path: '/demo-preview/good-kech-immo/biens', brand: 'Good Kech Immo', phone: '212675633077' },
  { path: '/demo-preview/good-kech-immo/biens/gki-villa-amelkis', brand: 'Good Kech Immo', phone: '212675633077' },
  { path: '/demo-preview/immo-built', brand: 'Immo Built', phone: '212687004021' },
  { path: '/demo-preview/immo-built/biens', brand: 'Immo Built', phone: '212687004021' },
  { path: '/demo-preview/immo-built/biens/ib-appartement-cfc', brand: 'Immo Built', phone: '212687004021' },
  { path: '/demo/immo-built', brand: 'Immo Built', phone: '212687004021' },
  { path: '/demo/immo-built/biens', brand: 'Immo Built', phone: '212687004021' },
  { path: '/demo/immo-built/biens/ib-appartement-cfc', brand: 'Immo Built', phone: '212687004021' },
  { path: '/demo/eladimmo', brand: 'ALADIMMO', phone: '212662033540' },
  { path: '/demo/eladimmo/biens', brand: 'ALADIMMO', phone: '212662033540' },
  { path: '/demo/eladimmo/biens/ela-appartement-hay-riad', brand: 'ALADIMMO', phone: '212662033540' },
]

let failed = false

for (const check of checks) {
  try {
    const response = await fetch(`${baseUrl}${check.path}`, { redirect: 'manual' })
    const body = await response.text()
    const valid = response.status === 200 && body.includes(check.brand) && body.includes(check.phone)
    console.log(`${valid ? 'PASS' : 'FAIL'} ${response.status} ${check.path}`)
    if (!valid) failed = true
  } catch (error) {
    console.error(`FAIL ${check.path}: ${error instanceof Error ? error.message : error}`)
    failed = true
  }
}

if (failed) process.exit(1)
