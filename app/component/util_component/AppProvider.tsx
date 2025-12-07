"use client";
import { store } from "@/app/lib/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import GlobalPusherListener from "./GlobalPusherListener";
import PusherListenerPresence from "./PusherListenerPresence";
import { PusherProvider } from "./PusherProvider";

const AppProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PusherProvider>
          <GlobalPusherListener />
          <PusherListenerPresence />
          {children}
        </PusherProvider>
      </Provider>
    </QueryClientProvider>
  );
};

export default AppProvider;
