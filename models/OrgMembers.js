import mongoose from 'mongoose'

const orgMemberSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  joindate: { type: Date, required: true },
  position: {
    type: String,
    enum:
      [
        'PRES',
        'EVP',
        'VP',
        'AVP',
        'CT',
        'JO',
        'MEM'
      ],
    default: 'MEM',
    required: true
  },
  media: [{ type: String }],
  meta: {
    created_at: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date, required: true, default: Date.now }
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
})

export default mongoose.model("org_members", orgMemberSchema)
