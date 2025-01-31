import { Request, Response } from 'express';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
    }

    res.json({ filename: req.file.filename });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
