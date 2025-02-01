import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: Object, required: true },
    media: [{ type: String }],
    meta: {
        created_at: { type: Date, required: true, default: Date.now },
        updated_at: { type: Date, required: true, default: Date.now }
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    comments: { type: mongoose.Schema.Types.ObjectId, ref: 'comments' },
    badge: { type: mongoose.Schema.Types.ObjectId, ref: 'badges' }
})

export default mongoose.model("posts", postSchema)
