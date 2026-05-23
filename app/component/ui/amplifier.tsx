/* eslint-disable react-hooks/set-state-in-effect */
import { useElapsedTime } from "@/app/hooks/useHooks";
import React, { useEffect, useRef, useState } from "react";

const Amplifier = ({ spike }: { spike: number }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [frequencyArray, setFrequencyArray] = useState<number[]>([]);

  useEffect(() => {
    const level = Math.min(Math.max((spike / 255) * 100, 2), 100);
    setFrequencyArray((prev) => [...prev.slice(-100), level]); //append new level to the array
  }, [spike]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth;
    scrollRef.current?.scrollTo({
      left: el.scrollWidth,
      behavior: "smooth",
    });
  }, [frequencyArray]);

  useEffect(() => {
    return () => {
      setFrequencyArray([]);
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex items-center gap-x-0.5 md:gap-x-1  w-full h-16 transition-all overflow-x-auto no-scrollbar"
    >
      {/* {spikes} */}
      {frequencyArray.map((lvl, i) => (
        <div
          key={i}
          className="bg-green-700 w-full rounded-xs"
          style={{ height: `${lvl}px` }}
        ></div>
      ))}
    </div>
  );
};

export default Amplifier;
