import mongoose, { Model } from 'mongoose';
import { Request, Response } from 'express';
import { Like } from '../models/models';
import { ILike } from '../models/interfaces/ILike';

export class LikeController {
  model: Model<ILike>;

  constructor(model: Model<ILike>) {
    this.model = model;
  }

  addLike = async (req: Request, res: Response) => {
    try {
      const newLike = await this.model.create(req.body);

      res.status(200).send(newLike);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  deleteLike = async (req: Request, res: Response) => {
    try {
      const userId: string = req.body.userId as string;
      const postId: string = req.body.postId as string;

      await this.model.deleteOne({ userId: userId, postId: postId });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  getPostLikes = async (req: Request, res: Response) => {
    try {
      const postId: string = req.params.postId as string;

      const postLikes = await this.model.find({
        postId: postId,
      });

      const likedUserIds = postLikes.map((like) => like.userId);

      res.status(200).send({ likedUserIds });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
}

export const likeController = new LikeController(Like);
