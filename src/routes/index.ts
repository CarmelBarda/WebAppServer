import { Router } from "express";
import testRoute from "./test.route";
// Export the base-router
const baseRouter = Router();

baseRouter.use("/test", testRoute);

export default baseRouter;
