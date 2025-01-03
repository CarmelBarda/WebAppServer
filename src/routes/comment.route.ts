import express from "express";
import { commentController } from "../controllers/comment.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: API for managing comments on posts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: unique identifier of the comment
 *         postId:
 *           type: string
 *           description: id of the post the comment belongs to
 *         userId:
 *           type: string
 *           description: id of the user who sent the comment
 *         content:
 *           type: string
 *           description: comment's content
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: timestamp of the comment creation
 *     CommentCreateRequest:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           description: comment's content
 */

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
