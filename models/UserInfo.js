import { Schema, model } from 'mongoose'

const userInfoSchema = new Schema({
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
        batchid: { type: String, required: true },
        nickname: { type: String, required: false },
        birthdate: { type: Date, required: true },
        bio: { type: String, required: false },
        links: {
            linkedin: { type: String, required: false },
            facebook: { type: String, required: false },
            instagram: { type: String, required: false },
            other: [String]
        }
    },
    meta: {
        created_at: { type: Date, required: true, default: Date.now },
        updated_at: { type: Date, required: true, default: Date.now }
    }
})

export default model("user_info", userInfoSchema)
