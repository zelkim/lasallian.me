const bcrypt = require('bcrypt')
const User = require('../models/User')
const session = require('../services/session')

const create = async (req, res) => {
  try {
    // -- Direct replacement of password with hashed password.
    req.body.credentials.password = bcrypt.hashSync(req.body.credentials.password, 12)

    // -- Insertion of data
    User.create(req.body)
      .then((createdUser) => {
        return res.status(201).send({ status: 'ok', user: createdUser })
      })
      .catch((error) => {
        return res.status(400).send({ status: 'error', msg: error })
      })
  }
  catch (err) {
    console.log(err)
    return res.status(400).send({ status: 'error', msg: err })
  }
}

const authenticate = async (req, res) => {
  try {
    const user = req.body.credentials;
    const errors = []

    // api call error handler
    if (!user.email)
      errors.push("'username' field is required")

    if (!user.password)
      errors.push("'password' field is required")

    if (errors.length > 0)
      return res.status(400).send({ status: 'error', msg: errors })

    // - Account processing handler
    const account = await User.findOne({ "credentials.email": user.email }).lean().exec()

    if (!account)
      return res.status(400).send({ status: "error", msg: "Account not found." })

    if (!bcrypt.compareSync(user.password, account.credentials.password))
      return res.status(400).send({ status: 'error', msg: 'Invalid password.' })

    // obfuscate some account details
    account.credentials.password = ""

    // create user session
    const token = await session.create(account)
    console.log(token)
    if (!token)
      return res.status(400).send({ status: 'error', msg: 'Could not create session.' });



    return res.status(200).send({ status: 'ok', session_token: token, user: account })
  }
  catch (err) {
    console.log(err)
    return res.status(400).send({ status: "error", msg: err })
  }
}

module.exports = {
  create,
  authenticate
}
