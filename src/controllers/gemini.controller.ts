import { GoogleGenerativeAI } from '@google/generative-ai';
import { Request, Response } from 'express';

export const sendGeminiReq = async (req: Request, res: Response) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `I have read and liked the book: ${req.query.bookName}. 
    I want you to give me a reccomentation for my next book based on this book.
    Please return a json answer with fields: title, author, and description.
    Please return the response without the word json at the begginning.`;

    const result = await model.generateContent(prompt);
    const json = JSON.parse(result.response.text());

    res.status(200).json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gemini Request Failed.' });
  }
};
