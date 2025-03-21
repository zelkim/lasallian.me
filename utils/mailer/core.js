import nodemailer from 'nodemailer';

/**
 * Sends an email using Zoho Mail SMTP
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} [options.html] - HTML content (optional)
 * @returns {Promise<Object>} - Info about the sent email
 */
const sendEmail = async ({ sender, to, subject, text, html }) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true, // true for port 465, false for 587
        auth: {
            user: process.env.MAIL_USER, // your Zoho email
            pass: process.env.MAIL_PASS, // your Zoho app password
        },
    });

    const mailOptions = {
        from: `"${sender}" <${process.env.MAIL_USER}>`,
        to,
        subject,
        text,
        html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
};

export default sendEmail;
