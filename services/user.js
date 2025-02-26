import { hashSync, compareSync } from 'bcrypt'
import UserCredentials from '../models/UserCredentials.js'
import UserInfo from '../models/UserInfo.js'
// import { create, validate } from '../services/session.js'
import { createSession } from '../services/session.js'

export const getSessionUser = async (req, res) => {
    try {
        const credentials = await UserCredentials.findById(req.user._id).populate('info').exec();
        if (!credentials) {
            return res.status(400).json({ status: 'error', error: 'User not found.' });
        }

        credentials.credentials.password = undefined;
        return res.status(200).json(credentials);
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: 'error', error: 'could not get user' });
    }
}

export const getUserByEmail = async (req, res) => {
    try {
        const credentials = await UserCredentials.findOne({ "credentials.email": req.body.email }).populate('info').exec();

        if (!credentials)
            return res.status(400).json({ status: 'error', error: 'could not find user' })

        credentials.credentials.password = undefined;
        return res.status(200).json(credentials);
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: 'error', error: 'could not get user' })
    }
}

export const getUserById = async (req, res) => {
    try {
        const credentials = await UserCredentials.findById(req.params.id).populate('info').exec();

        if (!credentials)
            return res.status(400).json({ status: 'error', error: 'could not find user' })

        credentials.credentials.password = undefined;
        return res.status(200).json(credentials);
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: 'error', error: 'could not get user' });
    }
}

export const createInfo = async (req, res) => {
    try {
        // -- Insertion of data
        UserInfo.create(req.body)
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
        // check if user info exists
        const userInfo = await UserInfo.findById(req.body.info);
        if (!userInfo) {
            return res.status(400).json({
                status: 'error',
                msg: 'User info not found'
            });
        }
        // -- Direct replacement of password with hashed password.
        req.body.credentials.password = hashSync(req.body.credentials.password, 12)

        // -- Insertion of data
        const userCredentials = await UserCredentials.create(req.body);

        const populatedCredentials = await userCredentials.populate('info');
        populatedCredentials.credentials.password = undefined;

        return res.status(201).json({
            status: 'ok',
            user: populatedCredentials
        });
    }
    catch (err) {
        console.error(err)
        return res.status(400).send({ status: 'error', msg: 'Could not create user credentials' })
    }
}

export const authenticate = async (req, res) => {
    try {
        const user = req.body.credentials;
        if (!user.email || !user.password) {
            return res.status(400).json({
                status: 'error',
                msg: 'Email and password are required'
            });
        }

        // - Account processing handler
        const account = await UserCredentials.findOne({ "credentials.email": user.email }).populate('info').lean().exec();

        if (!account)
            return res.status(400).json({ status: "error", msg: "Account not found." })

        if (!compareSync(user.password, account.credentials.password))
            return res.status(400).json({ status: 'error', msg: 'Invalid password.' })

        // obfuscate some account details
        account.credentials.password = ""

        // create user session
        const token = await createSession(account)
        console.log(token)
        if (!token)
            return res.status(400).json({ status: 'error', msg: 'Could not create session.' });

        return res.status(200).json({
            status: 'ok',
            session_token: token,
            user: account
        })
    }
    catch (err) {
        console.log(err)
        return res.status(400).send({ status: "error", msg: 'Authentication failed' })
    }
}
