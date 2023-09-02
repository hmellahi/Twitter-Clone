"use server";

import { Prisma, Thread } from "@prisma/client";
import { prisma } from "../prisma";

interface CreateThread {
  text: string;
  communityId?: String;
  parentId?: String;
  userId: String;
}

export async function createThread({
  userId,
  communityId,
  text,
  parentId,
}: CreateThread) {
  const newThread = {
    authorId: userId,
    communityId: communityId,
    text,
    parentId: parentId || null,
  };

  try {
    const updateThread = await prisma.thread.create({
      data: newThread,
    });

    return updateThread;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}

export async function fetchThread({
  authorId,
  threadId,
}: {
  authorId: string;
  threadId: string;
}) {
  try {
    return await prisma.thread.findFirst({
      where: { id: threadId, authorId },
      include: {
        author: true,
        likes: true,
        childrens: {
          include: {
            author: true,
            likes: true,
            childrens: true,
          },
        },
      },
    });
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}

export async function fetchThreads({
  userId,
  offset = 0,
  limit = 20,
}: {
  userId: string;
  offset?: number;
  limit?: number;
}) {
  const query: Prisma.ThreadFindManyArgs = {
    where: { NOT: { id: userId } },
  };
  try {
    let [threads, count] = await prisma.$transaction([
      prisma.thread.findMany({
        where: query.where,
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
          likes: true,
          childrens: true,
        },
      }),
      prisma.thread.count({ where: query.where }),
    ]);
    const isLastPage = offset + limit >= count;
    return { threads, count, isLastPage };
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}

export const createComment = async ({
  userId,
  parentThreadId,
  thread,
}: {
  thread: Thread;
  userId: String;
  parentThreadId: String;
}) => {
  // let commentThread = await createThread(thread);
};

export async function fetchUserThreads({
  userId,
  offset = 0,
  limit = 20,
}: {
  userId: string;
  offset?: number;
  limit?: number;
}) {
  const query: Prisma.ThreadFindManyArgs = {
    // where: { id: userId },
  };
  try {
    let [threads, count] = await prisma.$transaction([
      prisma.thread.findMany({
        where: query.where,
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
          likes: true,
          childrens: true,
        },
      }),
      prisma.thread.count({ where: query.where }),
    ]);

    const isLastPage = offset + limit >= count;
    return { threads, count, isLastPage };
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}

export async function likeThread({
  threadId,
  userId,
}: {
  threadId: string;
  userId: string;
}) {
  let newLike = {
    threadId,
    userId,
  };

  try {
    const existingLike = await prisma.threadLikes.findFirst({
      where: {
        threadId,
        userId,
      },
    });

    if (existingLike) {
      // A like with the same threadId and userId already exists, so do nothing.
      return null;
    }

    return await prisma.threadLikes.create({
      data: newLike,
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function unLikeThread({ likeId }: { likeId: string }) {
  try {
    return await prisma.threadLikes.delete({
      where: {
        id: likeId,
      },
    });
  } catch (e) {
    console.log(e);
    // throw e;
  }
}
