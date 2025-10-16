import archiver from "archiver"
import fs from "fs"
import path from "path"

export const createZip = async (folderPath) => {
  const zipName = `${Date.now()}-converted.zip`
  const zipPath = path.join(process.cwd(), "converted_zips", zipName)

  if (!fs.existsSync("converted_zips")) {
    fs.mkdirSync("converted_zips")
  }

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath)
    const archive = archiver("zip", { zlib: { level: 9 } })

    output.on("close", () => resolve(zipPath))
    archive.on("error", (err) => reject(err))

    archive.pipe(output)
    archive.directory(folderPath, false)
    archive.finalize()
  })
}
