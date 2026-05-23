import Status from "@/app/backend/models/Status";
import cloudinary from "@/app/lib/cloudinary/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { statusId, public_id } = await req.json();

    if (!statusId && !public_id)
      return NextResponse.json(
        {
          success: false,
          message: "status id && public_id is missing!",
        },
        { status: 404 }
      );

    await Promise.all([Status.deleteOne({ statusId })]);

    if (public_id) {
      await cloudinary.uploader.destroy(public_id);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully deleted the status!",
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
