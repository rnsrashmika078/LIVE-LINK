/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import Avatar from "@/app/component/ui/avatar";
import { useDebounce } from "@/app/hooks/useHooks";
import {
  FileType,
  GroupType,
  Message,
  MessageContentType,
  PusherChatDispatch,
  PusherChatState,
  SeenByType,
} from "@/app/types";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { TextArea } from "@/app/component/ui/textarea";
import { FileShare } from "@/app/component/ui/preview";
import { TypingIndicator } from "@/app/component/ui/typingIndicator";
import { v4 as uuidv4 } from "uuid";
import { useDragDropHook } from "@/app/hooks/useDragDropHook";
import Spinner from "../../ui/spinner";
import { useUpdateGroupMessageSeen } from "@/app/hooks/CustomHooks/messageEffectHooks";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import OutGoingCall from "../../ui/communications/OutGoingCall";
import SearchArea from "../../ui/searcharea";
import AppIcons from "../../ui/icons";
import { MessagePanelIcons } from "@/app/util/data";
import {
  useGetGroupMessage,
  useSendGroupMessage,
} from "@/app/lib/tanstack/groupQuery";
import {
  activateFeature,
  addDummyData,
  buildMessageStructure,
  featureActivation,
} from "@/app/helper/helper";
import { useSocket } from "../../util_component/SocketProvider";
import ActiveFeature from "../../modal/ActiveFeature";
import VoiceRecorder from "../../ui/communications/Voice";
import { useVoiceMessage } from "@/app/context/VoiceMessageContext";
const MessageViewArea = React.lazy(() => import("./messageViewArea"));
const GroupMessagePanel = () => {
  const [input, setInput] = useState<string>("");
  const [activeFeature, setActiveFeature] = useState<string>(""); // for reference
  const [messages, setMessages] = useState<Message[]>([]);

  const {
    setClickedIcon,
    clickedIcon,
    setActionMenuSelection,
    countRef,
    setFeatureActive,
    featureActive,
  } = useLiveLink();

  const { blobRef } = useVoiceMessage();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const socket = useSocket();

  const {
    activeChat,
    messageSeen,
    authUser,
    typingUsers,
    onlineUsers,
    groupMessageSeen,
    activeUsers,
  } = useSelector(
    (store: PusherChatState) => ({
      activeChat: store.chat.activeChat as GroupType,
      unreads: store.chat.unreads,
      messageSeen: store.chat.messageSeen,
      deletedMessages: store.chat.deletedMessage,
      authUser: store.chat.authUser,
      typingUsers: store.chat.typingUsers,
      groupMessageSeen: store.chat.GroupMessageSeen,
      activeUsers: store.chat.activeUsers,
      onlineUsers: store.friends.OnlineUsers,
    }),
    shallowEqual
  );
  const liveMessages = useSelector(
    (store: PusherChatState) => store.chat.messages
  );

  //redux dispatcher
  let debounce = useDebounce(input, 500);

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

  const { data: groupMessage, isPending: isMsgLoading } = useGetGroupMessage(
    activeChat.chatId!
  );

  const { mutate } = useSendGroupMessage();
  // -------------------------------------------------------------------------- use Effect --------------------------------------------------------------------------------

  //use Effect: make messages empty initially
  useEffect(() => {
    setMessages([]);
    setInput("");
    debounce = "";
    if (textAreaRef.current) {
      textAreaRef.current.value = "";
    }
  }, [activeChat?.chatId]);

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
    if (!groupMessage?.chatMessages) return;
    setMessages(groupMessage?.chatMessages);
  }, [groupMessage?.chatMessages]);

  const sendMessage = async (
    message: MessageContentType,
    fileMeta: FileType | null
  ) => {
    try {
      const messageId = uuidv4(); // generate messageId
      const chatId = activeChat?.chatId ?? ""; //get current Chat id
      const senderId = authUser?.uid ?? "";
      const senderName = authUser?.name ?? "";
      const createdAt = new Date().toISOString();
      const participants = activeChat?.participants;
      const isAnyOneOnline = onlineUsers.some((o) =>
        participants.some((p) => p.userId === o && p.userId !== authUser?.uid)
      );
      const seenBy: SeenByType[] = [];
      const onlineSet = new Set(onlineUsers);

      participants.forEach((p) => {
        const isThisUserOnline = onlineSet.has(p.userId);

        seenBy.push({
          userId: p.userId,
          userName: p.userName,
          userDp: p.userDp,
          status: isThisUserOnline
            ? p.userId === authUser?.uid
              ? "seen"
              : "delivered"
            : "sent",
        });
      });

      const status = isAnyOneOnline ? "delivered" : "sent";
      const updateUnseen = seenBy.map((s) => {
        if (s.userId === authUser?.uid) {
          countRef.current[chatId + "-" + authUser?.uid] = 0;
          return {
            userId: s.userId,
            count: 0,
          };
        }
        countRef.current[chatId + "-" + s?.userId] =
          (countRef.current[chatId + "-" + s?.userId] ?? 0) + 1;
        return {
          userId: s.userId,
          count: countRef.current[chatId + "-" + s?.userId],
        };
      });
      const payload = {
        customId: messageId,
        chatId,
        senderInfo: {
          senderId,
          senderName,
        },
        unreads: updateUnseen,
        content: message,
        files: fileMeta ? [fileMeta] : null,
        status,
        seenBy: seenBy,
        createdAt,
      };
      mutate({ message: payload });
    } catch (err) {
      console.error("", message, err);
    }
  };

  useUpdateGroupMessageSeen(setMessages, activeChat, groupMessageSeen);

  useEffect(() => {
    if (!socket || !activeChat?.chatId || !authUser?.uid) return;
    socket?.emit("user-typing", {
      useFor: "typing",
      userId: authUser?.uid,
      chatId: activeChat?.chatId,
      userName: authUser?.name,
      participants: activeChat.participants,
      type: "Group",
      isTyping: !!debounce?.length,
    });
  }, [
    debounce,
    socket,
    activeChat.chatId,
    authUser?.uid,
    activeChat.participants,
    authUser?.name,
  ]);

  const handleButtonClick = (item: string) => {
    // alert("YES")
    // if (!item || !debounce) return;
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
        setInput("");
        break;
      case "voice": {
      }
    }
  };

  const isUserTyping = useMemo(() => {
    return typingUsers.find(
      (u) =>
        u.isTyping &&
        u.type === "Group" &&
        u.chatId === activeChat.chatId &&
        activeChat.participants.some((p) => p.userId === u.userId)
    );
  }, [typingUsers, activeChat.chatId, activeChat.participants]);

  return (
    <div className="flex flex-col w-full h-full relative overflow-hidden">
      {activeChat && (
        <>
          <div
            className=" flex p-5  justify-between w-full bg-[var(--pattern_3)] items-center  sticky top-0"
            onClick={() =>
              setActionMenuSelection({ selection: "chat-info", message: null })
            }
          >
            <div className=" flex items-center gap-3">
              <Avatar image={activeChat?.dp || "/no_avatar2.png"} />
              <div className="w-full">
                <h1 className="">{activeChat?.groupName}</h1>
                {activeUsers.length > 0 && (
                  <p className="text-xs">{`${activeUsers.length} reading the chat`}</p>
                )}
              </div>
            </div>
            <AppIcons iconArray={MessagePanelIcons} callback={setClickedIcon} />
          </div>

          <Suspense fallback={<Spinner />}>
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
            <TypingIndicator UserTyping={isUserTyping!} version="1" />
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
                  // ref={textAreaRef}
                  value={input}
                  // text={debounce}
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
export default GroupMessagePanel;
