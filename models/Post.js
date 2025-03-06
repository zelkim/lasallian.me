import mongoose from "mongoose";

export const POST_TYPES = {
  NORMAL: "normal",
  PROJECT: "project",
  EVENT: "event",
};

const postSchema = new mongoose.Schema({
  title: { type: String, required: false },
  content: { type: Object, required: true },
  media: [{ type: String }],
  type: {
    type: String,
    required: true,
    enum: Object.values(POST_TYPES),
    default: POST_TYPES.NORMAL,
  },
  visibility: {
    type: String,
    enum: ["public", "organization", "private"],
    default: "public",
  },
  meta: {
    created_at: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date, required: true, default: Date.now },
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user_info",
    required: true,
  },
  comments: { type: mongoose.Schema.Types.ObjectId, ref: "comments" },
  hashtags: [
    {
      tag: {
        type: String,
        match: /^#[a-zA-Z0-9_]+$/,
        required: true,
      },
    },
  ],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user_info', required: true },
  comments: { type: mongoose.Schema.Types.ObjectId, ref: 'comments' },
  organization: {
      type: mongoose.Schema.Types.ObjectId, ref: 'org_info', required: function () {
          // require organization ref only if the post type is "event"
          return this.type === POST_TYPES.EVENT || this.visibility === "organization";
      }
  }
})

export default mongoose.model("posts", postSchema);
