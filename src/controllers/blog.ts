import { Request, Response, NextFunction } from "express";
import { Appsource } from "../config/data-source";
import { Blog } from "../model/blog";
import { User } from "../model/user";
import { AuthRequest } from "../middleware/authMiddleware";

const blogrepository = Appsource.getRepository(Blog);
const userrepository = Appsource.getRepository(User);

export const createBlog = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!title || !content || !category || !tags) {
      return res.status(404).json({ message: "Please provide complete data" });
    }

    const user = await userrepository.findOneBy({ id: req.user.id });
    if (!user) return res.status(404).json({ message: "User not found" });

    const blog = await blogrepository.create({
      title,
      content,
      category,
      tags,
      author: user,
    });
    await blogrepository.save(blog);
    res.status(201).json(blog);
  } catch (err) {
    next(err);
  }
};
export const getAllBlogs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogs = await blogrepository.find({
      where: { author: { id: req.user.id } },
      relations:["author"]
    });
    if (!blogs) {
      return res.status(200).json({ message: "No blog found" });
    }
    res.status(200).json(blogs);
  } catch (err) {
    next(err);
  }
};
export const getSingleBlog = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const blog = await blogrepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["author"],
    });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ blog });
  } catch (err) {
    next(err);
  }
};
export const updateBlog = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, category, tag } = req.body;

    const user = await userrepository.findOne({ where: { id: req.user.id } });

    const blog = await blogrepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["author"],
    });

    if (!blog) return res.status(404).json({ message: "Post not found" });

    if (blog) {
      blog.title = title ?? blog.title;
      blog.content = content ?? blog.content;
      blog.category = category ?? blog.category;
      blog.tags = tag ?? blog.tags;
      blog.author = user ?? blog.author;
      await blogrepository.save(blog);
    }
    res.status(200).json(blog);
  } catch (err) {
    next(err);
  }
};
export const deleteBlog = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const blog = await blogrepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ["author"],
    });

    const user = await userrepository.findOne({ where: { id: req.user.id } });

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.id !== user?.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await blogrepository.remove(blog);
    res.status(200).json({ message: "Succefully deleted" });
  } catch (err) {
    next(err);
  }
};
