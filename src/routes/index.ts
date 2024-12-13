import { Router } from "express";
import postRoute from "./post.route";

const baseRouter = Router();

baseRouter.use("/post", postRoute);

export default baseRouter;
