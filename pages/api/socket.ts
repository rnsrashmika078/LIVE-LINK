/* eslint-disable @typescript-eslint/no-explicit-any */
import { SessionInfo } from "@/app/types";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  //@ts-expect-error:server key not found issue
  if (res.socket.server.io) {
    res.status(200).json({ success: true });
    return;
  }

  //@ts-expect-error:server key not found issue
  const io = new IOServer(res.socket.server, {
    path: "/api/socket",
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    socket.on("join-room", (data) => {
      socket.join(`user-${data}`);
      socket.emit("room-joined", data);
    });

    socket.on("call-initialize", (data: SessionInfo) => {
      if (data.callFrom) {
        io.to(`user-${data.callFrom}`).emit("incoming-call", {
          callFrom: data.callFrom,
          callTo: data.callTo,
          callerName: data.callerName,
          callerDp: data.callerDp,
          callStatus: "Connecting..",
          sdp: data.sdp,
        });
      }
      if (data.callTo) {
        io.to(`user-${data.callTo}`).emit("incoming-call", {
          callFrom: data.callFrom,
          callTo: data.callTo,
          callerName: data.callerName,
          callerDp: data.callerDp,
          callStatus: "Connecting..",
          sdp: data.sdp,
        });
      }
    });
    socket.on("ice-candidate", (data: SessionInfo) => {
      io.to(`user-${data.callTo}`).emit("ice-incoming", {
        callFrom: data.callFrom,
        callTo: data.callTo,
        candidate: data.candidate,
      });
    });
    socket.on("call-answer", (data: SessionInfo) => {
      if (data.callFrom) {
        io.to(`user-${data.callFrom}`).emit("call-answering", {
          callFrom: data.callFrom,
          callTo: data.callTo,
          callerName: data.callerName,
          callerDp: data.callerDp,
          callStatus: "Connected",
          sdp: data.sdp,
          candidate: data.candidate,
        });
      }

      if (data.callTo) {
        io.to(`user-${data.callTo}`).emit("call-answering", {
          callFrom: data.callFrom,
          callTo: data.callTo,
          callerName: data.callerName,
          callerDp: data.callerDp,
          callStatus: "Connected",
          sdp: data.sdp,
          candidate: data.candidate,
        });
      }
    });
    socket.on("call-ended", (data: SessionInfo) => {
      if (data.callFrom) {
        io.to(`user-${data.callFrom}`).emit("call-ending", {
          callFrom: data.callFrom,
          callTo: data.callTo,
          callEndBy: data.callEndBy,
          callerName: data.callerName,
          callerDp: data.callerDp,
          callStatus: "Call End",
        });
      }

      if (data.callTo) {
        io.to(`user-${data.callTo}`).emit("call-ending", {
          callFrom: data.callFrom,
          callTo: data.callTo,
          callEndBy: data.callEndBy,
          callerName: data.callerName,
          callerDp: data.callerDp,
          callStatus: "Call End",
        });
      }
    });

    socket.on("create-new-chat", (data: any) => {
      data.participants.forEach((element: any) => {
        io.to(`user-${element.uid}`).emit("send-group-notification", data);
      });
    });
    socket.on("disconnect", () => {});
    socket.on("disconnect", () => {});
  });

  //@ts-expect-error:server key not found issue
  res.socket.server.io = io;

  res.status(200).json({ success: true, message: "Socket server initialized" });
}
