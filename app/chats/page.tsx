import React from "react";
import SidebarComponent from "../layouts/sidebar/SidebarComponent";
import ChatListClient from "../component/client_component/chats/ChatListClient";
import MainLayout from "../layouts/MainLayout";
import MessageAreaWrapper from "../component/client_component/message/MessageClient";
import { cookies } from "next/headers";
import { getChats } from "../actions/chats_server_actions";
import { redirect } from "next/navigation";

const ChatPage = async () => {
  const cookieStore = cookies();
  const uid = (await cookieStore).get("uid")?.value;
  if (!uid) return redirect("/");
  const data = await getChats(uid ?? "");

  return (
    <MainLayout>
      <SidebarComponent />
      <ChatListClient chats={data.chats} />
      <MessageAreaWrapper />
    </MainLayout>
  );
};

export default ChatPage;
