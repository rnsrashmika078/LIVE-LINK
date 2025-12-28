"use client";
import React, { ReactNode, useState } from "react";
import { BiArrowBack } from "react-icons/bi";

const AiLayout = ({ children }: { children: ReactNode }) => {
  const [back, setBack] = useState<boolean>(true);

  const style = back ? "w-0 sm:w-[300px]" : "w-full sm:w-[300px]";

  return (
    <div className={`${style} bg-yellow-700 absolute px-15 z-[90] h-full`}>
      <div className="p-5 absolute">
        <BiArrowBack onClick={() => setBack((prev) => !prev)} />
      </div>
      {children}
    </div>
  );
};

export default AiLayout;
