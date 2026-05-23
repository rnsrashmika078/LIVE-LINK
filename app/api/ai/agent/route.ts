import { NextRequest, NextResponse } from "next/server";
import Bytez from "bytez.js";

export async function POST(req: NextRequest) {
  try {
    const prompt = await req.json();

    const key = process.env.BYTEZ!;
    const sdk = new Bytez(key);

    const model = sdk.model("deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B")

    const { error, output } = await model.run([
      {
        role: "user",
        content: prompt,
      },
    ]);

    return NextResponse.json({
      message: "success",
      output: output.content,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      message: err,
    });
  }
}
