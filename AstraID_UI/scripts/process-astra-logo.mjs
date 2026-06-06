/**
 * Crop Astra ID logo PNG and replace solid black background with transparency.
 */
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

const srcDefault =
  process.env.ASTRA_LOGO_SRC || join(rootDir, 'public', 'dark.jpeg')

const src = process.argv[2] || srcDefault
const out = join(rootDir, 'public', 'astra-logo.png')

const BLACK_THRESHOLD = 28

async function main() {
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
