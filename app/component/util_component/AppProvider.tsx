"use client";
import { store } from "@/app/lib/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import GlobalPusherListener from "./GlobalPusherListener";
import PusherListenerPresence from "./PusherListenerPresence";
import { PusherProvider } from "./PusherProvider";
import Communication from "./Communication";
import LiveLink from "@/app/context/LiveLinkContext";
import { SocketProvider } from "./SocketProvider";
import GlobalSocket from "./GlobalSocket";
import { VoiceMessageProvider } from "@/app/context/VoiceMessageContext";

const AppProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <LiveLink>
          <VoiceMessageProvider>
            <SocketProvider>
              <PusherProvider>
                <GlobalPusherListener />
                <GlobalSocket />
                <PusherListenerPresence />
                <Communication />
                {children}
              </PusherProvider>
            </SocketProvider>
          </VoiceMessageProvider>
        </LiveLink>
      </Provider>
    </QueryClientProvider>
  );
};

export default AppProvider;
