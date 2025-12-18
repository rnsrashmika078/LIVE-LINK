/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
import { RelativePositionType, SessionInfo } from "../types";

interface LiveLinkContextType {
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
  id: string;
  setId: (id: string) => void;
  setOnSelect: (value: string) => void;
  onSelect: string;
  clickedIcon: string;
  setClickedIcon: (name: string) => void;
  internalClickState: string;
  setInternalClickState: (name: string) => void;
  uid: string | null;
  setUid: React.Dispatch<React.SetStateAction<string | null>>;
  setConnectionState: (state: boolean) => void;
  connectionState: boolean;
  relativePosition: RelativePositionType;
  setRelativePosition: (relativePosition: RelativePositionType) => void;

  //refs
  localAudioRef: React.RefObject<HTMLAudioElement | null>;
  remoteAudioRef: React.RefObject<HTMLAudioElement | null>;
  pcRef: React.RefObject<RTCPeerConnection | null>;
  channelRef: React.RefObject<any>;
  pendingCandidatesRef: React.RefObject<RTCIceCandidateInit[]>;
  sdpRef: React.RefObject<RTCSessionDescriptionInit | null>;
  currentPC: React.RefObject<RTCPeerConnection | null>;
  audioRef: React.RefObject<HTMLAudioElement | null>;

  //has incoming call
  setSessionInfo: (data: SessionInfo | null) => void;
  sessionInfo: SessionInfo | null;
}

//create context to share states
export const LiveLinkContext = createContext<LiveLinkContextType | null>(null);

export const LiveLink = ({ children }: { children: ReactNode }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [onSelect, setOnSelect] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [clickedIcon, setClickedIcon] = useState<string>("");
  const [internalClickState, setInternalClickState] = useState<string>("chats");
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [relativePosition, setRelativePosition] =
    useState<RelativePositionType>({ top: 0, left: 0 });
  const [connectionState, setConnectionState] = useState<boolean>(
    typeof window !== "undefined" ? navigator.onLine : true
  );
  // const [filter,setFilter] = useState<{}

  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const pcRef = useRef<RTCPeerConnection>(null);
  const currentPC = useRef<RTCPeerConnection>(null);
  const channelRef = useRef<any>(null);
  const sdpRef = useRef<RTCSessionDescriptionInit | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <LiveLinkContext.Provider
      value={{
        openModal,
        setOpenModal,
        onSelect,
        setOnSelect,
        id, // this current click message id ( custom Id )
        setId, // this is the setter of current click message id
        clickedIcon, // global icon click for message panel ( audio , video )
        setClickedIcon,
        setInternalClickState,
        internalClickState,
        //global icon click setter for message panel ( audio , video )
        //refs
        localAudioRef,
        remoteAudioRef,
        pcRef,
        channelRef,
        pendingCandidatesRef,
        sdpRef,
        currentPC,
        audioRef,

        //incoming call status
        setSessionInfo,
        sessionInfo,

        //connection status
        setConnectionState,
        connectionState,

        //relative position
        relativePosition,
        setRelativePosition,

        setUid,
        uid,
      }}
    >
      {children}
    </LiveLinkContext.Provider>
  );
};

export const useLiveLink = () => {
  const context = useContext(LiveLinkContext);
  if (!context) {
    throw new Error("Must be use in under the LiveLink Layout");
  }
  return context;
};
export default LiveLink;
