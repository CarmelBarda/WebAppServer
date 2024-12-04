import { BaseController } from "./base.controller";
import UserModel, { IUser } from '../models/test.model';
import mongoose, { Model } from "mongoose";
import { Request, Response } from "express";

export class TestController extends BaseController<IUser> {
    constructor(model: Model<IUser>) {
        super(model);
    }

    // async getTest(req, res) {
    //     const user = await UserModel.findById('59b99db4cfa9a34dcd7885b6');
    //     res.status(200).json(user);
    // }

    getTests(filter: mongoose.FilterQuery<IUser>) {
        return this.model
          .aggregate()
          .match(filter)
      }

    async get(req: Request, res: Response) {
        try {
          const posts = await this.getTests({});    
          const param = req.query.param;
          res.status(200).send([...posts, param]);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }
}

const testController = new TestController(UserModel);

export default testController;