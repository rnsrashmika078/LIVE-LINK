import ImageGen from "@/app/component/ui/ai/image/ImageGen";
import React, { ReactNode } from "react";

const AiLayout = ({ children }: { children: ReactNode }) => {
  return <div className="w-full h-full">{children}</div>;
};

export default AiLayout;
