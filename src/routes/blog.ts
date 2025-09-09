import { Router } from "express";
import { getAllBlogs,createBlog,getSingleBlog,updateBlog,deleteBlog } from "../controllers/blog";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router()


router.route("/").get(authMiddleware,getAllBlogs).post(authMiddleware,createBlog)
router.route("/:id").get(authMiddleware,getSingleBlog).put(authMiddleware,updateBlog).delete(authMiddleware,deleteBlog)




export default router 