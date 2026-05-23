import { streamText, UIMessage, convertToModelMessages, tool } from "ai";
import { groq } from "@ai-sdk/groq";
import { openChatTool, scheduleMessageTool } from "@/app/helper/agentTools";
// import { createFile, weatherTool } from "@/app/helpers/tools";

export async function POST(req: Request) {
  try {
    const { messages, system }: { messages: UIMessage[]; system: string } =
      await req.json();

    console.log("messages", messages);
    const result = streamText({
      // model: groq("openai/gpt-oss-20b"),
      model: groq("llama-3.3-70b-versatile"),
      system: "use tools when needed.otherwise reply casually" + system,
      tools: { openChatTool, scheduleMessageTool },
      messages: await convertToModelMessages(messages),
    });
    console.log("result", result);

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.log(err);
  }
}
