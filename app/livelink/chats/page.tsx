import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getChats } from "@/app/actions/chats_actions";
import ChatListClient from "@/app/component/client_component/chats/ChatListClient";
import { getGroups } from "@/app/actions/group_action";

const ChatPage = async () => {
    const cookieStore = cookies();
    const uid = (await cookieStore).get("uid")?.value;
    console.log(`uid :${uid}`);
    // if (!uid) return redirect("/");

    const [chats, groupChats] = await Promise.all([
        getChats(uid ?? "123"),
        getGroups(uid ?? "123"),
    ]);

    return <ChatListClient chats={chats} groupChats={groupChats} />;
};

export default ChatPage;
