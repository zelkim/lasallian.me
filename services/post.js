import Org from '../models/Org.js';
import Post, { POST_TYPES } from '../models/Post.js';
import UserInfo from '../models/UserInfo.js';
import {
    getOrgMemberRole,
    GetUserOrganizations,
    IsUserInOrganization,
} from '../services/org.js';
import { parseHashtags } from './hashtag.js';

export const GetAllPosts = async (req, res) => {
    try {
        const allPosts = await Post.find()
            .populate('author', 'vanity info')
            .populate('badge')
            .populate('reactions')
            .populate({
                path: 'comments',
                populate: [
                    {
                        path: 'author',
                        select: 'vanity info',
                    },
                    {
                        path: 'reactions', // Populating the "reactions" field
                    },
                ],
            });

        return res.status(200).json(allPosts);
    } catch (err) {
        console.error(err);
        return res.status(404).json({ error: 'GetAllPosts error' });
    }
};

export const GetAllUserPosts = async (req, res) => {
    try {
        const authorId = req.params.id;

        const user = await UserInfo.findById(authorId);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                error: 'User not found.',
            });
        }

        const posts = await Post.find({ author: authorId })
            .populate('author', 'vanity info')
            .populate('badge')
            .populate({
                path: 'comments',
                populate: [
                    {
                        path: 'author',
                        select: 'vanity info',
                    },
                    {
                        path: 'reactions', // Populating the "reactions" field
                    },
                ],
            })
            .populate('organization')
            .sort({ 'meta.created_at': -1 }); // sort by newest

        return res.status(200).json({
            status: 'success',
            count: posts.length,
            posts,
        });
    } catch (err) {
        console.error('GetAllUserPosts Error:', err);
        return res.status(500).json({
            status: 'error',
            error: 'An error occurred while fetching user posts.',
        });
    }
};

export const GetAllPostsByHashtag = async (req, res) => {
    try {
        const hashtag = req.params.hashtag;

        const cleanHashtag = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;

        const allPosts = await Post.find({ 'hashtags.tag': cleanHashtag })
            .populate('author', 'vanity info')
            .populate('reactions')
            .populate('badge')
            .populate({
                path: 'comments',
                populate: [
                    {
                        path: 'author',
                        select: 'vanity info',
                    },
                    {
                        path: 'reactions', // Populating the "reactions" field
                    },
                ],
            })
            .populate('organization');

        return res.status(200).json(allPosts);
    } catch (err) {
        console.error(err);
        return res.status(404).json({ error: 'GetAllPosts error' });
    }
};

// gets all normal posts of signed in user
export const GetNormalPostsByAuthor = async (req, res) => {
    try {
        const authorId = req.user._id;

        const user = await UserInfo.findById(authorId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const userNormalPosts = await Post.find({
            author: authorId,
            type: POST_TYPES.NORMAL,
        })
            .populate('author', 'vanity info')
            .populate('reactions')
            .populate('badge')
            .populate({
                path: 'comments',
                populate: [
                    {
                        path: 'author',
                        select: 'vanity info',
                    },
                    {
                        path: 'reactions', // Populating the "reactions" field
                    },
                ],
            });

        return res.status(200).json(userNormalPosts);
    } catch (err) {
        console.error(err);
        return res
            .status(404)
            .json({ error: 'GetAllNormalPostByAuthor error' });
    }
};

export const GetProjectPostsByAuthor = async (req, res) => {
    try {
        const authorId = req.user._id;

        const user = await UserInfo.findById(authorId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const posts = await Post.find({
            author: authorId,
            type: POST_TYPES.PROJECT,
        })
            .populate('author', 'vanity info')
            .populate('reactions')
            .populate('badge')
            .populate({
                path: 'comments',
                populate: [
                    {
                        path: 'author',
                        select: 'vanity info',
                    },
                    {
                        path: 'reactions', // Populating the "reactions" field
                    },
                ],
            })
            .populate('reactions');

        return res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching project posts:', error);
        return res
            .status(500)
            .json({ error: 'An error occurred while fetching project posts.' });
    }
};

export const GetEventPostsByAuthor = async (req, res) => {
    try {
        const authorId = req.user._id;

        const user = await UserInfo.findById(authorId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const userOrgs = await GetUserOrganizations(authorId);

        const posts = await Post.find({
            author: authorId,
            type: POST_TYPES.EVENT,
            $or: [
                { visibility: 'public' },
                {
                    visibility: 'public',
                    organization: { $in: userOrgs },
                },
            ],
        })
            .populate('author', 'vanity info')
            .populate('reactions')
            .populate('badge')
            .populate({
                path: 'comments',
                populate: [
                    {
                        path: 'author',
                        select: 'vanity info',
                    },
                    {
                        path: 'reactions', // Populating the "reactions" field
                    },
                ],
            })
            .populate('organization');

        return res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching event posts:', error);
        return res
            .status(500)
            .json({ error: 'An error occurred while fetching event posts.' });
    }
};

// TODO: for these services (getting post by id), can restrict to posts created by the authenticated user, just add req.user._id check

// expects id as path param
export const GetNormalPostById = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findOne({
            _id: postId,
            type: POST_TYPES.NORMAL,
        })
            .populate('author', 'vanity info')
            .populate('reactions')
            .populate('badge')
            .populate({
                path: 'comments',
                populate: [
                    {
                        path: 'author',
                        select: 'vanity info',
                    },
                    {
                        path: 'reactions', // Populating the "reactions" field
                    },
                ],
            });

        if (!post) {
            return res.status(404).json({
                error: 'Normal post not found.',
            });
        }

        return res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching normal post:', error);
        return res
            .status(500)
            .json({ error: 'An error occurred while fetching normal post.' });
    }
};

// expects id as path param
export const GetProjectPostById = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findOne({
            _id: postId,
            type: POST_TYPES.PROJECT,
        })
            .populate('author', 'vanity info')
            .populate('reactions')
            .populate('badge')
            .populate({
                path: 'comments',
                populate: [
                    {
                        path: 'author',
                        select: 'vanity info',
                    },
                    {
                        path: 'reactions', // Populating the "reactions" field
                    },
                ],
            });

        if (!post) {
            return res.status(404).json({
                error: 'Project post not found.',
            });
        }

        return res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching normal post:', error);
        return res
            .status(500)
            .json({ error: 'An error occurred while fetching normal post.' });
    }
};

// expects id as path param
export const GetEventPostById = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findOne({
            _id: postId,
            type: POST_TYPES.EVENT,
        })
            .populate('author', 'vanity info')
            .populate('reactions')
            .populate('badge')
            .populate({
                path: 'comments',
                populate: [
                    {
                        path: 'author',
                        select: 'vanity info',
                    },
                    {
                        path: 'reactions', // Populating the "reactions" field
                    },
                ],
            })
            .populate('organization');

        if (!post) {
            return res.status(404).json({
                error: 'Event post not found.',
            });
        }

        return res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching normal post:', error);
        return res
            .status(500)
            .json({ error: 'An error occurred while fetching normal post.' });
    }
};

// TODO: Verify correctness
export const CreatePost = async (req, res) => {
    try {
        // get authenticated user (assume it is stored in session)
        const authorId = req.user._id;
        let badge = req.body.badge;

        const user = await UserInfo.findById(authorId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const { title, content, media, type, visibility, organization } =
            req.body;

        if (!content || typeof content !== 'object') {
            return res
                .status(400)
                .json({ error: 'Content is required and must be an object.' });
        }
        if (type && !Object.values(POST_TYPES).includes(req.body.type)) {
            return res.status(400).json({ error: 'Invalid post type.' });
        }

        if (badge === '') {
            badge = null;
        }

        if (
            visibility &&
            !['public', 'organization', 'private'].includes(visibility)
        ) {
            return res
                .status(400)
                .json({ error: 'Invalid visibility option.' });
        }
        if (visibility === 'organization') {
            const isMember = await IsUserInOrganization(authorId, organization);
            if (!isMember) {
                return res.status(403).json({
                    error: 'You must be a member of the organization to create organization-visible posts.',
                });
            }
        }

        if (type === POST_TYPES.EVENT) {
            if (!organization) {
                return res
                    .status(400)
                    .json({ error: 'Event posts require an organization.' });
            }

            const orgExists = await Org.findById(organization);
            if (!orgExists) {
                return res
                    .status(404)
                    .json({ error: 'Organization not found.' });
            }
        }

        if (organization || type === POST_TYPES.EVENT) {
            const memberRole = await getOrgMemberRole(authorId, organization);

            if (!memberRole) {
                return res.status(403).json({
                    error: 'You must be a member of the organization to create this post.',
                });
            }

            // for events, verify if user has appropriate position/role
            if (type === POST_TYPES.EVENT) {
                // const allowedPositions = ['PRES', 'EVP', 'VP', 'AVP'];
                const allowedPositions = [
                    'PRES',
                    'EVP',
                    'VP',
                    'AVP',
                    'CT',
                    'JO',
                    'MEM',
                ]; // NOTE: for now allow all for testing
                if (!allowedPositions.includes(memberRole)) {
                    return res.status(403).json({
                        error: 'You do not have permission to create event posts.',
                    });
                }
            }
        }

        // create new post
        const post = new Post({
            title,
            content,
            media: Array.isArray(media) ? media : [],
            type: type || POST_TYPES.NORMAL,
            visibility: visibility || 'public',
            author: authorId,
            badge: badge,
            organization: organization,
            comments: [],
            hashtags: parseHashtags(content.text),
            meta: {
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        const savedPost = await post.save();
        return res.status(201).json({
            status: 'success',
            savedPost,
        });
    } catch (err) {
        console.error(err);
        return res.status(400).send({ status: 'error', msg: err });
    }
};

// expects id as param (/post/:id)
export const UpdatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const authorId = req.user._id;

        const allowedUpdates = [
            'title',
            'content',
            'media',
            'type',
            'visibility',
            'badge',
        ];
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every((update) =>
            allowedUpdates.includes(update)
        );
        if (!isValidOperation) {
            return res.status(400).json({
                status: 'error',
                msg: 'Invalid updates. Only title, content and media can be updated.',
            });
        }

        console.log(req.body);

        if (req.body.badge === '') {
            req.body.badge = null;
        }

        const existingPost = await Post.findById(id);
        if (!existingPost) {
            return res
                .status(404)
                .json({ status: 'error', msg: 'Post not found' });
        }

        if (!existingPost.author.equals(authorId)) {
            return res.status(403).json({
                status: 'error',
                msg: 'Not authorized to update this post',
            });
        }

        // required fields should not be empty
        if (req.body.content && typeof req.body.content !== 'object') {
            return res
                .status(400)
                .json({ status: 'error', msg: 'Content must be an object' });
        }

        if (
            req.body.type &&
            !Object.values(POST_TYPES).includes(req.body.type)
        ) {
            return res.status(400).json({ error: 'Invalid post type.' });
        }

        if (
            req.body.visibility &&
            !['public', 'organization', 'private'].includes(req.body.visibility)
        ) {
            return res
                .status(400)
                .json({ error: 'Invalid visibility option.' });
        }

        const updateData = {
            $set: {
                ...req.body,
                hashtags: parseHashtags(req.body.content.text),
                meta: {
                    ...existingPost.meta,
                    updated_at: new Date(),
                },
            },
        };

        const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).populate('author', 'vanity info');

        res.status(200).json({
            status: 'success',
            post: updatedPost,
        });
    } catch (err) {
        console.error('UpdatePost Error:', err);
        res.status(400).json({
            status: 'error',
            msg: err.message,
        });
    }
};

// expects id as param
export const DeletePost = async (req, res) => {
    try {
        // get authenticated user (assume it is stored in session)
        const authorId = req.user._id;

        const user = await UserInfo.findById(authorId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }
        if (!post.author.equals(authorId)) {
            return res
                .status(403)
                .json({ error: 'Not authorized to delete this post.' });
        }
        await Post.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            status: 'success',
            message: 'Post deleted successfully.',
        });
    } catch (err) {
        console.error(err);
        return res.status(400).send({ status: 'error', msg: err });
    }
};

// search happens on query params
export const SearchPosts = async (req, res) => {
    try {
        const { query = '', type, visibility, limit = 10 } = req.query;
        const userId = req.user._id;

        if (!query) {
            return res.status(400).json({
                status: 'error',
                error: 'Search query is required',
            });
        }

        const resultLimit = parseInt(limit);
        if (isNaN(resultLimit) || resultLimit < 1) {
            return res.status(400).json({
                status: 'error',
                error: 'Invalid limit value. Must be a positive number.',
            });
        }

        const userOrgs = await GetUserOrganizations(userId);

        const searchCriteria = {
            $and: [
                {
                    $or: [
                        { title: { $regex: query, $options: 'i' } },
                        { 'content.text': { $regex: query, $options: 'i' } },
                        { 'hashtags.tag': { $regex: query, $options: 'i' } },
                    ],
                },
                // visibility opts
                {
                    $or: [
                        { visibility: 'public' },
                        { author: userId },
                        {
                            $and: [
                                { visibility: 'organization' },
                                { organization: { $in: userOrgs } },
                            ],
                        },
                    ],
                },
            ],
        };

        // type and visibility is optional
        if (type && Object.values(POST_TYPES).includes(type)) {
            searchCriteria.$and.push({ type });
        }
        if (visibility) {
            searchCriteria.$and.push({ visibility });
        }

        const posts = await Post.find(searchCriteria)
            .populate('author', 'vanity info')
            .populate('organization')
            .populate('reactions')
            .populate({
                path: 'comments',
                populate: [
                    {
                        path: 'author',
                        select: 'vanity info',
                    },
                    {
                        path: 'reactions', // Populating the "reactions" field
                    },
                ],
            })
            .sort({ 'meta.created_at': -1 })
            .limit(resultLimit);

        return res.status(200).json({
            status: 'success',
            count: posts.length,
            posts,
        });
    } catch (err) {
        console.error('SearchPosts Error:', err);
        return res.status(500).json({
            status: 'error',
            error: 'An error occurred while searching posts',
        });
    }
};
