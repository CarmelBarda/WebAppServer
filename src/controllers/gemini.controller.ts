import { GoogleGenerativeAI } from '@google/generative-ai';
import { Request, Response } from 'express';

export const sendGeminiReq = async (req: Request, res: Response) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = req.body.prompt;
    const result = await model.generateContent(prompt);

    res.status(200).send(result.response.text());
  } catch (err) {
    res.status(500).json({ message: 'Gemini Request Failed.' });
  }
};
