import React, { useEffect, useRef } from "react";

type VisualizerProps = {
  audioRef: React.RefObject<HTMLAudioElement>;
  audioURL: string;
};

export const Visualizer = ({ audioRef, audioURL }: VisualizerProps) => {
  
  return <audio ref={audioRef} src={audioURL} controls />;
};

export default Visualizer;
