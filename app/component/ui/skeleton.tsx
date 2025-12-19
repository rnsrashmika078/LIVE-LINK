import React from "react";

const Skeleton = () => {
  return (
    <div className="animate-pulse p-4 space-y-4">
      {/* Header */}
      <div className="h-6 w-3/5 bg-gray-300 rounded"></div>

      {/* Message bubbles */}
      <div className="space-y-2">
        <div className="h-4 w-4/5 bg-gray-300 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-300 rounded self-end"></div>
        <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-300 rounded self-end"></div>
      </div>

      {/* Input box */}
      <div className="h-10 w-full bg-gray-300 rounded mt-4"></div>
    </div>
  );
};

export default Skeleton;
