import Reaction from '../models/Reaction.js';

/**
 * Controller to add a reaction to a post.
 */
export const addReactionToPost = async (req, res) => {
  try {
    const { postId, reactionType } = req.body;
    const userId = req.user._id; // Assuming req.user contains authenticated user info

    // Check if user has already reacted to this post
    const existingReaction = await Reaction.findOne({
      user: userId,
      target: postId,
      targetModel: 'Post',
    });

    // Ensures a user cannot react more than once to the same post.
    if (existingReaction) {
      return res
        .status(400)
        .json({ message: 'User has already reacted to this post.' });
    }

    // Create new reaction
    const reaction = await Reaction.create({
      user: userId,
      target: postId,
      targetModel: 'Post',
      type: reactionType,
    });

    return res.status(201).json({ message: 'Reaction added.', reaction });
  } catch (error) {
    console.error('addReactionToPost', error);
  }
};

/**
 * Controller to add a reaction to a comment.
 */
export const addReactionToComment = async (req, res) => {
  try {
    const { commentId, reactionType } = req.body;
    const userId = req.user._id; // Assuming req.user contains authenticated user info

    // Check if user has already reacted to this comment
    const existingReaction = await Reaction.findOne({
      user: userId,
      target: commentId,
      targetModel: 'Comment',
    });

    // Ensures a user cannot react more than once to the same comment.
    if (existingReaction) {
      return res
        .status(400)
        .json({ message: 'User has already reacted to this comment.' });
    }

    // Create new reaction
    const reaction = await Reaction.create({
      user: userId,
      target: commentId,
      targetModel: 'Comment',
      type: reactionType,
    });

    return res.status(201).json({ message: 'Reaction added.', reaction });
  } catch (error) {
    console.error('addReactionToComment', error);
  }
};

/**
 * Controller to remove a reaction from a post.
 */
export const removeReactionFromPost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user._id; // Assuming req.user contains authenticated user info

    // Find the user's reaction to the post
    const reaction = await Reaction.findOneAndDelete({
      user: userId,
      target: postId,
      targetModel: 'Post',
    });

    if (!reaction) {
      return res.status(404).json({ message: 'Reaction not found.' });
    }

    return res.status(200).json({ message: 'Reaction removed.' });
  } catch (error) {
    console.error('removeReactionFromPost', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Controller to remove a reaction from a comment.
 */
export const removeReactionFromComment = async (req, res) => {
  try {
    const { commentId } = req.body;
    const userId = req.user._id; // Assuming req.user contains authenticated user info

    // Find the user's reaction to the comment
    const reaction = await Reaction.findOneAndDelete({
      user: userId,
      target: commentId,
      targetModel: 'Comment',
    });

    if (!reaction) {
      return res.status(404).json({ message: 'Reaction not found.' });
    }

    return res.status(200).json({ message: 'Reaction removed.' });
  } catch (error) {
    console.error('removeReactionFromComment', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Controller to update a reaction on a post.
 */
export const updateReactionOnPost = async (req, res) => {
  try {
    const { postId, reactionType } = req.body;
    const userId = req.user._id; // Assuming req.user contains authenticated user info

    // Find the user's reaction to the post
    const reaction = await Reaction.findOneAndUpdate(
      { user: userId, target: postId, targetModel: 'Post' },
      { type: reactionType },
      { new: true }
    );

    if (!reaction) {
      return res.status(404).json({ message: 'Reaction not found.' });
    }

    return res.status(200).json({ message: 'Reaction updated.', reaction });
  } catch (error) {
    console.error('updateReactionOnPost', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Controller to update a reaction on a comment.
 */
export const updateReactionOnComment = async (req, res) => {
  try {
    const { commentId, reactionType } = req.body;
    const userId = req.user._id; // Assuming req.user contains authenticated user info

    // Find the user's reaction to the comment
    const reaction = await Reaction.findOneAndUpdate(
      { user: userId, target: commentId, targetModel: 'Comment' },
      { type: reactionType },
      { new: true }
    );

    if (!reaction) {
      return res.status(404).json({ message: 'Reaction not found.' });
    }

    return res.status(200).json({ message: 'Reaction updated.', reaction });
  } catch (error) {
    console.error('updateReactionOnComment', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
