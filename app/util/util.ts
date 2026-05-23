import { FileType } from "../types";
import { apiFetch } from "../helper/helper";
import { v4 as uuidv4 } from "uuid";
export async function handleFileUpload(
  file: File | Blob | null = null,
  feature?: boolean,
  prompt?: string
): Promise<FileType | null> {
  if (feature && prompt != null) {
    const res = await apiFetch("/api/ai/image_gen", "POST", prompt); // ai gen image
    const result = res ? await res.json() : null;
    const id = uuidv4();
    const payload = {
      public_id: id,
      name: "ai_generated_image",
      url: result.output,
      format: "png",
    };
    return payload;
  }
  if (file != null) {
    // user upload image // pdf // doc //
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
    if (!res || !res.ok) return null;
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
  }

  return null;
}

export async function handleAudioUpload(
  file: Blob | null = null,
  feature?: boolean,
  prompt?: string
): Promise<FileType | null> {
  if (feature && prompt != null) {
    const res = await apiFetch("/api/ai/image_gen", "POST", prompt);
    const result = res ? await res.json() : null;
    const id = uuidv4();
    const payload = {
      public_id: id,
      name: "ai_generated_image",
      url: result.output,
      format: "png",
    };
    return payload;
  }
  if (file != null) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "LiveLink");
    data.append("cloud_name", "dwcjokd3s");
    data.append("folder", "LiveLink/uploads");
    // data.append("file", file, "audio.mp3");

    const res = await apiFetch(
      "https://api.cloudinary.com/v1_1/dwcjokd3s/auto/upload", // auto means any : video image
      "POST",
      data,
      "EXTERNAL"
    );
    if (!res || !res.ok) return null;
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
  }

  return null;
}
