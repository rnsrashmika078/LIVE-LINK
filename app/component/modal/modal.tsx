import React, { createContext, ReactNode, useContext, useState } from "react";
import SearchArea from "../../component/ui/searcharea";
import Avatar from "../ui/avatar";
import { UserCard } from "../ui/cards";
import { IoIosArrowRoundBack } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";

export type ModalProps = {
    children: ReactNode;
    openModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};
export const BaseModalContext = createContext<ModalProps | null>(null);
export const useBaseModal = () => {
    const context = useContext(BaseModalContext);
    if (!context) {
        throw new Error("useLayout must be used within a <Layout>");
    }
    return context;
};
export const BaseModal = ({
    children,
    setOpenModal,
    openModal,
}: ModalProps) => {
    return (
        <BaseModalContext.Provider
            value={{ children, setOpenModal, openModal }}
        >
            <div className="">{openModal && children}</div>
        </BaseModalContext.Provider>
    );
};
export const NewChat = ({ className }: { className?: string }) => {
    const [selection, setSelection] = useState<string>("");
    const { openModal, setOpenModal } = useBaseModal();
    return (
        <>
            <div className="fixed inset-0 bg-black/80 z-40"></div>
            <div className=" z-50 point-events-none h-screen w-full absolute flex items-center justify-center">
                <div
                    className={`${className} z-0 border border-[var(--pattern_5)] transition-all overflow-y-auto h-[500px] custom-scrollbar-y space-y-2  bg-[var(--pattern_2)]  rounded-lg shadow-lg w-auto `}
                >
                    {selection.toLowerCase() !== "add friend" ? (
                        <>
                            <div className="flex flex-col gap-2 px-5 justify-start items-center w-full sticky top-0 bg-[var(--pattern_2)] p-2">
                                <div className="flex justify-between items-center w-full">
                                    <h1>New chat</h1>
                                    <RxCross1
                                        size={30}
                                        onClick={() => setOpenModal(false)}
                                        className="p-2 hover:bg-[var(--pattern_5)] rounded-md"
                                    />
                                </div>
                                <SearchArea
                                    placeholder="Search name"
                                    className="w-full"
                                />
                            </div>
                            <div className="px-5">
                                {[
                                    {
                                        image: "/group_avatar.png",
                                        title: "Create Group",
                                    },
                                    {
                                        image: "/add_friend_avatar.png",
                                        title: "Add Friend",
                                    },
                                ].map((t, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setSelection(t.title)}
                                        className="flex justify-start items-center gap-2 w-full hover:bg-[var(--pattern_5)]  p-2 rounded-xl "
                                    >
                                        <Avatar
                                            image={t.image}
                                            width={10}
                                            height={10}
                                        />
                                        <h1 className="">{t.title}</h1>
                                    </div>
                                ))}
                            </div>
                            <p className="sub-header px-5 ">
                                Frequently contact
                            </p>
                            <div className=" px-5 flex w-full flex-col justify-start items-center">
                                {[...Array(2)].map((_, i) => (
                                    <UserCard
                                        avatar="/dog.png"
                                        created_at={new Date().toLocaleTimeString()}
                                        key={i}
                                        name="Kusal Perera"
                                    />
                                ))}
                            </div>
                            <p className="sub-header px-5 ">All contact</p>
                            <div className="px-5 flex flex-col w-full justify-start items-center">
                                {[...Array(5)].map((_, i) => (
                                    <UserCard
                                        avatar="/dog.png"
                                        created_at={new Date().toLocaleTimeString()}
                                        key={i}
                                        name="Kusal Perera"
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <AddNewFriend setSelection={setSelection} />
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

interface AddNewFriend {
    setSelection: React.Dispatch<React.SetStateAction<string>>;
}
export const AddNewFriend = ({ setSelection }: AddNewFriend) => {
    return (
        <div>
            <div className="flex flex-col gap-2 px-5 justify-start items-center w-full sticky top-0 bg-[var(--pattern_2)]">
                <div className="flex justify-between w-full items-center">
                    <div className="p-3">
                        <IoIosArrowRoundBack
                            size={25}
                            onClick={() => setSelection("")}
                            className="hover:bg-[var(--pattern_5)] rounded-md"
                        />
                    </div>
                    <h1 className="">Add New Friend</h1>
                </div>

                <SearchArea placeholder="Search name" className="w-full" />
            </div>
            <div className="p-5 flex flex-col w-full gap-2">
                <h1>Search Result</h1>
                {[...Array(9)].map((_, i) => (
                    <UserCard
                        avatar="/dog.png"
                        created_at={new Date().toLocaleTimeString()}
                        key={i}
                        name="Kusal Perera"
                    />
                ))}
            </div>
        </div>
    );
};
