import mongoose, { Model } from 'mongoose';
import { Request, Response } from 'express';
import { IPost } from '../models/interfaces/IPost';
import { Post } from '../models/models';

export class PostController {
  model: Model<IPost>;

  constructor(model: Model<IPost>) {
    this.model = model;
  }

  getAllPosts = async (_: Request, res: Response) => {
    const allPosts = await this.model.find({}).populate('owner', 'name').exec();
    res.status(200).send(allPosts);
  };

  getPostById = async (req: Request, res: Response) => {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).send({ error: "post id isn't valid" });
    } else {
      const post = await this.model
        .findById({
          _id: new mongoose.Types.ObjectId(postId),
        })
        .populate('owner', 'name');

      res.status(200).send(post[0]);
    }
  };

  createPost = async (req: Request, res: Response) => {
    try {
      const newPost = await this.model.create(req.body);

      res.status(200).send(newPost);
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  getPostsBySender = async (req: Request, res: Response) => {
    try {
      const senderId = req.query.sender as string;

      const postsBySender = await this.model
        .find({
          owner: senderId,
        })
        .populate('owner', 'name');

      res.status(200).send(postsBySender);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  updatePost = async (req: Request, res: Response) => {
    try {
      const postId = req.params.id;
      const updatedPostFields = req.body;

      const updatedPost = await this.model.findByIdAndUpdate(
        postId,
        { $set: updatedPostFields },
        { new: true }
      );

      if (!updatedPost) {
        res.status(404).json({ error: `Post ${postId} not found` });
      } else {
        res.status(200).send(updatedPost);
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
}

const postController = new PostController(Post);

export default postController;
