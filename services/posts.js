import Post from '../models/Post.js'
import { validatePostInput } from '../utils/validators.js'

// Normal Post Handler
export const CreateNormalPost = async (req, res) => {
    try {
        const errors = validatePostInput(req.body, 'post')
        if (errors) throw Error(`Invalid input: ${errors.join(', ')}`)

        const newPost = new Post({
            ...req.body,
            type: 'normal',
            author: req.user._id, // get _id of authenticated user
            meta: {
                created_at: new Date(),
                updated_at: new Date()
            }
        })

        await newPost.save()
        res.status(201).json({
            status: 'success',
            post: await Post.populate(newPost, [
                { path: 'author', select: ' vanity.display_photo' },
                // TODO: display badge
                // { path: 'badge', select: 'mainTitle subTitle' }
            ])
        })

    } catch (err) {
        console.error('CreateNormalPost Error:', err)
        res.status(400).json({
            status: 'error',
            msg: err.message.replace('Error: ', '')
        })
    }
}

export const CreateProjectPost = async (req, res) => {
    try {
        const errors = validatePostInput(req.body, 'project')
        if (errors) throw Error(`Invalid input: ${errors.join(', ')}`)

        const newPost = new Post({
            ...req.body,
            type: 'project',
            author: req.user._id,
            showToPartners: true,
            meta: {
                created_at: new Date(),
                updated_at: new Date()
            }
        })

        await newPost.save()
        res.status(201).json({
            status: 'success',
            post: await Post.populate(newPost, [
                { path: 'author', select: 'username displayImage' },
                { path: 'badge', select: 'mainTitle subTitle' }
            ])
        })

    } catch (err) {
        console.error('CreateProjectPost Error:', err)
        res.status(400).json({
            status: 'error',
            msg: err.message.replace('Error: ', '')
        })
    }
}

export const CreateEventPost = async (req, res) => {
    try {
        const errors = validatePostInput(req.body, 'event')
        if (errors) throw Error(`Invalid input: ${errors.join(', ')}`)

        const newPost = new Post({
            ...req.body,
            type: 'event',
            author: req.user._id,
            meta: {
                created_at: new Date(),
                updated_at: new Date()
            }
        })

        await newPost.save()
        res.status(201).json({
            status: 'success',
            post: await Post.populate(newPost, [
                { path: 'author', select: 'username displayImage' },
                { path: 'badge', select: 'mainTitle subTitle' }
            ])
        })

    } catch (err) {
        console.error('CreateEventPost Error:', err)
        res.status(400).json({
            status: 'error',
            msg: err.message.replace('Error: ', '')
        })
    }
}

// export const GetAllNormalPosts = async (req, res) => {
//     try {
//         const posts = await Post.find({ type: 'normal' })
//         // TODO: need to ref User and Badge here
//             .populate('author', 'info.name...')
//             .populate('badge', '<badge_property_here>')
//             .sort({ 'meta.created_at': -1 })
//
//         res.json({ status: 'success', posts })
//
//     } catch (err) {
//         console.error('GetAllNormalPosts Error:', err)
//         res.status(500).json({
//             status: 'error',
//             msg: 'Failed to fetch posts'
//         })
//     }
// }
import Post from '../models/Post.js'
import User from '../models/User.js'

const populateOptions = [
    {
        path: 'author',
        select: 'info.name info.nickname vanity.display_photo',
        transform: doc => ({
            name: doc.info.name,
            nickname: doc.info.nickname,
            display_photo: doc.vanity.display_photo
        })
    },
    {
        path: 'badge',
        select: 'mainTitle subTitle mainColor subColor',
        transform: doc => ({
            main: doc.mainTitle,
            sub: doc.subTitle,
            mainColor: doc.mainColor,
            subColor: doc.subColor
        })
    }
]

const validatePost = (data, type) => {
    const errors = []

    // Common validations
    if (!data.title) errors.push('Title is required')
    if (!data.content || Object.keys(data.content).length === 0) {
        errors.push('Content is required')
    }
    if (data.media?.length > 4) errors.push('Maximum 4 media items allowed')

    // Type-specific validations
    if (type === 'post' && typeof data.showToPartners !== 'boolean') {
        errors.push('showToPartners required for posts')
    }

    return errors
}

const validateBadgeOwnership = async (userId, badgeId) => {
    if (!badgeId) return
    const user = await User.findById(userId).select('vanity.badges')
    if (!user.vanity.badges.includes(badgeId)) {
        throw Error('User does not own this badge')
    }
}

export const CreateNormalPost = async (req, res) => {
    try {
        const errors = validatePost(req.body, 'post')
        if (errors.length > 0) throw Error(errors.join(', '))

        await validateBadgeOwnership(req.user._id, req.body.badge)

        const newPost = new Post({
            ...req.body,
            type: 'post',
            author: req.user._id,
            meta: {
                created_at: new Date(),
                updated_at: new Date()
            }
        })

        await newPost.save()
        const populatedPost = await Post.populate(newPost, populateOptions)

        res.status(201).json({
            status: 'success',
            post: populatedPost
        })

    } catch (err) {
        console.error('CreateNormalPost Error:', err)
        res.status(400).json({
            status: 'error',
            msg: err.message.replace('Error: ', '')
        })
    }
}

export const CreateProjectPost = async (req, res) => {
    try {
        const errors = validatePost(req.body, 'project')
        if (errors.length > 0) throw Error(errors.join(', '))

        await validateBadgeOwnership(req.user._id, req.body.badge)

        const newPost = new Post({
            ...req.body,
            type: 'project',
            author: req.user._id,
            showToPartners: true, // Override for projects
            meta: {
                created_at: new Date(),
                updated_at: new Date()
            }
        })

        await newPost.save()
        const populatedPost = await Post.populate(newPost, populateOptions)

        res.status(201).json({
            status: 'success',
            post: populatedPost
        })

    } catch (err) {
        console.error('CreateProjectPost Error:', err)
        res.status(400).json({
            status: 'error',
            msg: err.message.replace('Error: ', '')
        })
    }
}

export const GetAllNormalPosts = async (req, res) => {
    try {
        const posts = await Post.find({ type: 'post' })
            .populate(populateOptions)
            .sort({ 'meta.created_at': -1 })

        res.json({
            status: 'success',
            posts: posts.map(post => ({
                ...post.toObject(),
                author: {
                    name: post.author.info.name,
                    nickname: post.author.info.nickname,
                    display_photo: post.author.vanity.display_photo
                }
            }))
        })

    } catch (err) {
        console.error('GetAllNormalPosts Error:', err)
        res.status(500).json({
            status: 'error',
            msg: 'Failed to fetch posts'
        })
    }
}
