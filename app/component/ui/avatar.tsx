import React from "react";
import Image from "next/image";

const Avatar = ({
    image,
    width = 12,
    height = 12,
}: {
    width?: number;
    height?: number;
    image: string;
}) => {
    const dynamicClass = `bg-[var(--pattern_5)] border border-[var(--pattern_4)] w-${width} h-${height} object-cover rounded-full shadow-0`;

    return (
        <Image
            src={image || "/no_avatar2.png"}
            alt="profile image"
            width={width * 4}
            className={dynamicClass}
            height={height * 4}
        />
    );
};

export default Avatar;
