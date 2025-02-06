import express from 'express';
import authMiddleware from '../commons/middlewares/auth';
import { sendGeminiReq } from '../controllers/gemini.controller';

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
 *   name: Gemini
 *   description: API for getting a reccomendation from Gemini
 */

/**
 * @swagger
 * /api/gemini:
 *   get:
 *     summary: Get reccomendation by book name
 *     tags: [Gemini]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: bookName
 *         required: true
 *         description: post name of the reccomendation to get
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested reccomendation
 *         content:
 *           text/plain:
 *            schema:
 *             type: string
 *       500:
 *         description: Internal server error
 */
router.get('/', authMiddleware, sendGeminiReq);

export default router;
