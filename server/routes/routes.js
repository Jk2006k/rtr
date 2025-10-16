import express from 'express'
import multer from "multer"
import path from 'path'
import fs from 'fs'
import {handleUpload} from '../controllers/controllers.js'

const  router =express.Router()

const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        const uploadPath= "uploads"
        if(!fs.existsSync(uploadPath))fs.mkdirSync(uploadPath)
        cb(null,uploadPath)
    },

    filename:(req,file,cb)=>{
        cb(null,Date.now() + path.extname(file.originalname))
    },
})

const upload = multer({storage})

router.post('/', upload.single('file'), handleUpload)

export default router   
