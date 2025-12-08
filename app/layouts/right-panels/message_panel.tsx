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
  PusherChatDispatch,
  PusherChatState,
} from "@/app/types";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useRef, useState } from "react";
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

export const MessageArea = () => {
  //use states
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [preview, setPreview] = useState<{
    url: string;
    type: string;
    name: string;
  } | null>(null);

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

  //UseEffect: update message seen
  useEffect(() => {
    if (!states.messageSeen?.receiverId || !states.activeChat?.chatId) return;

    setMessages((prev) =>
      prev.map((c) =>
        c.senderId === states.messageSeen?.receiverId &&
        c.chatId === states.activeChat?.chatId
          ? { ...c, status: "seen" }
          : c
      )
    );
  }, [states.activeChat?.chatId, states.messageSeen?.receiverId]);

  //use Effect: pusher typing state trigger
  useEffect(() => {
    if (!pusher || !states.activeChat?.chatId || !states.authUser?.uid) return;

    const channelName = `private-message-${states.activeChat?.chatId}`;

    const channel = pusher.channel(channelName);
    channel?.trigger("client-message", {
      type: "typing",
      userId: states.authUser?.uid,
      chatId: states.activeChat.chatId,
      isTyping: !!debounce?.length,
    });
  }, [debounce, pusher, states.activeChat?.chatId, states.authUser?.uid]);

  // use Effect:  update the user last seen when presence changes ( listening to the presence changes )
  useEffect(() => {
    const seenTime = new Date().toString();
    lastSeenMutate({
      uid: states.activeChat?.uid ?? "",
      lastSeen: seenTime?.toString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presence]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setFile(file);
    const url = URL.createObjectURL(file);
    const type = file.type;
    const name = file.name;
    setPreview({ url, type, name });
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

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
  return (
    <div className="flex flex-col w-full h-full ">
      {states.activeChat && (
        <>
          <div className="flex p-5 justify-between w-full bg-[var(--pattern_3)] items-center  sticky top-0">
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

          <Spinner condition={isPending} heading="Uploading" />
          <MessageViewArea messages={messages} state={isUploading} />
          <div className="flex relative flex-col gap-5 mt-auto w-full p-2 place-items-start ">
            <div className="fixed bottom-20">
              {isUserTyping ? (
                <div className="animate-pulse italic px-2 flex gap-1 items-center">
                  <TiMessageTyping size={30} color="green" />
                  {states.authUser?.name.split(" ")[0] + " is typing..."}
                </div>
              ) : null}
            </div>
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
                    if (messages.length === 0) {
                    }
                    handleClick("enter");
                    // request(e.currentTarget.value);
                    e.preventDefault();
                    setInput("");
                    e.currentTarget.value = "";
                  }
                }}
                onClickButton={(e) => handleClick(e)}
              />
            </div>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={onDragLeave}
              className={` absolute  h-[150px] w-[calc(100%-1rem)] bottom-15  ${
                isDragging
                  ? "pointer-events-auto border-gray-300 border-dashed "
                  : "pointer-events-none border-none "
              }  flex justify-center rounded-lg border px-6 py-1`}
            >
              {/* this whole thing replace with a functional component or a single function */}
              {preview?.type.startsWith("image/") && (
                <>
                  <Image
                    src={preview.url ?? "/12.png"}
                    alt="upload Image"
                    width={500}
                    height={500}
                    className="object-contain"
                  ></Image>
                  <div className="absolute right-8 top-3">
                    <Button onClick={() => setPreview(null)}>X</Button>
                  </div>
                </>
              )}
              {preview?.type === "application/pdf" && (
                <>
                  <div className="flex flex-col w-full h-full items-center gap-2 p-2 border rounded-lg">
                    <p className="text-red-600 font-semibold">
                      <FaFilePdf size={50} /> PDF
                    </p>
                    <span>{preview.name}</span>
                    {/* <iframe src={preview.url!} className="w-full h-full border" /> */}
                  </div>
                  <div className="absolute right-8 top-3">
                    <Button onClick={() => setPreview(null)}>X</Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
