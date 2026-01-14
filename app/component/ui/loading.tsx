import { motion } from "framer-motion";
import React from "react";

const Loading = ({
  username,
  version = "2",
}: {
  username?: string;
  version?: "1" | "2" | "3";
}) => {
  const dot = {
    animate: { y: [-4, -8, -4] },
  };
  return (
    <div className="flex gap-2 items-end rounded-2xl">
      {version === "2" && (
        <>
          <div className="flex justify-center">
            {username && <p className="italic">{username + " is typing"}</p>}
          </div>
          {[0.5, 1, 1.5].map((delay, i) => (
            <motion.span
              key={i}
              variants={dot}
              animate="animate"
              transition={{
                repeat: Infinity,
                duration: 0.6,
                delay,
              }}
              className="flex w-1 h-1 bg-white rounded-full"
            ></motion.span>
          ))}
        </>
      )}
      {version === "3" && (
        <>
          {[0.5, 1, 1.5].map((delay, i) => (
            <motion.span
              key={i}
              variants={dot}
              animate="animate"
              transition={{
                repeat: Infinity,
                duration: 0.6,
                delay,
              }}
              className="flex w-2 h-2 bg-white rounded-full"
            ></motion.span>
          ))}
        </>
      )}
    </div>
  );
};

export default Loading;
