"use server";

import { apiFetch } from "../helper/helper";

export async function getChats(uid: string) {
  try {
    if (!uid) {
      return {
        message: "Successfully getting chats!",
        status: 200,
      };
    }
    const res = await apiFetch(`/api/chats/get-chats/${uid}`, "GET");

    return res.json();
  } catch (err) {
    console.log(err);
    return { message: "Error fetching chats", status: 500 };
  }
}
