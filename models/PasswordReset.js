import { Schema, model } from 'mongoose';

const passwordResetSessionSchema = new Schema({
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }, // expires in 5 mins
});

export default model('PasswordResetSession', passwordResetSessionSchema);
