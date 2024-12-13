import mongoose, { FilterQuery, Model } from "mongoose";
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

    getPostById = async (req: Request, res: Response) => {
        const postId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).send({ error: "ownerId isn't valid" });
        }

        const post = await this.getPostsByFilter({ 
            _id: new mongoose.Types.ObjectId(postId) 
        });
        
        res.status(200).send(post);
    }
};

const postController = new PostController(Post);

export default postController;