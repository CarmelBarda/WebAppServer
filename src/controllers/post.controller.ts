import mongoose, { Document, FilterQuery, Model } from "mongoose";
import { BaseController } from "./base.controller";
import { IPost } from "../models/interfaces/IPost";
import { Request, Response } from "express";
import { Post } from "../models/models";

export class PostController extends BaseController<IPost> {
    constructor(model: Model<IPost>) {
        super(model);
    }

    getPostsByFilter = (filter: FilterQuery<IPost>) => {
        return this.model
          .aggregate()
          .match(filter)
    }

    getAllPosts = async (_: Request, res: Response) => {
        const allPosts = await this.getPostsByFilter({});
        
        res.status(200).send(allPosts);
    }

    getPostsBySender = async (req: Request, res: Response) => {
        try {
          const senderId = req.params.sender;

        if (!mongoose.Types.ObjectId.isValid(senderId)) {
            res.status(400).send({ error: "sender id isn't valid" });
        }

        const postsBySender = await this.getPostsByFilter({ 
            owner: new mongoose.Types.ObjectId(senderId) 
        });

        res.status(200).send(postsBySender);
        } catch (err) {
          res.status(500).json({ message: err.message });
      }
      
    }

    updatePost = async (req: Request, res: Response) => {
        try {
          const postId = req.params.id;
          const updatedPostFIelds = req.body;

          const updatedPost = await this.model.findByIdAndUpdate(
            postId,
            { $set: updatedPostFIelds },
            { new: true }
          );

          if (!updatedPost) {
            res.status(404).json({ error: `Post ${postId} not found` });
          } 
            
          res.status(200).send(updatedPost);  

        } catch (err) {
          res.status(500).json({ message: err.message });
      }
    };
};

const postController = new PostController(Post);

export default postController;