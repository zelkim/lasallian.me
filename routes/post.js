import express from 'express'
import { CreateNormalPost } from '../services/post'

const router = express.Router()

// TODO: add auth middleware
router.post("/normal", CreateNormalPost)

export default router
