/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import Avatar from "@/app/component/ui/avatar";
import { useDebounce, useOnlinePresence } from "@/app/hooks/useHooks";

import {
  ChatsType,
  FileType,
  GroupMessage,
  GroupType,
  Message,
  PusherChatDispatch,
  PusherChatState,
} from "@/app/types";
import { useQueryClient } from "@tanstack/react-query";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BiPhoneCall, BiSearch } from "react-icons/bi";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setUnreads } from "@/app/lib/redux/chatslicer";
import { TextArea } from "@/app/component/ui/textarea";
import { handleImageUpload } from "@/app/util/util";
import { FileShare } from "@/app/component/ui/preview";
import { TypingIndicator } from "@/app/component/ui/typingIndicator";
import {
  useGetMessages,
  useSaveMessage,
} from "@/app/lib/tanstack/messageQuery";
import {
  useGetLastSeen,
  useUpdateLastSeen,
} from "@/app/lib/tanstack/friendsQuery";
import { v4 as uuidv4 } from "uuid";
import { useDragDropHook } from "@/app/hooks/useDragDropHook";
import Spinner from "../../ui/spinner";
import {
  usePusherSubscribe,
  useUpdateMessageSeen,
} from "@/app/hooks/CustomHooks/messageEffectHooks";
import { useDeleteMessage } from "@/app/hooks/CommonEffectHooks";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import OutGoingCall from "../../ui/communications/OutGoingCall";
import SearchArea from "../../ui/searcharea";
import AppIcons from "../../ui/icons";
import { MessagePanelIcons } from "@/app/util/data";
import {
  useGetGroupMessage,
  useSendGroupMessage,
} from "@/app/lib/tanstack/groupQuery";
import { buildMessageStructure } from "@/app/helper/helper";
const MessageViewArea = React.lazy(() => import("./messageViewArea"));
const GroupMessagePanel = () => {
  const [input, setInput] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [lastSeen, setLastSeen] = useState<string>("Offline");
  const { setClickedIcon, clickedIcon } = useLiveLink();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const states = useSelector(
    (store: PusherChatState) => ({
      activeChat: store.chat.activeChat as GroupType,
      unreads: store.chat.unreads,
      messageSeen: store.chat.messageSeen,
      deletedMessages: store.chat.deletedMessage,
      authUser: store.chat.authUser,
      typingUsers: store.chat.typingUsers,
    }),
    shallowEqual
  );
  const liveMessages = useSelector(
    (store: PusherChatState) => store.chat.messages
  );
  const QueryClient = useQueryClient();
  //redux dispatcher
  const dispatch = useDispatch<PusherChatDispatch>();
  let debounce = useDebounce(input, 500);
  // const presence = useOnlinePresence(states.activeChat?.uid ?? "");
  //update message seen
  // useUpdateMessageSeen(setMessages, states.activeChat, states.messageSeen!);
  // pusher typing state trigger
  // usePusherSubscribe(debounce, states.activeChat, states.authUser!);
  //update delete message from the message
  // useDeleteMessage("Message", states.deletedMessages, setMessages);
  //D&D hook
  const {
    isDragging,
    file,
    setFile,
    preview,
    setPreview,
    handleDragOver,
    onDragLeave,
    handleDrop,
  } = useDragDropHook();

  // ----------------------------------------------------------------------- memoized logics --------------------------------------------------------------------------------

  // const isUserTyping = useMemo(
  //   () =>
  //     states.typingUsers.some(
  //       (u) => u.userId === states.activeChat?.uid && u.isTyping
  //     ),
  //   [states.activeChat?.uid, states.typingUsers]
  // );
  // -------------------------------------------------------------------------- tanstack --------------------------------------------------------------------------------
  // const { data, isPending, refetch } = useGetMessages(chatId);
  // const { data: lastSeenUpdate } = useGetLastSeen(states.activeChat?.uid ?? "");
  // const { mutate: lastSeenMutate } = useUpdateLastSeen((result) => {
  //   if (result.success) {
  //     setLastSeen(result.lastSeen);
  //   }
  // });

  const { data: groupMessage, isPending: isMsgLoading } = useGetGroupMessage(
    states.activeChat.chatId!
  );
  const [messages, setMessages] = useState<Message[]>([]);

  const { mutate } = useSendGroupMessage((result) => {
    if (messages?.length === 0) {
      if (result.success) {
        // refetch();
        // QueryClient.invalidateQueries({
        //   queryKey: ["get-chats", states.authUser?.uid ?? ""],
        // });
      }
    }
  });
  // -------------------------------------------------------------------------- use Effect --------------------------------------------------------------------------------

  //use Effect: make messages empty initially
  useEffect(() => {
    setMessages([]);
    setInput("");
    debounce = "";
    if (textAreaRef.current) {
      textAreaRef.current.value = "";
    }
  }, [states.activeChat?.chatId]);

  // useEffect(() => {
  //   const seenTime = new Date().toString();
  //   lastSeenMutate({
  //     uid: states.activeChat?.uid ?? "",
  //     lastSeen: seenTime?.toString(),
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [presence]);

  //use Effect: merge lives messages ( pusher ) with current Message
  useEffect(() => {
    if (!liveMessages) return;
    setMessages((prev) => [...prev, liveMessages]);
  }, [liveMessages]);

  //use Effect: add messages that fetch from backend to the messages state ( initially )
  useEffect(() => {
    if (!groupMessage?.chatMessages) return;
    setMessages(groupMessage?.chatMessages);
  }, [groupMessage?.chatMessages]);

  // useEffect(() => {
  //   if (!lastSeenUpdate?.lastSeen) return;
  //   setLastSeen(lastSeenUpdate?.lastSeen);
  // }, [lastSeenUpdate]);
  // -------------------------------------------------------------------------- Additional functions  --------------------------------------------------------------------------------
  //save message calling actually happen here
  const sendMessage = async (message: string, fileMeta: FileType | null) => {
    try {
      const messageId = uuidv4(); // generate messageId
      const chatId = states.activeChat?.chatId ?? ""; //get current Chat id
      const senderId = states.authUser?.uid ?? "";
      const senderName = states.authUser?.name ?? "";
      const createdAt = new Date().toISOString();
      const status = "sent";
      const payload = {
        customId: messageId,
        chatId,
        senderInfo: {
          senderId,
          senderName,
        },
        content: message,
        files: fileMeta ? [fileMeta] : null,
        status,
        createdAt,
        deliveredTo: [senderId],
        seenBy: [senderId],
      };
      mutate({ message: payload });
    } catch (err) {
      console.error("", message, err);
    }
    // dispatch(setUnreads(states.unreads + 1));
  };

  const handleMessageSend = (item: string) => {
    switch (item) {
      case "send":
      case "enter":
        buildMessageStructure(
          file,
          input,
          setIsUploading,
          sendMessage,
          setPreview,
          setInput,
          setFile
        );
        break;
    }
  };

  return (
    <div className="flex flex-col w-full h-full relative overflow-hidden">
      {states.activeChat && (
        <>
          <div className=" flex p-5  justify-between w-full bg-[var(--pattern_3)] items-center  sticky top-0">
            <div className=" flex items-center gap-3">
              <Avatar image={states.activeChat?.dp || "/no_avatar2.png"} />
              <div className="w-full">
                <h1 className="">{states.activeChat?.groupName}</h1>
              </div>
            </div>
            <AppIcons iconArray={MessagePanelIcons} callback={setClickedIcon} />
          </div>

          <Suspense fallback={<Spinner />}>
            <MessageViewArea
              messages={messages}
              state={isUploading}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={onDragLeave}
            />
          </Suspense>

          {/* Communication Component */}
          {clickedIcon === "audio" && <OutGoingCall />}
          {clickedIcon === "search" && (
            <div className="">
              <SearchArea />
            </div>
          )}

          <div className="flex flex-col gap-5 mt-auto w-full p-2 place-items-start ">
            {/* <TypingIndicator
              isUserTyping={isUserTyping}
              version="1"
              username={states.authUser?.name ?? ""}
            /> */}
            <FileShare
              isUploading={isUploading}
              isDragging={isDragging}
              preview={preview}
              setPreview={setPreview}
              setFile={setFile}
            />
            <div className="flex w-full gap-2 place-items-center">
              <TextArea
                ref={textAreaRef}
                value={input}
                placeholder={
                  preview?.url
                    ? `Enter caption to the ${preview.type}`
                    : `Enter your message`
                }
                onChange={(e) => {
                  setInput(e.currentTarget.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleMessageSend("enter");
                  }
                }}
                onClickButton={(input) => handleMessageSend(input)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default GroupMessagePanel;
