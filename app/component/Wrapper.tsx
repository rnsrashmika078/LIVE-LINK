import React, { ReactNode } from "react";

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        alert("YES");
      }}
    >
      {children}
    </div>
  );
};

export default Wrapper;
