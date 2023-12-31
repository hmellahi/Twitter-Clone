"use client";
import ThreadsListWrapper from "@/components/shared/Thread/ThreadsListWrapper";
import useUserStore from "@/store/user-store";
import { FetchThreadsParams } from "@/types/thread";
import { User } from "@prisma/client";
import { useEffect } from "react";
import { useStore } from "zustand";
import useCommunityStore from "../_store/community-store";

export default function CommunityThreadsTab({
  user,
  communityId,
}: {
  user: User;
  communityId: string;
}) {
  let { fetchThreads, deleteThread, threads, totalCount, isThreadsLoading } =
    useStore(useCommunityStore);

  let { setCurrentUser } = useStore(useUserStore);

  const fetchHandler = (params: FetchThreadsParams, clearOldList = false) => {
    fetchThreads({ ...params, communityId }, clearOldList);
  };

  useEffect(() => {
    setCurrentUser(() => user);
    fetchHandler({ userId: user.id }, true);
  }, []);

  return (
    <ThreadsListWrapper
      userId={user.id}
      initialThreadsData={null}
      onDeleteThread={deleteThread}
      onFetchThreads={fetchHandler}
      threads={threads}
      isThreadsLoading={isThreadsLoading}
      totalCount={totalCount}
    ></ThreadsListWrapper>
  );
}
