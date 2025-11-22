import { getChats } from "@/app/actions/server_action";
import ChatPanel from "@/app/layouts/left_panels/chatpanel";

const ChatsWrapper = async () => {
    const data = await getChats();
    return (
        <div className="w-full h-screen ">
            <div className="z-20 w-full h-full relative">
                <ChatPanel chats={data.chats} />
            </div>
        </div>
    );
};

export default ChatsWrapper;
