import { Router } from "express";
import testRoute from "./test.route";
import postRoute from "./post.route";

// Export the base-router
const baseRouter = Router();

baseRouter.use("/test", testRoute);
baseRouter.use("/post", postRoute);

export default baseRouter;
