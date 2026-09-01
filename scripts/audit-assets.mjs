import { readdirSync, statSync } from 'node:fs'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const publicRoot = join(projectRoot, 'public')
const rasterExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'])
const mediaExtensions = new Set([...rasterExtensions, '.mp4', '.webm', '.mov'])
const files = []

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = join(directory, entry.name)
    if (entry.isDirectory()) walk(absolutePath)
    else if (mediaExtensions.has(extname(entry.name).toLowerCase())) {
      files.push({
        path: relative(projectRoot, absolutePath).replaceAll('\\', '/'),
        bytes: statSync(absolutePath).size,
        isRaster: rasterExtensions.has(extname(entry.name).toLowerCase()),
      })
    }
  }
}

walk(publicRoot)
files.sort((a, b) => b.bytes - a.bytes)

console.log('Largest public media assets:')
for (const file of files.slice(0, 30)) {
  console.log(`${(file.bytes / 1024 / 1024).toFixed(2).padStart(7)} MB  ${file.path}`)
}

const largeRasters = files.filter((file) => file.isRaster && file.bytes > 500 * 1024)
for (const file of largeRasters) console.warn(`WARN: raster over 500 KB: ${file.path} (${(file.bytes / 1024).toFixed(0)} KB)`)

const failingDemoAssets = files.filter((file) => file.isRaster && file.path.startsWith('public/demos/') && file.bytes > 1024 * 1024)
if (failingDemoAssets.length) {
  console.error('ERROR: demo raster assets must stay below 1 MB.')
  process.exit(1)
}

console.log(`Asset audit complete: ${files.length} media files; ${largeRasters.length} raster warning(s); ${failingDemoAssets.length} demo failure(s).`)
