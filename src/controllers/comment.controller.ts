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

    getAllComments = async (_: Request, res: Response) => {
      try {
        const allcomments = await this.getCommentsByFilter({});
      
        res.status(200).send(allcomments);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
        
    }

    getCommentById = async (req: Request, res: Response) => {
      try {
        const commentId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            res.status(400).send({ error: "comment id isn't valid" });
        }

        const comment = await this.getCommentsByFilter({ 
            _id: new mongoose.Types.ObjectId(commentId) 
        });

        res.status(200).send(comment[0]);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }

    createComment = async (req: Request, res: Response) => {
        try {
          const comment: IComment = new Comment({ ...req.body });
      
          const savedComment = await comment.save();

            res.status(200).send(savedComment);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    updateComment = async (req: Request, res: Response) => {
        try {
          const commentId = req.params.id;
          const updatedMessage = req.body;

          const updatedComment = await this.model.findByIdAndUpdate(
            commentId,
            { $set: updatedMessage },
            { new: true }
          );

          res.status(200).send(updatedComment);  

        } catch (err) {
          res.status(500).json({ message: err.message });
      }
    }


    getPostComments = async (req: Request, res: Response) => {
        try {
          const postId: string = req.query.post as string;

        const postComments = await this.getCommentsByFilter({ 
            postId: postId
        });

        res.status(200).send(postComments);
        } catch (err) {
          res.status(500).json({ message: err.message });
      }
    }

    deleteComment = async (req: Request, res: Response) => {
      try {
        const commentId = req.params.commentId;
    
        const deletedComment = await this.model.findByIdAndDelete(commentId);
        if (!deletedComment) {
          res.status(404).json({ error: "Comment not found" });
        } else {
          res.status(200).json({ message: "Comment deleted successfully" });
        }
    
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    };
};

export const commentController = new CommentController(Comment);
