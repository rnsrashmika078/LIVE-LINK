import { FileType } from "../types";
import { apiFetch } from "../helper/helper";

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
    "https://api.cloudinary.com/v1_1/dwcjokd3s/auto/upload",
    "POST",
    data,
    "EXTERNAL"
  );

  const result = await res.json();

  if (result) {
    const payload = {
      public_id: result.public_id,
      name: result.display_name,
      url: result.secure_url,
      format: result.format,
    };

    return payload;
  }
  return null;
}
