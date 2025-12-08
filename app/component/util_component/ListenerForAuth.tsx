"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/lib/firebase/firebase";
import { useDispatch } from "react-redux";
import { PusherChatDispatch } from "@/app/types";
import { setAuthUser } from "@/app/lib/redux/chatslicer";

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
        //set cookies with authenticated user uid ( firebase id ) to give the user id access to the server component.
        // await fetch("/api/auth/set-cookies", {
        //   method: "POST",
        //   headers: {
        //     "Content-type": "application/json",
        //   },
        //   body: JSON.stringify(user.uid),
        // });
        const addAuthUser = async () => {
          const response = await fetch("/api/auth/add-auth-user", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(authUser),
          });
          const result = await response.json();
          if (result.status === 200) {
          }
        };
        addAuthUser();
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
  }, [dispatch]);

  return null;
}
