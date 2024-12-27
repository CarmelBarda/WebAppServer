import express from "express";
import { commentController } from "../controllers/comment.controller";

const router = express.Router();

router.get('/', commentController.getAllComments);
router.get('/:id', commentController.getCommentById);
router.post('/', commentController.createComment);
router.put('/:id', commentController.updateComment);
router.get('/:post', commentController.getPostComments);
router.delete('/:commentId', commentController.deleteComment);

export default router;
