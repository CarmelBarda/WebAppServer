import express from "express";
import postController from "../controllers/post.controller";

const router = express.Router();

router.get('/', postController.getAllPosts);

router.get('/:id', postController.getPostById);

router.post('/', postController.create);

export default router;
