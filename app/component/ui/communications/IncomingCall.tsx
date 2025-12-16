/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/refs */
import React, { useEffect, useState } from "react";
import Avatar from "../avatar";
import { shallowEqual, useSelector } from "react-redux";
import { PusherChatState } from "@/app/types";
import { MdCall, MdCallEnd } from "react-icons/md";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import { useSocket } from "../../util_component/SocketProvider";
import { BsMic, BsMicMute } from "react-icons/bs";
import { endCall } from "@/app/lib/webrtc/endCall";
import { cleanupConnection } from "@/app/lib/webrtc/cleanupConnection";
import { useElapsedTime } from "@/app/hooks/useHooks";

const IncomingCall = () => {
  const {
    localAudioRef,
    remoteAudioRef,
    pcRef,
    sessionInfo,
    setSessionInfo,
    pendingCandidatesRef,
    audioRef,
  } = useLiveLink();
  const socket = useSocket();
  const [mute, setMute] = useState<boolean>(false);

  const { activeChat, authUser } = useSelector(
    (store: PusherChatState) => ({
      activeChat: store.chat.activeChat,
      authUser: store.chat.authUser,
    }),
    shallowEqual
  );

  const handleAnswer = async () => {
    try {
      const pc = pcRef.current;
      if (!pc) {
        return;
      }
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      // if (pc.signalingState !== "have-remote-offer") {
      //   console.warn("Cannot create answer in state:", pc.signalingState);
      //   return;
      // }

      socket?.emit("call-answer", {
        // callFrom: authUser?.uid,
        callFrom: sessionInfo?.callFrom,
        callTo: authUser?.uid, // The original caller
        callerDp: sessionInfo?.callerDp,
        callerName: sessionInfo?.callerName,
        sdp: pc.localDescription?.toJSON(),
      });
    } catch (err: any) {
      console.error("Error sending answer:", err);
      cleanupConnection({
        pcRef,
        pendingCandidatesRef,
        localAudioRef,
        remoteAudioRef,
      });
    }
  };
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
    setSessionInfo(null);
  };

  useEffect(() => {
    if (sessionInfo?.callStatus === "Call End") {
      audioRef.current?.pause();
      const timer = setTimeout(() => {
        setSessionInfo(null);
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

  if (
    !sessionInfo?.callTo ||
    sessionInfo?.callTo !== authUser?.uid ||
    !sessionInfo
  )
    return;
  return (
    <div className=" z-[9999] bg-gray-900 right-5 top-5 rounded-xl border border-gray-800 shadow-sm h-[300px] w-[250px]  absolute">
      <div className="flex flex-col items-center justify-between p-5 w-full h-full">
        <div className="flex flex-col justify-center items-center">
          <audio
            ref={audioRef}
            src="/sounds/incoming-call.mp3"
            preload="auto"
          />
          <Avatar width={20} height={20} image={sessionInfo?.callerDp ?? ""} />
          <strong className="pt-2">{sessionInfo?.callerName}</strong>
          <p className="animate-pulse font-extralight">
            {sessionInfo?.callStatus === "Connecting.."
              ? "Incoming Call..."
              : sessionInfo.callStatus}
          </p>
          <p className="animate-pulse text-sm text-gray-500">{elapsedTime}</p>

          <audio ref={localAudioRef} autoPlay muted className="w-full" />
          <p className="text-xs text-gray-500">Muted to prevent echo</p>
          <audio ref={remoteAudioRef} autoPlay className="w-full" />
        </div>
        <div></div>
        <div className="flex justify-between w-full">
          {/* answer btn */}
          {sessionInfo?.callStatus === "Connected" ? (
            mute ? (
              <BsMicMute
                size={40}
                onClick={handleMute}
                color="white"
                className="p-2 bg-green-700 rounded-full transition-all hover:scale-120 cursor-pointer animate-pulse"
              />
            ) : (
              <BsMic
                size={40}
                onClick={handleMute}
                color="white"
                className="p-2 bg-green-700 rounded-full transition-all hover:scale-120 cursor-pointer animate-pulse"
              />
            )
          ) : (
            <MdCall
              size={40}
              onClick={handleAnswer}
              color="white"
              className="p-2 bg-green-700 rounded-full transition-all hover:scale-120 cursor-pointer animate-pulse"
            ></MdCall>
          )}

          {/* call end btn  */}
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

export default IncomingCall;
