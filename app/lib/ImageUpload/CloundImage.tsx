import React, { useEffect, useState } from "react";
import ImageUpload from "./ImageUpload";

const CloudImage = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };
  return (
    <div className="p-5">
      <ImageUpload />
    </div>
  );
};

export default CloudImage;
