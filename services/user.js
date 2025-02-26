import { hashSync, compareSync } from 'bcrypt'
import UserCredentials from '../models/UserCredentials.js'
import UserInfo from '../models/UserInfo.js'
import { createSession } from '../services/session.js'

export const getSessionUser = async (req, res) => {
    try {
        const credentials = await UserCredentials.findById(req.user._id).exec();
        if (!credentials) {
            return res.status(400).json({ status: 'error', error: 'User not found.' });
        }

        const userInfo = await UserInfo.findOne({ credentials: credentials._id }).exec();
        if (!userInfo) {
            return res.status(400).json({ status: 'error', error: 'User info not found.' });
        }

        const user = {
            credentials: {
                email: credentials.credentials.email
            },
            ...userInfo.toObject()
        };
        return res.status(200).json(user);
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: 'error', error: 'could not get user' });
    }
}

export const getUserByEmail = async (req, res) => {
    try {
        const credentials = await UserCredentials.findOne({ "credentials.email": req.body.email }).exec();
        if (!credentials)
            return res.status(400).json({ status: 'error', error: 'could not find user' })

        const userInfo = await UserInfo.findOne({ credentials: credentials._id }).exec();
        if (!userInfo) {
            return res.status(400).json({ status: 'error', error: 'User info not found' });
        }

        const user = {
            credentials: {
                email: credentials.credentials.email
            },
            ...userInfo.toObject()
        };


        return res.status(200).json(user);
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: 'error', error: 'could not get user' })
    }
}

export const getUserById = async (req, res) => {
    try {
        const credentials = await UserCredentials.findById(req.params.id).exec();
        if (!credentials)
            return res.status(400).json({ status: 'error', error: 'could not find user' })

        const userInfo = await UserInfo.findOne({ credentials: credentials._id }).exec();
        if (!userInfo) {
            return res.status(400).json({ status: 'error', error: 'User info not found' });
        }

        const user = {
            credentials: {
                email: credentials.credentials.email
            },
            ...userInfo.toObject()
        };

        return res.status(200).json(user);
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: 'error', error: 'could not get user' });
    }
}

export const createCredentials = async (req, res) => {
    try {
        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        if (!req.body.credentials.password.match(passwordRegex)) {
            return res.status(400).json({
                status: "error",
                error: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
            });
        }

        const existingUser = await UserCredentials.findOne({ "credentials.email": req.body.credentials.email }).exec()
        if (existingUser) {
            return res.status(400).json({
                status: "error",
                error: "Email already registered"
            })
        }

        const credentials = await UserCredentials.create({
            credentials: {
                email: req.body.credentials.email,
                password: hashSync(req.body.credentials.password, 12)
            },
            meta: {
                created_at: new Date(),
                updated_at: new Date()
            }
        });

        const token = await createSession(credentials);

        return res.status(201).json({
            status: 'ok',
            session_token: token,
            credentials
        });
    }
    catch (err) {
        console.error(err)
        return res.status(400).send({ status: 'error', msg: 'Could not create user credentials' })
    }
}

export const createInfo = async (req, res) => {
    try {
        const userInfo = await UserInfo.create({
            vanity: req.body.vanity,
            info: req.body.info,
            meta: {
                created_at: new Date(),
                updated_at: new Date()
            },
            credentials: req.user._id // we get this from validateSession (sets req.user that stores authenticated user's credentials._id from UserCredentials)
        });

        return res.status(201).json({ status: 'ok', user: userInfo });
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: 'error', error: 'Could not create user info' });
    }
}

export const authenticate = async (req, res) => {
    try {
        const { email, password } = req.body.credentials;
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                error: 'Email and password are required'
            });
        }

        const credentials = await UserCredentials.findOne({ "credentials.email": email }).exec();
        if (!credentials) {
            return res.status(400).json({ status: "error", error: "Account not found." });
        }

        if (!compareSync(password, credentials.credentials.password)) {
            return res.status(400).json({ status: 'error', error: 'Invalid password.' });
        }

        const userInfo = await UserInfo.findOne({ credentials: credentials._id }).exec();
        const user = {
            credentials: {
                _id: credentials._id,
                email: credentials.credentials.email
            },
            ...(userInfo ? userInfo.toObject() : {})
        };

        const token = await createSession(user);
        if (!token) {
            return res.status(400).json({ status: 'error', error: 'Could not create session.' });
        }

        return res.status(200).json({
            status: 'ok',
            session_token: token,
            user
        });
    }
    catch (err) {
        console.log(err)
        return res.status(400).send({ status: "error", msg: 'Authentication failed' })
    }
}
