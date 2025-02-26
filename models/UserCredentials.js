import { Schema, model } from 'mongoose'

const userCredentialsSchema = new Schema({
    credentials: {
        email: { type: String, required: true },
        password: { type: String, required: true },
    },
    meta: {
        created_at: { type: Date, required: true, default: Date.now },
        updated_at: { type: Date, required: true, default: Date.now }
    }
})

export default model("user_credentials", userCredentialsSchema)
