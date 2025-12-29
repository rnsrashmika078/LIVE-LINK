/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/refs */
import React, { useEffect, useState } from "react";
import Avatar from "../avatar";
import { useSelector } from "react-redux";
import { ChatsType, PusherChatState } from "@/app/types";
import { MdCallEnd } from "react-icons/md";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import { useSocket } from "../../util_component/SocketProvider";
import { BsMic, BsMicMute } from "react-icons/bs";
import { startCall } from "@/app/lib/webrtc/startCall";
import { endCall } from "@/app/lib/webrtc/endCall";
import { useElapsedTime } from "@/app/hooks/useHooks";

const OutGoingCall = () => {
  const {
    localAudioRef,
    remoteAudioRef,
    sessionInfo,
    pcRef,
    setClickedIcon,
    pendingCandidatesRef,
    audioRef,
  } = useLiveLink();

  const [mute, setMute] = useState<boolean>(false);
  const socket = useSocket();

  const activeChat = useSelector(
    (store: PusherChatState) => store.chat.activeChat as ChatsType
  );
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);

  useEffect(() => {
    const handleStartCall = async () => {
      await startCall({
        callFrom: authUser?.uid,
        callTo: activeChat?.uid,
        callerDp: authUser?.dp,
        callerName: authUser?.name,
        pcRef,
        localAudioRef,
        remoteAudioRef,
        socket,
        pendingCandidatesRef,
      });
    };
    handleStartCall();
  }, []);

  const handleMute = () => {
    if (remoteAudioRef.current && localAudioRef.current) {
      remoteAudioRef.current.muted = !remoteAudioRef.current.muted;

      setMute((prev) => !prev);
    }
  };

  const handleCallEnd = async () => {
    await endCall({
      socket,
      callFrom: sessionInfo?.callFrom,
      callTo: sessionInfo?.callTo,
      callEndBy: authUser?.uid,
      callerDp: sessionInfo?.callerDp,
      callerName: sessionInfo?.callerName,
      pcRef,
      pendingCandidatesRef,
      localAudioRef,
      remoteAudioRef,
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setClickedIcon("");
  };

  useEffect(() => {
    if (sessionInfo?.callStatus === "Call End") {
      const timer = setTimeout(() => {
        setClickedIcon("");
      }, 2000);

      return () => clearTimeout(timer);
    }

    if (sessionInfo?.callStatus === "Connecting..") {
      audioRef.current?.play();
    }
    if (sessionInfo?.callStatus === "Connected") {
      audioRef.current?.pause();
    }
    return;
  }, [sessionInfo?.callStatus]);

  const elapsedTime = useElapsedTime(sessionInfo?.callStatus === "Connected");
  return (
    <div className=" z-[9999] bg-gray-900 right-5 top-5 rounded-xl border border-gray-800 shadow-sm h-[300px] w-[250px]  absolute">
      <div className="flex flex-col items-center justify-between p-5 w-full h-full">
        <audio ref={audioRef} src="/sounds/phone-rigging.mp3" preload="auto" />
        {activeChat && (
          <div className="flex flex-col justify-center items-center">
            <Avatar width={20} height={20} image={activeChat.dp} />
            <strong className="pt-2">{activeChat.name}</strong>
            <p className="animate-pulse font-extralight">
              {sessionInfo?.callStatus}
            </p>
            <p className="animate-pulse text-sm text-gray-500">{elapsedTime}</p>
            <audio ref={localAudioRef} autoPlay muted className="w-full" />
            <p className="text-xs text-gray-500">Muted to prevent echo</p>
            <audio ref={remoteAudioRef} autoPlay className="w-full" />
          </div>
        )}
        <div className="flex justify-between w-full">
          {mute ? (
            <BsMicMute
              size={40}
              onClick={handleMute}
              color="white"
              className="p-2 bg-green-700 rounded-full transition-all hover:scale-120 cursor-pointer"
            />
          ) : (
            <BsMic
              size={40}
              onClick={handleMute}
              color="white"
              className="p-2 bg-green-700 rounded-full transition-all hover:scale-120 cursor-pointer"
            />
          )}
          <MdCallEnd
            onClick={handleCallEnd}
            size={40}
            color="white"
            className="p-2 bg-red-500 rounded-full transition-all hover:scale-120 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default OutGoingCall;
