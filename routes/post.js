import express from 'express'
import {
    GetAllPosts,
    GetNormalPostsByAuthor,
    GetProjectPostsByAuthor,
    GetEventPostsByAuthor,
    GetNormalPostById,
    GetProjectPostById,
    GetEventPostById,
    GetAllPostsByHashtag,
    CreatePost,
    UpdatePost,
    DeletePost,
    SearchPosts
} from '../services/post.js'
import { validateSession } from '../services/session.js'

const router = express.Router()

router.get("/all", GetAllPosts) // /post

// normal posts
router.get("/normal", validateSession, GetNormalPostsByAuthor) // gets all normal posts of authenticated user
router.get("/normal/:id", validateSession, GetNormalPostById)

// project posts (visible to recruiters)
router.get("/project", validateSession, GetProjectPostsByAuthor)
router.get("/project/:id", validateSession, GetProjectPostById)

// event posts
router.get("/event", validateSession, GetEventPostsByAuthor)
router.get("/event/:id", validateSession, GetEventPostById)

// Generic post creation/update/delete (handles all types)
router.post("/", validateSession, CreatePost)
router.put("/:id", validateSession, UpdatePost)
router.delete("/:id", validateSession, DeletePost)


router.get("/hashtag/:hashtag", validateSession, GetAllPostsByHashtag);

router.get("/search", validateSession, SearchPosts)

export default router
