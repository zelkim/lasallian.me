import express from 'express'
import {
    GetAllPosts,
    GetNormalPostById,
    GetAllNormalPostByAuthor,
    CreatePost,
    UpdatePost,
    DeletePost
} from '../services/post.js'
import { validateSession } from '../services/session.js'

const router = express.Router()

router.get("/all", GetAllPosts) // /post

// project posts (visible to recruiters)
router.get("/project", GetProjectPosts)

// event posts
router.get("/event", GetEventPosts)

// normal posts
router.get("/normal/:id", validateSession, GetNormalPostById)
router.get("/normal", validateSession, GetAllNormalPostByAuthor) // gets all normal posts of authenticated user

// Generic post creation/update/delete (handles all types)
router.post("/", validateSession, CreatePost)
router.put("/:id", validateSession, UpdatePost)
router.delete("/:id", validateSession, DeletePost)

export default router
