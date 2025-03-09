import { Schema, model } from 'mongoose';

const commentSchema = new Schema({
    author: { type: Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, required: true, ref: 'posts' },
    meta: {
        created_at: { type: Date, required: true, default: Date.now },
        updated_at: { type: Date, required: true, default: Date.now },
    },
});

export default model('comments', commentSchema, 'comments');
