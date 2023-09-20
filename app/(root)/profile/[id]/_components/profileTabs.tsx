import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { ThreadWithDetails } from "@/types/Thread";
import { User } from "@prisma/client";
import React from "react";
import SvgIcon from "@/components/ui/svgIcon";
import { ThreadsList } from "@/components/shared/ThreadsList";
import ThreadsTab from "./tabs/threadsTab";
import RepliesTab from "./tabs/repliesTab/repliesTab";

export default async function ProfileTabs({
  // threads,
  user,
}: {
  // threads: ThreadWithDetails[];
  user: User;
}) {
  return (
    <Tabs defaultValue="threads" className="w-full ">
      <TabsList className="w-full flex justify-between text-center tab p-0 gap-0 rounded-none">
        {profileTabs.map((tab, index) => (
          <TabsTrigger value={tab.value} className="tab" key={index}>
            <SvgIcon
              width={30}
              height={30}
              alt="tab"
              className="object-cover"
              iconName={tab.value}
            />
            <p className="max-sm:hidden ml-1">{tab.label}</p>
            {tab.value == "threads" && (
              <div className="ml-2 bg-gray-600 px-3 py-1 box-shadow-count-badge rounded-md">
                {/* {threads?.length} */}
              </div>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="mt-10">
        <TabsContent value="threads">
          <ThreadsTab user={user} />
        </TabsContent>
        <TabsContent value="replies">
          <RepliesTab user={user} />
        </TabsContent>
      </div>
    </Tabs>
  );
}