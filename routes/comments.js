import express from 'express'
import { validateSession } from '../services/session.js'
import { getCommentFromSessionUser, getCommentFromPostId, createComment } from "../services/comments.js"

const router = express.Router()

router.post('/', validateSession, createComment)
router.get('/post/:postid', validateSession, getCommentFromPostId)
router.get('/user/:userid', validateSession, getCommentFromSessionUser)

export default router
