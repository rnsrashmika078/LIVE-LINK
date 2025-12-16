/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { PusherChatState } from "@/app/types";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);

  // Ensure server is initialized before connecting
  useEffect(() => {
    fetch("/api/socket").catch(console.error);
  }, []);

  // Connect socket once authUser.uid is available
  useEffect(() => {
    if (!authUser?.uid) return;

    const socketInstance = io({
      path: "/api/socket",
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {

      // ✅ JOIN ROOM: Immediately join personal room after connection
      socketInstance.emit("join-room", authUser.uid);
    });

    // ✅ LISTEN: For room joined confirmation
    socketInstance.on("room-joined", (data) => {
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      socketInstance.off();
    };
  }, [authUser?.uid]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
