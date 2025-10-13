import fs from "fs"
import path from "path"

export function scanFiles(dir, allowedExt = [".js", ".jsx", ".ts", ".tsx", ".css"], skipDirs = ["node_modules", "public", ".git"]) {
  let results = []
  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat && stat.isDirectory()) {
      if (!skipDirs.includes(file)) {
        results = results.concat(scanFiles(filePath, allowedExt, skipDirs))
      }
    } else {
      if (allowedExt.includes(path.extname(file))) {
        results.push(filePath)
      }
    }
  })

  return results
}
