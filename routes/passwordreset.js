import express from 'express';
import {
  createResetPasswordInstance,
  handlePasswordReset,
  validatePasswordResetInstance,
} from '../services/passwordreset.js';

const router = express.Router();

router.post('/create', createResetPasswordInstance);
router.get('/:id', validatePasswordResetInstance);
router.post('/', handlePasswordReset);

export default router;
