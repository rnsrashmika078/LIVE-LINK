import Image from "next/image";
import { FaFilePdf } from "react-icons/fa6";
import { Button } from "./button";
import { PreviewDataType } from "@/app/types";
import React from "react";
import Spinner from "./spinner";

interface FileShareProp {
  isDragging: boolean;
  isUploading: boolean;
  preview: PreviewDataType | null;
  setPreview: React.Dispatch<React.SetStateAction<PreviewDataType | null>>;
}
export const FileShare = React.memo(
  ({ isDragging, preview, isUploading, setPreview }: FileShareProp) => {
    return (
      <div
        className={` ${
          isDragging
            ? "absolute flex-col  top-0 left-0 pointer-events-none flex items-center justify-center w-full h-full border-gray-300 border-dashed backdrop-blur-2xl  "
            : "absolute flex-col top-0 left-0 pointer-events-none flex items-center justify-center w-full h-full  "
        }  `}
      >
        {preview?.url && (
          <>
            <div
              className={`absolute flex-col  top-0 left-0 pointer-events-auto flex items-center justify-center w-full h-full border-gray-300 border-dashed backdrop-blur-2xl ${
                isUploading ? "animate-pulse " : " "
              }`}
            >
              {preview?.type.startsWith("image/") && (
                <>
                  <Image
                    src={preview.url ?? "/12.png"}
                    alt="upload Image"
                    width={500}
                    height={500}
                    className="object-contain"
                  ></Image>
                </>
              )}
              {preview?.type === "application/pdf" && (
                <>
                  <div className="flex flex-col justify-center items-center">
                    <p className="text-red-600 font-semibold">
                      <FaFilePdf size={200} /> PDF
                    </p>
                    <span>{preview.name}</span>
                    {/* <iframe src={preview.url!} className="w-full h-full border" /> */}
                  </div>
                </>
              )}

              <div className="absolute right-8 top-3">
                <Button onClick={() => setPreview(null)}>X</Button>
              </div>
              <Spinner
                condition={isUploading}
                heading="Uploading...Please Wait"
              />
            </div>
            <div className="absolute right-8 top-3">
              <Button onClick={() => setPreview(null)}>X</Button>
            </div>
          </>
        )}

        {isDragging && (
          <>
            <div className="text-6xl">📁</div>
            <p className="text-xl font-semibold">Drop your file here</p>
            <p className="text-sm mt-2 opacity-80">Release to upload</p>
          </>
        )}
      </div>
    );
  }
);

FileShare.displayName = "FileShare";
