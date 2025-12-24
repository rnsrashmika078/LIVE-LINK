import Bytez from "bytez.js";
import { NextRequest, NextResponse } from "next/server";

const key = "ce5d679a11217de713cba56714d3a03d";
const sdk = new Bytez(key);
const stable_diffusion = sdk.model(
  "stable-diffusion-v1-5/stable-diffusion-v1-5"
);
const zb_tech = sdk.model("ZB-Tech/Text-to-Image");
const video = sdk.model("Revanthraja/Text_to_Vision")
export async function POST(req: NextRequest) {
  try {
    console.log("Hit AI API")
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
/*
  npm i bytez.js || yarn add bytez.js
*/
/*
  npm i bytez.js || yarn add bytez.js
*/


// choose Text_to_Vision


// send input to model
