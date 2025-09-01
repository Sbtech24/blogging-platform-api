import { Router } from "express";
import { getAllBlogs,createBlog,getSingleBlog,updateBlog,deleteBlog } from "../controllers/blog";

const router = Router()


router.route("/").get(getAllBlogs).post(createBlog)
router.route("/:id").get(getSingleBlog).put(updateBlog).delete(deleteBlog)


export default router 