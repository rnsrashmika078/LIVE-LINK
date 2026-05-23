export async function recorder(
  streamRef: React.RefObject<MediaStream | null>,
  chunksRef: React.RefObject<Blob[]>
): Promise<MediaRecorder | null> {
  if (!streamRef || !streamRef.current) {
    return null;
  }
  // Recorder
  const mediaRecorder = new MediaRecorder(streamRef.current);
  //   mediaRecorderRef.current = mediaRecorder;
  chunksRef.current = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunksRef.current.push(e.data);
  };

  return mediaRecorder;
}
