"use client";
import { UserCard } from "@/app/component/ui/cards";
import { PusherChatState } from "@/app/types";
import { useSelector } from "react-redux";

const StatusPanel = () => {
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);

  return (
    <div
      className={`transition-all bg-[var(--pattern_2)] h-full relative w-full sm:w-72 custom-scrollbar-y`}
    >
      <div className="p-5 space-y-2">
        <h1 className="header">Status</h1>
        {/* my status */}
        <UserCard avatar={authUser?.dp} name={""} created_at={""} version={1} />
        <div className="">
          <p className="sub-header">Recent updates</p>
          {/* friends status */}
          <UserCard
            avatar={"/dog.png"}
            name={"Alastair Cook"}
            created_at={new Date().toLocaleTimeString().toString()}
          />
          <UserCard
            avatar={"/dog.png"}
            name={"Alastair Cook"}
            created_at={new Date().toLocaleTimeString().toString()}
          />
          <UserCard
            avatar={"/dog.png"}
            name={"Alastair Cook"}
            created_at={new Date().toLocaleTimeString().toString()}
          />
          <UserCard
            avatar={"/dog.png"}
            name={"Alastair Cook"}
            created_at={new Date().toLocaleTimeString().toString()}
          />
          <UserCard
            avatar={"/dog.png"}
            name={"Alastair Cook"}
            created_at={new Date().toLocaleTimeString().toString()}
          />
          <UserCard
            avatar={"/dog.png"}
            name={"Alastair Cook"}
            created_at={new Date().toLocaleTimeString().toString()}
          />
          <UserCard
            avatar={"/dog.png"}
            name={"Alastair Cook"}
            created_at={new Date().toLocaleTimeString().toString()}
          />
          <UserCard
            avatar={"/dog.png"}
            name={"Alastair Cook"}
            created_at={new Date().toLocaleTimeString().toString()}
          />
          <UserCard
            avatar={"/dog.png"}
            name={"Alastair Cook"}
            created_at={new Date().toLocaleTimeString().toString()}
          />
          <UserCard
            avatar={"/dog.png"}
            name={"Alastair Cook"}
            created_at={new Date().toLocaleTimeString().toString()}
          />
          <UserCard
            avatar={"/dog.png"}
            name={"Alastair Cook"}
            created_at={new Date().toLocaleTimeString().toString()}
          />
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
