"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase/firebase";

export async function logoutUser() {
    try {
        await signOut(auth);
        // UseUnimateApp.getState().setAuthUser(null); // clear local store
        console.log("User logged out successfully");
        return { success: true };
    } catch (error) {
        console.error("Logout failed:", error);
        return { success: false, message: (error as Error).message };
    }
}
