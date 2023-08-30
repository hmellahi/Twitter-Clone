"use server";

import { Prisma, User } from "@prisma/client";
import { prisma } from "../prisma";

interface CreateThread {
  text: string;
  community: String | undefined;
  userId: String;
}

export async function createThread({ userId, community, text }: CreateThread) {
  const newThread = {
    authorId: userId,
    communityId: null,
    text,
  };

  try {
    const updateThread = await prisma.thread.create({
      data: newThread,
    });

    return updateThread;
  } catch (error: any) {
    console.log(error);
    throw error
  }
}

export async function fetchThread(threadId: string) {
  try {
    return await prisma.thread.findFirst({
      where: { id: threadId },
    });
  } catch (error: any) {
    console.log(error);
  }
}

export async function fetchThreads({
  userId,
  offset = 0,
  limit = 20,
}: {
  userId: string;
  offset: number;
  limit: number;
}) {
  const query: Prisma.categoriesFindManyArgs = {
    where: { NOT: { id: "4" } },
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
        },
      }),
      prisma.thread.count({ where: query.where }),
    ]);
    console.log({ threads });
    const isLastPage = offset + limit >= count;
    return { threads, count, isLastPage };
  } catch (error: any) {
    console.log(error);
    throw error
    // throw new Error("wtf");
  }
}