"use client";
import { Button } from "../../component/ui/button";
import { EndItems, MiddleItems, StartItems } from "../../util/data";
import { useDispatch, useSelector } from "react-redux";
import { PusherChatDispatch, PusherChatState } from "../../types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect } from "react";
import { setActiveChat } from "@/app/lib/redux/chatslicer";
import { usePathName } from "@/app/hooks/useHooks";
import { useLiveLink } from "@/app/context/LiveLinkContext";

// one hydration error occur in this component that needed be solve
const Sidebar = React.memo(() => {
  const dispatch = useDispatch<PusherChatDispatch>();
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  const router = useRouter();
  const { currentTab, setCurrentTab, setInternalClickState } = useLiveLink();

  //temp function
  const deletefunction = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/test-delete-route`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await res.json();
    if (result) {
    }
  };
  const path = usePathName();

  useEffect(() => {
    if (!path) return;
    setCurrentTab(path.split("/")[2]);
  }, []);

  const dummy_chat = {
    chatId: "",
    uid: "",
    name: "",
    email: "",
    lastMessageId: "",
    dp: "",
    lastMessage: "",
  };
  return (
    <div
      className="bg-[var(--pattern_1)] z-[99] relative w-14 h-full flex flex-col justify-between py-2 px-1"
      // ref={divRef}
    >
      <div className="flex flex-col justify-center ">
        {StartItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="relative rounded-4xl">
              <Button
                variant="transparent"
                radius="md"
                className={`w-12 ${
                  currentTab === item.name
                    ? "bg-[var(--pattern_2)]"
                    : "bg-transparent"
                }`}
                onClick={() => {
                  setCurrentTab(item.name);
                  dispatch(setActiveChat(null));
                  setInternalClickState("chats");
                  router.push(`/livelink/${item.name}`);
                }}
              >
                {/* <p>{item.name}</p> */}
                <Icon size={16} className="relative" />
                <div
                  className={`${
                    currentTab === item.name
                      ? " border-green-500"
                      : " border-transparent"
                  }
                   transition-all absolute top-0  rounded-2xl translate-x-1/2 translate-y-1/2 border-l border-4 h-5 left-0`}
                ></div>{" "}
              </Button>
            </div>
          );
        })}
      </div>
      <Button size="xs" onClick={deletefunction}>
        X
      </Button>

      <div className="flex flex-col justify-center ">
        {MiddleItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="relative rounded-4xl">
              <Button
                variant="transparent"
                radius="md"
                className={`${
                  currentTab === item.name
                    ? "border-red-500 bg-[var(--pattern_2)]"
                    : "bg-transparent"
                }`}
                onClick={() => {
                  setInternalClickState("");
                  setCurrentTab(item.name);
                }}
              >
                <Icon size={16} className="relative" />
                <div
                  className={`${
                    currentTab === item.name
                      ? " border-green-500"
                      : " border-transparent"
                  }
                                            transition-all absolute top-0 rounded-2xl translate-x-1/2 translate-y-1/2 border-l border-4 h-5 left-0`}
                ></div>{" "}
              </Button>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col justify-center">
        {EndItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="relative rounded-4xl">
              <Button
                variant="transparent"
                radius="md"
                className={`${
                  currentTab === item.name
                    ? "bg-[var(--pattern_2)]"
                    : "bg-transparent"
                }`}
                onClick={() => {
                  if (item.name === "users") {
                    setCurrentTab(item.name);
                    setInternalClickState(item.name);
                  } else {
                    setCurrentTab(item.name);
                    setInternalClickState("");
                  }
                }}
              >
                {/* <p>{item.name}</p> */}
                {item.name === "users" ? (
                  <Image
                    src={authUser?.dp || "/no_avatar2.png"}
                    width={16}
                    className="relative w-4 h-4 shrink-0 rounded-full"
                    height={16}
                    alt="profile image"
                  />
                ) : (
                  <Icon size={16} className="relative" />
                )}

                <div
                  className={`${
                    currentTab === item.name
                      ? " border-green-500"
                      : " border-transparent"
                  }
                                            transition-all absolute top-0  rounded-2xl translate-x-1/2 translate-y-1/2 border-l border-4 h-5 left-0`}
                ></div>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
});

Sidebar.displayName = "Sidebar";
export default Sidebar;
