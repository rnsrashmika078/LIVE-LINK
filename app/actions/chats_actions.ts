"use server";

import { apiFetch } from "../helper/helper";

export async function getChats(uid: string) {
  try {
    if (!uid) {
      return [];
    }
    const res = await apiFetch(`/api/chats/get-chats/${uid}`, "GET");

    const data = await res.json();
    return data.chats;
  } catch (err) {
    console.log(err);
    return { message: "Error fetching chats", status: 500 };
  }
}
