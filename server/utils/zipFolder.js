import fs from 'fs'
import archiver from 'archiver'

export function zipFolder(sourceFolder, outputZipPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputZipPath)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', () => resolve(outputZipPath))
    archive.on('error', (err) => reject(err))

    archive.pipe(output)
    archive.directory(sourceFolder, false)
    archive.finalize()
  })
}
