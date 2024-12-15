import express from "express";
import postController from "../controllers/post.controller";

const router = express.Router();

router.get('/', postController.getAllPosts);

router.post('/:sender', postController.getPostsBySender);

router.put('/:id', postController.updatePost);

export default router;
