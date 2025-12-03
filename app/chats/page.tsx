import React from "react";
import SidebarComponent from "../layouts/sidebar/SidebarComponent";
import ChatsWrapper from "../component/component_wrappers/chats/chatpanel_wrapper";
import { getChats } from "../actions/server_action";
import { cookies } from "next/headers";
import MainLayout from "../layouts/MainLayout";
import MessageAreaWrapper from "../component/component_wrappers/chats/message_area_wrapper";

const page = async () => {
  // const cookieStore = cookies();
  // const uid = (await cookieStore).get("uid")?.value;
  // const data = await getChats(uid ?? "");

  return (
    <MainLayout>
      <SidebarComponent />
      {/* <ChatsWrapper chats={data?.chats} /> */}
      <ChatsWrapper/>
      <MessageAreaWrapper />
    </MainLayout>
  );
};

export default page;
