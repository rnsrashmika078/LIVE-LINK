/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import Avatar from "@/app/component/ui/avatar";
import { useDebounce, useOnlinePresence } from "@/app/hooks/useHooks";
import {
  useGetLastSeen,
  useGetMessages,
  useSaveMessage,
  useUpdateLastSeen,
} from "@/app/lib/tanstack/tanstackQuery";
import {
  FileType,
  Message,
  PreviewDataType,
  PusherChatDispatch,
  PusherChatState,
} from "@/app/types";
import { useQueryClient } from "@tanstack/react-query";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BiPhoneCall, BiSearch, BiVideo } from "react-icons/bi";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { MessageViewArea } from "./messageViewArea";
import Spinner from "@/app/component/ui/spinner";
import { setUnreads } from "@/app/lib/redux/chatslicer";
import { usePusher } from "@/app/component/util_component/PusherProvider";
import { TiMessageTyping } from "react-icons/ti";
import Image from "next/image";
import { Button } from "@/app/component/ui/button";
import { FaFilePdf } from "react-icons/fa6";
import { TextArea } from "@/app/component/ui/textarea";
import { handleImageUpload } from "@/app/util/util";
import {
  usePusherSubscribe,
  useUpdateMessageSeen,
} from "@/app/hooks/useEffectHooks";
import { FileShare } from "@/app/component/ui/display";
import { UserCard } from "@/app/component/ui/cards";
import { TypingIndicator } from "@/app/component/ui/typingIndicator";
import { DropDown, MenuItem } from "@/app/component/ui/dropdown";

export const MessageArea = () => {
  //use states
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [preview, setPreview] = useState<PreviewDataType | null>(null);

  //query client ( tanstack )
  const QueryClient = useQueryClient();

  //refs
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  //redux states
  const states = useSelector(
    (store: PusherChatState) => ({
      activeChat: store.chat.activeChat,
      unreads: store.chat.unreads,
      messageSeen: store.chat.messageSeen,
      // liveMessages: store.chat.messages,
      authUser: store.chat.authUser,
      typingUsers: store.chat.typingUsers,
    }),
    shallowEqual
  );

  const liveMessages = useSelector(
    (store: PusherChatState) => store.chat.messages
  );

  //use hooks
  let debounce = useDebounce(input, 500);
  const pusher = usePusher();
  const presence = useOnlinePresence(states.activeChat?.uid ?? "");

  //generate chatId : memoized
  const chatId = useMemo(
    () => [states.authUser?.uid, states.activeChat?.uid].sort().join("-"),
    [states.authUser?.uid, states.activeChat?.uid]
  );

  // user Typing : memoized

  const isUserTyping = useMemo(
    () =>
      states.typingUsers.some(
        (u) => u.userId === states.activeChat?.uid && u.isTyping
      ),
    [states.activeChat?.uid, states.typingUsers]
  );

  //get Messages ( tanstack )
  const { data, isPending, refetch } = useGetMessages(chatId);

  //get last seen time ( tanstack )
  const { data: lastSeenUpdate } = useGetLastSeen(states.activeChat?.uid ?? "");

  //update last seen time ( tanstack )
  const { mutate: lastSeenMutate } = useUpdateLastSeen((result) => {});

  //redux dispatcher
  const dispatch = useDispatch<PusherChatDispatch>();

  //save message call ( tanstack )
  const { mutate } = useSaveMessage((result) => {
    if (messages.length === 0) {
      if (result.success) {
        refetch();
        QueryClient.invalidateQueries({
          queryKey: ["get-chats", states.authUser?.uid ?? ""],
        });
      }
    }
  });

  //save message calling actually happen here
  const request = async (message: string) => {
    const date = new Date();
    const { url, name, format, asset_id } = await JSON.parse(message);
    const filePayload: FileType = { url, name, format, asset_id };

    mutate({
      content: message,
      files: filePayload,
      senderId: states.authUser?.uid ?? "",
      receiverId: states.activeChat?.uid ?? "",
      chatId: chatId,
      name: states.authUser?.name ?? "",
      dp: states.authUser?.dp ?? "",
      createdAt: date.toISOString(),
      status: presence === "Online" ? "delivered" : "sent",
      unreads: [
        { userId: states.activeChat?.uid ?? "", count: states.unreads },
      ], // find a way to increase this count in the future : currently it only save count as 1 in db
    });
    dispatch(setUnreads(states.unreads + 1));
  };

  //use Effect: make messages empty initially
  useEffect(() => {
    setMessages([]);
    setInput("");
    debounce = "";
    if (textAreaRef.current) {
      textAreaRef.current.value = "";
    }
  }, [states.activeChat?.chatId]);

  //use Effect: merge lives messages ( pusher ) with current Message
  useEffect(() => {
    if (!liveMessages) return;
    setMessages((prev) => [...prev, liveMessages]);
  }, [liveMessages]);

  //use Effect: add messages that fetch from backend to the messages state ( initially )
  useEffect(() => {
    if (!data?.history) return;
    setMessages(data?.history);
  }, [data]);

  //update message seen
  useUpdateMessageSeen(setMessages, states.activeChat!, states.messageSeen!);

  // pusher typing state trigger
  usePusherSubscribe(debounce, states.activeChat!, states.authUser!);

  // use Effect:  update the user last seen when presence changes ( listening to the presence changes )
  useEffect(() => {
    const seenTime = new Date().toString();
    lastSeenMutate({
      uid: states.activeChat?.uid ?? "",
      lastSeen: seenTime?.toString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presence]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setFile(file);
    const url = URL.createObjectURL(file);
    const type = file.type;
    const name = file.name;
    setPreview({ url, type, name });
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleSendMessageBasedOnFile = async () => {
    if (preview?.url && file) {
      setIsUploading(true);
      const content = await handleImageUpload(file);
      if (content) {
        const { url, name, format } = content;
        setIsUploading(false);
        request(
          `{"url": "${url}", "message" : "${input}" ,"name" : "${name}" , "format" : "${format}"}`
        );
        setPreview(null);
        setInput("");
        return;
      }
    }
    setPreview(null);
    request(`{"url": "", "message" : "${input}" ,"name" : "" , "format" : ""}`);
    setInput("");
    return;
  };
  const handleClick = (item: string) => {
    switch (item) {
      case "send":
      case "enter":
        handleSendMessageBasedOnFile();
        break;
    }
  };
  useEffect(() => {
    const handleLeave = (e: DragEvent) => {
      if (e.clientX === 0 && e.clientY === 0) {
        setIsDragging(false);
      }
    };

    window.addEventListener("dragleave", handleLeave);
    return () => window.removeEventListener("dragleave", handleLeave);
  }, []);

  return (
    <div className="flex flex-col w-full h-full relative ">
      {states.activeChat && (
        <>
          <div className="flex p-5  justify-between w-full bg-[var(--pattern_3)] items-center  sticky top-0">
            <div className="flex items-center gap-3">
              <Avatar image={states.activeChat?.dp || "/no_avatar2.png"} />
              <div className="w-full">
                <h1 className="">{states.activeChat?.name}</h1>
                <p className="text-xs text-[var(--pattern_4)]">
                  {presence !== "Online"
                    ? lastSeenUpdate?.lastSeen
                      ? "Last Seen: " +
                        new Date(lastSeenUpdate?.lastSeen).toLocaleTimeString()
                      : null
                    : presence}
                </p>
              </div>
            </div>
            <div className="flex gap-5">
              <BiPhoneCall size={20} />
              <BiVideo size={20} />
              <BiSearch size={20} />
            </div>
          </div>

          {/* drop down menu goes here */}
          <DropDown onSelect={(value) => alert(value)}>
            <MenuItem value="Apple" />
            <MenuItem value="Orange" />
          </DropDown>

          <MessageViewArea
            messages={messages}
            state={isUploading}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={onDragLeave}
          />
          <div className="flex flex-col gap-5 mt-auto w-full p-2 place-items-start ">
            <TypingIndicator
              isUserTyping={isUserTyping}
              version="2"
              username={states.authUser?.name ?? ""}
            />
            <FileShare
              isUploading={isUploading}
              isDragging={isDragging}
              preview={preview}
              setPreview={setPreview}
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
                    handleClick("enter");
                  }
                }}
                onClickButton={(e) => handleClick(e)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
