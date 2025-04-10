import mongoose, { model } from 'mongoose'

const badgeSchema = new mongoose.Schema({
    badge_type: { type: String, enum: ['organization', 'user'], required: [true] },
    badge_key: { type: String, required: [true] },
    main_text_color: { type: String, required: [true] },
    sub_text_color: { type: String, required: [true] },
    main_title: { type: String, required: [true] },
    main_color: { type: String, required: [true] },
    sub_title: { type: String, required: [true] },
    sub_color: { type: String, required: [true] },
    badge_expiry: { type: Date, default: null },
    description: { type: String, required: [true]}
})

export default model("badges", badgeSchema)