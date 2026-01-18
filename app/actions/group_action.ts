import { apiFetch } from "../helper/helper";
import { GroupMessage, GroupType } from "../types";

export async function createGroup(groupData: GroupType) {
  try {
    if (!groupData) return;

    const res = await apiFetch(`/api/group/create-group`, "POST", groupData);
    if (!res) return;
    return res.json();
  } catch (err) {
    console.log(err);
  }
}
export async function getGroups(uid: string) {
  try {
    if (!uid) {
      return;
    }
    const res = await apiFetch(`/api/group/get-groups/${uid}`, "GET");
    if (!res) return;
    const result = await res.json();
    return result.groups;
  } catch (err) {
    console.log(err);
  }
}
export async function sendMessage(message: GroupMessage) {
  try {
    if (!message) return;
    const res = await apiFetch(
      `/api/group/messages/send-message`,
      "POST",
      message
    );
    if (!res) return;
    return res.json();
  } catch (err) {
    console.log(err);
  }
}
export async function getGroupMessages(chatId: string) {
  try {
    if (!chatId) {
      return [];
    }
    const res = await apiFetch(
      `/api/group/messages/get-messages/${chatId}`,
      "GET"
    );
    if (!res) return;
    return res.json();
  } catch (err) {
    console.log(err);
  }
}
