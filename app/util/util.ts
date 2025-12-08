import { FileType } from "../types";
import { apiFetch } from "./helper";

export function formattedDate(createdAt: string) {
  const now = new Date(createdAt);
  const date = new Date();

  const difference = (now.getTime() - date.getTime()) / 1000;

  const days = Math.floor(difference / 86400);

  return days;
}

export async function handleImageUpload(file: File): Promise<FileType | null> {
  if (!file) {
    return null;
  }
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "LiveLink");
  data.append("cloud_name", "dwcjokd3s");
  data.append("folder", "LiveLink/uploads");

  const res = await apiFetch(
    "https://api.cloudinary.com/v1_1/dwcjokd3s/image/upload",
    "POST",
    data,
    "EXTERNAL"
  );

  const result = await res.json();
  console.log(result);

  if (result) {
    const payload = {
      asset_id: result.asset_id,
      name: result.display_name,
      url: result.secure_url,
      format: result.format,
    };

    return payload;
  }
  return null;
}
