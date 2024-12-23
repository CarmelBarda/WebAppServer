import mongoose, { FilterQuery, Model } from "mongoose";
import { Request, Response } from "express";
import { Comment } from "../models/models";
import { IComment } from "../models/interfaces/IComment";

export class CommentController {
    model: Model<IComment>;
    
    constructor(model: Model<IComment>) {
        this.model = model;
    }

    getCommentsByFilter = (filter: FilterQuery<IComment>) => {
        return this.model
          .aggregate()
          .match(filter)
    }

    createComment = async (req: Request, res: Response) => {
        try {
            const newComment = await this.model.create(req.body);

            res.status(200).send(newComment);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    updateComment = async (req: Request, res: Response) => {
        try {
          const commentId = req.params.id;
          const updatedMessage = req.body;

          const updatedPost = await this.model.findByIdAndUpdate(
            commentId,
            { $set: updatedMessage },
            { new: true }
          );

          if (!updatedPost) {
            res.status(404).json({ error: `Comment ${commentId} not found` });
          } 

          res.status(200).send(updatedPost);  

        } catch (err) {
          res.status(500).json({ message: err.message });
      }
    }


    getPostComments = async (req: Request, res: Response) => {
        try {
          const postId: string = req.params.post;

        const postComments = await this.getCommentsByFilter({ 
            postId: postId
        });

        res.status(200).send(postComments);
        } catch (err) {
          res.status(500).json({ message: err.message });
      }
    }
};

export const commentController = new CommentController(Comment);
