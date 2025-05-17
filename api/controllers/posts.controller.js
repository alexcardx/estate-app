import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const addPost = async (req, res) => {
  const body = req.body;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: req.userId,
        postDetails: { create: body.postDetails },
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  const { postData, postDetails } = req.body;
  const { id } = req.params;
  const userId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You do not have permission to edit this post" });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...postData,
        postDetail: {
          update: postDetails,
        },
      },
      include: {
        postDetail: true,
      },
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this post" });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post was deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete this post" });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetails: true,
        user: {
          select: {
            username: true,
            avatar: true,
            id: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const token = req.cookies.token;
    let isSaved = false;

    if (token) {
      try {
        const payload = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId: payload.id,
            },
          },
        });
        isSaved = !!saved;
      } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
    }

    return res.status(200).json({ ...post, isSaved });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPosts = async (req, res) => {
  const {
    city = "",
    property = "",
    type = "",
    bedroom = "",
    minPrice = "",
    maxPrice = "",
    page = "1",
  } = req.query;

  const limit = 10;

  const parsedPage = parseInt(page, 10) || 1;
  const parsedMinPrice = parseInt(minPrice, 10);
  const parsedMaxPrice = parseInt(maxPrice, 10);
  const parsedBedroom = parseInt(bedroom, 10);

  const filters = {};

  if (city) filters.city = city;
  if (property) filters.property = property;
  if (type) filters.type = type;
  if (!isNaN(parsedBedroom)) {
    filters.stats = {
      bedrooms: parsedBedroom,
    };
  }
  if (!isNaN(parsedMinPrice) || !isNaN(parsedMaxPrice)) {
    filters.price = {};
    if (!isNaN(parsedMinPrice)) filters.price.gte = parsedMinPrice;
    if (!isNaN(parsedMaxPrice)) filters.price.lte = parsedMaxPrice;
  }

  try {
    const posts = await prisma.post.findMany({
      where: filters,
      skip: (parsedPage - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const totalPosts = await prisma.post.count({
      where: filters,
    });

    const totalPages = Math.ceil(totalPosts / limit);

    let savedPostIds = [];

    const token = req.cookies.token;

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = payload.id;

        const postIds = posts.map((post) => post.id);

        const savedPosts = await prisma.savedPost.findMany({
          where: {
            userId,
            postId: { in: postIds },
          },
          select: {
            postId: true,
          },
        });

        savedPostIds = savedPosts.map((item) => item.postId);
      } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
    }

    const postsWithSaved = posts.map((post) => ({
      ...post,
      isSaved: savedPostIds.includes(post.id),
    }));

    return res.status(200).json({
      posts: postsWithSaved,
      page: parsedPage,
      totalPosts,
      totalPages,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
