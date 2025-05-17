import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
  const userId = req.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [userId],
        },
      },
    });

    for (const chat of chats) {
      const receiverId = chat.userIDs.find((id) => id !== userId);

      const receiver = await prisma.user.findUnique({
        where: {
          id: receiverId,
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });
      chat.receiver = receiver;
    }

    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ message: "Failed to get chats" });
  }
};

export const getChat = async (req, res) => {
  const userId = req.userId;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [userId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [userId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ message: "Failed to get chat" });
  }
};

export const addChat = async (req, res) => {
  const userId = req.userId;
  try {
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [userId, req.body.receiverId],
      },
    });
    res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat" });
  }
};

export const readChat = async (req, res) => {
  const userId = req.userId;

  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [userId],
        },
      },
      data: {
        seenBy: {
          set: [userId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat" });
  }
};

export const openOrCreateChat = async (req, res) => {
  const userId = req.userId;
  const { receiverId } = req.body;

  if (!receiverId) {
    return res.status(400).json({ message: "receiverId is required" });
  }

  try {
    let chat = await prisma.chat.findFirst({
      where: {
        userIDs: {
          hasEvery: [userId, receiverId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          userIDs: [userId, receiverId],
          seenBy: [userId],
        },
        include: {
          messages: true,
        },
      });
    } else {
      if (!chat.seenBy.includes(userId)) {
        await prisma.chat.update({
          where: { id: chat.id },
          data: {
            seenBy: {
              push: userId,
            },
          },
        });
      }
    }

    const receiver = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });
    chat.receiver = receiver;

    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to open chat" });
  }
};
