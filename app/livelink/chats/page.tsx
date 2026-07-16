import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getChats } from "@/app/actions/chats_actions";
import { getGroups } from "@/app/actions/group_action";
import Spinner from "@/app/component/ui/spinner";
import dynamic from "next/dynamic";
const ChatListClient = dynamic(
  () => import("@/app/component/client_component/chats/ChatListClient"),
  {
    loading: () => <Spinner heading="Fetching..."></Spinner>,
  },
);
const ChatPage = async () => {
  const cookieStore = cookies();
  const uid = (await cookieStore).get("uid")?.value;

  const [chats, groupChats] = await Promise.all([
    getChats(uid ?? "123"),
    getGroups(uid ?? "123"),
  ]);

  return <ChatListClient chats={chats} groupChats={groupChats} />;
};

export default ChatPage;
