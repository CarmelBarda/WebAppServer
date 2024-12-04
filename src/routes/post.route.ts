import express from "express";
import postController from "../controllers/post.controller";

const router = express.Router();

router.get("/", [], postController.getAllPosts);

export default router;
