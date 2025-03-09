import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config();
const emailHTML =
    '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #ddd;border-radius:8px;overflow:hidden"><div style="background:#005C19;color:#fff;padding:20px;text-align:center"><h2 style="margin:0;font-size:24px">lasallian.me</h2><p style="margin:5px 0;font-size:14px">YOUR Lasallian Experience.</p></div><div style="padding:20px;text-align:center"><p style="font-size:16px;color:#333">You requested a password reset. Click the button below to set a new password.</p><a href="{{reset_link}}" style="display:inline-block;background:#005C19;color:#fff;text-decoration:none;padding:12px 20px;border-radius:5px;font-size:16px;margin:10px 0">Reset Password</a><p style="font-size:14px;color:#555">If the button doesn\'t work, use this link:</p><a href="{{reset_link}}" style="font-size:14px;color:#005C19;word-break:break-all">{{reset_link}}</a></div><div style="background:#f5f5f5;padding:15px;text-align:center;font-size:12px;color:#666"><p style="margin:0">If you didn\'t request this, you can safely ignore this email.</p></div></div>';

// Configure the transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // Use an App Password if 2FA is enabled
    },
});

// Send an email
export async function sendMail(username, recipient, subject, html) {
    try {
        console.log(process.env.MAIL_USER, ':', process.env.MAIL_PASS);
        const info = await transporter.sendMail({
            from: `"${username}" <${process.env.MAIL_USER}>`,
            to: recipient,
            subject: subject,
            html: html,
        });

        console.log('Message sent: %s', info.messageId);
        return 'email sent';
    } catch (error) {
        console.error('Error sending email:', error);
        return undefined;
    }
}
