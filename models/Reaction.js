import mongoose from 'mongoose';

const ReactionType = Object.freeze({
  LOVE: '❤️',
  CLAP: '👏',
  LAUGH: '😂',
  SAD: '😢',
  ANGRY: '😡',
});

const reactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: Object.values(ReactionType),
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'targetModel',
    },
    targetModel: {
      type: String,
      required: true,
      enum: ['posts', 'comments'],
    },
  },
  { timestamps: true }
);

const Reaction = mongoose.model('reaction', reactionSchema);

export default Reaction;
