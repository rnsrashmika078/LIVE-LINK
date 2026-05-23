import { useLiveLink } from "@/app/context/LiveLinkContext";
import { useClickFocus } from "@/app/hooks/useHooks";
import React, { useEffect, useRef } from "react";

const FilterSection = () => {
  const { setClickedIcon, relativePosition } = useLiveLink();
  const divRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={divRef}
      className="fixed z-[9999]"
      style={{
        top: relativePosition.top + 50,
        left: relativePosition.left,
      }}
    >
      <div className="flex rounded-xl border-b-2 shadow-md border-green-600 p-5 flex-col gap-2 px-5 justify-start items-center  sticky top-0 bg-[var(--pattern_2)]">
        <div className="flex justify-between w-full items-center">
          <h1 className="text-xs">Working on it</h1>
        </div>
      </div>
      <div className="p-5 flex flex-col w-auto gap-2 ">
        <h1 className="text-start text-[var(--pattern_4)] text-xs"></h1>
      </div>
    </div>
  );
};

export default FilterSection;
