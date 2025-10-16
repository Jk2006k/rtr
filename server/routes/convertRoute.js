import express from 'express'
import { handleConversion } from '../controllers/convertControllers.js'

const router = express.Router()

router.post('/', handleConversion)

export default router
