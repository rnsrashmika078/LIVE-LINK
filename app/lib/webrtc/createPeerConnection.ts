import { SessionInfo } from "@/app/types";
import { cleanupConnection } from "./cleanupConnection";
/**
 * The **`createPeerConnection`** function create a Peer connection and then send **`ICE`** to other end remote peer.
 * Then set the audio elements.
 * @param data ***refs*** - **`pcRef`**  **`localAudioRef`**  **`remoteAudioRef`**
 * @param data ***string*** - **`callFrom`**  **`callTo`**
 * @description Destruct the **`data`** variable and assign the params.
 * @access ***`{ callFrom:data.callFrom , callTo:data.callTo ,  pcRef:data.pcRef , localAudioRef:data.localAudioRef , remoteAudioRef:data.remoteAudioRef}`***
 * @author **`Rashmika Siriwardhana`**
 * */
export const createPeerConnection = async (
  data: SessionInfo
): Promise<RTCPeerConnection | null> => {
  if (
    !data.pcRef ||
    !data.localAudioRef?.current ||
    !data.remoteAudioRef?.current
  ) {
    return null;
  }

  const pcRef = data.pcRef;
  const localAudioRef = data.localAudioRef;
  const remoteAudioRef = data.remoteAudioRef;

  const pc = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  });

  pcRef.current = pc;

  // Get local audio
  const localStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });

  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

  localAudioRef.current!.srcObject = localStream;

  // Handle remote audio
  pc.ontrack = (event) => {
    // setStatus("Receiving remote audio!");
    remoteAudioRef.current!.srcObject = event.streams[0];
  };

  // Handle ICE candidates
  pc.onicecandidate = (event) => {
    if (event.candidate && data.socket) {
      data.socket.emit("ice-candidate", {
        callFrom: data.callFrom,
        callTo: data.callTo,
        candidate: event.candidate.toJSON(),
      });
    }
  };

  pc.onconnectionstatechange = () => {
    // setStatus(`Connection: ${pc.connectionState}`);

    if (pc.connectionState === "failed" || pc.connectionState === "closed") {
      cleanupConnection(data);
      return;
    }
  };

  pc.oniceconnectionstatechange = () => {};

  pc.onsignalingstatechange = () => {};

  return pc;
};
