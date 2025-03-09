import express from 'express';
import { validateSession } from '../services/session.js';
import {
    getCommentFromSessionUser,
    getCommentFromPostId,
    createComment,
    getComment,
    updateComment,
    deleteComment,
} from '../services/comments.js';

const router = express.Router();

router.post('/', validateSession, createComment);
router.get('/post/:postid', validateSession, getCommentFromPostId);
router.get('/user/:userid', validateSession, getCommentFromSessionUser);
router.get('/:commentid', validateSession, getComment);
router.put('/:commentid', validateSession, updateComment);
router.delete('/:commentid', validateSession, deleteComment);

export default router;
