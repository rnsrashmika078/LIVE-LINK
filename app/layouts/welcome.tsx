"use client";
import { motion } from "framer-motion";
import { Button } from "../component/ui/button";
import { BsGoogle } from "react-icons/bs";
import { signInWithGoogle } from "../util/auth-options/server_options";
import { useSelector } from "react-redux";
import { PusherChatState } from "../types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "../component/ui/spinner";
const Welcome = () => {
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const authenticated = !!authUser?.uid;
  const handleAuth = async () => {
    if (authenticated) {
      router.push("/livelink");
    } else {
      setIsLoading(true);
      await signInWithGoogle();
      setTimeout(() => {
        router.push("/livelink");
      }, 1000);
    }
  };
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
        <Button className="gap-2" radius="xl" onClick={handleAuth}>
          {authenticated ? "Continue to chat" : "Continue with Google"}
          {!authenticated && <BsGoogle size={20} />}
        </Button>
        <Spinner condition={isLoading} />
      </motion.div>
    </div>
  );
};

export default Welcome;
