"use server";

import { apiFetch } from "../helper/helper";
import { AuthUser } from "../types";

export async function addFriend(user: AuthUser, friend: AuthUser) {
  try {
    if (!user || !friend) return;

    const payload = {
      user,
      friend,
    };
    const res = await apiFetch("/api/friends/add-new-friend", "POST", payload);
    if (!res) return;

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
    if (!res) return;

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
    if (!res) return;

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
    if (!res) return;

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
    if (!res) return;

    return res.json();
  } catch (err) {
    console.log(err);
  }
}

export async function getUserFriends(userId: string) {
  try {
    if (!userId) return [];

    const res = await apiFetch(
      `/api/friends/get-friends/${userId}`,
      "GET",
      null,
      "NATIVE",
      "no-cache"
    );
    if (!res) return;
    return res.json();
  } catch (err) {
    console.log(err);
  }
}
export async function getLastSeenUpdate(uid: string) {
  try {
    if (!uid) return;

    const res = await apiFetch(`/api/friends/get-last-seen/${uid}`, "GET");
    if (!res) return;

    return res.json();
  } catch (err) {
    console.log(err);
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
    if (!res) return;

    return res.json();
  } catch (err) {
    console.log(err);
  }
}
