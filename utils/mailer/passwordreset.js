import fs from 'fs';
import sendEmail from './core.js';

const html = fs.readFileSync('./utils/mailer/passwordreset.html', 'utf-8');

export default async function sendPasswordResetEmail(email, link) {
    await sendEmail({
        sender: 'Password Reset',
        subject: 'Reset your password',
        to: email,
        html: html.replace(/{{PASSWORD_RESET_LINK}}/g, link),
    });
}
