import { NextResponse } from "next/server";
import { SeenByUserType, StatusType } from "../types";
import Status from "../backend/models/Status";
import { apiFetch } from "../helper/helper";

export async function getStatus(uid: string) {
  try {
    if (!uid) {
      return [];
    }
    const res = await apiFetch(`/api/status/get-status/${uid}`, "GET");

    if (!res) return [];
    const result = await res.json();

    return result;
  } catch (err) {
    console.log(err);
    return { message: "Error fetching chats", status: 500 };
  }
}

export async function setStatus(payload: StatusType) {
  try {
    if (payload === null) {
      return [];
    }
    const res = await apiFetch(`/api/status/add-status`, "POST", payload);

    if (!res) return [];
    const result = await res.json();

    return result;
  } catch (err) {
    console.log(err);
    return { message: "Error fetching chats", status: 500 };
  }
}
export async function updateStatus(payload: SeenByUserType) {
  try {
    if (payload === null) {
      return [];
    }
    const res = await apiFetch(`/api/status/update-status`, "POST", payload);

    if (!res) return [];
    return res.json();
  } catch (err) {
    console.log(err);
    return { message: "Error fetching chats", status: 500 };
  }
}
export async function getStatusSeenUsers(statusId: string) {
  try {
    if (!statusId) {
      return [];
    }
    const res = await apiFetch(`/api/status/get-seen-users/${statusId}`, "GET");

    if (!res) return [];
    const result = await res.json();
    if (!result) return;
    return result?.seenByUsers?.seenBy;
  } catch (err) {
    console.log(err);
    return { message: "Error fetching chats", status: 500 };
  }
}
export async function deleteStatus(payload: {
  statusId?: string | undefined;
  public_id?: string | undefined;
}) {
  try {
    const res = await apiFetch(`/api/status/delete-status/`, "DELETE", payload);

    if (!res) return [];
    const result = await res.json();

    return result;
  } catch (err) {
    console.log(err);
    return { message: "Error fetching chats", status: 500 };
  }
}
