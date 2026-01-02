import Bytez from "bytez.js";
import { NextRequest, NextResponse } from "next/server";

const key = "ce5d679a11217de713cba56714d3a03d";
const sdk = new Bytez(key);
const stable_diffusion = sdk.model(
  "stable-diffusion-v1-5/stable-diffusion-v1-5"
);

export async function POST(req: NextRequest) {
  try {
    const prompt = await req.json();
    if (!prompt)
      return NextResponse.json({
        error: "Prompt required",
      });
    const { error, output } = await stable_diffusion.run(prompt);

    return NextResponse.json({
      error,
      output,
    });
  } catch (err) {
    console.log(err);
  }
}
// send input to model
// const prompt = await req.json();
// if (!prompt)
//   return NextResponse.json({
//     error: "Prompt required",
//   });

// const model = sdk.model("stabilityai/stable-diffusion-xl-base-1.0")

// const { error, output } = await model.run(prompt)