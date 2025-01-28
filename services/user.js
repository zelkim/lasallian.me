const User = require('../models/User')

export const createUser = async (req, res) => {
  try {
    User.create(req.body.user)
      .then((createdUser) => {
        return res.status(201).send({ status: 'ok', user: createdUser })
      })
      .catch((error) => {
        return res.status(400).send({ status: 'error', msg: error });
      })
  }
  catch (err) {
    return res.status(400).send({ status: 'error', user: err })
  }
}
