/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
import { Message, RelativePositionType, SessionInfo } from "../types";

type ActionMenuSelectionType = {
  selection: string;
  message: Message | null;
};
interface LiveLinkContextType {
  openModal: boolean;
  setOpenModal: (state: boolean) => void;

  actionMenuSelection: { selection: string; message: Message | null };
  setActionMenuSelection: (data: ActionMenuSelectionType) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  id: string;
  setId: (id: string) => void;
  setOnSelect: (value: string) => void;
  onSelect: string;
  clickedIcon: string;
  featureActive: boolean;
  setFeatureActive: (state: boolean) => void;
  setClickedIcon: (name: string) => void;
  internalClickState: string;
  setInternalClickState: (name: string) => void;
  setConnectionState: (state: boolean) => void;
  connectionState: boolean;
  relativePosition: RelativePositionType;
  setRelativePosition: (relativePosition: RelativePositionType) => void;
  setIsActive: (state: string) => void;
  isActive: string;
  dynamic: string;
  setDynamic: React.Dispatch<React.SetStateAction<string>>;
  scheduleActivate: boolean;
  setScheduleActivate: React.Dispatch<React.SetStateAction<boolean>>;

  //agent task
  agentTask: string;
  setAgentTask: React.Dispatch<React.SetStateAction<string>>;

  //refs
  localAudioRef: React.RefObject<HTMLAudioElement | null>;
  remoteAudioRef: React.RefObject<HTMLAudioElement | null>;
  pcRef: React.RefObject<RTCPeerConnection | null>;
  channelRef: React.RefObject<any>;
  pendingCandidatesRef: React.RefObject<RTCIceCandidateInit[]>;
  sdpRef: React.RefObject<RTCSessionDescriptionInit | null>;
  currentPC: React.RefObject<RTCPeerConnection | null>;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  countRef: React.RefObject<Record<string, number>>;
  chatRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  //has incoming call
  setSessionInfo: (data: SessionInfo | null) => void;
  sessionInfo: SessionInfo | null;
}

//create context to share states
export const LiveLinkContext = createContext<LiveLinkContextType | null>(null);

export const LiveLink = ({ children }: { children: ReactNode }) => {
  const [currentTab, setCurrentTab] = useState<string>("chats");
  const [actionMenuSelection, setActionMenuSelection] =
    useState<ActionMenuSelectionType>({ selection: " ", message: null });
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [onSelect, setOnSelect] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [clickedIcon, setClickedIcon] = useState<string>("");
  const [featureActive, setFeatureActive] = useState<boolean>(false);
  const [internalClickState, setInternalClickState] = useState<string>("chats");
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [dynamic, setDynamic] = useState<string>("");
  const [agentTask, setAgentTask] = useState<string>("");
  const [scheduleActivate, setScheduleActivate] = useState<boolean>(false);

  const [relativePosition, setRelativePosition] =
    useState<RelativePositionType>({ top: 0, left: 0 });
  const [connectionState, setConnectionState] = useState<boolean>(
    typeof window !== "undefined" ? navigator.onLine : true
  );
  const [isActive, setIsActive] = useState<string>("");
  // const [filter,setFilter] = useState<{}

  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const pcRef = useRef<RTCPeerConnection>(null);
  const currentPC = useRef<RTCPeerConnection>(null);
  const channelRef = useRef<any>(null);
  const sdpRef = useRef<RTCSessionDescriptionInit | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const countRef = useRef<Record<string, number>>({});
  const chatRefs = useRef<Record<string, HTMLDivElement | null>>({});
  return (
    <LiveLinkContext.Provider
      value={{
        isActive,
        featureActive,
        setFeatureActive,
        setIsActive,
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
        scheduleActivate,
        setScheduleActivate,

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
        countRef, // this use to keep track of the unread count

        //agent refs
        chatRefs,

        //incoming call status
        setSessionInfo,
        sessionInfo,

        //connection status
        setConnectionState,
        connectionState,

        //relative position
        relativePosition,
        setRelativePosition,

        //current active tab
        currentTab,
        setCurrentTab,

        //action menu selection
        setActionMenuSelection,
        actionMenuSelection,

        //use to go back and forth in chats  (open close -> )
        dynamic,
        setDynamic,

        //perform agent tasks
        agentTask,
        setAgentTask,
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
