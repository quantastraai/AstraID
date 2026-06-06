/**
 * Trim light-theme logo and remove pale pastel background (#E6EEF0-ish).
 */
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

const srcDefault = join(rootDir, 'public', 'light.jpeg')
const src = process.argv[2] || srcDefault
const out = join(rootDir, 'public', 'astra-logo-light.png')

/** Treat near-white / pastel page fills as transparent */
function isLightBackground(r, g, b) {
  const avg = (r + g + b) / 3
  if (avg >= 218) return true
  if (r >= 210 && g >= 218 && b >= 222) return true
  return false
}

async function main() {
  const input = sharp(src).ensureAlpha()
  const { data, info } = await input.clone().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    if (isLightBackground(r, g, b)) {
      data[i + 3] = 0
    }
  }

  await sharp(data, {
    raw: { width, height, channels: 4 },
  })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 0 })
    .png({ compressionLevel: 9 })
    .toFile(out)

  const meta = await sharp(out).metadata()
  console.log('Wrote', out, `${meta.width}x${meta.height}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
