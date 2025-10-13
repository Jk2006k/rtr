import fs from 'fs'
import path from 'path'
import {
  tagReplacements,
  importReplacements,
  styleReplacements,
  fileExtensions,
  unsupportedHTMLTags
} from './convertionRules.js'

export async function convertFile(inputFilePath, outputDir) {
  const ext = path.extname(inputFilePath)
  if (!fileExtensions.includes(ext)) return

  const code = fs.readFileSync(inputFilePath, 'utf-8')
  let converted = code

  Object.entries(importReplacements).forEach(([oldImport, newImport]) => {
    const regex = new RegExp(oldImport, 'g')
    converted = converted.replace(regex, newImport)
  })

  Object.entries(tagReplacements).forEach(([htmlTag, rnTag]) => {
    const openTag = new RegExp(`<${htmlTag}(\\s|>)`, 'g')
    const closeTag = new RegExp(`</${htmlTag}>`, 'g')
    converted = converted.replace(openTag, `<${rnTag}$1`)
    converted = converted.replace(closeTag, `</${rnTag}>`)
  })

  Object.entries(styleReplacements).forEach(([oldStyle, newStyle]) => {
    const regex = new RegExp(oldStyle, 'g')
    converted = converted.replace(regex, newStyle)
  })

  unsupportedHTMLTags.forEach(tag => {
    const regex = new RegExp(`<${tag}[\\s>]|</${tag}>`, 'g')
    if (regex.test(converted)) {
      console.warn(`Unsupported tag <${tag}> found in ${inputFilePath}`)
    }
  })

  fs.mkdirSync(outputDir, { recursive: true })
  const outputFilePath = path.join(outputDir, path.basename(inputFilePath))
  fs.writeFileSync(outputFilePath, converted, 'utf-8')
  console.log(`Converted: ${inputFilePath} → ${outputFilePath}`)
}
