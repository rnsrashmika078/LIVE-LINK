import Image from "next/image";
import { FaFilePdf } from "react-icons/fa6";
import React from "react";

export const MessageUI = React.memo(({ msg }: { msg: string }) => {
  if (!msg) return null;

  let parsed;
  try {
    parsed = JSON.parse(msg);
  } catch {
    return <p className="text-red-500">Invalid message</p>;
  }

  const { format, url, message } = parsed;

  const openFile = () => {
    if (url) window.open(url, "_blank");
  };

  // ---- FILE MESSAGES ----
  if (url) {
    const type = format?.toLowerCase() ?? "";

    // IMAGE
    if (type.includes("png") || type.includes("jpeg") || type.includes("jpg")) {
      return (
        <Image
          onClick={openFile}
          src={url}
          alt="uploaded image"
          width={150}
          height={150}
          className="object-contain w-[150px] h-[150px] cursor-pointer"
        />
      );
    }

    // PDF
    if (type.includes("pdf")) {
      return (
        <FaFilePdf
          size={50}
          onClick={openFile}
          className="cursor-pointer hover:scale-110 transition-all"
        />
      );
    }

    return <p className="text-gray-400 text-sm">Unsupported file</p>;
  }

  // ---- TEXT MESSAGE ----
  return (
    <div className="flex w-fit font-extralight mt-1">
      <p>{message}</p>
    </div>
  );
});

MessageUI.displayName = "MessageUI";
