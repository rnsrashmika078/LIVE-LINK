/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useLiveLink } from "@/app/context/LiveLinkContext";
import { useClickFocus } from "@/app/hooks/useHooks";
import { IconArrayType } from "@/app/types";
import React, { useRef, useState } from "react";
import { IconType } from "react-icons/lib";

const AppIcons = ({
  iconArray,
  callback,
}: {
  iconArray: IconArrayType;
  callback: (icon: string) => void;
}) => {
  const { setRelativePosition } = useLiveLink();

  const iconRefs = useRef<Record<string, HTMLDivElement | null>>({}); // => [iconRef]: divElement

  const handleClick = (name: string) => {
    const ref = iconRefs.current[name];
    if (ref) {
      const { x, y, height, width } = ref.getBoundingClientRect();
      setRelativePosition({
        top: y,
        left: x,
      });
      callback(name);
    }
  };

  return (
    <div className="flex gap-4">
      {iconArray.map((item) => {
        const Icon: IconType = item.icon;
        return (
          <div
            key={item.name}
            //@ts-expect-error: ref typescript issue found!
            ref={(el) => (iconRefs.current[item.name] = el)}
          >
            <Icon
              onClick={() => {
                handleClick(item.name);
              }}
              size={30}
              className="hover:bg-[var(--pattern_5)] p-1 rounded-md"
            />
          </div>
        );
      })}
    </div>
  );
};

export default AppIcons;
