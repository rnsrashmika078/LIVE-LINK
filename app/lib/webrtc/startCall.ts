/* eslint-disable @typescript-eslint/no-explicit-any */
import { SessionInfo } from "@/app/types";
import { cleanupConnection } from "./cleanupConnection";
import { createPeerConnection } from "./createPeerConnection";

/**
 * The **`startCall`** function call to start the call and it return success or not as boolean.
 * @param data ***refs*** - **`pcRef`**  **`localAudioRef`**  **`remoteAudioRef`** **`socket`**
 * @param data ***string*** - **`callFrom`**  **`callTo`**
 * @description Destruct the **`data`** variable and assign the params.
 * @access ***`{ callFrom:data.callFrom , callTo:data.callTo ,  pcRef:data.pcRef , localAudioRef:data.localAudioRef , remoteAudioRef:data.remoteAudioRef , socket}`***
 * @author **`Rashmika Siriwardhana`**
 * */
export const startCall = async (data: SessionInfo) => {
  if (!data.callFrom || !data.callTo || !data.callerDp) {
    return;
  }

  // Clean up any existing connection
  cleanupConnection({
    pcRef: data.pcRef,
    pendingCandidatesRef: data.pendingCandidatesRef,
    localAudioRef: data.localAudioRef,
    remoteAudioRef: data.remoteAudioRef,
  });

  try {
    // setStatus("Starting call...");
    const pc = await createPeerConnection({
      callFrom: data.callFrom,
      callTo: data.callTo,
      pcRef: data.pcRef,
      localAudioRef: data.localAudioRef,
      remoteAudioRef: data.remoteAudioRef,
    });

    if (!pc) return;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    data.socket?.emit("call-initialize", {
      callFrom: data.callFrom,
      callTo: data.callTo,
      callerDp: data.callerDp,
      callerName: data.callerName,
      sdp: pc.localDescription?.toJSON(),
    });
  } catch (err: any) {
    console.error("Error starting call:", err);
    // setStatus(`Error: ${err.message}`);
    cleanupConnection({
      pcRef: data.pcRef,
      pendingCandidatesRef: data.pendingCandidatesRef,
      localAudioRef: data.localAudioRef,
      remoteAudioRef: data.remoteAudioRef,
    });
  }
};
