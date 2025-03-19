import express from 'express';

import {
  addReactionToComment,
  addReactionToPost,
  removeReactionFromComment,
  removeReactionFromPost,
  updateReactionOnComment,
  upsertReactionOnPost
} from '../services/reaction.js'; // Assuming your controller file is named reactionController.js
import { validateSession } from '../services/session.js'; // Assuming you have authentication middleware

const router = express.Router();

// Routes for reactions on posts
router.post('/post', validateSession, addReactionToPost);
router.delete('/post', validateSession, removeReactionFromPost);
router.put('/post', validateSession, upsertReactionOnPost);

// Routes for reactions on comments
router.post('/comment', validateSession, addReactionToComment);
router.delete('/comment', validateSession, removeReactionFromComment);
router.put('/comment', validateSession, updateReactionOnComment);

export default router;
