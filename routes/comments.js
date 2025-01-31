import express from 'express'
import { validateSession } from '../services/session.js'
import { getCommentFromSessionUser, getCommentFromPostId, createComment } from "../services/comments.js"

const router = express.Router()

router.post('/create', validateSession, createComment)
router.post('/get-by-post', validateSession, getCommentFromPostId)
router.post('/get-by-user', validateSession, getCommentFromSessionUser)

export default router
