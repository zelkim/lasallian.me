import { compareSync, hashSync } from 'bcrypt'
import UserCredentials from '../models/UserCredentials.js'
import UserInfo from '../models/UserInfo.js'
import { GetUserOrganizations } from './org.js'
import Org from '../models/Org.js'
import { createSession } from '../services/session.js'

export const getSessionUser = async (req, res) => {
    try {
        const userInfo = await UserInfo.findById(req.user._id)
            .populate('credentials', 'credentials.email')
            .populate('vanity.badges')
            .exec();
        if (!userInfo) {
            return res.status(404).json({
                status: 'error',
                error: 'User info not found'
            });
        }

        const userCredentials = await UserCredentials.findById(userInfo.credentials).exec();
        if (!userCredentials) {
            return res.status(404).json({
                status: 'error',
                error: 'User credentials not found'
            });
        }

        const userObj = userInfo.toObject();

        const user = {
            credentials: {
                _id: userObj.credentials._id,
                email: userObj.credentials.credentials.email
            },
            vanity: userObj.vanity,
            info: userObj.info,
            meta: userObj.meta,
            _id: userObj._id
        };

        return res.status(200).json(user);
    } catch (err) {
        console.error(err)
        return res.status(400).json({ status: 'error', error: 'could not get user' });
    }
}

export const getUserByEmail = async (req, res) => {
    try {
        const userCredentials = await UserCredentials.findOne({
            "credentials.email": req.body.email
        }).exec();

        if (!userCredentials) {
            return res.status(400).json({
                status: 'error',
                error: 'Could not find user'
            });
        }

        const userInfo = await UserInfo.findOne({
            credentials: userCredentials._id
        }).populate({
            path: 'credentials',
            select: 'credentials.email'
        }).populate('vanity.badges').exec();

        if (!userInfo) {
            return res.status(400).json({
                status: 'error',
                error: 'User info not found'
            });
        }

        const userObj = userInfo.toObject();

        const user = {
            credentials: {
                _id: userObj.credentials._id,
                email: userObj.credentials.credentials.email
            },
            vanity: userObj.vanity,
            info: userObj.info,
            meta: userObj.meta,
            _id: userObj._id
        };

        return res.status(200).json(user);
    } catch (err) {
        console.error('Error in getUserByEmail:', err);
        return res.status(400).json({
            status: 'error',
            error: 'Could not get user'
        });
    }
}

export const getUserById = async (req, res) => {
    try {
        const userInfo = await UserInfo.findById(req.params.id)
            .populate({
                path: 'credentials',
                select: 'credentials.email'
            }).populate('vanity.badges')
            .exec();
        if (!userInfo) {
            console.log('No user info found for ID:', req.params.id);
            return res.status(400).json({ status: 'error', error: 'User info not found' });
        }

        const userObj = userInfo.toObject();

        const user = {
            credentials: {
                _id: userObj.credentials._id,
                email: userObj.credentials.credentials.email
            },
            vanity: userObj.vanity,
            info: userObj.info,
            meta: userObj.meta,
            _id: userObj._id
        };

        return res.status(200).json(user);
    } catch (err) {
        console.error('Error in getUserById:', err);
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
            user: credentials
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

        const user_credentials = await UserCredentials.findOne({ "credentials.email": email }).exec();
        if (!user_credentials) {
            return res.status(400).json({ status: "error", error: "Account not found." });
        }

        if (!compareSync(password, user_credentials.credentials.password)) {
            return res.status(400).json({ status: 'error', error: 'Invalid password.' });
        }

        // TODO: maybe invalidate the last session (if it exists) before creating a new one for consistency or just set expiry time to shorter time than 1 hour
        const userInfo = await UserInfo.findOne({ credentials: user_credentials._id }).populate('vanity.badges').exec();

        const user = {
            credentials: {
                _id: user_credentials._id,
                email: user_credentials.credentials.email
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

export const updateInfo = async (req, res) => {
    try {
        const userInfo = await UserInfo.findById(req.user._id).exec();
        if (!userInfo) {
            return res.status(404).json({
                status: 'error',
                error: 'User info not found'
            });
        }

        const userCredentials = await UserCredentials.findById(userInfo.credentials._id).exec();
        if (!userCredentials) {
            return res.status(404).json({
                status: 'error',
                error: 'User credentials not found'
            });
        }

        if (req.body.credentials) {
            const updates = {};

            if (req.body.credentials.email) {
                const existingUser = await UserCredentials.findOne({
                    _id: { $ne: userCredentials._id },
                    "credentials.email": req.body.credentials.email
                }).exec();
                if (existingUser) {
                    return res.status(400).json({
                        status: 'error',
                        error: 'Email already in use'
                    });
                }
                updates["credentials.email"] = req.body.credentials.email;
            }
            if (req.body.credentials.password) {
                const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
                if (!req.body.credentials.password.match(passwordRegex)) {
                    return res.status(400).json({
                        status: 'error',
                        error: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character'
                    });
                }
                updates["credentials.password"] = hashSync(req.body.credentials.password, 12);
            }

            updates["meta.updated_at"] = new Date();

            await UserCredentials.findByIdAndUpdate(userCredentials._id, {
                $set: updates
            });
        }

        if (req.body.info || req.body.vanity) {
            const updates = {};

            if (req.body.info) {
                for (const [key, value] of Object.entries(req.body.info)) {
                    if (key === 'name') {
                        for (const [nameKey, nameValue] of Object.entries(value)) {
                            if (nameValue) {
                                updates[`info.name.${nameKey}`] = nameValue;
                            }
                        }
                    } else if (key === 'links') {
                        for (const [linkKey, linkValue] of Object.entries(value)) {
                            if (linkValue !== undefined) {
                                updates[`info.links.${linkKey}`] = linkValue;
                            }
                        }
                    } else if (value) {
                        updates[`info.${key}`] = value;
                    }
                }
            }
            if (req.body.vanity) {
                for (const [key, value] of Object.entries(req.body.vanity)) {
                    if (value !== undefined) {
                        updates[`vanity.${key}`] = value;
                    }
                }
            }

            updates["meta.updated_at"] = new Date();

            await UserInfo.findByIdAndUpdate(userInfo._id, {
                $set: updates
            });
        }

        const updatedUserInfo = await UserInfo.findOne({ credentials: userCredentials._id })
            .populate({
                path: 'credentials',
                select: 'credentials.email'
            }).populate('vanity.badges')
            .exec();

        const updatedUser = {
            credentials: {
                email: updatedUserInfo.credentials.credentials.email
            },
            vanity: updatedUserInfo.vanity,
            info: updatedUserInfo.info,
            meta: updatedUserInfo.meta
        };

        return res.status(200).json({
            status: 'success',
            user: updatedUser
        });

    } catch (err) {
        console.error('Error in updateInfo:', err);
        return res.status(500).json({
            status: 'error',
            error: 'Could not update user information'
        });
    }
};


// Get all orgs of a user
export const GetUserOrgs = async (req, res) => {
    try {
        const orgIds = await GetUserOrganizations(req.user._id);

        if (!orgIds || orgIds.length === 0) {
            return res.status(200).json({
                status: "success",
                count: 0,
                organizations: []
            });
        }

        const organizations = await Org.find({ _id: { $in: orgIds } })
            .select('vanity info meta')
            .lean()
            .exec();

        return res.status(200).json({
            status: "success",
            count: organizations.length,
            organizations
        });
    } catch (err) {
        console.error("GetUserOrganizations Error:", err);
        return res.status(500).json({
            status: "error",
            error: "Could not get user organizations"
        });
    }
};

export const GetUserOrgsByUserId = async (req, res) => {
    try {
        const orgIds = await GetUserOrganizations(req.params.id);

        if (!orgIds || orgIds.length === 0) {
            return res.status(200).json({
                status: "success",
                count: 0,
                organizations: []
            });
        }

        const organizations = await Org.find({ _id: { $in: orgIds } })
            .select('vanity info meta')
            .lean()
            .exec();

        return res.status(200).json({
            status: "success",
            count: organizations.length,
            organizations
        });
    } catch (err) {
        console.error("GetUserOrganizations Error:", err);
        return res.status(500).json({
            status: "error",
            error: "Could not get user organizations"
        });
    }
};
