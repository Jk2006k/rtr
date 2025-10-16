import fs from "fs"
import path from "path"

const FILE_AGE_LIMIT = 24 * 60 * 60 * 1000

export function cleanupOldFiles() {
  const convertedDir = path.join(process.cwd(), "converted")

  if (!fs.existsSync(convertedDir)) return

  fs.readdir(convertedDir, (err, files) => {
    if (err) {
      console.error("Error reading converted directory:", err)
      return
    }

    files.forEach((file) => {
      const filePath = path.join(convertedDir, file)
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Error getting stats for file:", filePath, err)
          return
        }

        const now = Date.now()
        const fileAge = now - stats.mtimeMs

        if (fileAge > FILE_AGE_LIMIT) {
          if (stats.isDirectory()) {
            fs.rm(filePath, { recursive: true, force: true }, (err) => {
              if (err) console.error("Failed to remove folder:", filePath, err)
              else console.log("Deleted old converted folder:", filePath)
            })
          } else {
            fs.unlink(filePath, (err) => {
              if (err) console.error("Failed to remove file:", filePath, err)
              else console.log("Deleted old converted file:", filePath)
            })
          }
        }
      })
    })
  })
}
