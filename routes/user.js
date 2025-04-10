import express from 'express'
import { validateSession } from '../services/session.js'
import { createInfo, updateInfo, createCredentials, authenticate, getUserById, getSessionUser, getUserByEmail, GetUserOrgs, GetUserOrgsByUserId } from '../services/user.js'

const router = express.Router()

// - Authentication routes
router.post('/register', createCredentials)
router.post('/setup', validateSession, createInfo)
router.post('/login', authenticate)

// - CRUD routes
router.get('/', validateSession, getSessionUser)
router.get('/orgs', validateSession, GetUserOrgs)
router.get('/:id', validateSession, getUserById)
router.get('/:id/orgs', validateSession, GetUserOrgsByUserId);
router.post('/get-by-email', validateSession, getUserByEmail)
router.put('/', validateSession, updateInfo)


export default router
