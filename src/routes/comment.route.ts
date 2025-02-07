import express from 'express';
import { commentController } from '../controllers/comment.controller';
import authMiddleware from '../commons/middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

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

/**
 * @swagger
 * /api/comment:
 *   get:
 *     summary: Get comments by post id or all comments
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: post
 *         required: false
 *         description: id of the post whos' commets to get. if ommited, all comments will be returned
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An array of the post's comments or all comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Internal server error
 */
router.get('/', authMiddleware, (req, res) => {
  if (req.query.post) {
    return commentController.getPostComments(req, res);
  }

  return commentController.getAllComments(req, res);
});

/**
 * @swagger
 * /api/comment/{id}:
 *   get:
 *     summary: Get comment by id
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id of the comment to get
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authMiddleware, commentController.getCommentById);

/**
 * @swagger
 * /api/comment/post/{postId}:
 *   get:
 *     summary: Get comments count by post id
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: post id of the comments count to get
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested comments count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                amount:
 *                  type: number
 *                  description: amount of comments
 *       404:
 *         description: Comments count not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/post/:postId',
  authMiddleware,
  commentController.getPostCommentsAmount
);

/**
 * @swagger
 * /api/comment:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentRequest'
 *           example:
 *             message: "amazinggg!!"
 *             userId: "675016b349f76c9c0a7ab99a"
 *             postId: "675073bc49f76c9c0a7ab99c"
 *     responses:
 *       200:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Internal server error
 */
router.post('/', authMiddleware, commentController.createComment);

/**
 * @swagger
 * /api/comment/{id}:
 *   put:
 *     summary: Update a comment by id
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id of the comment to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentUpdateRequest'
 *           example:
 *             message: "amazinggg!!"
 *             userId: "675016b349f76c9c0a7ab99a"
 *             postId: "675073bc49f76c9c0a7ab99c"
 *     responses:
 *       200:
 *         description: The updated Comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authMiddleware, commentController.updateComment);

/**
 * @swagger
 * /api/comment/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: ID of the comment to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: comment not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:commentId', authMiddleware, commentController.deleteComment);

export default router;
