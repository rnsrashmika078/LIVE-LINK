"use client";

import { useSelector } from "react-redux";
import { PusherChatState } from "../types";
import { UserCard } from "./ui/cards";

const Presence = () => {
  const initialMembers = useSelector(
    (store: PusherChatState) => store.friends.initialMembers
  );
  const joinedUsers = useSelector(
    (store: PusherChatState) => store.friends.joinedUsers
  );
  const leftUsers = useSelector(
    (store: PusherChatState) => store.friends.leftUsers
  );
  return (
    <div className="w-full h-screen bg-red-500">
      <h1>Initial Members</h1>

      {Array.isArray(initialMembers) &&
        initialMembers.map((u) => (
          <UserCard version={10} key={u.uid} avatar={u.dp} name={u.name} />
        ))}
    </div>
  );
};

export default Presence;
