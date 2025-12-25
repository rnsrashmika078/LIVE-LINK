import React, { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getChats } from "@/app/actions/chats_actions";
const ChatListClient = React.lazy(
  () => import("@/app/component/client_component/chats/ChatListClient")
);
import { getGroups } from "@/app/actions/group_action";
import Skeleton from "@/app/component/ui/skeleton";

const ChatPage = async () => {
  const cookieStore = cookies();
  const uid = (await cookieStore).get("uid")?.value;
  if (!uid) return redirect("/");

  const [chats, groupChats] = await Promise.all([
    getChats(uid ?? ""),
    getGroups(uid ?? ""),
  ]);

  return (
    <>
      <Suspense fallback={<Skeleton version="sidebar" />}>
        <ChatListClient chats={chats} groupChats={groupChats} />
      </Suspense>
    </>
  );
};

export default ChatPage;
