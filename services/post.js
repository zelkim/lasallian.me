import express from 'express'
import Post from '../models/Post.js'
import User from '../models/User.js'


// expects: title, content, media (optional for now)
export const CreateNormalPost = async (req, res) => {
    try {
        // get authenticated user (assume it is stored in session)
        const authorId = req.user._id

        const user = await User.findById(authorId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // create new post
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            // NOTE: no media for now
            author: authorId,
            meta: {
                created_at: new Date,
                updated_at: new Date
            }
        })

        const savedPost = await post.save()
        return res.status(201).json({
            status: 'success',
            savedPost
        })
    } catch (err) {
        console.error(err)
        return res.status(400).send({ status: 'error', msg: err })
    }
}
