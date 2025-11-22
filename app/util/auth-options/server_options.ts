
import { auth, provider } from "@/app/lib/firebase/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { signInAnonymously } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Signed in as:", user.displayName);
    console.log("Email:", user.email);
    console.log("Photo:", user.photoURL);
    return {
      success: true,
      user: result.user,
      message: "Successfully Signed in with Google!",
    };
  } catch (error) {
    return {
      success: false,
      user: null,
      message: error instanceof Error ? error.toString() : "Unknown error",
    };
  }
}

export async function loginAnonymously() {
  try {
    const result = await signInAnonymously(auth);
    console.log("Anonymous user ID:", result.user.uid);
    return { user: result.user };
  } catch (error) {
    console.error("Anonymous login error:", error);
    return null;
  }
}

export async function signUpWithEmail(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User signed up:", userCredential.user.uid);
    return {
      success: true,
      user: userCredential.user,
      message: "Successfully Logged in!",
    };
  } catch (error) {
    return {
      success: false,
      user: null,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
