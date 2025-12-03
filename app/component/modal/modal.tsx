import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import SearchArea from "../../component/ui/searcharea";
import Avatar from "../ui/avatar";
import { UserCard } from "../ui/cards";
import { IoIosArrowRoundBack } from "react-icons/io";
import { RxCross1, RxReload } from "react-icons/rx";
import {
  AuthUser,
  ChatsType,
  PusherChatDispatch,
  PusherChatState,
} from "@/app/types";
import {
  useGetFriends,
  useSearchFriend,
  useSendFriendRequests,
} from "@/app/lib/tanstack/tanstackQuery";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../button";
import { logoutUser } from "@/app/util/auth-options/client_options";
import { useRouter } from "next/navigation";
import Spinner from "../spinner";
import { setActiveChat } from "@/app/lib/redux/chatslicer";

export type ModalProps = {
  children: ReactNode;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};
interface AddNewFriend {
  setSelection: React.Dispatch<React.SetStateAction<string>>;
}
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
    <BaseModalContext.Provider value={{ children, setOpenModal, openModal }}>
      <div className="">{openModal && children}</div>
    </BaseModalContext.Provider>
  );
};
export const NewChat = React.memo(({ className }: { className?: string }) => {
  const [selection, setSelection] = useState<string>("");
  const { openModal, setOpenModal } = useBaseModal();
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  const activeChat = useSelector(
    (store: PusherChatState) => store.chat.activeChat
  );
  const { data: friends, isPending: isGettingFriends } = useGetFriends(
    authUser?.uid ?? ""
  );

  const dispatch = useDispatch<PusherChatDispatch>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleOpenChat(fr: any) {
    //generate chatId
    const chatId = [authUser?.uid, fr?.uid].sort().join("-");
    const newActiveChat = {
      chatId: chatId,
      lastMessage: "",
      uid: fr?.uid ?? "",
      name: fr?.name ?? "",
      email: fr?.email ?? "",
      dp: fr?.dp ?? "",
    };
    setOpenModal(false);
    dispatch(setActiveChat(newActiveChat));
  }
  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-40 "></div>
      <div className=" z-50 point-events-none h-screen w-full absolute flex items-center justify-center">
        <div
          className={`${className}  pb-2 z-0 border border-[var(--pattern_5)] transition-all overflow-y-auto h-[500px] custom-scrollbar-y space-y-2  bg-[var(--pattern_2)]  rounded-lg shadow-lg w-auto `}
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
                <SearchArea placeholder="Search name" className="w-full" />
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
                    <Avatar image={t.image} width={10} height={10} />
                    <h1 className="">{t.title}</h1>
                  </div>
                ))}
              </div>
              <p className="sub-header px-5 ">Frequently contact</p>
              <div className=" px-5 flex w-full flex-col justify-start items-center">
                {[...Array(1)].map((_, i) => (
                  <UserCard
                    avatar="/dog.png"
                    created_at={new Date().toLocaleTimeString()}
                    useFor="chat"
                    key={i}
                    name="Kusal Perera"
                  />
                ))}
              </div>
              {/* all contact */}

              <p className="sub-header px-5 ">All contact</p>
              <Spinner condition={isGettingFriends} />
              <div className="px-5 flex flex-col w-full justify-start items-center">
                {friends?.friends.length > 0 &&
                  friends?.friends?.map((fr: AuthUser, i: number) => (
                    <UserCard
                      avatar={fr.dp}
                      created_at={new Date().toLocaleTimeString()}
                      key={fr.uid}
                      name={fr.name}
                      handleClick={() => handleOpenChat(fr)}
                      useFor="chat"
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
});
NewChat.displayName = "NewChat";
export const AddNewFriend = React.memo(({ setSelection }: AddNewFriend) => {
  const [searchText, setSearchText] = useState<string>("");
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);

  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchFriend(searchText, authUser?.uid ?? "");

  const {
    mutate: sendReqMutate,
    data: sendRequest,
    error: sendReqError,
  } = useSendFriendRequests();

  const handleSearch = useCallback(async (text: string) => {
    setSearchText(text);
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-2 px-5 justify-start items-center  sticky top-0 bg-[var(--pattern_2)]">
        <div className="flex justify-between w-full items-center">
          <div className="p-3">
            <IoIosArrowRoundBack
              size={25}
              onClick={() => setSelection("")}
              className="hover:bg-[var(--pattern_5)] rounded-md"
            />
          </div>
          <h1 className="text-xs">Add New Friend</h1>
        </div>
        <h1 className="text-xs">Search friend by their name</h1>
        <SearchArea
          onSearch={handleSearch}
          placeholder="Search name"
          className="w-full"
        />
      </div>
      <div className="p-5 flex flex-col w-auto gap-2 ">
        <h1 className="text-start text-[var(--pattern_4)] text-xs">
          {isSearchLoading
            ? ""
            : `${searchData?.users?.length ?? "0"} result found`}
        </h1>
        <Spinner condition={isSearchLoading} />

        {searchData && searchData?.users?.length > 0 ? (
          searchData?.users.map((user: AuthUser, i: number) => (
            <UserCard
              avatar={user.dp}
              created_at={new Date().toLocaleTimeString()}
              key={i}
              useFor="send-req"
              name={user.name}
              handleClick={() => {
                sendReqMutate({
                  requestSender: authUser as AuthUser, // this is me
                  requestReceiver: user as AuthUser, // this is friend
                });
              }}
            />
          ))
        ) : (
          <h1 className="text-center">{searchData && searchData?.message}</h1>
        )}
      </div>
    </div>
  );
});
AddNewFriend.displayName = "AddNewFriend";

export const UserDetails = React.memo(() => {
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  const router = useRouter();

  return (
    <div className="fixed flex bottom-0 min-w-72 h-[500px] bg-[var(--pattern_2)] border border-[var(--pattern_5)] rounded-md">
      <div className="p-1 w-10 border h-full bg-green-500">
        <div className="flex justify-center items-center gap-2 hover:bg-[var(--pattern_1)] p-1 rounded-xl px-2">
          <CgProfile />
        </div>
      </div>
      <div className="w-62 border flex flex-col justify-start items-start te h-full bg-red-500x p-5 ">
        <Avatar
          image={authUser?.dp ?? "/no_avatar.png"}
          width={20}
          height={20}
        />
        <div className="mt-2 mb-5">
          <p className="text-sm font-bold">{authUser?.name}</p>
          <p className="text-xs">{authUser?.email}</p>
        </div>
        <div className="border-b w-full border-[var(--pattern_5)]"></div>
        <Button
          variant="danger"
          className="mt-2"
          radius="md"
          onClick={async () => {
            await logoutUser();
            router.push("/welcome");
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
});
UserDetails.displayName = "UserDetails";
