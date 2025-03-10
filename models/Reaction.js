import mongoose from 'mongoose';

const ReactionType = Object.freeze({
  LOVE: '❤️',
  CLAP: '👏',
  LAUGH: '😂',
  SAD: '😢',
  ANGRY: '😡',
});

const baseReactionSchema = {};

const commentReactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: Object.values(ReactionType),
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user_info',
      required: true,
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'comments',
    },
  },
  { timestamps: true }
);

const postReactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: Object.values(ReactionType),
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user_info',
      required: true,
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'posts',
    },
  },
  { timestamps: true }
);

export const PostReaction = mongoose.model(
  'post_reactions',
  postReactionSchema
);
export const CommentReaction = mongoose.model(
  'comment_reactions',
  commentReactionSchema
);
