import { NextRequest, NextResponse } from "next/server";
import Bytez from "bytez.js";

export async function POST(req: NextRequest) {
  try {
    const prompt = await req.json();

    const key = "ce5d679a11217de713cba56714d3a03d";
    const sdk = new Bytez(key);

    // choose Phi-3-mini-4k-instruct
    const model = sdk.model("microsoft/Phi-3-mini-4k-instruct");

    // send input to model
    const { error, output } = await model.run([
      {
        role: "user",
        content: prompt,
      },
    ]);
    console.log("output", output.content);

    return NextResponse.json({
      error,
      output: output.content,
    });
  } catch (err) {
    console.log(err);
  }
}

//   const res = await fetch("http://localhost:11434/api/generate", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       model: "llama3.2:latest",
//       prompt,
//     }),
//   });
//   const data = await res.json();

//   if (!res.ok) {
//     const errorData = await res.json().catch(() => ({}));
//     return {
//       error: true,
//       status: res.status,
//       message: errorData?.error?.message || "Request failed",
//     };
//   }

//   const text = data.response;
//   return { error: false, message: text || "No reply received" };
// } catch (error) {
//   return {
//     error: true,
//     message:
//       error instanceof Error ? error.message : "Unknown error occurred",
//   };

// }
