import React, { useCallback } from "react";
import { AuthUser, PusherChatDispatch, PusherChatState } from "@/app/types";
import { useDispatch, useSelector } from "react-redux";
import { setActiveChat } from "@/app/lib/redux/chatslicer";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import Spinner from "@/app/component/ui/spinner";
import { UserCard } from "@/app/component/ui/cards";

const ContactList = ({
  friends,
  loading,
}: {
  friends: AuthUser[];
  loading: boolean;
}) => {
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  const { setClickedIcon, setInternalClickState } = useLiveLink();

  const dispatch = useDispatch<PusherChatDispatch>();
  const handleOpenChat = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fr: any) => {
      setClickedIcon("");
      const chatId = [authUser?.uid, fr?.uid].sort().join("-");
      const newActiveChat = {
        chatId: chatId,
        lastMessage: "",
        uid: fr?.uid ?? "",
        name: fr?.name ?? "",
        email: fr?.email ?? "",
        dp: fr?.dp ?? "",
        type: "Individual",
      };
      //@ts-expect-error:type error- > lastMessage type is different here from the original type
      dispatch(setActiveChat(newActiveChat));
    },
    [authUser?.uid, dispatch, setClickedIcon]
  );

  if (loading) return <Spinner />;

  return (
    <div className="py-4">
      <p className="sub-header">All contact</p>
      <div className=" flex flex-col w-full justify-start items-center">
        {friends?.length > 0 &&
          friends?.map((fr: AuthUser, i: number) => (
            <UserCard
              avatar={fr.dp}
              key={i}
              name={fr.name}
              handleClick={() => {
                setInternalClickState("chats");
                handleOpenChat(fr);
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default ContactList;
