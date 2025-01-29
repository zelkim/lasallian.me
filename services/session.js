const jwt = require('jsonwebtoken')

const create = async (user) => {
  try {
    const token = jwt.sign(user, process.env.JWT_SECRET_KEY);
    return !token ? undefined : token;
  }
  catch (err) {
    console.log(err);
    return undefined;
  }
}

const validate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expecting "Bearer <token>"

    if (!token)
      return res.status(401).json({ status: 'error', msg: 'Token not found.' })

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err)
        return res.status(403).json({ status: 'error', msg: 'Invalid token.' });

      req.user = user; // Save the user info for the next middleware
      next();
    });
  }
  catch (err) {
    return res.status(400).send({ status: 'error', msg: err })
  }
}

module.exports = {
  create,
  validate
}
