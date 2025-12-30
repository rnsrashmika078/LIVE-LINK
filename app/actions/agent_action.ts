"use server";
import { apiFetch } from "../helper/helper";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

export async function openAIAgent(prompt: string) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const res = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Return JSON only." },
      { role: "user", content: prompt },
    ],
  });

  return res.choices[0].message.content;
}
export async function agentCall(prompt: string, model: string) {
  console.log("model", model);
  try {
    if (!prompt)
      return {
        error: true,
        message: "prompt not provided!",
      };



    const res = await apiFetch("/api/agent/", "POST", prompt);

    if (!res) return;

    const data = await res.json();
    console.log("Answer", data.output);
    return data.output;
  } catch (error) {
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function geminiAgent(prompt: string) {
  console.log("Call gemini");
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  if (!response) return;
  const text = response.text;
  console.log(text);

  return text;
}
