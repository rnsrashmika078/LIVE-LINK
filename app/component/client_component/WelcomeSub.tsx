"use client";
import { PusherChatState } from "@/app/types";
import React from "react";
import { useSelector } from "react-redux";

const WelcomeSub = () => {
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);

  return (
    <div className="flex items-start justify-start h-screen bg-gradient-to-br from-dark to-black/10">
      <div className="text-start px-8 max-w-2xl">
        <div className="mb-8 flex justify-start">
          <div className="relative">
            {/* <Greet
            color="green"
            className="w-16 h-16 animate-pulse"
          /> */}
          </div>
        </div>

        <h1 className="text-4xl font-bold">
          Hi, {authUser?.name.split(" ")[0]}!
        </h1>

        <div>
          <h1 className=" text-gray-400">Welcome to the Live Link !</h1>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSub;
