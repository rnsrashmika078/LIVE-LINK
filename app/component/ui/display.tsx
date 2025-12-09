import Image from "next/image";
import { FaFilePdf } from "react-icons/fa6";
import { Button } from "./button";
import { PreviewDataType } from "@/app/types";
import React from "react";
export const Display = React.memo(({ msg }: { msg: string }) => {
  const { format, url } = JSON.parse(msg);

  const openPDF = () => {
    window.open(url, "_blank");
  };
  const openImage = () => {
    window.open(url, "_blank");
  };
  if (url) {
    if (
      String(format).includes("png") ||
      String(format).includes("jpeg") ||
      String(format).includes("jpg")
    ) {
      return (
        <Image
          onClick={openImage}
          src={url ?? "/12.png"}
          alt="upload Image"
          width={150}
          height={150}
          className="object-contain"
        ></Image>
      );
    } else if (String(format).includes("pdf")) {
      return (
        <div>
          <FaFilePdf
            size={50}
            onClick={openPDF}
            className="transition-all hover:scale-110 cursor-pointer"
          />
        </div>
      );
    }
  }
});

Display.displayName = "Display";

interface FileShareProp {
  handleDrop: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  isDragging: boolean;
  preview: PreviewDataType | null;
  setPreview: React.Dispatch<React.SetStateAction<PreviewDataType | null>>;
}
export const FileShare = React.memo(
  ({
    handleDrop,
    handleDragOver,
    onDragLeave,
    isDragging,
    preview,
    setPreview,
  }: FileShareProp) => {
    return (
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={onDragLeave}
        className={`   h-[150px] w-[calc(100%-1rem)] bottom-0 ${
          isDragging
            ? " block border-gray-300 border-dashed "
            : "absolute border-none "
        }  flex justify-center rounded-lg border px-6 py-1`}
      >
        {/* this whole thing replace with a functional component or a single function */}
        {preview?.type.startsWith("image/") && (
          <>
            <Image
              src={preview.url ?? "/12.png"}
              alt="upload Image"
              width={500}
              height={500}
              className="object-contain"
            ></Image>
            <div className="absolute right-8 top-3">
              <Button onClick={() => setPreview(null)}>X</Button>
            </div>
          </>
        )}
        {preview?.type === "application/pdf" && (
          <>
            <div className="flex flex-col w-full h-full items-center gap-2 p-2 border rounded-lg">
              <p className="text-red-600 font-semibold">
                <FaFilePdf size={50} /> PDF
              </p>
              <span>{preview.name}</span>
              {/* <iframe src={preview.url!} className="w-full h-full border" /> */}
            </div>
            <div className="absolute right-8 top-3">
              <Button onClick={() => setPreview(null)}>X</Button>
            </div>
          </>
        )}
      </div>
    );
  }
);
FileShare.displayName = "FileShare";
