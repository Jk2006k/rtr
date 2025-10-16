import fs from 'fs'
import path from 'path'
import {
  tagReplacements,
  importReplacements,
  fileExtensions,
  unsupportedHTMLTags
} from './convertionRules.js'

function convertCSS(cssContent) {
  const styles = {}
  const regex = /\.([a-zA-Z0-9_-]+)\s*\{([^}]+)\}/g
  let match

  while ((match = regex.exec(cssContent)) !== null) {
    const className = match[1]
    const properties = match[2].trim().split(';').filter(Boolean)
    styles[className] = {}
    properties.forEach(prop => {
      const [key, value] = prop.split(':').map(s => s.trim())
      if (!key || !value) return
      const jsKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      const cleanValue = value.replace(/['"]/g, '')
      styles[className][jsKey] = isNaN(cleanValue)
        ? cleanValue
        : Number(cleanValue)
    })
  }

  return 'const styles = StyleSheet.create(' + JSON.stringify(styles, null, 2) + ')'
}

export async function convertFile(inputFilePath, outputDir) {
  const ext = path.extname(inputFilePath)
  if (!fileExtensions.includes(ext)) return

  let code = fs.readFileSync(inputFilePath, 'utf-8')
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

  converted = converted.replace(/className="([^"]+)"/g, (m, p1) => `style={styles.${p1}}`)

  let cssFilePath = ''
  converted = converted.replace(/import\s+['"](.+\.css)['"];?/g, (_, cssPath) => {
    cssFilePath = path.resolve(path.dirname(inputFilePath), cssPath)
    return ''
  })

  if (!converted.includes("from 'react-native'")) {
    converted = `import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'\n` + converted
  }

  if (!converted.includes("import React")) {
    converted = `import React from 'react'\n` + converted
  }

  unsupportedHTMLTags.forEach(tag => {
    const regex = new RegExp(`<${tag}[\\s>]|</${tag}>`, 'g')
    if (regex.test(converted)) {
      console.warn(`⚠️ Unsupported tag <${tag}> found in ${inputFilePath}`)
    }
  })

  let cssConverted = ''
  if (cssFilePath && fs.existsSync(cssFilePath)) {
    const cssContent = fs.readFileSync(cssFilePath, 'utf-8')
    cssConverted = '\n\n' + convertCSS(cssContent)
  } else {
    cssConverted = `
const styles = StyleSheet.create({
  app: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' },
  btn: { backgroundColor: '#4f46e5', padding: 12, borderRadius: 8, marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold' },
})`
  }

  fs.mkdirSync(outputDir, { recursive: true })
  const outputFilePath = path.join(outputDir, path.basename(inputFilePath))
  fs.writeFileSync(outputFilePath, converted + cssConverted, 'utf-8')

  console.log(`✅ Converted successfully: ${inputFilePath} → ${outputFilePath}`)
}
