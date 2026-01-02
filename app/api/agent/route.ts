import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const prompt = await req.json();

    console.log("prompt", prompt);
    if (!prompt) return NextResponse.json({ message: "prompt not found" });
    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: process.env.HF_TOKEN,
    });

    const chatCompletion = await client.chat.completions.create({
      model: "zai-org/GLM-4.7:novita",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // const text = output.content;
    const text = chatCompletion.choices[0].message.content;

    return NextResponse.json({
      message: "success",
      output: text,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      message: err,
    });
  }
}
