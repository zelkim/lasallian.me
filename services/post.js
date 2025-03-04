import Post, { POST_TYPES } from '../models/Post.js'
import UserInfo from '../models/UserInfo.js'

export const GetAllPosts = async (req, res) => {
    try {
        const allPosts = await Post.find()
            .populate('author', 'vanity info')
            .populate('comments')
            .populate('organization')

        return res.status(200).json(allPosts);
    } catch (err) {
        console.error(err)
        return res.status(404).json({ error: 'GetAllPosts error' });
    }
}

// gets all normal posts of signed in user
export const GetNormalPostsByAuthor = async (req, res) => {
    try {
        const authorId = req.user._id

        const user = await UserInfo.findById(authorId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const userNormalPosts = await Post.find({ author: authorId, type: POST_TYPES.NORMAL })
            .populate('author', 'vanity info')
            .populate('comments')

        return res.status(200).json(userNormalPosts);
    } catch (err) {
        console.error(err)
        return res.status(404).json({ error: 'GetAllNormalPostByAuthor error' });
    }
}

export const GetProjectPostsByAuthor = async (req, res) => {
    try {
        const authorId = req.user._id

        const user = await UserInfo.findById(authorId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const posts = await Post.find({ author: authorId, type: POST_TYPES.PROJECT })
            .populate('author', 'vanity info')
            .populate('comments')

        return res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching project posts:', error);
        return res.status(500).json({ error: 'An error occurred while fetching project posts.' });
    }
}

export const GetEventPostsByAuthor = async (req, res) => {
    try {
        const authorId = req.user._id

        const user = await UserInfo.findById(authorId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const posts = await Post.find({
            author: authorId,
            type: POST_TYPES.EVENT,
            $or: [
                { visibility: 'public' },
                { organization: req.user.organization }
            ]
        })
            .populate('author', 'vanity info')
            .populate('comments')
            .populate('organization')

        return res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching event posts:', error);
        return res.status(500).json({ error: 'An error occurred while fetching event posts.' });
    }
}

// TODO: for these services (getting post by id), can restrict to posts created by the authenticated user, just add req.user._id check

// expects id as path param
export const GetNormalPostById = async (req, res) => {
    try {
        const postId = req.params.id

        const post = await Post.findOne({
            _id: postId,
            type: POST_TYPES.NORMAL
        })
            .populate('author', 'vanity info')
            .populate('comments')

        if (!post) {
            return res.status(404).json({
                error: 'Normal post not found.'
            })
        }

        return res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching normal post:', error);
        return res.status(500).json({ error: 'An error occurred while fetching normal post.' });
    }
}

// expects id as path param
export const GetProjectPostById = async (req, res) => {
    try {
        const postId = req.params.id

        const post = await Post.findOne({
            _id: postId,
            type: POST_TYPES.PROJECT
        })
            .populate('author', 'vanity info')
            .populate('comments')

        if (!post) {
            return res.status(404).json({
                error: 'Project post not found.'
            });
        }

        return res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching normal post:', error);
        return res.status(500).json({ error: 'An error occurred while fetching normal post.' });
    }
}

// expects id as path param
export const GetEventPostById = async (req, res) => {
    try {
        const postId = req.params.id

        const post = await Post.findOne({
            _id: postId,
            type: POST_TYPES.EVENT
        })
            .populate('author', 'vanity info')
            .populate('comments')
            .populate('organization');

        if (!post) {
            return res.status(404).json({
                error: 'Event post not found.'
            });
        }

        return res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching normal post:', error);
        return res.status(500).json({ error: 'An error occurred while fetching normal post.' });
    }
}

// expects: title, content, media (optional for now)
export const CreatePost = async (req, res) => {
    try {
        // get authenticated user (assume it is stored in session)
        const authorId = req.user._id

        const user = await UserInfo.findById(authorId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const { title, content, media, type, visibility, organization } = req.body;

        if (!content || typeof content !== 'object') {
            return res.status(400).json({ error: 'Content is required and must be an object.' });
        }
        if (type && !Object.values(POST_TYPES).includes(req.body.type)) {
            return res.status(400).json({ error: 'Invalid post type.' });
        }

        if (visibility && !['public', 'organization', 'private'].includes(visibility)) {
            return res.status(400).json({ error: 'Invalid visibility option.' });
        }

        // Validate organization for event posts
        if (type === POST_TYPES.EVENT) {
            if (!organization) {
                return res.status(400).json({ error: 'Event posts require an organization.' });
            }

            const orgExists = await OrgInfo.findById(organization);
            if (!orgExists) {
                return res.status(404).json({ error: 'Organization not found.' });
            }
        }

        // create new post
        // const post = new Post({
        //     title,
        //     content,
        //     media: media || [],
        //     type: req.body.type,
        //     visibility: req.body.visibility || 'public',
        //     author: authorId,
        //     organization: req.body.organization,
        //     meta: {
        //         created_at: new Date,
        //         updated_at: new Date
        //     },
        // })
        const post = new Post({
            title,
            content,
            media: Array.isArray(media) ? media : [],
            type: type || POST_TYPES.NORMAL,
            visibility: visibility || 'public',
            author: authorId,
            organization: organization,
            meta: {
                created_at: new Date(),
                updated_at: new Date()
            }
        });

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

// expects id as param (/post/:id)
export const UpdatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const authorId = req.user._id;

        const allowedUpdates = ['title', 'content', 'media', 'type', 'visibility'];
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));
        if (!isValidOperation) {
            return res.status(400).json({
                status: 'error',
                msg: 'Invalid updates. Only title, content and media can be updated.'
            });
        }

        const existingPost = await Post.findById(id);
        if (!existingPost) {
            return res.status(404).json({ status: 'error', msg: 'Post not found' });
        }

        if (!existingPost.author.equals(authorId)) {
            return res.status(403).json({ status: 'error', msg: 'Not authorized to update this post' });
        }

        // required fields should not be empty
        if (req.body.content && typeof req.body.content !== 'object') {
            return res.status(400).json({ status: 'error', msg: 'Content must be an object' });
        }

        if (req.body.type && !Object.values(POST_TYPES).includes(req.body.type)) {
            return res.status(400).json({ error: 'Invalid post type.' });
        }

        if (req.body.visibility && !['public', 'organization', 'private'].includes(req.body.visibility)) {
            return res.status(400).json({ error: 'Invalid visibility option.' });
        }

        const updateData = {
            $set: {
                ...req.body,
                meta: {
                    ...existingPost.meta,
                    updated_at: new Date()
                }
            }
        };

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('author', 'vanity info');

        res.status(200).json({
            status: 'success',
            post: updatedPost
        });

    } catch (err) {
        console.error('UpdatePost Error:', err);
        res.status(400).json({
            status: 'error',
            msg: err.message
        });
    }
}

// expects id as param
export const DeletePost = async (req, res) => {
    try {
        // get authenticated user (assume it is stored in session)
        const authorId = req.user._id

        const user = await UserInfo.findById(authorId);
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
