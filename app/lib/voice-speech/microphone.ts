

export async function openMic(): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  return stream;
}
export async function stopMic(
  chunksRef: React.RefObject<Blob[]>,
  streamRef: React.RefObject<MediaStream | null>,
  mediaRecorderRef: React.RefObject<MediaRecorder | null>,
  blobRef: React.RefObject<Blob | null>,
  setRecording: React.Dispatch<React.SetStateAction<boolean>>,
  setAudio: React.Dispatch<React.SetStateAction<string | null>>,
  setBlob: React.Dispatch<React.SetStateAction<Blob | null>>
): Promise<void> {
  return new Promise((resolve) => {
    if (!mediaRecorderRef.current || !streamRef.current) {
      resolve();
      return;
    }

    setRecording(false);
    
    mediaRecorderRef.current.onstop = async () => {
      const chunks = chunksRef.current;
      if (chunks.length === 0) {
        resolve();
        return;
      }

      const blob = new Blob(chunks, { type: "audio/webm" });
      setAudio(URL.createObjectURL(blob));
      setBlob(blob);
      blobRef.current = blob;
      chunksRef.current = [];
      
      resolve(); // ← Resolve after blob is set
    };

    mediaRecorderRef.current.stop();
  });
}
