import { createContext, useContext, useRef, useState } from "react";

type VMCType = {
  mediaRecorderRef: React.RefObject<MediaRecorder | null>;
  chunksRef: React.RefObject<Blob[]>;
  audioCtxRef: React.RefObject<AudioContext | null>;
  analyserRef: React.RefObject<AnalyserNode | null>;
  animationRef: React.RefObject<number>;
  streamRef: React.RefObject<MediaStream | null>;
  blobRef: React.RefObject<Blob | null>;
  audio: string | null;
  setAudio: React.Dispatch<React.SetStateAction<string | null>>;
  recording: boolean;
  setRecording: React.Dispatch<React.SetStateAction<boolean>>;
  pause: boolean;
  setPause: React.Dispatch<React.SetStateAction<boolean>>;
  spike: number;
  setSpike: React.Dispatch<React.SetStateAction<number>>;
  blob: Blob | null;
  setBlob: React.Dispatch<React.SetStateAction<Blob | null>>;
};

export const VoiceMessageContext = createContext<VMCType | null>(null);

export const VoiceMessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const blobRef = useRef<Blob | null>(null);
  const [audio, setAudio] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [pause, setPause] = useState<boolean>(false);

  const [recording, setRecording] = useState(false);
  const [spike, setSpike] = useState(0);

  return (
    <VoiceMessageContext.Provider
      value={{
        mediaRecorderRef,
        chunksRef,
        audioCtxRef,
        analyserRef,
        animationRef,
        streamRef,
        blob,
        setBlob,
        audio,
        setAudio,
        recording,
        setRecording,
        spike,
        setSpike,
        pause,
        setPause,
        blobRef,
      }}
    >
      {children}
    </VoiceMessageContext.Provider>
  );
};

export function useVoiceMessage() {
  const context = useContext(VoiceMessageContext);
  if (!context) {
    throw new Error(
      "useVoiceMessage must be used within a VoiceMessageProvider"
    );
  }
  return context;
}
