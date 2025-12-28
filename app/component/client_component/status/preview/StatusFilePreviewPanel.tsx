import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PusherChatDispatch, PusherChatState } from "@/app/types";
import { useDebounce } from "@/app/hooks/useHooks";
import { v4 as uuid } from "uuid";
import { useSetStatus } from "@/app/lib/tanstack/statusQuery";
import { handleFileUpload } from "@/app/util/util";
import { setNotification } from "@/app/lib/redux/notificationSlicer";
import { useStatusContext } from "@/app/context/StatusContext";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import { useSocket } from "@/app/component/util_component/SocketProvider";
import { FileShare } from "@/app/component/ui/preview";
import { TextArea } from "@/app/component/ui/textarea";

const StatusFilePreviewPanel = () => {
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
      setCurrentState("idle");
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
    setUploading("uploading");
    dispatch(
      setNotification({
        id: Date.now().toString(),
        notify: "Status uploading...wait a second!",
      })
    );
    switch (item) {
      case "send":
      case "enter": {
        const result = preview?.file
          ? await handleFileUpload(preview?.file)
          : null;
        const friendsUids = friends.flat().map((f) => f.uid);

        const payload = {
          statusId: uuid(),
          uid: authUser?.uid ?? "",
          email: authUser?.email ?? "",
          dp: authUser?.dp ?? "",
          name: authUser?.name ?? "",
          content: { file: result, caption: { caption: debounce } },
          myFriends: friendsUids,
          createdAt: new Date().toISOString(),
        };
        if (socket) {
          socket.emit("update-status", payload);
        }
        setUserStatus(payload);
        mutate({ payload });
        setInput("");
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-full relative overflow-hidden">
      {currentTab === "status" && (
        <div className="flex flex-col justify-end p-5 relative custom-scrollbar-y h-full w-full">
          {uploading !== "uploading" && (
            <FileShare
              isDragging={false}
              preview={preview}
              setPreview={setPreview}
              //   setFile={setFile}
            />
          )}
          <TextArea
            // ref={textAreaRef}
            value={input}
            // text={debounce}
            preview={preview?.type}
            support="only-message"
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
                handleStatusUpdate("enter");
              }
            }}
            onClickButton={(input) => {
              handleStatusUpdate(input);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default StatusFilePreviewPanel;
