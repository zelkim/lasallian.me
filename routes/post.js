import express from 'express'
import {
    GetProjectPostsByAuthor,
    GetEventPostsByAuthor,
    GetAllPosts,
    GetNormalPostById,
    GetNormalPostsByAuthor,
    CreatePost,
    UpdatePost,
    DeletePost
} from '../services/post.js'
import { validateSession } from '../services/session.js'

const router = express.Router()

router.get("/all", GetAllPosts) // /post

// normal posts
router.get("/normal", validateSession, GetNormalPostsByAuthor) // gets all normal posts of authenticated user
router.get("/normal/:id", validateSession, GetNormalPostById)

// project posts (visible to recruiters)
router.get("/project", validateSession, GetProjectPostsByAuthor)

// event posts
router.get("/event", validateSession, GetEventPostsByAuthor)

// Generic post creation/update/delete (handles all types)
router.post("/", validateSession, CreatePost)
router.put("/:id", validateSession, UpdatePost)
router.delete("/:id", validateSession, DeletePost)

export default router
