import express from 'express';
import authMiddleware from '../commons/middlewares/auth';
import { likeController } from '../controllers/like.controller';

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
 *   name: Like
 *   description: API for managing likes on posts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Like:
 *       type: object
 *       properties:
 *         postId:
 *           type: string
 *           description: ID of the post the like belongs to
 *         userId:
 *           type: string
 *           description: ID of the user who liked the post
 *     LikeCreateRequest:
 *       type: object
 *       required:
 *         - userId
 *         - postId
 *       properties:
 *         userId:
 *           type: string
 *           description: User ID
 *         postId:
 *           type: string
 *           description: Post ID
 */

/**
 * @swagger
 * tags:
 *   name: Like
 *   description: API for managing likes on posts
 */

/**
 * @swagger
 * /api/like:
 *   post:
 *     summary: Like a post
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LikeCreateRequest'
 *     responses:
 *       200:
 *         description: Successfully liked the post
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Like added successfully"
 *       500:
 *         description: Internal server error
 */
router.post('/', authMiddleware, likeController.addLike);

/**
 * @swagger
 * /api/like/{postId}:
 *   get:
 *     summary: Get likes for a post
 *     tags: [Like]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: Successfully retrieved likes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Like'
 *       500:
 *         description: Internal server error
 */
router.get('/:postId', authMiddleware, likeController.getPostLikes);

/**
 * @swagger
 * /api/like/{postId}/{userId}:
 *   delete:
 *     summary: Unlike a post
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Successfully unliked the post
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Like removed successfully"
 *       500:
 *         description: Internal server error
 */
router.delete('/:postId/:userId', authMiddleware, likeController.deleteLike);

export default router;
