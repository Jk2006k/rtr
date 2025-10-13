import fs from 'fs'
import path from 'path'
import { convertFolder } from '../utils/convertFolder.js'
import { zipFolder } from '../utils/zipFolder.js'   

export const handleConversion = async (req, res) => {
  try {
    const { extractPath } = req.body
    if (!extractPath || !fs.existsSync(extractPath)) {
      return res.status(400).json({ message: 'Invalid or missing extract path' })
    }

    const timestamp = Date.now()
    const convertedDir = `converted/${timestamp}`
    const zipPath = `converted/${timestamp}.zip`

    await convertFolder(extractPath, convertedDir)
    await zipFolder(convertedDir, zipPath)

    res.json({
      message: 'Conversion and zipping completed successfully',
      convertedDir,
      downloadUrl: `/${zipPath}`
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error during conversion', error: err.message })
  }
}
