import mongoose from 'mongoose'

const postSchema = new Schema({
    title: { type: String, required: true },
    content: { type: Object, required: true },
    media: [{ type: String }],
    meta: {
        created_at: { type: Date, required: true, default: Date.now },
        updated_at: { type: Date, required: true, default: Date.now }
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }
})

export default mongoose.model("posts", postSchema)
