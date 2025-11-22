"use client";
import { BiEdit, BiFilter } from "react-icons/bi";
import SearchArea from "@/app/component/ui/searcharea";
import { BaseModal, NewChat } from "@/app/component/modal/modal";
import { useState } from "react";
import { UserCard } from "@/app/component/ui/cards";
import { ChatsType } from "@/app/types";

interface ChatPanelProp {
    chats: ChatsType[];
}
const ChatPanel = ({ chats }: ChatPanelProp) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    return (
        <div
            className={`z-50 transition-all bg-[var(--pattern_2)] h-full w-full sm:w-96`}
        >
            <BaseModal setOpenModal={setOpenModal} openModal={openModal}>
                <NewChat className="pointer-events-auto" />
            </BaseModal>
            <div className="p-5 space-y-2 relative">
                <div className="flex justify-between items-center ">
                    <h1 className="header">Chats</h1>
                    <div className="flex gap-4 ">
                        <BiEdit
                            onClick={() => setOpenModal(!openModal)}
                            size={30}
                            className="hover:bg-[var(--pattern_5)] p-1 rounded-md"
                        />
                        <BiFilter
                            size={30}
                            className="hover:bg-[var(--pattern_5)] p-1 rounded-md"
                        />
                    </div>
                </div>
                <SearchArea placeholder="Search or start a new chat" />
                <div className="flex w-full flex-col justify-start items-center">
                    {chats.map((c, i) => (
                        <UserCard
                            version={3}
                            avatar={c.friendDp}
                            created_at={new Date().toLocaleTimeString()}
                            key={i}
                            name={c.friendName}
                            // unreadCount={c.unreadCount}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
export default ChatPanel;
