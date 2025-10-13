import fs from 'fs'
import path from 'path'
import { convertFile } from './convertFile.js'
import { scanFiles } from './fileScanner.js'

export async function convertFolder(sourceDir, targetDir) {
  const files = scanFiles(sourceDir)

  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })

  for (const file of files) {
    const relativePath = path.relative(sourceDir, file)
    const outputPath = path.join(targetDir, relativePath)
    const outputDir = path.dirname(outputPath)

    fs.mkdirSync(outputDir, { recursive: true })
    await convertFile(file, outputDir)
  }

  console.log(`All eligible files from ${sourceDir} have been converted.`)
}
