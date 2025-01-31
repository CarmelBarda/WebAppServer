import { Router } from 'express';
import authRoute from './auth.route';
import postRoute from './post.route';
import commentRoute from './comment.route';
import likeRoute from './like.route';

const baseRouter = Router();

baseRouter.use('/auth', authRoute);
baseRouter.use('/post', postRoute);
baseRouter.use('/comment', commentRoute);
baseRouter.use('/like', likeRoute);

export default baseRouter;
