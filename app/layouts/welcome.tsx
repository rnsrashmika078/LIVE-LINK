"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../component/button";
import { BsGoogle } from "react-icons/bs";
import { signInWithGoogle } from "../util/auth-options/server_options";
import { useSelector } from "react-redux";
import { PusherChatState } from "../types";
import { useRouter } from "next/navigation";
const Welcome = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const authuser = useSelector((store: PusherChatState) => store.chat.authUser);

  useEffect(() => {
    if (!authuser) return;
    const auth = async () => {
      if (authuser?.uid) {
        await setAuthenticated(true);
      }
    };
    auth();
  }, [authuser]);

  console.log("auth user data ", authuser);
  console.log("auth  ", authenticated);
  const router = useRouter();

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center text-center space-y-2">
      <motion.h1
        className="text-4xl "
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.p
          animate={{ color: ["#ff4d4d", "#4db8ff"] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="font-bold italic"
        >
          {" LIVE LINK "}
        </motion.p>
      </motion.h1>
      <motion.p
        className="text-[var(--pattern_5)] text-xl"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Instant chat application with dozens of features
      </motion.p>
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          className="gap-2"
          radius="xl"
          onClick={() =>
            authenticated ? router.push("/chats") : signInWithGoogle()
          }
        >
          {authenticated ? "Continue to chat" : "Continue with Google"}
          {!authenticated && <BsGoogle size={20} />}
        </Button>
      </motion.div>
    </div>
  );
};

export default Welcome;
