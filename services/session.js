import { sign, verify } from 'jsonwebtoken';

/*
 * session.create()
 * @param user - The user object you receive after a mongoose query.
 *               Use  .lean() as JWT only  accepts plain  javascript
 *               objects.
 *
 * @return     - undefined or token. This is to allow if(!token)
 *               statements.
 *
*/
const create = async (user) => {
    try {
        const token = sign(user, process.env.JWT_SECRET_KEY);
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

        verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
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

export default {
    create,
    validate
}
