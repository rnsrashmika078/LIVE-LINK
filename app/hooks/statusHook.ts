import { useDispatch, useSelector } from "react-redux";
import { PusherChatDispatch, PusherChatState } from "../types";
import { useStatusContext } from "../context/StatusContext";
import { useSocket } from "../component/util_component/SocketProvider";
import { setOnViewStatus } from "../lib/redux/statusSlicer";
import { useDeleteStatus } from "../lib/tanstack/statusQuery";

export const useDeleteHook = () => {
  const { mutate, error } = useDeleteStatus((result) => {
    if (result.success) {
    }
  });
  const dispatch = useDispatch<PusherChatDispatch>();
  const friends = useSelector(
    (store: PusherChatState) => store.friends.friends
  );
  const { setUserStatus, setStatusState, setCurrentState } = useStatusContext();
  const socket = useSocket();
  const deleteStatus = (
    statusId: string | undefined,
    public_id: string | undefined
  ) => {
    const friendsUids = friends.flat().map((f) => f.uid);
    const payload = {
      statusId: statusId!,
      public_id: public_id!,
      myFriends: friendsUids,
    };

    if (socket) {
      socket.emit("delete-status", payload);
    }
    mutate({ payload });
    //reset functions
    dispatch(setOnViewStatus(null));
    setUserStatus(null);
    setCurrentState("idle");
    setStatusState((prev) =>
      (prev ?? []).filter((p) => p.statusId !== payload.statusId)
    );
  };

  return deleteStatus;
};
