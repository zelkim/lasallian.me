import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

/**
 * Creates a new comment on a post.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} Sends a response with the result of the operation.
 */

export const createComment = async (req, res) => {
    const data = req.body;

    try {
        // Check if post exists
        const post = await Post.findById(data.post_id).exec();

        if (!post) {
            return res
                .status(400)
                .send({ status: 'error', msg: 'Invalid post' });
        }

        // Create the comment
        const comment = await Comment.create({
            author: req.user._id,
            post: data.post_id,
            content: data.content,
        });

        // Push comment ID into the post's comments array
        post.comments.push(comment._id);
        await post.save(); // Save the updated post

        return res.status(200).send({
            status: 'ok',
            msg: 'Comment created.',
            data: comment,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send({
            status: 'error',
            msg: 'Comment could not be created.',
        });
    }
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
            return res.status(400).send({
                status: 'error',
                msg: 'Comments could not be retrieved',
            });
        });
};

/**
 * Retrieves a comment.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} Sends a response containing the list of comments.
 */
export const getComment = async (req, res) => {
    const data = req.params;

    Comment.findById(data.commentid)
        .then((comment) => {
            res.status(200).send({ status: 'ok', data: comment });
        })
        .catch((err) => {
            console.error(err);
            return res.status(400).send({
                status: 'error',
                msg: 'Comment could not be retrieved',
            });
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
            return res.status(400).send({
                status: 'error',
                msg: 'Comments could not be retrieved',
            });
        });
};

/**
 * Updates an existing comment.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} Sends a response indicating the update result.
 */
export const updateComment = async (req, res) => {
    const { commentid } = req.params;
    const { content } = req.body;

    Comment.findOneAndUpdate(
        { _id: commentid, author: req.user._id },
        { content },
        { new: true }
    )
        .then((updatedComment) => {
            if (!updatedComment) {
                return res.status(400).send({
                    status: 'error',
                    msg: 'Comment not found or unauthorized',
                });
            }
            return res.status(200).send({
                status: 'ok',
                msg: 'Comment updated',
                data: updatedComment,
            });
        })
        .catch((err) => {
            console.error(err);
            return res
                .status(400)
                .send({ status: 'error', msg: 'Comment could not be updated' });
        });
};

/**
 * Deletes an existing comment.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} Sends a response indicating the delete result.
 */

export const deleteComment = async (req, res) => {
    const { commentid } = req.params;

    try {
        // Find the comment first
        const deletedComment = await Comment.findOneAndDelete({
            _id: commentid,
            author: req.user._id,
        });

        if (!deletedComment) {
            return res.status(400).send({
                status: 'error',
                msg: 'Comment not found or unauthorized',
            });
        }

        // Remove the comment from the associated post
        await Post.findByIdAndUpdate(
            deletedComment.post,
            { $pull: { comments: commentid } }, // Remove the comment ID from the array
            { new: true }
        );

        return res.status(200).send({ status: 'ok', msg: 'Comment deleted' });
    } catch (err) {
        console.error(err);
        return res.status(400).send({
            status: 'error',
            msg: 'Comment could not be deleted',
        });
    }
};
/**
 * Retrieves comments from an organization.
 * TODO: Implement this function when organization logic is defined.
 */
export const getCommentFromOrg = undefined;
