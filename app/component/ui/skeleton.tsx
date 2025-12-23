"use client";
import React from "react";

const Skeleton = ({ version }: { version: string }) => {
  switch (version.toLowerCase()) {
    case "chat": {
      return <Chat />;
    }
    case "sidebar": {
      return <Sidebar />;
    }
  }
};

const Sidebar = () => {
  return (
    <div className="animate-pulse overflow-hidden flex flex-col gap-5 justify-start  p-2 items-center shadow-2xl bg-[#494949] w-15 h-full">
      {[...Array(25)].map((item, index) => (
        <div
          key={index}
          className="animate-pulse p-4 w-full bg-[#545454] rounded-xl shadow-2xl"
        ></div>
      ))}
    </div>
  );
};
const Chat = () => {
  return (
    <div className="animate-pulse overflow-hidden flex flex-col gap-5 justify-start  p-2 items-center shadow-2xl bg-[#494949] w-full h-full">
      {[...Array(25)].map((item, index) => (
        <div
          key={index}
          className="animate-pulse p-4 w-full bg-[#545454] rounded-xl shadow-2xl"
        ></div>
      ))}
    </div>
  );
};
export default Skeleton;
