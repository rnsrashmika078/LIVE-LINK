"use client";
import { useState } from "react";
import { Button } from "@/app/component/ui/button";

const PlayWrite = () => {
  const [message, setMessage] = useState("");

  const handleClick = () => {
    new Promise((resolve) => setTimeout(resolve, 5000));

    setMessage("Button clicked!");
  };

  return (
    <div>
      <Button id="clickButton" onClick={handleClick}>
        CLICK HERE
      </Button>
      <p id="output">{message}</p>
    </div>
  );
};

export default PlayWrite;
