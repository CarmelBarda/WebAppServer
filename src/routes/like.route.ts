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
 *           description: id of the post the like belongs to
 *         userId:
 *           type: string
 *           description: id of the user who liked the post
 *     LikeCreateRequest:
 *       type: object
 *       required:
 *         - userId
 *         - postId
 *       properties:
 *         userId:
 *           type: string
 *           description: user id
 *         postId:
 *           type: string
 *           description: post id
 */

/**
 * @swagger
 * /api/like/{postId}:
 *   get:
 *     summary: Get likes by post id
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: post id of the likes to get
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested user ids of likes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/likes/schemas/Like'
 *       404:
 *         description: Likes not found
 *       500:
 *         description: Internal server error
 */
router.get('/:postId', authMiddleware, likeController.getPostLikes);

/**
 * @swagger
 * /api/like:
 *   like:
 *     summary: Create a new like
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             schema:
 *               $ref: '#/likes/schemas/LikeCreateRequest'
 *             example:
 *               userId: 60f7b3b2b5f7b30015f3f3b2
 *               postId: 60f7b3b2b5f7b30015f3f3b2
 *     responses:
 *       200:
 *         description: created like
 *       500:
 *         description: Internal server error
 */
router.post('/', authMiddleware, likeController.addLike);

export default router;
