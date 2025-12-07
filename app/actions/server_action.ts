import { AuthUser, Unread } from "../types";

//server_action.ts
export async function getChats(uid: string) {
  try {
    if (!uid) {
      return Response.json({
        message: "Successfully getting chats!",
        chats: [],
        status: 200,
      });
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/get-chats/${uid}`,
      {
        cache: "no-store",
      }
    );

    return res.json();
  } catch (err) {
    console.log(err);
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
  unreads?: Unread[]
) {
  try {
    if (!chatId) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/presence-message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          senderId,
          receiverId,
          chatId,
          name,
          dp,
          createdAt,
          status,
          unreads,
        }),
        cache: "no-store",
      }
    );

    return res.json();
  } catch (err) {
    console.log(err);
  }
}
export async function lastSeenUpdate(uid: string, lastSeen: string) {
  try {
    if (!uid) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/update-last-seen`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid,
          lastSeen,
        }),
        cache: "no-store",
      }
    );

    return res.json();
  } catch (err) {
    console.log(err);
  }
}
export async function getMessages(chatId: string) {
  try {
    if (!chatId) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/get-messages/${chatId}`,
      {
        cache: "no-store",
      }
    );

    return res.json();
  } catch (err) {
    console.log(err);
  }
}
export async function getLastSeenUpdate(uid: string) {
  try {
    if (!uid) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/get-last-seen/${uid}`,
      {
        cache: "no-store",
      }
    );

    return res.json();
  } catch (err) {
    console.log(err);
  }
}
export async function findFriend(searchParam: string, userId: string) {
  try {
    if (!searchParam) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/search-friend/${searchParam}/${userId}`,
      {
        cache: "no-store",
      }
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/send-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestSender,
          requestReceiver,
        }),
        cache: "no-store",
      }
    );
    return res.json();
  } catch (err) {
    console.log(err);
  }
}

export async function getSendRequests(userId: string) {
  try {
    if (!userId) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/get-send-request/${userId}`,
      {
        cache: "no-store",
      }
    );

    return res.json();
  } catch (err) {
    console.log(err);
  }
}
export async function getReceivedRequests(userId: string) {
  try {
    if (!userId) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/get-received-request/${userId}`,
      {
        cache: "no-store",
      }
    );

    return res.json();
  } catch (err) {
    console.log(err);
  }
}

export async function getUserFriends(userId: string) {
  try {
    if (!userId) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/get-friends/${userId}`,
      {
        cache: "no-store",
      }
    );

    return res.json();
  } catch (err) {
    console.log(err);
  }
}

export async function addFriend(user: AuthUser, friend: AuthUser) {
  try {
    if (!user || !friend) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/add-new-friend`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user,
          friend,
        }),
        cache: "no-store",
      }
    );
    return res.json();
  } catch (err) {
    console.log(err);
  }
}

// export async function storeChat(user: AuthUser, friend: AuthUser) {
//   try {
//     if (!user || !friend) return;
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/add-new-friend`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           user,
//           friend,
//         }),
//         cache: "no-store",
//       }
//     );
//     return res.json();
//   } catch (err) {
//     console.log(err);
//   }
// }
