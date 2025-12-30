/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  agentCall,
} from "@/app/actions/agent_action";
import { useMutation } from "@tanstack/react-query";

export function useAgent(onSuccess?: (result: any) => void) {
  return useMutation({
    mutationFn: ({ prompt, model }: { prompt: string; model: string }) =>
      agentCall(prompt, model),
    onSuccess,
  });
}
