import Comment from "../models/Comment.js"

export const create = async (req, res) => {

  const data = req.body;

  Comment.create({
    user: req.user._id,
    content: data.content,
    post: data.post_id
  })
    .then((comment) => {
      return res.status(200).send({ status: 'ok', msg: 'Comment created.', data: comment })
    })
    .catch((err) => {
      console.error(err)
      return res.status(400).send({ status: 'error', msg: 'comment could not be created.' })
    })
}

export const getFromPostId = async (req, res) => {

  const data = req.body;

  Comment.find({ post: data.post_id })
    .then((commentsList) => {
      res.status(200).send({ status: 'ok', data: commentsList });
    })
    .catch((err) => {
      console.error(err)
      return res.status(400).send({ status: 'error', msg: 'comments could not be retrieved' })
    })
}

export const getFromUser = async (req, res) => {

  const data = req.body;
  const user = req.user;

  Comment.find({ user: user._id })
    .then((commentsList) => {
      res.status(200).send({ status: 'ok', data: commentsList });
    })
    .catch((err) => {
      console.error(err)
      return res.status(400).send({ status: 'error', msg: 'comments could not be retrieved' })
    })

}

// TODO: Create when orgs have been defined
export const getFromOrg = undefined
