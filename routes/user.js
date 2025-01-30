import express from 'express';
import { create, authenticate } from '../services/user.js';

const router = express.Router();

router.post('/register', create);
router.post('/login', authenticate)

export default router
