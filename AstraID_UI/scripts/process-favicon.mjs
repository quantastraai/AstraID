/**
 * Build tab favicons from the icon-only mark (transparent background).
 * Does not modify header wordmark assets (astra-logo.png).
 */
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

const srcDefault = join(rootDir, 'assets', 'favicon-source.png')
const src = process.argv[2] || srcDefault
const BLACK_THRESHOLD = 28
const SIZES = [16, 32]

async function loadTransparent() {
  const input = sharp(src).ensureAlpha()
  const { data, info } = await input.clone().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    if (r <= BLACK_THRESHOLD && g <= BLACK_THRESHOLD && b <= BLACK_THRESHOLD) {
      data[i + 3] = 0
    }
  }

  return sharp(data, {
    raw: { width, height, channels: 4 },
  }).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 0 })
}

async function main() {
  const base = await loadTransparent()

  for (const size of SIZES) {
    const out = join(rootDir, 'public', `favicon-${size}.png`)
    await base
      .clone()
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9 })
      .toFile(out)
    console.log('Wrote', out, `${size}x${size}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
