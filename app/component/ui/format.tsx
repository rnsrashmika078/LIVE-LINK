import React from "react";
import { FaFilePdf } from "react-icons/fa6";
import Image from "next/image";
interface FormatProps {
  id: string;
  url: string;
  format: string;
  message: string;
}
const MessageFormat = React.memo(
  ({ id, url, format, message }: FormatProps) => {
    const openFile = () => {
      if (url) window.open(url, "_blank");
    };
    const renderFile = () => {
      if (url) {
        const type = format?.toLowerCase() ?? "";
        // IMAGE
        if (
          type.includes("png") ||
          type.includes("jpeg") ||
          type.includes("jpg") ||
          type.includes("avif")
        ) {
          return (
            <Image
              src={url}
              alt="uploaded image"
              width={200}
              onClick={openFile}
              height={200}
              className="object-contain w-[200px] h-[200px] cursor-pointer"
            />
          );
        }
        // VIDEO
        if (
          type.includes("mp4") ||
          type.includes("ogg") ||
          type.includes("webm")
        ) {
          return (
            <video
              src={url}
              controls
              className="object-contain w-[250px] h-[250px] cursor-pointer"
              width={250}
              onClick={openFile}
              height={250}
            ></video>
          );
        }

        // PDF
        if (type.includes("pdf")) {
          return (
            <FaFilePdf
              onClick={openFile}
              size={50}
              className="cursor-pointer hover:scale-110 transition-all"
            />
          );
        }

        return <p className="text-gray-400 text-sm">Unsupported file</p>;
      }
      return <p className=" w-fit font-extralight">{message}</p>;
    };
    return <div className="">{renderFile()}</div>;
  }
);

MessageFormat.displayName = "MessageFormat";

export default MessageFormat;
