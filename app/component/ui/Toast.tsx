"use client";
import { PusherChatState } from "@/app/types";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Toast() {
  const notification = useSelector((store: PusherChatState) => store.notify);

  useEffect(() => {
    if (!notification.notify) {
      return;
    }
    toast.success(notification.notify);
  }, [notification]);
  return (
    <div>
      {/* <button onClick={() => toast.info("Hello from Toastify!")}>
        Show Toast
      </button> */}
      <ToastContainer position="top-right" autoClose={3000} theme="dark"/>
    </div>
  );
}
