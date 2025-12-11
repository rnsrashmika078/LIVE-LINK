import React from "react";

// import MessageAreaWrapper from "../component/client_component/message/MessageClient";
import { cookies } from "next/headers";

import { redirect } from "next/navigation";
import { getChats } from "@/app/actions/chats_server_actions";
import ChatListClient from "@/app/component/client_component/chats/ChatListClient";

const ChatPage = async () => {
  const cookieStore = cookies();
  const uid = (await cookieStore).get("uid")?.value;
  if (!uid) return redirect("/");
  const data = await getChats(uid ?? "");

  return (
    <>
      <ChatListClient chats={data.chats} />
    </>
  );
};

export default ChatPage;
