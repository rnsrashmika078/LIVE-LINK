/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useVoiceMessage } from "@/app/context/VoiceMessageContext";
import { micAnalyzer } from "@/app/lib/voice-speech/mic_analyzer";
import { openMic, stopMic } from "@/app/lib/voice-speech/microphone";
import { recorder } from "@/app/lib/voice-speech/recorder";
import { BiSend } from "react-icons/bi";
import { IoTrashBinOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import Amplifier from "../amplifier";
import { useElapsedTime } from "@/app/hooks/useHooks";
import { BsPauseFill } from "react-icons/bs";

export default function VoiceRecorder({
  setActiveFeature,
  onClick,
  maxRecLength = "05",
}: {
  setActiveFeature: React.Dispatch<React.SetStateAction<string>>;
  onClick: (btn: string) => void;
  maxRecLength?: "05" | "10" | "15";
}) {
  const {
    streamRef,
    chunksRef,
    mediaRecorderRef,
    animationRef,
    analyserRef,
    blobRef,
    audioCtxRef,
    setSpike,
    setRecording,
    setAudio,
    recording,
    spike,
    pause,
    setPause,
    audio,
    blob,
    setBlob,
  } = useVoiceMessage();

  const start = async () => {
    streamRef.current = await openMic();
    setRecording(true);
    const mediaRecorder = await recorder(streamRef, chunksRef);
    mediaRecorderRef.current = mediaRecorder;
    if (!mediaRecorder) return;
    await micAnalyzer(
      streamRef,
      animationRef,
      analyserRef,
      audioCtxRef,
      setSpike
    );
    mediaRecorder.start();
  };

  const finished_up = async () => {
    await stopMic(
      chunksRef,
      streamRef,
      mediaRecorderRef,
      blobRef,
      setRecording,
      setAudio,
      setBlob
    );
    stop();
  };

  const stop = () => {
    if (!streamRef.current) return;
    streamRef.current.getTracks().forEach((track) => track.stop());
    cancelAnimationFrame(animationRef.current);
    analyserRef.current?.disconnect();

    if (audioCtxRef.current) {
      audioCtxRef.current?.close();
    }
    setActiveFeature("");
  };

  const pauseRecording = async () => {
    mediaRecorderRef.current?.pause();
    // await finished_up();
    setPause(true);
    // setRecording(false);
  };

  const resumeRecording = () => {
    mediaRecorderRef.current?.resume();

    setPause(false);
  };

  const elapsedTime = useElapsedTime(recording) ?? "00:00";
  const [length, setLength] = useState<string>("00:15");

  useEffect(() => {
    if (pause) return;
    const modifiedTime = elapsedTime.slice(3);
    setLength(elapsedTime);

    if (modifiedTime >= maxRecLength + 1) {
      pauseRecording();
      setRecording(false);
    }
  }, [elapsedTime]);
  useEffect(() => {
    start();
    setPause(false);

    return () => {
      setLength("00:00");
      setRecording(false);
      setAudio(null);
    };
  }, []);
  return (
    <div className="gap-2 flex  justify-between items-center outline-none focus-ring-0  w-full border border-[var(--pattern_2)] p-2 rounded-xl custom-scrollbar-y">
      {/* {recording ? "Stop Recording" : "Start Recording"} */}
      {/* {spike} */}
      <IoTrashBinOutline
        // size={size}
        onClick={stop}
        size={30}
        className="bg-gray-700 p-1.5 flex-shrink-0 rounded-full text-white hover:cursor-pointer hover:bg-gray-800 transition-all"
        // className={iconStyles}
      />

      <div
        className={`p-1 w-3 h-3 flex-shrink-0 ${
          !pause ? "animate-pulse" : " "
        } bg-red-500 rounded-full`}
      ></div>
      <p>{length}</p>

      {recording && <Amplifier spike={spike} />}
      {/* {!pause && (
        <BsPauseFill
          // size={size}
          onClick={() => {
            pauseRecording();
          }}
          size={25}
          className="bg-gray-700 p-1.5 flex-shrink-0 rounded-full text-white hover:cursor-pointer hover:bg-gray-800 transition-all"
        />
      )} */}

      <BiSend
        onClick={async () => {
          await finished_up(); // Now this actually waits for blob
          onClick("send");
        }}
        size={30}
        className="bg-green-700 p-1.5 flex-shrink-0 rounded-full text-white hover:cursor-pointer hover:bg-green-800 transition-all"
      />
      {!recording && audio && <audio src={audio} controls />}
      {/* <p>Live mic spike: {spike}</p> */}
    </div>
  );
}
