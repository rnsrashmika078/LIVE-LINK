"use client";
import React from "react";
import Image from "next/image";

const Avatar = React.memo(
  ({
    image,
    width = 10,
    height = 10,
    border,
  }: {
    width?: number;
    height?: number;
    image: string;
    border?: string;
  }) => {
    const dynamicClass = `flex-shrink-0 bg-[var(--pattern_5)] border border-[var(--pattern_4)] object-cover rounded-full shadow-0`;

    return (
      <Image
        src={image || "/no_avatar2.png"}
        alt="profile image"
        width={width * 4}
        className={`${dynamicClass} ${border}`}
        height={height * 4}
        style={{
          width: `${width * 4}px`,
          height: `${height * 4}px`,
          borderRadius: "9999px",
        }}
      />
    );
  }
);
Avatar.displayName = "Avatar";
export default Avatar;
