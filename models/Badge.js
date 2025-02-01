import mongoose, { model } from 'mongoose'

const badgeSchema = new mongoose.Schema({
    badge_type: {enum: ['organization', 'user']},
    badge_key: {type: String},
    main_title: {type: String},
    sub_title: {type: String},
    sub_color: {type: String},
    badge_expiry: {type: Date}
})

export default model("badge", badgeSchema)