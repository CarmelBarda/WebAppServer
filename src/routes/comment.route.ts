import express from "express";
import postController from "../controllers/post.controller";
import { commentController } from "../controllers/comment.controller";

const router = express.Router();

router.post('/', commentController.createComment);
router.put('/:id', commentController.updateComment);
router.post('/:post', commentController.getPostComments);

export default router;
