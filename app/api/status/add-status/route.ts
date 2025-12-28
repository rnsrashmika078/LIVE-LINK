import Status from "@/app/backend/models/Status";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (data == null)
      return NextResponse.json(
        {
          success: false,
          message: "payload is empty!",
        },
        { status: 404 }
      );
    await Status.create(data);

    return NextResponse.json(
      {
        success: true,
        message: "Successfully added the new status",
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
