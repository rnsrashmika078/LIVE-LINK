import { NextRequest, NextResponse } from "next/server";
import Bytez from "bytez.js";

export async function POST(req: NextRequest) {
  try {
    const prompt = await req.json();

    console.log("prompt", prompt);
    // if (!prompt) return NextResponse.json({ message: "prompt not found" });
    // const client = new OpenAI({
    //   baseURL: "https://router.huggingface.co/v1",
    //   apiKey: process.env.HF_TOKEN,
    // });

    // const chatCompletion = await client.chat.completions.create({
    //   model: "zai-org/GLM-4.7:novita",
    //   messages: [
    //     {
    //       role: "user",
    //       content: prompt,
    //     },
    //   ],
    // });

    // // const text = output.content;
    // const text = chatCompletion.choices[0].message.content;

    const key = process.env.BYTEZ!;
    const sdk = new Bytez(key);

    // choose gpt-oss-20b
    const model = sdk.model("deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B")

    // send input to model
    const { error, output } = await model.run([
      {
        role: "user",
        content: prompt,
      },
    ]);

    console.log("prompt", output);
    console.log("error", error);
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
