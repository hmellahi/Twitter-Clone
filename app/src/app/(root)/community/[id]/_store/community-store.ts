import * as threadActions from "@/server-actions/thread/thread.actions";
import useUserStore from "@/store/user-store";
import { CreateThreadParams, FetchThreadsParams } from "@/types/thread";
import { Thread } from "@prisma/client";
import { useRouter } from "next/navigation";
import { create } from "zustand";
import { CommunityStore } from "../_types/community-store";

const deleteThread = ({
  path,
  authorId,
  threadId,
}: {
  path: string;
  authorId: string;
  threadId: string;
}) => {
  let { totalCount, threads } = useCommunityStore.getState();
  const thread = threads.find((thread) => thread.id === threadId);
  const threadIndex = threads.indexOf(thread);
  if (!thread) return;

  threads = [...threads.slice(0, threadIndex), ...threads.slice(threadIndex + 1, threads.length)];

  useCommunityStore.setState({ totalCount: --totalCount, threads });

  threadActions.removeThread({ path, authorId, threadId });
  if (path.includes("thread")) useRouter().push("/");
};

const fetchThreads = async (params: FetchThreadsParams, clearOldList: boolean = false) => {
  const { threads = [], setIsThreadsLoading, setThreads } = useCommunityStore.getState();

  if (clearOldList) {
    setThreads([]);
  }

  setIsThreadsLoading(true);

  let { threads: newThreads, totalCount } = await threadActions.fetchThreads(params);

  if (!clearOldList && threads) {
    newThreads = [...threads, ...newThreads];
  }

  useCommunityStore.setState({ totalCount, threads: newThreads });
  setIsThreadsLoading(false);

  return { threads, totalCount };
};

const createThread = async (params: CreateThreadParams) => {
  const { setThreads, threads, totalCount } = useCommunityStore.getState();
  const { currentUser } = useUserStore.getState();
  const { images } = params;

  const createdThread = await threadActions.createThread(params);
  createdThread.author = currentUser;
  if (images?.length) {
    createdThread.images = [{ imageUrl: images[0] }];
  }

  setThreads([createdThread, ...threads]);
  useCommunityStore.setState({ totalCount: totalCount + 1 });
};

const useCommunityStore = create<CommunityStore>((set) => ({
  threads: null,
  totalCount: 0,
  isThreadsLoading: true,
  deleteThread,
  fetchThreads,
  createThread,
  setThreads: (newThreads: Thread[]) => set(() => ({ threads: newThreads })),
  setIsThreadsLoading: (value: boolean) => set(() => ({ isThreadsLoading: value })),
}));

export default useCommunityStore;
