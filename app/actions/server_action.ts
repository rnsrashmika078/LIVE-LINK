"use server";
import { NextResponse } from "next/server";
import { AuthUser, FileType, Unread } from "../types";
import { apiFetch } from "../helper/helper";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function getChats(uid: string) {
  try {
    if (!uid) {
      return {
        message: "Successfully getting chats!",
        chats: [],
        status: 200,
      };
    }
    const res = await apiFetch(`/api/chats/get-chats/${uid}`, "GET");

    return res.json();
  } catch (err) {
    console.log(err);
    return { message: "Error fetching chats", chats: [], status: 500 };
  }
}
export async function saveMessages(
  content: string,
  senderId: string,
  receiverId: string,
  chatId: string,
  name: string,
  dp: string,
  createdAt: string,
  status: string,
  files?: FileType,
  unreads?: Unread[]
) {
  try {
    if (!chatId)
      return {
        message: "Successfully getting messages!",
        messages: [],
        status: 200,
      };

    const payload = {
      content,
      senderId,
      receiverId,
      chatId,
      name,
      dp,
      createdAt,
      status,
      unreads,
      files,
    };

    const res = await apiFetch(
      `/api/messages/private-message`,
      "POST",
      payload
    );

    return res.json();
  } catch (err) {
    console.log(err);
    return { message: "Error fetching messages", messages: [], status: 500 };
  }
}
export async function lastSeenUpdate(uid: string, lastSeen: string) {
  try {
    if (!uid) return;

    const payload = {
      uid,
      lastSeen,
    };
    const res = await apiFetch(
      `/api/friends/update-last-seen`,
      "POST",
      payload
    );

    return res.json();
  } catch (err) {
    console.log(err);
  }
}
export async function getMessages(chatId: string) {
  try {
    if (!chatId) return;

    const res = await apiFetch(`/api/messages/get-messages/${chatId}`, "GET");

    return res.json();
  } catch (err) {
    console.log(err);
  }
}
export async function getLastSeenUpdate(uid: string) {
  try {
    if (!uid) return;

    const res = await apiFetch(`/api/friends/get-last-seen/${uid}`, "GET");

    return res.json();
  } catch (err) {
    console.log(err);
  }
}
export async function findFriend(searchParam: string, userId: string) {
  try {
    if (!searchParam) return;

    const res = await apiFetch(
      `/api/friends/search-friend/${searchParam}/${userId}`,
      "GET"
    );
    return res.json();
  } catch (err) {
    console.log(err);
  }
}
export async function sendRequest(
  requestSender: AuthUser,
  requestReceiver: AuthUser
) {
  try {
    if (!requestSender) return;

    const payload = {
      requestSender,
      requestReceiver,
    };
    const res = await apiFetch(`/api/friends/send-request`, "POST", payload);

    return res.json();
  } catch (err) {
    console.log(err);
  }
}

export async function getSendRequests(userId: string) {
  try {
    if (!userId) return;

    const res = await apiFetch(
      `/api/friends/get-send-request/${userId}`,
      "GET"
    );

    return res.json();
  } catch (err) {
    console.log(err);
  }
}
export async function getReceivedRequests(userId: string) {
  try {
    if (!userId) return;

    const res = await apiFetch(
      `/api/friends/get-received-request/${userId}`,
      "GET"
    );

    return res.json();
  } catch (err) {
    console.log(err);
  }
}

export async function getUserFriends(userId: string) {
  try {
    if (!userId) return;

    const res = await apiFetch(`/api/friends/get-friends/${userId}`, "GET");

    return res.json();
  } catch (err) {
    console.log(err);
  }
}

export async function addFriend(user: AuthUser, friend: AuthUser) {
  try {
    if (!user || !friend) return;

    const payload = {
      user,
      friend,
    };
    const res = await apiFetch("/api/friends/add-new-friend", "POST", payload);
    return res.json();
  } catch (err) {
    console.log(err);
  }
}
// SS : upload files such as image, pdf, docs to cloudinary service
export async function uploadFile(formData: FormData) {
  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dwcjokd3s/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await res.json();
    if (result) {
      const url = result?.secure_url as string;
      const format = result?.format as string;
      const name = result?.display_name as string;
      const asset_id = result?.asset_id as string;

      return {
        content: { url, name, asset_id, format },
        status: 200,
        message: "file uploaded successfully!",
      };
    }
    return {
      status: 500,
      message: "error while update the database!",
    };
  } catch (err) {
    console.log(err);
  }
}
