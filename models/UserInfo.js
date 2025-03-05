import { Schema, model } from 'mongoose'

const userInfoSchema = new Schema({
    credentials: { type: Schema.Types.ObjectId, ref: 'user_credentials' },
    badges: [{ type: Schema.Types.ObjectId, ref: 'badges' }],
    vanity: {
        display_photo: { type: String, required: false },
        cover_photo: { type: String, required: false },
        badges: [Schema.Types.ObjectId]
    },
    info: {
        name: {
            first: { type: String, required: true },
            middle: { type: String, required: false },
            last: { type: String, required: true },
            suffix: { type: String, required: false }
        },
        username: { type: String, required: true },
        batchid: { type: String, required: true },
        birthdate: { type: Date, required: false },
        program: { type: String, required: true },
        bio: { type: String, required: false },
        links: {
            linkedin: { type: String, required: false },
            facebook: { type: String, required: false },
            instagram: { type: String, required: false },
            other: [String]
        }
    },
    account_type: {
        type: String,
        enum: ['individual', 'organization'],
        default: 'individual',
        required: true
    },
    meta: {
        created_at: { type: Date, required: true, default: Date.now },
        updated_at: { type: Date, required: true, default: Date.now }
    }
})

export default model("user_info", userInfoSchema)
