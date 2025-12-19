/* eslint-disable react-hooks/immutability */
import React, { useRef, useState } from "react";
import TopBar from "./relatedUI/TopBar";
import SearchArea from "../../ui/searcharea";
import { useDispatch, useSelector } from "react-redux";
import {
  AuthUser,
  GroupType,
  PusherChatDispatch,
  PusherChatState,
} from "@/app/types";
import { Button } from "../../ui/button";
import { MdAdd } from "react-icons/md";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import ContactList from "./relatedUI/ContactList";
import { AddUser, Users } from "../../ui/cards";
import { BiArrowToRight, BiSkipNext } from "react-icons/bi";
import { FaForward } from "react-icons/fa6";
import { RxArrowLeft, RxArrowRight, RxArrowTopLeft } from "react-icons/rx";
import Image from "next/image";
import { useCreateGroup } from "@/app/lib/tanstack/groupQuery";
import { handleImageUpload } from "@/app/util/util";
import { setNotification } from "@/app/lib/redux/notificationSlicer";
import Spinner from "../../ui/spinner";
import { v4 as uuidv4 } from "uuid";
import { useSocket } from "../../util_component/SocketProvider";
export const CreateNewGroup = React.memo(() => {
  const friends = useSelector(
    (store: PusherChatState) => store.friends.friends
  );
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  const [users, setUsers] = useState<AuthUser[]>(friends ? friends : []);
  const [isClick, setIsClick] = useState<boolean>(false);

  const handleSearch = (value: string) => {
    const filteredUsers = (friends ?? [])
      .flat()
      .filter((u) => u.name?.toLowerCase().includes(value.toLowerCase()));
    setUsers(filteredUsers);
  };
  const { setInternalClickState } = useLiveLink();

  const [list, setList] = useState<AuthUser[]>([]);
  const addToList = (user: AuthUser) => {
    setList((prev) => {
      const exist = prev.some((u) => u.uid === user.uid);
      if (!exist) {
        return [...prev, user];
      }
      return prev;
    });
  };

  const removeUser = (user: AuthUser) => {
    setList((prev) => prev.filter((a) => a.uid !== user.uid));
  };

  const [step, setStep] = useState<number>(1);
  const dispatch = useDispatch<PusherChatDispatch>();
  const inputRef = useRef<HTMLInputElement>(null);
  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const [dp, setDP] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const { mutate } = useCreateGroup(async (result) => {
    if (result.success) {
      setStatus("finished");
      const id = new Date().getTime().toString();
      dispatch(setNotification({ id, notify: result?.message }));
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      setInternalClickState("chats");
    }
  });
  const [status, setStatus] = useState<string>("");
  const [groupName, setGroupName] = useState<string>("");
  const socket = useSocket();

  const createGroup = async () => {
    let result = null;
    if (file && dp) {
      result = await handleImageUpload(file);
    }
    if (authUser && authUser.uid) {
      const updatedList = [...list, authUser].map((p) => p.uid);

      const chatId = uuidv4();
      const createdBy = authUser.uid;
      const username = authUser.name;

      const payload: GroupType = {
        groupName,
        createdBy,
        dp: result ? result.url : "",
        participants: updatedList,
        type: "Group",
        message: `You have added to the ${groupName} by ${username}`,
        lastMessage: {
          message: `{"url": "", "message" : "You were added!" ,"name" : "" , "format" : "", "public_id" : ""}`,
          name: username,
        },
        updatedAt: new Date().toISOString(),
        chatId,
      };

      if (socket) {
        socket.emit("create-new-chat", payload);
        setStatus("loading");
        mutate({ groupData: payload });
      }
    }
  };
  return (
    <div
      onClick={() => {
        setIsClick(false);
      }}
      className={`p-5 flex flex-col h-full w-full gap-2 justify-start items-center sticky top-0 bg-[var(--pattern_2)]`}
    >
      <TopBar
        type="back"
        route="edit"
        title="Create a Group"
        subTitle={
          step === 1
            ? "Search friends by their name and add to the group"
            : "Add other group details"
        }
        callback={() => {
          if (step > 1) {
            setStep((prev) => prev - 1);
          } else {
            setInternalClickState("edit");
          }
        }}
      />

      {/* show added users */}
      {step === 1 && (
        <>
          <div className="w-full p-2">
            <div className="grid grid-cols-2 max-h-[200px] overflow-y-auto overflow-x-hidden gap-2">
              <AddUser friends={list} handleClick={removeUser} />
            </div>

            <div className="flex  flex-col mb-4 space-y-3  mt-2">
              <SearchArea
                onSearch={handleSearch}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsClick((prev) => !prev);
                }}
                placeholder="Add friends to the group"
                className="w-full "
              />
              <Users friends={users} handleClick={(val) => addToList(val)} />
            </div>
          </div>
          <div className="h-full flex justify-end items-end">
            <Button
              disabled={list.length <= 0}
              variant="eco"
              size="lg"
              radius="full"
              onClick={() => {
                if (list.length > 0) {
                  setStep(step + 1);
                }
              }}
            >
              <RxArrowRight size={30} />
            </Button>
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <h1 className="text-md font-bold">Display picture</h1>
          <p className="text-xs italic">
            Choose display picture for your group
          </p>

          <div onClick={openFilePicker} className="place-items-center">
            <Image
              src={dp ?? "/group_avatar.png"}
              alt="group dp"
              width={250}
              className="mt-5 w-[250px] h-[250px] border-2 border-green-500 shadow-md
            rounded-full bg-gray-300 flex-shrink-0"
              height={250}
            ></Image>
            <input
            
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFile(file);
                  const link = URL.createObjectURL(file!);
                  setDP(link);
                }
              }}
              className="opacity-0"
              ref={inputRef}
            ></input>
          </div>

          <h1 className="text-md font-bold">Group Name</h1>
          <p className="text-xs italic">Set group name</p>
          <input
            type="text"
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name"
            className="border border-[var(--pattern_1)] shadow-md p-2 rounded-xl placeholder:text-center"
          />

          <div className="h-full flex justify-end items-end">
            <Button
              variant="eco"
              size="lg"
              radius="full"
              onClick={() => {
                createGroup();
              }}
            >
              {status === "loading" ? <Spinner /> : "Create Group"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
});
CreateNewGroup.displayName = "CreateNewGroup";

export default CreateNewGroup;
