import { Schema, model } from 'mongoose'

const postSchema = new Schema({
    title: { type: String, required: true },
    content: { type: Object, required: true },
    media: [{ type: String }], // URL from Object Storage
    type: { type: String, enum: ['normal', 'project', 'event'] },
    meta: {
        created_at: { type: Date, required: true, default: Date.now },
        updated_at: { type: Date, required: true, default: Date.now }
    },
    showToPartners: {
        type: Boolean,
        required: function () { return this.type === 'post'; },
        default: function () { return this.type === 'project' ? true : undefined; }
    },
    // refs
    author: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // user
    badge: { type: Schema.Types.ObjectId, ref: 'badges' },
    comments: [{ type: Schema.Types.ObjectId, ref: 'comments' }],
})

export default model("posts", postSchema)
