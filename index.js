// -- lasallian.me
// A professional social media platform created for De La Salle University's
// student organization ecosystem.
import express, { urlencoded, json } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
import userRouter from './routes/user.js';
import commentRouter from './routes/comments.js';
import postRouter from './routes/post.js';
import { validateSession } from './services/session.js';
import badgeRouter from './routes/badge.js';
import orgRouter from './routes/org.js';
import hashtagRouter from './routes/hashtag.js';
import reactionRouter from './routes/reaction.js';
import { sendMail } from './utils/mailer.js';

config();

const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

// ##############
// ##  ROUTES  ##
// ##############
app.use('/user', userRouter);
app.use('/comment', commentRouter);
app.use('/post', postRouter);
app.use('/org', orgRouter);
app.use('/badge', badgeRouter);
app.use('/hashtag', hashtagRouter);
app.use('/reaction', reactionRouter);

app.get('/test', validateSession, (req, res) => res.send('works'));

// NOTE: STARTUP
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log(`[${process.env.APP_NAME}] Database connection established.`);
});

app.listen(process.env.APP_PORT, () => {
    console.log(
        `[${process.env.APP_NAME}] API started on port ${process.env.APP_PORT}`
    );
    const emailHTML =
        '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #ddd;border-radius:8px;overflow:hidden"><div style="background:#005C19;color:#fff;padding:20px;text-align:center"><h2 style="margin:0;font-size:24px">lasallian.me</h2><p style="margin:5px 0;font-size:14px">YOUR Lasallian Experience.</p></div><div style="padding:20px;text-align:center"><p style="font-size:16px;color:#333">You requested a password reset. Click the button below to set a new password.</p><a href="{{reset_link}}" style="display:inline-block;background:#005C19;color:#fff;text-decoration:none;padding:12px 20px;border-radius:5px;font-size:16px;margin:10px 0">Reset Password</a><p style="font-size:14px;color:#555">If the button doesn\'t work, use this link:</p><a href="{{reset_link}}" style="font-size:14px;color:#005C19;word-break:break-all">{{reset_link}}</a></div><div style="background:#f5f5f5;padding:15px;text-align:center;font-size:12px;color:#666"><p style="margin:0">If you didn\'t request this, you can safely ignore this email.</p></div></div>';

    sendMail(
        'lasallian.me',
        'sean_robenta@dlsu.edu.ph',
        '[lasallian.me] Reset your password',
        emailHTML
    );
});
