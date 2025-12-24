"use server";
import { apiFetch } from "../helper/helper";
import { MessagePayload } from "../types";

export async function saveMessages(message: MessagePayload | null) {
  try {
    if (!message)
      return {
        message: "Successfully getting messages!",
        messages: [],
        status: 200,
      };

    const res = await apiFetch(
      `/api/messages/private-message`,
      "POST",
      message
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
