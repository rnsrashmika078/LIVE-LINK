"use client";
import { store } from "@/app/lib/redux/store";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";

const AppProvider = ({ children }: { children: ReactNode }) => {
    return <Provider store={store}>{children}</Provider>;
};

export default AppProvider;
