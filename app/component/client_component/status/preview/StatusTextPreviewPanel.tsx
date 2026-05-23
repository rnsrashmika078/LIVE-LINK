import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PusherChatDispatch, PusherChatState } from "@/app/types";
import { useDebounce } from "@/app/hooks/useHooks";
import { v4 as uuid } from "uuid";
import { useSetStatus } from "@/app/lib/tanstack/statusQuery";
import { useSocket } from "../../../util_component/SocketProvider";
import { setNotification } from "@/app/lib/redux/notificationSlicer";
import { useStatusContext } from "@/app/context/StatusContext";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import { IoColorPalette } from "react-icons/io5";
import Emoji from "@/app/component/ui/emojies";
import { Button } from "@/app/component/ui/button";
import { BiSend } from "react-icons/bi";
import { IoCloseCircleSharp } from "react-icons/io5";

const StatusTextPreviewPanel = () => {
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  const { currentTab } = useLiveLink();
  const { setUserStatus, setCurrentState } = useStatusContext();
  const { preview, setPreview } = useStatusContext();
  const friends = useSelector(
    (store: PusherChatState) => store.friends.friends
  );
  //status related data
  const [input, setInput] = useState<string>("");
  const debounce = useDebounce(input, 500);
  const [uploading, setUploading] = useState<string>("");
  const dispatch = useDispatch<PusherChatDispatch>();

  const { mutate } = useSetStatus((result) => {
    if (result.success) {
      setUploading("success");
      setPreview(null);
      dispatch(
        setNotification({
          id: Date.now().toString(),
          notify: "Your status update!",
        })
      );
    }
  });

  const socket = useSocket();
  const handleStatusUpdate = async (item: string) => {
    dispatch(
      setNotification({
        id: "123",
        notify: "Status uploading...wait a second!",
      })
    );
    switch (item) {
      case "send":
      case "enter": {
        const friendsUids = friends.flat().map((f) => f.uid);
        const caption = {
          caption: debounce,
          color,
        };
        const payload = {
          statusId: uuid(),
          uid: authUser?.uid ?? "",
          email: authUser?.email ?? "",
          dp: authUser?.dp ?? "",
          name: authUser?.name ?? "",
          content: { file: null, caption },
          myFriends: friendsUids,
          createdAt: new Date().toISOString(),
        };
        if (socket) {
          socket.emit("update-status", payload);
        }
        setUserStatus(payload);
        setCurrentState("idle");
        mutate({ payload });
        setInput("");
      }
    }
  };
  const colorRef = useRef<HTMLInputElement | null>(null);

  const [color, setColor] = useState<string>("#0000FF");
  const handleColorPicker = () => {
    if (!colorRef.current) return;
    colorRef.current.click();
  };
  const handleAddEmoji = (e: string) => {
    setInput((prev) => prev + e);
  };
  return (
    <div
      style={{ backgroundColor: color }}
      className={`flex flex-col w-full h-full relative overflow-hidden`}
    >
      <div className="py-2 px-2 flex pattern_3 justify-between">
        <IoColorPalette
          size={40}
          onClick={handleColorPicker}
          className="hover:scale-110 transition-all cursor-pointer"
        />

        <IoCloseCircleSharp
          size={40}
          onClick={() => setCurrentState("idle")}
          className="hover:scale-110 transition-all cursor-pointer"
        />
      </div>

      <input
        type="color"
        ref={colorRef}
        className="opacity-0 pointer-events-none"
        onChange={(e) => setColor(e.target.value)}
      ></input>
      {currentTab === "status" && (
        <div className="flex  flex-col justify-end p-5 relative custom-scrollbar-y h-full w-full">
          <textarea
            aria-label="input-text"
            className="w-full h-full flex justify-center items-center text-center border-none ring-0 outline-none text-white text-6xl"
            placeholder="Type a status here"
            value={input}
            onKeyDown={(e) => e.key === "Enter" && handleStatusUpdate("enter")}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          ></textarea>
        </div>
      )}

      <div className="flex justify-between p-2 w-full items-center">
        <Emoji onClickEmoji={handleAddEmoji} />
        <Button radius="full" variant="eco">
          <BiSend
            size={25}
            onClick={() => {
              handleStatusUpdate("send");
            }}
          />
        </Button>
      </div>
    </div>
  );
};

export default StatusTextPreviewPanel;
