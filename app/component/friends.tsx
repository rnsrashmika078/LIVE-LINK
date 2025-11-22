import { useDispatch, useSelector } from "react-redux";
import {
    AuthUser,
    ChatsType,
    PusherChatDispatch,
    PusherChatState,
} from "../types";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { setActiveChat } from "../lib/redux/chatslicer";

interface FriendCardProp extends React.HTMLAttributes<HTMLDivElement> {
    name?: string;
    uid?: string;
    email?: string;
    dp?: string;
    type?: string;
}
export const FriendsCard = ({
    name,
    uid,
    email,
    dp,
    type,
    ...rest
}: FriendCardProp) => {
    const authUser = useSelector(
        (store: PusherChatState) => store.chat.authUser
    );

    const dispatch = useDispatch<PusherChatDispatch>();
    async function AddFriend() {
        const NewFriend = {
            uid: authUser?.uid,
            name: authUser?.name,
            email: authUser?.email,
            dp: authUser?.dp,
            friendId: uid,
            friendName: name,
            friendEmail: email,
            friendDp: dp,
            chatId: [authUser?.uid, uid]?.sort().join("_"),
            participants: [
                { uid, name, email, dp },
                {
                    uid: authUser?.uid,
                    name: authUser?.name,
                    email: authUser?.email,
                    dp: authUser?.dp,
                },
            ],
            lastMessage: null,
            unreadCount: [
                { userId: uid, count: 0 },
                { userId: authUser?.uid, count: 0 },
            ],
        };
        const response = await fetch("api/add-new-friend", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(NewFriend),
        });

        const result = await response.json();
        if (result.status === 200) {
            // alert(JSON.stringify(result.message));
        }
    }
    return (
        <div {...rest} className="flex justify-evenly">
            {/* <div>
                <Image
                    src={dp ?? ""}
                    alt="user display image"
                    width={50}
                    className="rounded-2xl"
                    height={50}
                />
            </div> */}
            <div className="flex flex-col">
                <div>{name}</div>
                <div>{email}</div>
                <div>{uid}</div>
            </div>
            <div>
                <button
                    className="bg-red-500 p-1 rounded-xl"
                    onClick={() => {
                        dispatch(
                            setActiveChat({
                                chatId: [authUser?.uid, uid]?.sort().join("_"),
                                receiverId: uid ?? "",
                            })
                        );
                        if (type === "add friend") {
                            AddFriend();
                        }
                    }}
                >
                    {type === "friends" ? "Message" : "ADD AS FRIEND"}
                </button>
            </div>
        </div>
    );
};
export const Friends = ({
    list,
    type,
}: {
    type: string;
    list: AuthUser[] | ChatsType[];
}) => {
    const authUser = useSelector(
        (store: PusherChatState) => store.chat.authUser
    );
    return (
        <div>
            {type === "add friend"
                ? (list as AuthUser[])
                      ?.filter((user) => user.uid !== authUser?.uid)
                      ?.map((user) => (
                          <FriendsCard
                              type={type}
                              key={user.uid}
                              name={user.name}
                              uid={user.uid}
                              email={user.email}
                              dp={user.dp}
                          />
                      ))
                : (list as ChatsType[])
                      .filter((chat) => chat.uid === authUser?.uid)
                      .map((chat) => (
                          <FriendsCard
                              type={type}
                              key={chat._id}
                              name={chat.friendName}
                              uid={chat.friendId}
                              email={chat.friendEmail}
                              dp={chat.friendDp}
                          />
                      ))}
        </div>
    );
};

export default FriendsCard;
