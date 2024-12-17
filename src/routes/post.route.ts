import express from "express";
import postController from "../controllers/post.controller";

const router = express.Router();

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/:sender', postController.getPostsBySender);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);

export default router;
