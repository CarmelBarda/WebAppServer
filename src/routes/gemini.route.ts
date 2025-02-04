import express from 'express';
import authMiddleware from '../commons/middlewares/auth';
import { sendGeminiReq } from '../controllers/gemini.controller';

const router = express.Router();

router.get('/', authMiddleware, sendGeminiReq);

export default router;
