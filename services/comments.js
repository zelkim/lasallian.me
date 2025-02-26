
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

/**
 * Creates a new comment on a post.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} Sends a response with the result of the operation.
 */
export const createComment = async (req, res) => {
  const data = req.body;

  try {
    const postExists = await Post.findOne({ _id: data.post_id }).exec();

    if (!postExists)
      return res.status(400).send({ status: 'error', msg: 'Invalid post' });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: 'error', msg: 'Invalid post' });
  }

  Comment.create({
    author: req.user._id,
    post: data.post_id,
    content: data.content,
  })
    .then((comment) => {
      return res.status(200).send({ status: 'ok', msg: 'Comment created.', data: comment });
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).send({ status: 'error', msg: 'Comment could not be created.' });
    });
};

/**
 * Retrieves all comments associated with a specific post.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} Sends a response containing the list of comments.
 */
export const getCommentFromPostId = async (req, res) => {
  const data = req.params;

  Comment.find({ post: data.postid })
    .then((commentsList) => {
      res.status(200).send({ status: 'ok', data: commentsList });
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).send({ status: 'error', msg: 'Comments could not be retrieved' });
    });
};

/**
 * Retrieves all comments authored by the currently authenticated user.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} Sends a response containing the user's comments.
 */
export const getCommentFromSessionUser = async (req, res) => {
  const user = req.user;

  Comment.find({ author: user._id })
    .then((commentsList) => {
      res.status(200).send({ status: 'ok', data: commentsList });
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).send({ status: 'error', msg: 'Comments could not be retrieved' });
    });
};

/**
 * Retrieves comments from an organization.
 * TODO: Implement this function when organization logic is defined.
 */
export const getCommentFromOrg = undefined;

