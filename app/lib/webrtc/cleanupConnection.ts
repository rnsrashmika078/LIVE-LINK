import { SessionInfo } from "@/app/types";
/**
 * The **`cleanupConnection`** function responsible for clean the current connection in **`pcRef`** and **`pendingCandidatesRef`** current values as well as the audio elements.
 * @param data ***refs*** - **`pcRef`**  **`pendingCandidatesRef`**  **`remoteAudioRef`** **`localAudioRef`**
 * @description Destruct the **`data`** variable and assign the params: ***`{ data.pcRef, data.pendingCandidatesRef, }`***
 * @access ***`{ pcRef:data.pcRef, pendingCandidatesRef:data.pendingCandidatesRef, localAudioRef:data.localAudioRef,remoteAudioRef:data.remoteAudioRef }`***
 * @author **`Rashmika Siriwardhana`**
 */

export const cleanupConnection = (data: SessionInfo) => {
  if (data.localAudioRef?.current?.srcObject) {
    const stream = data.localAudioRef?.current.srcObject as MediaStream;
    stream.getTracks().forEach((track) => {
      track.stop();
    });
    data.localAudioRef.current.srcObject = null;
  }

  if (data.remoteAudioRef?.current?.srcObject) {
    const stream = data.remoteAudioRef.current.srcObject as MediaStream;
    stream.getTracks().forEach((track) => {
      track.stop();
    });
    data.remoteAudioRef.current.srcObject = null;
  }

  if (data.pcRef?.current) {
    data.pcRef.current.getSenders().forEach((sender) => {
      if (sender.track) {
        sender.track.stop();
      }
    });

    data.pcRef.current.close();
    data.pcRef.current = null;
  }

  if (data.pendingCandidatesRef) {
    data.pendingCandidatesRef.current = [];
  }
};
