import { hashSync, compareSync } from 'bcrypt'
import User from '../models/UserCredentials.js'
// import { create, validate } from '../services/session.js'
import { createSession } from '../services/session.js'

export const getSessionUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).json({ status: 'error', error: 'User not found.' });
        }

        return res.status(200).json(user);
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: 'error', error: 'could not get user' });
    }
}

export const getUserByEmail = async (req, res) => {
    try {
        const user = await User.findOne({ "credentials.email": req.body.email }).exec();

        if (!user)
            return res.status(400).json({ status: 'error', error: 'could not find user' })

        return res.status(200).json(user);
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: 'error', error: 'could not get user' })
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).exec();

        if (!user)
            return res.status(400).json({ status: 'error', error: 'could not find user' })

        return res.status(200).json(user);
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: 'error', error: 'could not get user' });
    }
}

export const createInfo = async (req, res) => {
    try {
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
        console.error(err)
        return res.status(400).send({ status: 'error', msg: err })
    }
}

export const createCredentials = async (req, res) => {
    try {
        // -- Direct replacement of password with hashed password.
        req.body.credentials.password = hashSync(req.body.credentials.password, 12)

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
        console.error(err)
        return res.status(400).send({ status: 'error', msg: err })
    }
}

export const authenticate = async (req, res) => {
    try {
        const user = req.body.credentials;
        const errors = []

        // api call error handler
        if (!user.email)
            errors.push("'email' field is required")

        if (!user.password)
            errors.push("'password' field is required")

        if (errors.length > 0)
            return res.status(400).send({ status: 'error', msg: errors })

        // - Account processing handler
        const account = await User.findOne({ "credentials.email": user.email }).lean().exec()

        if (!account)
            return res.status(400).send({ status: "error", msg: "Account not found." })

        if (!compareSync(user.password, account.credentials.password))
            return res.status(400).send({ status: 'error', msg: 'Invalid password.' })

        // obfuscate some account details
        account.credentials.password = ""

        // create user session
        const token = await createSession(account)
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
