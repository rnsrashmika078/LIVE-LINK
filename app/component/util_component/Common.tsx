"use client";
import { usePathName } from "@/app/hooks/useHooks";
import { setCurrentTab } from "@/app/lib/redux/layoutSlicer";
import { PusherChatDispatch } from "@/app/types";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Common = () => {
  const path = usePathName();
  const dispatch = useDispatch<PusherChatDispatch>();

  useEffect(() => {
    if (window && typeof window !== "undefined") {
      dispatch(setCurrentTab(path.replace("/", "")));
    } else {
      dispatch(setCurrentTab("chats"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

export default Common;
