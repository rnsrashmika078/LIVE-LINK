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
