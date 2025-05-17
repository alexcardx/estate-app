import { z } from "zod";
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  avatar: z.string().url().optional(),
});

export const updateUser = async (req, res) => {
  const id = req.userId;

  const parseResult = updateUserSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({ message: "Invalid data", errors: parseResult.error.issues });
  }

  const data = parseResult.data;

  try {
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (existingEmail && existingEmail.id !== id) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    const { password: userPassword, ...user } = updatedUser;
    res.status(200).json(user);
  } catch (err) {
    console.error("Update user failed:", err);
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.userId;

  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const getUserPosts = async (req, res) => {
  const userId = req.userId;

  try {
    const userPosts = await prisma.post.findMany({
      where: { userId },
    });

    const userPostIds = userPosts.map((post) => post.id);

    const savedPosts = await prisma.savedPost.findMany({
      where: {
        userId,
        postId: { in: userPostIds },
      },
      select: {
        postId: true,
      },
    });

    const savedPostIds = savedPosts.map((item) => item.postId);

    const userPostsMarkedSaved = userPosts.map((userPost) => ({
      ...userPost,
      isSaved: savedPostIds.includes(userPost.id),
    }));
    res.status(200).json(userPostsMarkedSaved);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user's posts" });
  }
};

export const getSavedPosts = async (req, res) => {
  const userId = req.userId;
  try {
    const savedPosts = await prisma.savedPost.findMany({
      where: { userId },
      include: {
        post: true,
      },
    });
    res
      .status(200)
      .json(
        savedPosts.map((savedPost) => ({ ...savedPost.post, isSaved: true }))
      );
  } catch (err) {
    res.status(500).json({ message: "Failed to get saved posts" });
  }
};

export const savePost = async (req, res) => {
  const userId = req.userId;
  const postId = req.body.postId;

  try {
    const isSaved = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (isSaved) {
      await prisma.savedPost.delete({
        where: {
          id: isSaved.id,
        },
      });
      res.status(200).json({ message: "Place was removed from saved list" });
    } else {
      await prisma.savedPost.create({
        data: {
          userId,
          postId,
        },
      });
      res.status(200).json({ message: "Place saved" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getNotificationNumber = async (req, res) => {
  const userId = req.userId;
  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          hasSome: [userId],
        },
        NOT: {
          seenBy: {
            hasSome: [userId],
          },
        },
      },
    });
    res.status(200).json(number);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};
