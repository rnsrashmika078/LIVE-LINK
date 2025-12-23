"use client";
import { logoutUser } from "@/app/util/auth-options/client_options";
import Avatar from "../ui/avatar";
import { Button } from "../ui/button";
import { CgProfile } from "react-icons/cg";
import { PusherChatState } from "@/app/types";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import React from "react";

const UserSettings = React.memo(() => {
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  const router = useRouter();
  return (
    <div className="flex w-full h-full bg-[var(--pattern_2)] border border-[var(--pattern_5)] rounded-md">
      <div className="p-1 w-10  h-full bg-green-900">
        <div className="flex justify-center items-center gap-2 hover:bg-[var(--pattern_1)] p-1 rounded-xl px-2">
          <CgProfile />
        </div>
      </div>
      <div className="w-full  flex flex-col justify-start items-start te h-full  p-5 ">
        <div className="w-48 py-5">
          <strong>User Settings</strong>
          <p className="text-xs font-extralight italic">
            User profile details shows here
          </p>
        </div>
        <Avatar
          image={authUser?.dp ?? "/no_avatar.png"}
          width={20}
          height={20}
        />
        <div className="mt-2 mb-5">
          <p className="text-sm font-bold">{authUser?.name}</p>
          <p className="text-xs">{authUser?.email}</p>
          <p className="text-xs">{authUser?.uid}</p>
        </div>
        <div className="border-b w-full border-[var(--pattern_5)]"></div>
        <Button
          variant="danger"
          className="mt-2"
          radius="md"
          onClick={async () => {
            await logoutUser();
            router.push("/welcome");
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
});
UserSettings.displayName = "UserSettings";
export default UserSettings;
