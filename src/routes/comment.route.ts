import express from "express";
import { commentController } from "../controllers/comment.controller";

const router = express.Router();

router.post('/', commentController.createComment);
router.put('/:id', commentController.updateComment);
router.get('/:post', commentController.getPostComments);

export default router;
