import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const failures = []
const warnings = []

function read(relativePath) {
  return readFileSync(join(projectRoot, relativePath), 'utf8')
}

const brandSource = read('app/demoBrands.ts')
const hostnames = [...brandSource.matchAll(/'([^']+\.leadflowimmo\.com)'\s*:\s*{/g)].map((match) => match[1])
const slugs = [...brandSource.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1])
const phones = [...brandSource.matchAll(/whatsappNumber:\s*'([^']+)'/g)].map((match) => match[1])
const logoPaths = [...brandSource.matchAll(/logoPath:\s*'([^']+)'/g)].map((match) => match[1])

if (!hostnames.length) failures.push('No demo hostname found in app/demoBrands.ts')
if (new Set(slugs).size !== slugs.length) failures.push('Duplicate demo slug found')
if (new Set(hostnames).size !== hostnames.length) failures.push('Duplicate demo hostname found')

for (const phone of phones) {
  if (!/^\d{11,15}$/.test(phone)) failures.push(`Invalid canonical WhatsApp number: ${phone}`)
}

for (const logoPath of logoPaths) {
  const absolutePath = join(projectRoot, 'public', logoPath.replace(/^\//, ''))
  if (!existsSync(absolutePath)) failures.push(`Missing logo asset: public${logoPath}`)
}

const demoFiles = [
  'app/goodKech/GoodKechHome.tsx',
  'app/goodKech/data.ts',
  'app/immoBuilt/ImmoBuiltHome.tsx',
  'app/immoBuilt/data.ts',
  'app/eladimmo/data.ts',
  'app/agenceReda/data.ts',
]

const propertySources = ['app/goodKech/data.ts', 'app/immoBuilt/data.ts', 'app/eladimmo/data.ts', 'app/agenceReda/data.ts']
for (const relativePath of propertySources) {
  const ids = [...read(relativePath).matchAll(/\bid:\s*'([^']+)'/g)].map((match) => match[1])
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index)
  if (!ids.length) failures.push(`No property IDs found in ${relativePath}`)
  if (duplicates.length) failures.push(`Duplicate property IDs in ${relativePath}: ${[...new Set(duplicates)].join(', ')}`)
}

const assetReferences = new Set()
for (const relativePath of demoFiles) {
  const source = read(relativePath)
  for (const match of source.matchAll(/['"](\/demos\/[^'"]+)['"]/g)) assetReferences.add(match[1])
  const remoteImages = [...source.matchAll(/https:\/\/images\.unsplash\.com\/[^'"\s]+/g)]
  if (remoteImages.length) warnings.push(`${relativePath} still contains ${remoteImages.length} runtime Unsplash image reference(s)`)
}

for (const assetPath of assetReferences) {
  const absolutePath = join(projectRoot, 'public', assetPath.replace(/^\//, ''))
  if (!existsSync(absolutePath)) failures.push(`Missing demo image: public${assetPath}`)
}

for (const warning of warnings) console.warn(`WARN: ${warning}`)

if (failures.length) {
  for (const failure of failures) console.error(`ERROR: ${failure}`)
  process.exit(1)
}

console.log(`Demo config valid: ${hostnames.length} hostnames, ${slugs.length} slugs, ${logoPaths.length} logos, ${assetReferences.size} local demo images.`)
