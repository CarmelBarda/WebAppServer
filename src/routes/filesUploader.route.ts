import express, { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { uploadImage } from '../controllers/filesUploader.controller';
import authMiddleware from '../commons/middlewares/auth';

const router = express.Router();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedFiles = ['image/jpeg', 'image/png', 'image/gif'];

  if (!allowedFiles.includes(file.mimetype)) {
    return cb(new Error('The image type is invalid'));
  }

  cb(null, true); // Accept the file
};

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (_req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage, fileFilter });

// endpoint to upload he images
router.post('/', authMiddleware, upload.single('image'), uploadImage);

export default router;
