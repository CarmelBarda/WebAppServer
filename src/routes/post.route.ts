import express from "express";
import postController from "../controllers/post.controller";

const router = express.Router();

router.get('/:id', postController.getPostById);
router.get('/', (req, res) => {
    if (req.query.sender) {
        return postController.getPostsBySender(req, res);
    }
    return postController.getAllPosts(req, res);
});
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);

export default router;
