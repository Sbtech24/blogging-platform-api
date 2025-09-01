import { Request, Response, NextFunction } from "express";
import { Appsource } from "../config/data-source";
import { Blog } from "../model/blog";

const blogtrepository = Appsource.getRepository(Blog);

export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, category, tags } = req.body;

    if(!title || !content || !category ||!tags ){
        return res.status(404).json({message:"Please provide complete data"})
    }

    const blog = await blogtrepository.create({
      title,
      content,
      category,
      tags,
    });
    await blogtrepository.save(blog);
    res.status(201).json(blog);
  } catch (err) {
    next(err);
  }
};
export const getAllBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogs = await blogtrepository.find();
    if (!blogs) {
      return res.status(200).json({ message: "No blog found" });
    }
    res.status(200).json(blogs);
  } catch (err) {
    next(err);
  }
};
export const getSingleBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const blog = await blogtrepository.findOneBy({ id: Number(id) });
    if (!blog) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(blog);
  } catch (err) {
    next(err);
  }
};
export const updateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, content, category, tag } = req.body;

    const blog = await blogtrepository.findOneBy({ id: Number(id) });

    if (!blog) return res.status(404).json({ message: "Post not found" });

    if (blog) {
      blog.title = title ?? blog.title;
      blog.content = content ?? blog.content;
      blog.category = category ?? blog.category;
      blog.tags = tag ?? blog.tags;
      await blogtrepository.save(blog);
    }
    res.status(200).json(blog);
  } catch (err) {
    next(err);
  }
};
export const deleteBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const blog = await blogtrepository.delete({ id: Number(id) });

    if (blog.affected === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Succefully deleted" });
  } catch (err) {
    next(err);
  }
};
