import { Router } from "express";
import postRoute from "./post.route";
import commentRoute from "./comment.route";


const baseRouter = Router();

baseRouter.use("/post", postRoute);
baseRouter.use("/comment", commentRoute);

export default baseRouter;
