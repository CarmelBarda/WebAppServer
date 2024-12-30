import express from "express";
import { commentController } from "../controllers/comment.controller";

const router = express.Router();

router.get('/', (req, res) => {
    if (req.query.post) {
        return commentController.getPostComments(req, res);
    }
    
    return commentController.getAllComments(req, res);
});
router.get('/:id', commentController.getCommentById);
router.post('/', commentController.createComment);
router.put('/:id', commentController.updateComment);
router.delete('/:commentId', commentController.deleteComment);

export default router;
