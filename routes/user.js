import express from 'express'
import { validateSession } from '../services/session.js'
import { createInfo, createCredentials, authenticate, getUserById, getSessionUser, getUserByEmail } from '../services/user.js'

const router = express.Router()

// - Authentication routes
router.post('/register', createInfo)
router.post('/setup', createCredentials)
router.post('/login', authenticate)

// - CRUD routes
router.get('/', validateSession, getSessionUser)
router.get('/:id', validateSession, getUserById)
router.post('/get-by-email', validateSession, getUserByEmail)

export default router
