/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { apiFetch } from "@/app/helper/helper";
import Input from "../../searcharea";
import { Button } from "../../button";
import { useElapsedTime } from "@/app/hooks/useHooks";
const ImageGen = ({
  userPrompt,
  setGenURL,
}: {
  userPrompt: string;
  setGenURL: (ulr: string) => void;
}) => {
  // const [prompt, setPrompt] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("idle");
  const time = useElapsedTime(status === "generating");

  const GenerateImage = async () => {
    if (!userPrompt) return;
    setStatus("generating");
    const res = await apiFetch("/api/ai/image_gen", "POST", userPrompt);
    const result = await res.json();
    setImage(result.output);
    setGenURL(result.output);
    setStatus("finished");
  };

  useEffect(() => {
    if(!userPrompt) return;
    GenerateImage();
  }, [userPrompt]);

  const handleOpen = () => {
    window.open(image!, "_blank");
  };
  //   alert(JSON.stringify(result));
  return (
    <div className="z-[99] bottom-10 absolute right-0 p-10 space-y-5">
      {/* <div className="flex space-x-5">
        <Input onSearch={setPrompt} />
        <Button variant="eco" size="xs" onClick={GenerateImage}>
          Generate
        </Button>
      </div> */}
      {status !== "generating" ? (
        <>
          <div className="w-[200px] h-[200px] bg-gray-600 animate-pulse"></div>
          <div>{time}</div>
        </>
      ) : image ? (
        <img
          onClick={handleOpen}
          src={image ?? ""}
          width={450}
          height={450}
          alt="ai gen image"
        />
      ) : (
        <div></div>
      )}
      {/* <video src={image!} width={250} height={250} controls/> */}
    </div>
  );
};

export default ImageGen;
