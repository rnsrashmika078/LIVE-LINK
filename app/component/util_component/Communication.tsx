/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
"use client";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useSocket } from "./SocketProvider";
import { PusherChatState } from "@/app/types";

const Communication = () => {
  const {
    localAudioRef,
    remoteAudioRef,
    pcRef,
    pendingCandidatesRef,
    sdpRef,
    setSessionInfo,
  } = useLiveLink();

  const [peerId, setPeerId] = useState("");
  const socket = useSocket();

  const { authUser } = useSelector(
    (store: PusherChatState) => ({
      authUser: store.chat.authUser,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (socket && authUser?.uid) {
      cleanupConnection();
      initializePusher();
    }

    return () => {
      if (socket) {
        socket.off("incoming-call");
        socket.off("call-answering");
        socket.off("ice-incoming");
      }
    };
  }, [socket, authUser?.uid]);

  const cleanupConnection = () => {
    if (localAudioRef.current?.srcObject) {
      const stream = localAudioRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      localAudioRef.current.srcObject = null;
    }

    if (remoteAudioRef.current?.srcObject) {
      const stream = remoteAudioRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      remoteAudioRef.current.srcObject = null;
    }

    if (pcRef.current) {
      pcRef.current.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });

      pcRef.current.close();
      pcRef.current = null;
    }

    pendingCandidatesRef.current = [];
  };

  const initializePusher = () => {
    if (!socket || !authUser?.uid) {
      return;
    }

    // Listening to the call ends
    try {
      socket?.on("call-ending", (data: any) => {
        setSessionInfo({
          callFrom: data.callFrom,
          callTo: data.callTo,
          callerName: data.callerName,
          callEndBy: data.callEndBy,
          callStatus: data.callStatus,
          callerDp: data.callerDp,
        });
        cleanupConnection();
      });
      setPeerId("");
    } catch (err: any) {
      console.error("Error setting up incoming call:", err);
    }

    socket.on("incoming-call", async (data: any) => {
      setSessionInfo({
        callFrom: data.callFrom,
        callTo: data.callTo,
        callerName: data.callerName,
        callerDp: data.callerDp,
        callStatus: data.callStatus,
      });
      if (data.callFrom === authUser?.uid) {
        return;
      }
      if (data.callTo && data.callTo !== authUser?.uid) {
        return;
      }
      setPeerId(data.callFrom);
      sdpRef.current = data.sdp;
    });

    socket.on("call-answering", async (data: any) => {
      setSessionInfo({
        callFrom: data.callFrom,
        callTo: data.callTo,
        callerName: data.callerName,
        callerDp: data.callerDp,
        callStatus: data.callStatus,
      });
      // if (data.callTo !== authUser?.uid) {
      //   alert("YES");
      //   return;
      // }
      const pc = pcRef.current;
      if (!pc) {
        console.error("No peer connection available");
        return;
      }

      if (pc.signalingState === "have-local-offer") {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
          await processPendingCandidates(pc);
        } catch (err: any) {
          console.error("Error setting remote description:", err);
        }
      } else {
        console.warn(`Wrong state: ${pc.signalingState}`);
      }
    });

    // Listen for ICE candidates
    socket.on("ice-incoming", async (data: any) => {
      if (data.callTo !== authUser?.uid) return;

      const pc = pcRef.current;
      if (!pc) {
        console.warn("No peer connection, storing candidate");
        pendingCandidatesRef.current.push(data.candidate);
        return;
      }

      if (pc.remoteDescription) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err: any) {
          console.error("Error adding ICE candidate:", err);
        }
      } else {
        pendingCandidatesRef.current.push(data.candidate);
      }
    });
  };

  const processPendingCandidates = async (pc: RTCPeerConnection) => {
    if (pendingCandidatesRef.current.length > 0 && pc.remoteDescription) {
      for (const candidate of pendingCandidatesRef.current) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("Error adding pending candidate:", err);
        }
      }
      pendingCandidatesRef.current = [];
    }
  };

  const createPeerConnection = async (targetPeerId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });

    pcRef.current = pc;

    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    if (localAudioRef.current) {
      localAudioRef.current.srcObject = localStream;
    }

    pc.ontrack = (event) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit("ice-candidate", {
          callFrom: authUser?.uid,
          callTo: targetPeerId,
          candidate: event.candidate.toJSON(),
        });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed" || pc.connectionState === "closed") {
        cleanupConnection();
      }
    };

    pc.oniceconnectionstatechange = () => {};

    pc.onsignalingstatechange = () => {};

    return pc;
  };

  //Lis
  useEffect(() => {
    const setupIncomingCall = async () => {
      if (sdpRef.current && peerId) {
        try {
          const pc = await createPeerConnection(peerId);

          await pc.setRemoteDescription(
            new RTCSessionDescription(sdpRef.current)
          );

          await processPendingCandidates(pc);
        } catch (err: any) {
          console.error("Error setting up incoming call:", err);
        }
      }
    };
    setupIncomingCall();
  }, [sdpRef.current, peerId]);

  return null;
};

export default Communication;
