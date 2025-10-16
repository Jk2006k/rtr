import express from "express"
import cors from "cors"
import path from "path"
import fs from "fs"
import routes from "./routes/routes.js"
import convertRoute from "./routes/convertRoute.js"
import { cleanupOldFiles } from "./utils/cleanup.js" 

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

cleanupOldFiles()

setInterval(() => {
  cleanupOldFiles()
}, 24 * 60 * 60 * 1000) 

app.use("/upload", routes)
app.use("/convert", convertRoute)

app.use("/converted", express.static(path.join(process.cwd(), "converted")))
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))
app.use("/extracted", express.static(path.join(process.cwd(), "extracted")))

app.get("/", (req, res) => {
  res.send("Welcome to the React to React Native Converter API")
})

app.get("/test-react-app.zip", (req, res) => {
  const zipPath = path.join(process.cwd(), "test-react-app.zip")
  if (fs.existsSync(zipPath)) {
    res.download(zipPath) 
  } else {
    res.status(404).send("Test file not found")
  }
})

app.get("/converted/:fileName", (req, res) => {
  const fileName = req.params.fileName
  const filePath = path.join(process.cwd(), "converted", fileName)
  if (fs.existsSync(filePath)) {
    res.download(filePath)
  } else {
    res.status(404).send("File not found")
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`)
})
