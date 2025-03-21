import UserCredentials from './models/UserCredentials.js'; // Adjust path as needed
import sendResetPasswordEmail from './utils/mailer/resetpassword.js'; // Adjust path as needed

// Express controller
export const createResetPasswordInstance = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            message: 'Email is required.',
        });
    }

    try {
        const user = await UserCredentials.findOne({ email });

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
        await PasswordResetSession.create({ email });
        await sendResetPasswordEmail(email);

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
