//server_action.ts
export async function getChats() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/get-chats`,
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
export async function addNewFriend(searchParam: string) {
  try {
    if (!searchParam) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/add-new-friend/${searchParam}`,
      {
        cache: "no-store",
      }
    );
    return res.json();
  } catch (err) {
    console.log(err);
  }
}
