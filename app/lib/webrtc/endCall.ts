import { SessionInfo } from "@/app/types";
import { cleanupConnection } from "./cleanupConnection";
/**
 * The **`endCall`** function execute the end call functionality and clean-ups and successfully dismantle the connections and return success as boolean.
 * @param data ***refs*** - **`callFrom`**  **`callTo`** **`callEndBy`** **`pcRef`**  **`pendingCandidatesRef`** **`localAudioRef`** **`remoteAudioRef`**
 * @description Destruct the **`data`** variable and assign the params: ***`{ data.pcRef, data.pendingCandidatesRef, }`***
 * @access ***`{ socket,callFrom:data.callFrom, callTo:data.callTo,callEndBy:data.callEndBy,pcRef:data.pcRef, pendingCandidatesRef:data.pendingCandidatesRef, localAudioRef:data.localAudioRef,remoteAudioRef:data.remoteAudioRef }`***
 * @author **`Rashmika Siriwardhana`**
 */
export const endCall = async (data: SessionInfo) => {
  if (!data.socket) {
    return;
  }
  data.socket.emit("call-ended", {
    callEndBy: data.callEndBy,
    callFrom: data.callFrom,
    callTo: data.callTo,
    callerDp: data.callerDp,
    callerName: data.callerName,
  });
  cleanupConnection({
    pcRef: data.pcRef,
    pendingCandidatesRef: data.pendingCandidatesRef,
    localAudioRef: data.localAudioRef,
    remoteAudioRef: data.remoteAudioRef,
  });
};
