import { FilterQuery, Model } from "mongoose";
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
};

const postController = new PostController(Post);

export default postController;