/* eslint-disable @typescript-eslint/no-explicit-any */
import { SessionInfo } from "@/app/types";
import { Session } from "inspector/promises";

//answer call
/**
 *
 * @param data **`pcRef`** **`sdp`**
 * @returns **`pcRef`** **`sdp`**
 */
export const answerCall = async (
  data: SessionInfo
): Promise<{
  candidates: React.RefObject<RTCIceCandidateInit[]>;
} | null> => {
  const pc = data.pcRef!.current;
  if (!pc) {
    console.error("No peer connection available");
    return null;
  }

  // Only set remote description if we're in the correct state
  if (pc.signalingState === "have-local-offer") {
    try {
      // setStatus(`Received answer from ${data.callFrom}`);
      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp!));

      // Process any pending ICE candidates
      const result = await processPendingCandidates(
        pc,
        data.pendingCandidatesRef!
      );

      if (!result) return null;

      const { pendingCandidatesRef } = result;

      return { candidates: pendingCandidatesRef };

      // setStatus("Connection established!");
    } catch (err: any) {
      console.error("Error setting remote description:", err);
      return null;
      // setStatus(`Error: ${err.message}`);
    }
  } else {
    console.warn(`Cannot set remote answer in state: ${pc.signalingState}`);
    // setStatus(`Wrong state: ${pc.signalingState}`);
    return null;
  }
};
