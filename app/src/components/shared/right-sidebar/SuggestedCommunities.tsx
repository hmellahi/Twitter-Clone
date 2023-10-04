"use server";

import { fetchCommunities } from "@/server-actions/community/community.actions";
import { Community } from "@prisma/client";
import CommunityCard from "./CommunityCard";

export default async function SuggestedCommunities({ currentUserId }: { currentUserId: string }) {
  const communities = await fetchCommunities({
    userId: currentUserId,
    searchKeyword: "",
    limit: 5,
  });

  return (
    <div>
      <h3 className="text-heading3-medium text-light-1">Suggested Communities</h3>
      <div className="flex flex-col gap-4 mt-5 ">
        {communities?.map((community: Community) => (
          <CommunityCard community={community} isSmall={true} />
        ))}
      </div>
    </div>
  );
}