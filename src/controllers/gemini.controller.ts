import { GoogleGenerativeAI } from '@google/generative-ai';
import { Request, Response } from 'express';

export const sendGeminiReq = async (req: Request, res: Response) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `I have read and liked the book: ${req.query.bookName}. 
    I want you to give me a reccomentation for my next book based on this book.
    If you dont find any book, please return a random reccomended book.
    Please tell me the book name and the author 
    and a short description of the book (2-3 sentences).
    Please put on book name quotes and a dot after the author name.
    Please return all in plain text with no html or other formatting.`;

    const result = await model.generateContent(prompt);

    res.status(200).json(result.response.text());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gemini Request Failed.' });
  }
};
