import React from "react";
import { FaFilePdf } from "react-icons/fa6";
import Image from "next/image";
import { SeenByType, SenderInfoType } from "@/app/types";
import { SenderNameStyle } from "@/app/helper/jsxhelper";
interface FormatProps {
  id?: string;
  url: string;
  format: string;
  info?: string;
  message: string;
  senderInfo?: SenderInfoType;

}
const MessageFormat = React.memo(
  ({ info, url, format, message, senderInfo }: FormatProps) => {
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
            <div className="place-items-start">
              <Image
                src={url}
                alt="uploaded image"
                width={200}
                onClick={openFile}
                height={200}
                className="object-contain w-[200px]  h-[200px] cursor-pointer"
              />
              <p className="mt-1 w-fit font-extralight">
                {info ? info : message}
              </p>
            </div>
          );
        }
        // VIDEO
        if (
          type.includes("mp4") ||
          type.includes("ogg") ||
          type.includes("webm")
        ) {
          return (
            <>
              <video
                src={url}
                controls
                className="object-contain w-[250px] h-[250px] cursor-pointer"
                width={250}
                onClick={openFile}
                height={250}
              ></video>
              <p className="mt-1 w-fit font-extralight">
                {info ? info : message}
              </p>
            </>
          );
        }

        // PDF
        if (type.includes("pdf")) {
          return (
            <>
              <FaFilePdf
                onClick={openFile}
                size={50}
                className="cursor-pointer hover:scale-110 transition-all"
              />
              <p className=" w-fit font-extralight">{info ? info : message}</p>
            </>
          );
        }

        return <p className="text-gray-400 text-sm">Unsupported file</p>;
      }

      return <p className=" w-fit font-extralight">{info ? info : message}</p>;
    };
    return (
      <div className="">
        {senderInfo?.senderName && (
          <SenderNameStyle name={senderInfo?.senderName ?? ""} />
        )}
        {renderFile()}{" "}
      </div>
    );
  }
);

MessageFormat.displayName = "MessageFormat";

export default MessageFormat;
