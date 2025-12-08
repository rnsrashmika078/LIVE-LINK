import { NextRequest, NextResponse } from "next/server";

import Message from "@/app/backend/models/Message";
//server_action.ts

export async function POST(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const formData = await req.formData();
    const { chatId } = await params;

    if (!formData || !chatId) {
      return NextResponse.json({
        status: 404,
        message: "file or chat not found!",
      });
    }

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dwcjokd3s/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const result = await response.json();
    if (result) {
      // url = result?.secure_url;
      // format = result?.format;
      // name = result?.display_name;
      // asset_id = result?.asset_id;
      // if (!url) {
      //   return NextResponse.json({
      //     status: 500,
      //     message: "error while uploading the image!",
      //   });
      // }
      //   updateDB = await Message.findOneAndUpdate(
      //     { chatId },
      //     { files: { format, url, name, asset_id } }
      //   );
      // }
      // if (!updateDB) {
      //   return NextResponse.json({
      //     status: 500,
      //     message: "error while update the database!",
      //   });
      // }
    }
    return NextResponse.json({
      // content: { url, name, asset_id, format },
      status: 200,
      message: "file uploaded successfully!",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "internal server error",
    });
  }
}
