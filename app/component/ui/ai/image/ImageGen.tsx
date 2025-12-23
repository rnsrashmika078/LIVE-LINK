"use client";
import React, { useState } from "react";
import Image from "next/image";
import { apiFetch } from "@/app/helper/helper";
import Input from "../../searcharea";
import { Button } from "../../button";
import { useElapsedTime } from "@/app/hooks/useHooks";
const ImageGen = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("idle");
  const time = useElapsedTime(status === "generating");

  const GenerateImage = async () => {
    if (!prompt) return;
    setStatus("generating");
    const res = await apiFetch("/api/ai/image_gen", "POST", prompt);
    const result = await res.json();
    setImage(result.output);
    setStatus("finished");
  };

  const handleOpen = () => {
    window.open(image!, "_blank");
  };
  //   alert(JSON.stringify(result));
  return (
    <div className="p-10 space-y-5">
      <div className="flex space-x-5">
        <Input onSearch={setPrompt} />
        <Button variant="eco" size="xs" onClick={GenerateImage}>
          Generate
        </Button>
      </div>
      {status === "generating" ? (
        <>
          <div className="w-[450px] h-[450px] bg-gray-600 animate-pulse"></div>
          <div>{time}</div>
        </>
      ) : image ? (
        <Image
          onClick={handleOpen}
          src={image ?? "/dog.png"}
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
