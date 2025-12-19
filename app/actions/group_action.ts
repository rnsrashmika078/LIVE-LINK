import { apiFetch } from "../helper/helper";
import { GroupMessage, GroupType } from "../types";

export async function createGroup(groupData: GroupType) {
  try {
    if (!groupData) return;

    const res = await apiFetch(`/api/group/create-group`, "POST", groupData);
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
    return res.json();
  } catch (err) {
    console.log(err);
  }
}
export async function getGroupMessages(chatId: string) {
  try {
    if (!chatId) {
      console.log("chat is  null");
      return [];
    }
    const res = await apiFetch(
      `/api/group/messages/get-messages/${chatId}`,
      "GET"
    );
    // console.log("message from", result.chatMessages);
    // console.log("chatId", chatId);
    return res.json();
  } catch (err) {
    console.log(err);
  }
}
