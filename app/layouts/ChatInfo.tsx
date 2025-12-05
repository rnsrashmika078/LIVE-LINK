"use client";

import { useState } from "react";
import { BiLeftArrowCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { PusherChatDispatch, PusherChatState } from "../types";
import { setOpenSection } from "../lib/redux/layoutSlicer";

const ChatInfo = () => {
    const dispatch = useDispatch<PusherChatDispatch>();
    const openSection = useSelector(
        (store: PusherChatState) => store.layout.OpenSection
    );

    return (
        <div
            className={`transition-all bg-gray-900 h-full ${
                openSection?.section === "info"
                    ? "flex-10 md:flex-1"
                    : "flex-0 md:flex-1  overflow-hidden"
            }`}
        >
            <button
                onClick={() => {
                    dispatch(
                        setOpenSection({
                            section:
                                openSection.section === "list"
                                    ? "info"
                                    : openSection.section === ""
                                    ? "info"
                                    : "",
                        })
                    );
                }}
                className="fixed md:hidden top-0 right-0"
            >
                <BiLeftArrowCircle />
            </button>
        </div>
    );
};

export default ChatInfo;
