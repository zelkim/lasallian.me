import express from 'express'
import Post from '../models/Post.js'
import User from '../models/User.js'

// expects id as param
export const GetNormalPostById = async (req, res) => {
    try {
        const postId = req.params.id

        const normalPost = await Post.findById(postId)
            .populate('author', 'vanity info')
        // .populate('comments');

        return res.status(200).json(normalPost);
    } catch (error) {
        console.error('Error fetching normal post:', error);
        return res.status(500).json({ error: 'An error occurred while fetching normal post.' });
    }
}

// gets all normal posts of signed in user
export const GetAllNormalPostByAuthor = async (req, res) => {
    try {
        const authorId = req.user._id

        const user = await User.findById(authorId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const userNormalPosts = await Post.find({ author: authorId })
            .populate('author', 'vanity info')
        // .populate('comments');

        return res.status(200).json(userNormalPosts);
    } catch (err) {
        console.error(err)
        return res.status(404).json({ error: 'GetAllNormalPostByAuthor error' });
    }
}


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

// expects id as param
export const DeletePost = async (req, res) => {
    try {
        // get authenticated user (assume it is stored in session)
        const authorId = req.user._id

        const user = await User.findById(authorId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Post deleted successfully.'
        })
    } catch (err) {
        console.error(err)
        return res.status(400).send({ status: 'error', msg: err })
    }
}
