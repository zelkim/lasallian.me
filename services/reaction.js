import { PostReaction, CommentReaction } from '../models/Reaction.js';

/**
 * Controller to add a reaction to a post.
 */
export const addReactionToPost = async (req, res) => {
  try {
    const { postid, reaction } = req.body;
    const userId = req.user._id; // Assuming req.user contains authenticated user info

    // Check if user has already reacted to this post
    const existingReaction = await PostReaction.findOne({
      user: userId,
      target: postid,
    });

    // Ensures a user cannot react more than once to the same post.
    if (existingReaction) {
      return res
        .status(400)
        .json({ message: 'User has already reacted to this post.' });
    }

    // Create new reaction
    const newReaction = await PostReaction.create({
      user: userId,
      target: postid,
      type: reaction,
    });

    return res
      .status(201)
      .json({ message: 'Reaction added.', newReaction });
  } catch (error) {
    console.error('addReactionToPost', error);
  }
};

/**
 * Controller to add a reaction to a comment.
 */
export const addReactionToComment = async (req, res) => {
  try {
    const { commentid, reaction } = req.body;
    const userId = req.user._id; // Assuming req.user contains authenticated user info

    // Check if user has already reacted to this comment
    const existingReaction = await CommentReaction.findOne({
      user: userId,
      target: commentid,
    });

    // Ensures a user cannot react more than once to the same comment.
    if (existingReaction) {
      return res
        .status(400)
        .json({ message: 'User has already reacted to this comment.' });
    }

    // Create new reaction
    const newReaction = await CommentReaction.create({
      user: userId,
      target: commentid,
      type: reaction,
    });

    return res
      .status(201)
      .json({ message: 'Reaction added.', newReaction });
  } catch (error) {
    console.error('addReactionToComment', error);
  }
};

/**
 * Controller to remove a reaction from a post.
 */
export const removeReactionFromPost = async (req, res) => {
  try {
    const { postid } = req.body;
    const userId = req.user._id; // Assuming req.user contains authenticated user info

    // Find the user's reaction to the post
    const reaction = await PostReaction.findOneAndDelete({
      user: userId,
      target: postid,
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
    const { commentid } = req.body;
    const userId = req.user._id; // Assuming req.user contains authenticated user info

    // Find the user's reaction to the comment
    const reaction = await CommentReaction.findOneAndDelete({
      user: userId,
      target: commentid,
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
    const { postid, reaction } = req.body;
    const userId = req.user._id; // Assuming req.user contains authenticated user info

    // Find the user's reaction to the post
    const newReaction = await PostReaction.findOneAndUpdate(
      { user: userId, target: postid },
      { type: reaction },
      { new: true }
    );

    if (!newReaction) {
      return res.status(404).json({ message: 'Reaction not found.' });
    }

    return res
      .status(200)
      .json({ message: 'Reaction updated.', newReaction });
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
    const { commentid, reaction } = req.body;
    const userId = req.user._id; // Assuming req.user contains authenticated user info

    // Find the user's reaction to the comment
    const newReaction = await CommentReaction.findOneAndUpdate(
      { user: userId, target: commentid },
      { type: reaction },
      { new: true }
    );

    if (!newReaction) {
      return res.status(404).json({ message: 'Reaction not found.' });
    }

    return res
      .status(200)
      .json({ message: 'Reaction updated.', newReaction });
  } catch (error) {
    console.error('updateReactionOnComment', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
