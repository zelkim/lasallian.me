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
});
