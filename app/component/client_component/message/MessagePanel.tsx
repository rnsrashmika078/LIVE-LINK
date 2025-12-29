/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import Avatar from "@/app/component/ui/avatar";
import { useDebounce, useOnlinePresence } from "@/app/hooks/useHooks";

import {
  ChatsType,
  FileType,
  Message,
  MessageContentType,
  PusherChatDispatch,
  PusherChatState,
} from "@/app/types";
import { useQueryClient } from "@tanstack/react-query";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setUnreads } from "@/app/lib/redux/chatslicer";
import { TextArea } from "@/app/component/ui/textarea";
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
import { useUpdateMessageSeen } from "@/app/hooks/CustomHooks/messageEffectHooks";
import { useDeleteMessage } from "@/app/hooks/CommonEffectHooks";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import OutGoingCall from "../../ui/communications/OutGoingCall";
import SearchArea from "../../ui/searcharea";
import AppIcons from "../../ui/icons";
import { MessagePanelIcons } from "@/app/util/data";
import { useSocket } from "../../util_component/SocketProvider";
import {
  activateFeature,
  addDummyData,
  buildMessageStructure,
  featureActivation,
} from "@/app/helper/helper";
import ActiveFeature from "../../modal/ActiveFeature";
import VoiceRecorder from "../../ui/communications/Voice";
import { useVoiceMessage } from "@/app/context/VoiceMessageContext";
import Skeleton from "../../ui/skeleton";
const MessageViewArea = React.lazy(() => import("./messageViewArea"));
const MessagePanel = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [lastSeen, setLastSeen] = useState<string>("Offline");
  const [activeFeature, setActiveFeature] = useState<string>(""); // for reference

  const {
    setClickedIcon,
    clickedIcon,
    setActionMenuSelection,
    setFeatureActive,
    featureActive,
  } = useLiveLink();
  const { blobRef } = useVoiceMessage();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    activeChat,
    typingUsers,
    authUser,
    messageSeen,
    deletedMessages,
    unreads,
  } = useSelector(
    (store: PusherChatState) => ({
      activeChat: store.chat.activeChat as ChatsType,
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
  const presence = useOnlinePresence(activeChat?.uid ?? "");
  //update message seen
  useUpdateMessageSeen(setMessages, activeChat, messageSeen!);
  // pusher typing state trigger
  // usePusherSubscribe(debounce, activeChat, authUser!);

  const socket = useSocket();
  useEffect(() => {
    if (!socket || !activeChat?.chatId || !authUser?.uid) return;
    socket.emit("user-typing", {
      useFor: "typing",
      type: "Individual",
      userId: authUser?.uid,
      userName: authUser?.name,
      chatId: activeChat.chatId,
      isTyping: !!debounce?.length,
    });
  }, [
    activeChat.chatId,
    authUser?.name,
    authUser?.uid,
    debounce?.length,
    socket,
  ]);

  //update delete message from the message
  useDeleteMessage("Message", deletedMessages!, setMessages);
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

  const chatId = useMemo(
    () => [authUser?.uid, activeChat?.uid].sort().join("-"),
    [authUser?.uid, activeChat?.uid]
  );
  const UserTyping = useMemo(
    () =>
      typingUsers.find(
        (u) =>
          u.userId === activeChat?.uid &&
          u.type === "Individual" &&
          activeChat.chatId === u.chatId &&
          u.isTyping
      ),
    [activeChat.chatId, activeChat?.uid, typingUsers]
  );

  const { data, isPending, refetch } = useGetMessages(chatId);
  const { data: lastSeenUpdate } = useGetLastSeen(activeChat?.uid ?? "");
  const { mutate: lastSeenMutate } = useUpdateLastSeen((result) => {
    if (result.success) {
      setLastSeen(result.lastSeen);
    }
  });
  const { mutate } = useSaveMessage((result) => {
    if (messages?.length === 0) {
      if (result.success) {
        refetch();
        QueryClient.invalidateQueries({
          queryKey: ["get-chats", authUser?.uid ?? ""],
        });
      }
    }
  });

  //use Effect: make messages empty initially
  useEffect(() => {
    setMessages([]);
    setInput("");
    debounce = "";
    if (textAreaRef.current) {
      textAreaRef.current.value = "";
    }
  }, [activeChat?.chatId]);

  useEffect(() => {
    if (presence === "Offline") return;
    const seenTime = new Date().toString();
    lastSeenMutate({
      uid: activeChat?.uid ?? "",
      lastSeen: seenTime?.toString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presence]);

  //use Effect: merge lives messages ( pusher ) with current Message
  useEffect(() => {
    if (!liveMessages) return;
    const lastMessage = messages?.at(-1)?.content?.url?.includes("dummy");
    if (lastMessage) {
      setMessages((prev) => prev.filter((m) => m.customId !== "dummy_001"));
      setMessages((prev) => [...prev, liveMessages]);
      return;
    }
    setMessages((prev) => [...prev, liveMessages]);
  }, [liveMessages]);

  //use Effect: add messages that fetch from backend to the messages state ( initially )
  useEffect(() => {
    if (!data?.history) return;
    setMessages(data?.history);
  }, [data]);

  useEffect(() => {
    if (!lastSeenUpdate?.lastSeen) return;
    setLastSeen(lastSeenUpdate?.lastSeen);
  }, [lastSeenUpdate]);
  // -------------------------------------------------------------------------- Additional functions  --------------------------------------------------------------------------------
  //save message calling actually happen here
  const sendMessage = async (
    message: MessageContentType,
    fileMeta: FileType | null
  ) => {
    const date = new Date();
    const customId = uuidv4();
    const name = authUser?.name ?? "";
    const senderId = authUser?.uid ?? "";
    const receiverId = activeChat?.uid ?? "";

    try {
      const payload = {
        customId,
        content: message,
        files: fileMeta,
        senderId,
        receiverId,
        chatId: chatId,
        type: "Individual",
        name,
        dp: authUser?.dp ?? "",
        createdAt: date.toISOString(),
        status: presence === "Online" ? "delivered" : "sent",
        unreads: [
          {
            userId: activeChat?.uid ?? "",
            count: unreads === 0 ? 1 : unreads,
          },
        ],
      };
      mutate({ message: payload });
    } catch (err) {
      console.error("Invalid JSON:", message, err);
    }

    dispatch(setUnreads(unreads + 1));
  };

  // use Effect:  update the user last seen when presence changes ( listening to the presence changes )

  const handleButtonClick = (item: string) => {
    const refinedPrompt = featureActive
      ? input.replace("LIVELINK AI: ", "")
      : undefined; //this if ai feature active

    let blob;
    if (blobRef.current) {
      blob = blobRef.current;
    }
    switch (item) {
      case "send":
      case "enter":
        buildMessageStructure(
          file || blob,
          input,
          sendMessage,
          setFile,
          blobRef,
          featureActive,
          refinedPrompt
        );
        if (featureActive || file) {
          addDummyData(
            activeChat.chatId!,
            authUser?.uid ?? "", // this never undefined at this stage
            authUser?.name ?? "", // this never undefined at this stage
            setMessages
          );
        }
        setPreview(null);
        setFeatureActive(false);
        setInput("");
        break;
    }
  };

  return (
    <div className="flex flex-col w-full h-full relative overflow-hidden">
      {activeChat && (
        <>
          <div className=" flex p-5  justify-between w-full bg-[var(--pattern_3)] items-center  sticky top-0">
            <div
              className=" flex items-center gap-3 "
              onClick={() =>
                setActionMenuSelection({
                  selection: "message-Info",
                  message: null,
                })
              }
            >
              <Avatar image={activeChat?.dp || "/no_avatar2.png"} />
              <div className="w-full">
                <h1 className="">{activeChat?.name}</h1>
                <p className="text-xs text-[var(--pattern_4)]">
                  {presence === "Online"
                    ? "Online"
                    : lastSeen
                    ? "Last seen " + new Date(lastSeen).toLocaleTimeString() ||
                      "Offline"
                    : "Offline"}
                </p>
              </div>
            </div>
            <AppIcons iconArray={MessagePanelIcons} callback={setClickedIcon} />
          </div>

          <Suspense fallback={<Skeleton version="chats" />}>
            <MessageViewArea
              messages={messages}
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
            <TypingIndicator UserTyping={UserTyping!} version="1" />
            <FileShare
              isDragging={isDragging}
              preview={preview}
              setPreview={setPreview}
              setFile={setFile}
            />
            <ActiveFeature
              active={featureActivation(debounce)}
              feature="image-gen-ll"
              onClickEvent={(state) =>
                activateFeature(state, setFeatureActive, setInput)
              }
            />
            <div className="flex w-full gap-2 place-items-center">
              {!activeFeature.toLowerCase().includes("voice") ? (
                <TextArea
                  ref={textAreaRef}
                  value={input}
                  text={debounce}
                  preview={preview?.type}
                  placeholder={
                    preview?.url
                      ? `Enter caption to the ${preview.type}`
                      : `Enter your message`
                  }
                  onChange={(e) => {
                    setInput(e.currentTarget.value);
                  }}
                  // onKeyDown={(e) => {
                  //   if (e.key === "Enter") {
                  //     e.preventDefault();
                  //     handleMessageSend("enter");
                  //   }
                  // }}
                  onClickButton={(input) => {
                    setActiveFeature(input as string);
                    handleButtonClick(input);
                  }}
                />
              ) : (
                <VoiceRecorder
                  setActiveFeature={setActiveFeature}
                  onClick={(input) => {
                    if (blobRef.current) handleButtonClick(input.toLowerCase());
                  }}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default MessagePanel;
