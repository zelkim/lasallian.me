import express from 'express'
import { CreateNormalPost } from '../services/post.js'
import { validateSession } from '../services/session.js'

const router = express.Router()

// TODO: add auth middleware
router.post("/normal", validateSession, CreateNormalPost)

export default router
