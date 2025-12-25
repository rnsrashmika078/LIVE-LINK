export async function micAnalyzer(
  streamRef: React.RefObject<MediaStream | null>,
  animationRef: React.RefObject<number | null>,
  analyserRef: React.RefObject<AnalyserNode | null>,
  audioCtxRef: React.RefObject<AudioContext | null>,
  setSpike: React.Dispatch<React.SetStateAction<number>>
) {
  if (!streamRef || !streamRef.current) return;
  const audioCtx = new AudioContext();
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;

  const source = audioCtx.createMediaStreamSource(streamRef.current);
  source.connect(analyser);

  audioCtxRef.current = audioCtx;
  analyserRef.current = analyser;

  const dataArray = new Uint8Array(analyser.frequencyBinCount); // store in bits for analysis

  const update = () => {
    analyser.getByteFrequencyData(dataArray);
    const peak = Math.max(...dataArray);
    setSpike(peak); // live mic spike
    animationRef.current = requestAnimationFrame(update);
  };

  update();

}
