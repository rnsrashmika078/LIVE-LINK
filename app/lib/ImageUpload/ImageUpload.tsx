"use Client";
import React, { SetStateAction, useEffect } from "react";
import { useState } from "react";
import Icons from "../Common/Icons";
import Loading from "../Loading/Loading";
import { Product } from "../../interface";
import { imageUpload } from "../../DbQuaries/API";
// import RenderIcon from "../svgIcons/RenderIcon";

interface param {
  setImageURL: React.Dispatch<SetStateAction<string | undefined>>;
  Pending: boolean;
  image: string | undefined;
  editing?: Product;
  placeholder?: string;
}

const ImageUpload: React.FC<param> = ({
  setImageURL,
  Pending,
  image,
  editing,
  placeholder,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDraging] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // const [url, setUrl] = useState<string | null>(() => {
  //   const image = localStorage.getItem("url");
  //   return image ? image : null;
  // });
  const [url, setUrl] = useState<string | null>();

  const handleImageUpload = async () => {
    if (!file) {
      return;
    }
    if (image) {
      return;
    }
    setLoading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "farmnest");
    data.append("cloud_name", "dwcjokd3s");
    data.append("folder", "Listing");
    const response = await imageUpload(data);
    const uploadedImageURL = await response.data;
    console.log(uploadedImageURL);
    if (uploadedImageURL) {
      {
        !editing && localStorage.setItem("url", uploadedImageURL.url);
      }

      setUrl(uploadedImageURL.url);
      setImageURL(uploadedImageURL.url);
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setFile(file);
  };

  useEffect(() => {
    if (file) {
      handleImageUpload();
    }
  }, [file]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setFile(file);
    setIsDraging(false);
    handleImageUpload();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraging(false);
  };

  useEffect(() => {
    if (image) {
      setUrl(image);
      if (!editing) {
        {
          localStorage.setItem("url", image);
        }
      }
    }
  }, [image]);

  // useEffect(() => {
  //   const image = localStorage.getItem("url");
  //   if (image && !editing) {
  //     setUrl(image);
  //   }
  // }, []);

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={onDragLeave}
        className={`${
          isDragging ? "bg-gray-100  border-dashed " : "border-gray-200"
        }  flex justify-center rounded-lg border px-6 py-1`}
      >
        <div className="text-center my-15">
          {url && !loading && (
            <img src={url} width={450} className="mb-2"></img>
          )}
          <div className={`flex flex-col text-sm/6 text-gray-600`}>
            {loading ? (
              <Loading borderNone={false} label={"Image Uploading.."} />
            ) : (
              <p>{file ? file.name : null}</p>
            )}
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
            >
              <span>{placeholder ? placeholder : "Upload Product Image "}</span>
              <input
                id="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileUpload}
              />
            </label>
            <p className="pl-1">or drag and drop Product Images</p>
          </div>

          <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>

      {/* {url && <img src={url}></img>} */}
    </div>
  );
};
export default ImageUpload;
