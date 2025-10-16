import fs from "fs"
import unzipper from "unzipper";
import {scanFiles} from '../utils/fileScanner.js'


export const handleUpload = async (req, res) => {
  try {
    const filePath = req.file.path
    const extractPath = `extracted/${Date.now()}`
    if (!fs.existsSync("extracted")) fs.mkdirSync("extracted")
    fs.mkdirSync(extractPath)

    fs.createReadStream(filePath)
      .pipe(unzipper.Extract({ path: extractPath }))
      .on("close", () => {
        let files
        try {
          files = scanFiles(extractPath)
        } catch (err) {
          console.error("Error scanning files:", err)
          return res.status(500).json({ message: "Failed to scan extracted files", error: err.message })
        }

        res.json({
          message: "File uploaded and extracted successfully",
          extractPath,
          files,
        })
      })
      .on("error", (err) => {
        console.error("Extraction error:", err)
        res.status(500).json({ message: "Failed to extract zip file", error: err.message })
      })
  } catch (err) {
    console.error("Server error:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}
