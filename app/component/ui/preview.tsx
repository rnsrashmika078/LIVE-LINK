import Image from "next/image";
import { Button } from "./button";
import { PreviewDataType } from "@/app/types";
import React from "react";

interface FileShareProp {
  isDragging: boolean;
  preview: PreviewDataType | null;
  setFile: React.Dispatch<React.SetStateAction<File | Blob | null>>;
  setPreview: React.Dispatch<React.SetStateAction<PreviewDataType | null>>;
}
export const FileShare = React.memo(
  ({ isDragging, preview, setPreview, setFile }: FileShareProp) => {
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
              className={`absolute flex-col  top-0 left-0 pointer-events-auto flex items-center justify-center w-full h-full border-gray-300 border-dashed backdrop-blur-2xl `}
            >
              {preview?.type.startsWith("image/") && (
                <>
                  <Image
                    src={preview.url ?? "/12.png"}
                    alt="upload Image"
                    width={450}
                    height={450}
                    className="object-contain w-[450px] h-[450px]"
                  ></Image>
                </>
              )}
              {preview?.type === "application/pdf" && (
                <>
                  <div className="flex flex-col justify-center items-center w-[calc(100%-2rem)] h-[calc(100%-8rem)]">
                    <iframe
                      src={preview.url!}
                      className="w-full h-full border"
                    />
                    {/* <span>{preview.name}</span> */}
                  </div>
                </>
              )}
              {preview?.type?.startsWith("video") && (
                <>
                  <div className="flex flex-col justify-center items-center w-[calc(100%-2rem)] h-[calc(100%-8rem)]">
                    <iframe
                      src={preview.url!}
                      className="w-full h-full border"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="absolute pointer-events-auto right-8 top-18">
              <Button
                variant="danger"
                radius="md"
                onClick={() => {
                  setPreview(null);
                  setFile(null);
                }}
              >
                X
              </Button>
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
