import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const prompt = await req.json();
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2:latest",
        prompt,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        error: true,
        status: res.status,
        message: errorData?.error?.message || "Request failed",
      };
    }

    const text = data.response;
    return { error: false, message: text || "No reply received" };
  } catch (error) {
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
