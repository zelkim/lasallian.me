import express from 'express'
import { GetAllPosts, GetNormalPostById, GetAllNormalPostByAuthor, CreateNormalPost, UpdatePost, DeletePost } from '../services/post.js'
import { validateSession } from '../services/session.js'

const router = express.Router()

router.get("/all", GetAllPosts) // /post

// normal posts
router.get("/normal/:id", validateSession, GetNormalPostById) // /post/normal/:id (for getting specific post) 
router.get("/normal", validateSession, GetAllNormalPostByAuthor) // gets all normal posts of authenticated user
router.post("/normal", validateSession, CreateNormalPost) // creates normal post

// normal posts

router.put("/normal/:id", validateSession, UpdatePost) // updates post

// TODO: check if need paths to be type specific
router.delete("/normal/:id", validateSession, DeletePost) // deletes normal post given id

export default router
