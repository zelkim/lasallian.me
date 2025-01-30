import express from 'express'
import {
    CreateNormalPost,
    CreateProjectPost,
    CreateEventPost,
    // GetAllNormalPosts
} from '../services/posts.js'

const router = express.Router()

// Middleware to validate post types
const validatePostType = (type) => (req, res, next) => {
    if (req.body.type !== type) {
        return res.status(400).json({ error: `Invalid post type. Expected ${type}.` });
    }
    next();
};

// TODO: add ensureAuthenticated middleware (check if valid session)
router.post('/normal', validatePostType('normal'), CreateNormalPost)
router.post('/project', validatePostType('project'), CreateProjectPost)
router.post('/event', validatePostType('event'), CreateEventPost)

// for testing
// router.get('/posts', GetAllNormalPosts)

export default router
