import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { convertFolder } from "../utils/convertFolder.js"
import { zipFolder } from "../utils/zipFolder.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const handleConversion = async (req, res) => {
  try {
    const { extractPath } = req.body
    if (!extractPath || !fs.existsSync(extractPath)) {
      return res.status(400).json({ message: "Invalid or missing extract path" })
    }

    const timestamp = Date.now()
    const convertedDir = path.join(__dirname, `../converted/${timestamp}`)
    const zipPath = path.join(__dirname, `../converted/${timestamp}.zip`)

    const convertedBase = path.join(__dirname, "../converted")
    if (!fs.existsSync(convertedBase)) fs.mkdirSync(convertedBase, { recursive: true })

    await convertFolder(extractPath, convertedDir)
    console.log(`Converted: ${extractPath} → ${convertedDir}`)

    await zipFolder(convertedDir, zipPath)
    console.log(`Zipped converted folder → ${zipPath}`)

    const zipDownloadPath = `/converted/${timestamp}.zip`

    res.json({
      message: "Conversion and zipping completed successfully",
      convertedDir,
      zipPath: zipDownloadPath
    })
  } catch (err) {
    console.error("Conversion error:", err)
    res.status(500).json({
      message: "Error during conversion",
      error: err.message
    })
  }
}
