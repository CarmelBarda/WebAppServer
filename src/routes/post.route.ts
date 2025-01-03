import express from "express";
import postController from "../controllers/post.controller";
import authMiddleware from "../commons/middlewares/auth";

const router = express.Router();

router.get('/:id', authMiddleware, postController.getPostById);
router.get('/', authMiddleware, (req, res) => {
    if (req.query.sender) {
        return postController.getPostsBySender(req, res);
    }
    
    return postController.getAllPosts(req, res);
});
router.post('/', authMiddleware, postController.createPost);
router.put('/:id', authMiddleware, postController.updatePost);

export default router;
