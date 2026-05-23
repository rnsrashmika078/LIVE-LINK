import React from "react";

interface ActiveFeatureProps {
  feature:
    | "image-gen-ll"
    | "video-gen-ll"
    | "audio-gen-ll"
    | "text-gen-ll"
    | "code-gen-ll"
    | "3d-gen-ll"
    | "data-gen-ll"
    | "model-gen-ll"
    | "multi-gen-ll"
    | "other-gen-ll"
    | null;
  active: boolean;
  onClickEvent?: (action: boolean) => void;
}
const ActiveFeature = React.memo(
  ({ feature, active, onClickEvent }: ActiveFeatureProps) => {
    if (feature && feature.includes("image-gen-ll") && active) {
      return (
        <div
          onClick={() => onClickEvent?.(feature ? true : false)}
          className="text-xs animate-pulse rounded-r-full absolute bg-gradient-to-r from-blue-900 via-blue-600 to-blue-500 flex justify-end items-end text-center bottom-15 left-20 p-2 cursor-pointer hover:scale-110 transition-all"
        >
          LIVE LINK AI
        </div>
      );
    }
    return null;
  }
);

ActiveFeature.displayName = "ActiveFeature";

export default ActiveFeature;
