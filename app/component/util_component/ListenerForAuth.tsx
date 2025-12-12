"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/lib/firebase/firebase";
import { useDispatch } from "react-redux";
import { PusherChatDispatch } from "@/app/types";
import { setAuthUser } from "@/app/lib/redux/chatslicer";
import { apiFetch } from "@/app/helper/helper";

export default function ListenerForAuth() {
  const dispatch = useDispatch<PusherChatDispatch>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const authUser = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          dp: user.photoURL,
        };
        // set cookies with authenticated user uid ( firebase id ) to give the user id access to the server component.
        await apiFetch("/api/auth/add-auth-user", "POST", authUser);

        dispatch(
          setAuthUser({
            uid: user.uid!,
            email: user.email!,
            dp: user.photoURL!,
            name: user.displayName!,
          })
        );
      } else {
        dispatch(setAuthUser(null));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return null;
}
