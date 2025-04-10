import { Schema, model } from 'mongoose';

const orgInfoSchema = new Schema({
    vanity: {
        display_photo: { type: String, required: false },
        cover_photo: { type: String, required: false },
        badges: [Schema.Types.ObjectId],
    },
    info: {
        name: {
            type: String,
            required: true,
        },
        acronym: { type: String, required: true },
        founding: { type: Date, required: false },
        office: { type: String, required: true },
        college: { type: String, required: true },
        bio: { type: String, required: false },
        links: {
            linkedin: { type: String, required: false },
            facebook: { type: String, required: false },
            instagram: { type: String, required: false },
            other: [String],
        },
    },
    members: [{ type: Schema.Types.ObjectId, ref: 'org_members' }],
    meta: {
        created_at: { type: Date, required: true, default: Date.now },
        updated_at: { type: Date, required: true, default: Date.now },
    },
});

export default model('org_info', orgInfoSchema);
