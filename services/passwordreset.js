import bcrypt from 'bcrypt';
import UserCredentials from '../models/UserCredentials.js'; // Adjust path as needed
import PasswordResetSession from '../models/PasswordReset.js';
import sendPasswordResetEmail from '../utils/mailer/passwordreset.js'; // Adjust path as needed

// Express controller
export const createResetPasswordInstance = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            message: 'Email is required.',
        });
    }

    try {
        const user = await UserCredentials.findOne({
            'credentials.email': email,
        });

        if (!user) {
            return res.status(200).json({
                message:
                    'If your email is registered, you will be sent password reset instructions in your email.',
            });
        }

        const existingSession = await PasswordResetSession.findOne({ email });

        if (existingSession) {
            const secondsSinceLastRequest =
                (Date.now() - existingSession.createdAt.getTime()) / 1000;
            if (secondsSinceLastRequest < 60) {
                return res.status(429).json({
                    message: `You can only request a password reset every 60 seconds. Please try again in ${Math.ceil(60 - secondsSinceLastRequest)} seconds.`,
                });
            }
        }

        await PasswordResetSession.findOneAndDelete({ email });

        const passwordReset = await PasswordResetSession.create({ email });
        sendPasswordResetEmail(
            email,
            `${process.env.WEB_URL}/resetpassword/${passwordReset._id}`
        );

        return res.status(200).json({
            message:
                'If your email is registered, you will be sent password reset instructions in your email.',
        });
    } catch (error) {
        console.error('Error in createResetPasswordInstance:', error);
        return res.status(500).json({
            message: 'An error occurred while processing your request.',
        });
    }
};

export const validatePasswordResetInstance = async (req, res) => {
    try {
        const passReset = await PasswordResetSession.findById(req.params.id);
        if (!passReset) {
            return res
                .status(404)
                .json({ error: 'Invalid password reset instance.' });
        }
        return res.status(200).json(passReset);
    } catch (error) {
        console.error('Error in validatePasswordResetInstance:', error);
        return res.status(500).json({
            message:
                'An error occurred while validating the password reset instance.',
        });
    }
};

export const handlePasswordReset = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res
                .status(400)
                .json({ message: 'Incorrect parameters length' });
        }

        const passReset = await PasswordResetSession.findById(token);

        if (!passReset) {
            return res.status(400).json({ message: 'Invalid passresettoken' });
        }

        const hashedPassword = bcrypt.hashSync(password, 12);

        const updatedUser = await UserCredentials.findOneAndUpdate(
            { 'credentials.email': passReset.email },
            {
                $set: {
                    'credentials.password': hashedPassword,
                    'meta.updated_at': new Date(),
                },
            },
            { new: true }
        );

        if (!updatedUser) {
            return res
                .status(404)
                .json({ message: 'Invalid Password Reset Session' });
        }

        await PasswordResetSession.findOneAndDelete(token);

        return res.status(200).json({
            message: 'Password updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};
