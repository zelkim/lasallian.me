import Comment from "../models/Comment.js"
import Post from "../models/Post.js"

export const createComment = async (req, res) => {

  const data = req.body

  try {
    const postExists = await Post.findOne({ _id: data.post_id }).exec();

    if (!postExists)
      return res.status(400).send({ status: 'error', msg: 'Invalid post' });

  }
  catch (error) {
    console.log(error)
    return res.status(400).send({ status: 'error', msg: 'Invalid post' });
  }

  Comment.create({
    author: req.user._id,
    post: data.post_id,
    content: data.content,
  })
    .then((comment) => {
      return res.status(200).send({ status: 'ok', msg: 'Comment created.', data: comment })
    })
    .catch((err) => {
      console.error(err)
      return res.status(400).send({ status: 'error', msg: 'comment could not be created.' })
    })
}

export const getCommentFromPostId = async (req, res) => {

  const data = req.params;

  Comment.find({ post: data.postid })
    .then((commentsList) => {
      res.status(200).send({ status: 'ok', data: commentsList });
    })
    .catch((err) => {
      console.error(err)
      return res.status(400).send({ status: 'error', msg: 'comments could not be retrieved' })
    })
}

export const getCommentFromSessionUser = async (req, res) => {

  const user = req.user;

  Comment.find({ author: user._id })
    .then((commentsList) => {
      res.status(200).send({ status: 'ok', data: commentsList });
    })
    .catch((err) => {
      console.error(err)
      return res.status(400).send({ status: 'error', msg: 'comments could not be retrieved' })
    })

}

// TODO: Create when orgs have been defined
export const getCommentFromOrg = undefined
