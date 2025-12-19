"use server";
import { apiFetch } from "../helper/helper";
import { FileType, Unread } from "../types";

export async function saveMessages(
  content: string,
  senderId: string,
  receiverId: string,
  chatId: string,
  name: string,
  dp: string,
  createdAt: string,
  customId: string,
  status: string,
  files?: FileType,
  unreads?: Unread[],
  type?: string
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
      customId,
      type,
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
export async function getMessages(chatId: string) {
  try {
    if (!chatId) return;

    const res = await apiFetch(`/api/messages/get-messages/${chatId}`, "GET");

    return res.json();
  } catch (err) {
    console.log(err);
  }
}

export async function deleteMessage(
  messageId: string,
  public_id: string,
  chatId: string
) {
  try {
    if (!chatId) return;

    let payload;
    if (public_id) {
      payload = {
        public_id,
      };
    }

    const res = await apiFetch(
      `/api/messages/delete-message/${messageId}/${chatId}`,
      "DELETE",
      payload
    );

    return res.json();
  } catch (err) {
    console.log(err);
  }
}
