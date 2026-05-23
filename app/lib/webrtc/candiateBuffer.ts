/**
 * The **`processPendingCandidates`** function responsible for assign the current buffering candidates to **`pendingCandidatesRef`** until the remote peer connect
 *
 * @param data  **`RTCPeerConnection`** **`pendingCandidatesRef`**
 * @description Destruct the **`data`** variable and assign the params: Ex: ***{ pcRef }***
 * @author **`Rashmika Siriwardhana`**
 */

const processPendingCandidates = async (
  pc: RTCPeerConnection,
  pendingCandidatesRef: React.RefObject<RTCIceCandidateInit[]>
): Promise<{
  pendingCandidatesRef: React.RefObject<RTCIceCandidateInit[]>;
} | null> => {
  if (pendingCandidatesRef.current.length > 0 && pc.remoteDescription) {
    
    for (const candidate of pendingCandidatesRef.current) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding pending candidate:", err);
      }
    }
    pendingCandidatesRef.current = [];
    return { pendingCandidatesRef };
  }

  return null;
};
