/* eslint-disable react-hooks/set-state-in-effect */
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";
import { Viewer } from "../ui/cards";
import {
  PusherChatDispatch,
  PusherChatState,
  SeenByUserType,
} from "@/app/types";
import { useDispatch, useSelector } from "react-redux";
import { clearLiveSeen } from "@/app/lib/redux/statusSlicer";
import { useGetSeenUsers } from "@/app/lib/tanstack/statusQuery";

const StatusInfo = ({
  setIsViewInfo,
}: {
  setIsViewInfo: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useDispatch<PusherChatDispatch>();

  const statusInfo = useSelector(
    (store: PusherChatState) => store.status.seenBy
  );
  const statusId = useSelector(
    (store: PusherChatState) => store.status.onViewStatus?.statusId
  );

  const [info, setInfo] = useState<SeenByUserType[]>([]);

  const { data } = useGetSeenUsers(statusId ?? "");

  useEffect(() => {
    dispatch(clearLiveSeen());
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) return;
    setInfo(data);
  }, [data]);

  useEffect(() => {
    if (statusInfo.length === 0) return;
    const latest = statusInfo?.at(-1);
    if (!latest) return;
    setInfo((prev) => [...prev, latest]);
  }, [statusInfo]);

  return (
    <motion.div
      initial={{ y: 500, x: 0 }}
      animate={{ y: -50, x: 0 }}
      exit={{ y: 500, x: 0 }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 bg-gradient-to-br rounded-t-4xl bg-black w-[calc(70%)] h-full from-black/50"
    >
      <div className="flex justify-between items-center p-5 bg-gradient-to-bl from-blue-400 via-blue-600 to-blue-800 rounded-t-4xl">
        <p className="text-2xl font-bold">Status Info</p>
        <IoCloseCircleSharp
          size={40}
          onClick={() => setIsViewInfo((prev: boolean) => !prev)}
          className="hover:scale-110 transition-all cursor-pointer text-end"
        />
      </div>
      <div className="h-[325px] p-2 custom-scrollbar flex flex-col">
        {info &&
          info.map((u: SeenByUserType, i: number) => (
            <Viewer key={i} viewers={u}></Viewer>
          ))}
      </div>
    </motion.div>
  );
};

export default StatusInfo;
