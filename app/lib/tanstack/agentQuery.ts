/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  agentCall,
  geminiAgent,
  openAIAgent,
} from "@/app/actions/agent_action";
import { useMutation } from "@tanstack/react-query";

export function useAgent(onSuccess?: (result: any) => void) {
  return useMutation({
    mutationFn: ({ prompt, model }: { prompt: string; model: string }) => {
      if (model.includes("Gemini")) return geminiAgent(prompt);
      // if (model.includes("llama")) return agentCall(prompt, model);
      return agentCall(prompt, model);
    },
    onSuccess,
  });
}
