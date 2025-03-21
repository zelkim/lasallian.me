import express from 'express';
import { createResetPasswordInstance } from '../services/passwordreset.js';

const router = express.Router();

router.post('/', createResetPasswordInstance);

export default router;
