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
            res.status(400).send({ error: "post id isn't valid" });
        }

        const post = await this.getPostsByFilter({ 
            _id: new mongoose.Types.ObjectId(postId) 
        });

        res.status(200).send(post[0]);
    }

    async create(req: Request, res: Response) {
        try {    
          const newPost = await super.create(req, res);

          res.status(200).send(newPost);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
    }
};

const postController = new PostController(Post);

export default postController;