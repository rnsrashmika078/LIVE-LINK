"use client";
import Spinner from "@/app/component/ui/spinner";
import { UserCard } from "@/app/component/ui/cards";
import {
  useAddFriend,
  useGetFriends,
  useGetSendRequests,
  useReceivedRequest,
} from "@/app/lib/tanstack/friendsQuery";
import { AuthUser, PusherChatState } from "@/app/types";
import { set } from "mongoose";
import { useCallback, useEffect, useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { RxReload } from "react-icons/rx";
import { useSelector } from "react-redux";

type ToggleStateType = {
  [key: string]: boolean;
};
const ConnectionPanel = () => {
  //  useStates
  const [id, setId] = useState<string | null>(null);
  const [addedFriendUid, setAddedFriendUid] = useState<string | null>(null);
  const [requests, setRequests] = useState<AuthUser[]>([]);

  //redux
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  const realtimeRequests = useSelector(
    (store: PusherChatState) => store.friends.friendRequest
  );

  const { data: SendRequests, isPending: isGetSendRequestsPending } =
    useGetSendRequests(authUser?.uid ?? "");

  const {
    data: receivedRequest,
    isPending: isGetReceivedRequest,
    refetch,
  } = useReceivedRequest(authUser?.uid ?? "");

  const {
    mutate: AddFriendMutate,
    data: addFriend,
    isPending: isAddFriendPending,
    isSuccess: isAddFriendSuccess,
    error: addFriendError,
  } = useAddFriend();

  useEffect(() => {
    if (!authUser) return;
    const getId = async () => {
      setId(authUser.uid);
    };
    getId();
  }, [authUser]);

  const [isOpen, setIsOpen] = useState<ToggleStateType>({
    "my-req": true,
    "friend-req": true,
    // friends: true,
  });

  const toggle = useCallback((id: string) => {
    setIsOpen((prev) => ({ ...prev, [id]: !prev?.[id] }));
  }, []);

  useEffect(() => {
    if (!addFriend?.success) return;
    refetch();
  }, [addFriend?.success, refetch]);

  useEffect(() => {
    if (receivedRequest?.receivedRequests?.length > 0) {
      const req = () => {
        setRequests(receivedRequest?.receivedRequests);
      };
      req();
    }
  }, [receivedRequest?.receivedRequests]);

  useEffect(() => {
    if (!realtimeRequests) return;
    const req = () => {
      setRequests((prev) => {
        const exist = prev.some((r) => r.uid === realtimeRequests.uid);
        if (!exist) {
          return [...prev, realtimeRequests];
        }
        return prev;
      });
    };
    req();
  }, [realtimeRequests]);

  return (
    <div
      className={`transition-all bg-[var(--pattern_2)] h-full relative w-full sm:w-72 custom-scrollbar-y`}
    >
      <div className="p-5 space-y-2">
        <h1 className="header">Connections</h1>
        {/* requests that requests by you  */}
        <div className="">
          <div className="flex justify-between cursor-pointer">
            <p className="sub-header">Your Requests</p>
            <MdArrowDropDown
              size={25}
              className=" transition-all"
              onClick={() => toggle("my-req")}
              style={{ rotate: isOpen["my-req"] ? "0deg" : "-90deg" }}
            />
          </div>

          <Spinner condition={isGetSendRequestsPending} />

          {/* friends status */}
          {isOpen["my-req"] &&
            SendRequests?.sendRequests?.map((req: AuthUser, index: number) => (
              <UserCard
                key={req.uid}
                avatar={req.dp || "/dog.png"}
                name={req.name}
                useFor="my-req"
                // created_at={new Date().toLocaleTimeString().toString()}
              />
            ))}
        </div>

        {/* requests that received to you  */}
        <div className="">
          <div className="flex justify-between cursor-pointer">
            <p className="sub-header">Friend Requests</p>
            <MdArrowDropDown
              size={25}
              className="transition-all"
              onClick={() => toggle("friend-req")}
              style={{ rotate: isOpen["friend-req"] ? "0deg" : "-90deg" }}
            />
          </div>

          <Spinner condition={isGetReceivedRequest} />

          {/* friends status */}

          <div
            className={`${
              isAddFriendPending
                ? "pointer-events-none "
                : "pointer-events-auto"
            }`}
          >
            {isOpen["friend-req"] &&
              requests?.map((req: AuthUser, index: number) => (
                <UserCard
                  key={req.uid}
                  avatar={req.dp || "/dog.png"}
                  name={req.name}
                  useFor="friend-req"
                  handleClick={() => {
                    AddFriendMutate(
                      {
                        user: req as AuthUser,
                        friend: authUser as AuthUser,
                      },
                      {
                        onSuccess: () => {
                          setRequests((prev) =>
                            prev.filter((r) => r.uid !== req.uid)
                          );
                          // setRequests([]);
                        },
                      }
                    );
                  }}
                  // created_at={new Date().toLocaleTimeString().toString()}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionPanel;
