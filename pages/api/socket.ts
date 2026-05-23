/* eslint-disable @typescript-eslint/no-explicit-any */
import { SeenByUserType, SeenType, SessionInfo, StatusType } from "@/app/types";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
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
      socket.on("join-user", (userId) => {
        socket.join(`user-${userId}`);
      });

      socket.on("join-chat", (chatId) => {
        socket.join(`chat-${chatId}`);
        socket.emit("head-count", chatId);
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
          io.to(`user-${element.userId}`).emit("send-group-notification", data);
        });
      });
      socket.on("message-seen", (data: any) => {
        if (data.receiverId) {
          io.to(`user-${data.receiverId}`).emit("seen-success", data);
        }
        if (data.senderId) {
          io.to(`user-${data.senderId}`).emit("seen-success", data);
        }
      });
      socket.on("user-typing", (data: any) => {
        io.to(`chat-${data.chatId}`).emit("typing-status", data);
      });

      socket.on("connect-to-chat", (data: any) => {
        io.to(`chat-${data.chatId}`).emit("connected-to-chat", data);
      });

      //update status
      socket.on("update-status", (data: StatusType) => {
        data?.myFriends?.forEach((fr) => {
          io.to(`user-${fr}`).emit("updated-status", data);
        });
      });

      //status delete
      socket.on("delete-status", (data: any) => {
        data?.myFriends?.forEach((fr: any) => {
          io.to(`user-${fr}`).emit("deleted-status", data);
        });
      });

      //status seen
      socket.on("status-seen", (data: SeenByUserType) => {
        io.to(`user-${data.uidO}`).emit("status-has-seen", data);
      });

      //disconnect from chat
      socket.on("disconnect-from-chat", (data: any) => {
        io.to(`chat-${data.chatId}`).emit("disconnected-from-chat", data);
      });

      socket.on("disconnect", () => {});
      socket.on("disconnect", () => {});
    });

    //@ts-expect-error:server key not found issue
    res.socket.server.io = io;

    res
      .status(200)
      .json({ success: true, message: "Socket server initialized" });
  } catch (err) {
    console.log(err);
  }
}
