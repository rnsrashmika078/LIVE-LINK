"use client";
import { Button } from "../../component/ui/button";
import { EndItems, MiddleItems, StartItems } from "../../util/data";
import { useDispatch, useSelector } from "react-redux";
import { PusherChatDispatch, PusherChatState } from "../../types";
import { setCurrentTab } from "../../lib/redux/layoutSlicer";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useState } from "react";
import { setActiveChat } from "@/app/lib/redux/chatslicer";

// one hydration error occur in this component that needed be solve
const SidebarComponent = React.memo(() => {
  const dispatch = useDispatch<PusherChatDispatch>();
  const currentTab = useSelector(
    (store: PusherChatState) => store.layout.currentTab
  );

  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  const router = useRouter();

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

  return (
    <div className="bg-[var(--pattern_1)] w-14 h-full flex flex-col justify-between py-2 px-1">
      <div className="flex flex-col justify-center">
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
                  dispatch(setCurrentTab(item.name));
                  dispatch(setActiveChat(null));
                  router.push(`/${item.name}`);
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

      <div className="flex flex-col justify-center">
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
                onClick={() => dispatch(setCurrentTab(item.name))}
              >
                {/* <p>{item.name}</p> */}
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
                onClick={() => dispatch(setCurrentTab(item.name))}
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

SidebarComponent.displayName = "SidebarComponent";
export default SidebarComponent;
