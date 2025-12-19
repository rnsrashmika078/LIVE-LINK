/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IoCheckmark,
  IoCheckmarkDone,
  IoCheckmarkDoneSharp,
} from "react-icons/io5";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import React, { useEffect, useState } from "react";

export function OnMessageSeen(condition: boolean, status: string) {
  if (condition) {
    return (
      <div>
        {status === "seen" && <IoMdEye color="lightgreen" />}
        {status === "delivered" && <IoMdEyeOff />}
        {status === "sent" && <IoCheckmark />}
      </div>
    );
  }
  return <div>{null}</div>;
}

export function formattedDate(createdAt: string) {
  const now = new Date(createdAt);
  const date = new Date();

  const difference = (now.getTime() - date.getTime()) / 1000;

  const days = Math.floor(difference / 86400);

  return days;
}
type Props = {
  name: string;
};

export const SenderNameStyle = React.memo(({ name }: Props) => {
  const letter = name.slice(0, 1)[0];

  const [style, setStyle] = useState<string>("text-white");
  useEffect(() => {
    switch (letter.toLowerCase()) {
      case "r":
        setStyle("text-red-500");
        break;
      default:
        setStyle("text-green-500");
    }
  }, [letter, name]);

  return <p className={style}>{name}</p>;
});

SenderNameStyle.displayName = "SenderNameStyle";
