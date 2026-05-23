/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import {
  PusherChatDispatch,
  PusherChatState,
  SeenByUserType,
  StatusType,
} from "@/app/types";
import { StatusCard } from "../../ui/cards";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDeleteStatus, setOnViewStatus } from "@/app/lib/redux/statusSlicer";
import { useStatusContext } from "@/app/context/StatusContext";
import { v4 as uuid } from "uuid";
import Select, {
  Component,
  SelectionSection,
  SelectItem,
} from "../../ui/select";
import { BiEdit, BiPhotoAlbum } from "react-icons/bi";
import { useSocket } from "../../util_component/SocketProvider";
import { useUpdateStatus } from "@/app/lib/tanstack/statusQuery";
const StatusClient = ({ status }: { status: StatusType[] }) => {
  const {
    setPreview,
    setCurrentState,
    setStatusState,
    userStatus,
    statusState,
    back,
    setBack,
  } = useStatusContext();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch<PusherChatDispatch>();
  //state : updating-text
  const handleWriteText = () => {
    setCurrentState("updating-text");
  };
  //state : updating-photo
  const handleUploadFile = () => {
    if (!inputRef.current) return;
    inputRef.current.click();
  };
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  const deletedStatusId = useSelector(
    (store: PusherChatState) => store.status.deletedStatusId
  );
  const seenBy = useSelector((store: PusherChatState) => store.status.seenBy);
  const statusList = useSelector(
    (store: PusherChatState) => store.status.statusList
  );
  useEffect(() => {
    if (status == null) return;
    setStatusState(status);
  }, [status]);

  //coming from live pusher socket
  useEffect(() => {
    if (statusList.length === 0) {
      return;
    }
    const latest = statusList?.at(-1);
    if (!latest) return;
    setStatusState((prev) => [...(prev ?? []), latest]);
    return;
  }, [statusList]);

  useEffect(() => {
    if (!deletedStatusId) return;
    setStatusState(
      (prev) => prev && prev.filter((p) => p.statusId !== deletedStatusId)
    );
    dispatch(setOnViewStatus(null));
    dispatch(setDeleteStatus(null));
    setCurrentState("idle");
  }, [deletedStatusId]);

  useEffect(() => {
    if (userStatus == null) return;
    setStatusState((prev) => [...(prev ?? []), userStatus]);
  }, [userStatus]);

  const myStatus = useMemo(
    () => statusState?.filter((u) => u.uid === authUser?.uid),
    [authUser?.uid, statusState]
  );
  const othersSTatus = useMemo(
    () => statusState?.filter((u) => u.uid !== authUser?.uid),
    [authUser?.uid, statusState]
  );

  const [selection, setSelection] = useState<string | null>(null);

  const { mutate } = useUpdateStatus((success) => {
    if (success.status) {
    }
  });

  const handleSelection = (selection: string) => {
    setSelection(selection);
    switch (selection) {
      case "photo": {
        handleUploadFile();
        setBack((prev) => !prev);
        break;
      }
      case "text": {
        handleWriteText();
        setBack((prev) => !prev);
        break;
      }
    }
  };
  const socket = useSocket();
  const handleViewStatus = (val: StatusType) => {
    if (!socket) return;

    const id = uuid();
    const newVal = { ...val, id };
    dispatch(setOnViewStatus(newVal));

    const payload: SeenByUserType = {
      dp: authUser?.dp ?? "",
      createdAt: new Date().toISOString(),
      name: authUser?.name ?? "",
      uid: authUser?.uid ?? "",
      uidO: val.uid ?? "",
      statusId: val.statusId,
    };

    //emit // ignore my status view
    if (val.uid !== authUser?.uid) {
      socket.emit("status-seen", payload);
      const is = IsSeenBefore(payload);
      if (!is) {
        markedAsSeen(payload);
        mutate({ payload });
      }
    }
    setCurrentState("viewing-text");
  };

  const markedAsSeen = (payload: SeenByUserType) => {
    setStatusState(
      (prev) =>
        prev &&
        prev.map((a) => {
          const exist = payload.statusId === a.statusId;
          return exist ? { ...a, seenBy: [...(a.seenBy || []), payload] } : a;
        })
    );
  };

  const IsSeenBefore = (payload: SeenByUserType) => {
    let exist;
    let seenBefore;
    statusState?.map((a) => {
      exist = payload.statusId === a.statusId;
      seenBefore = a.seenBy?.some((a) => a.uid === a.uid);
    });

    if (exist && seenBefore) return true;
    return false;

    // return false;
  };
  return (
    <>
      <input
        type="file"
        aria-label="status-import"
        className="fixed opacity-0 pointer-events-none"
        ref={inputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) {
            setCurrentState("idle");
            return;
          }
          const url = URL.createObjectURL(file);
          const payload = {
            file,
            url,
            name: file.name,
            type: file.type,
          };
          setPreview(payload);
          setCurrentState("updating-photo");
        }}
      />
      {myStatus?.length === 0 && (
        <Select
          onSelect={(val) => {
            setCurrentState("idle");
            handleSelection(val);
          }}
        >
          <Component>
            <StatusCard
              users={myStatus ?? []}
              type="MY"
              handleClick={(val) => {
                // handleOpenAddStatus(val);
              }}
            ></StatusCard>
          </Component>
          <SelectionSection>
            <SelectItem value="photo">
              <BiPhotoAlbum size={20} />
              Photo & Video
            </SelectItem>
            <SelectItem value="text">
              <BiEdit size={20} />
              Text Only
            </SelectItem>
          </SelectionSection>
        </Select>
      )}
      {myStatus && myStatus.length > 0 && (
        <StatusCard
          users={myStatus ?? []}
          type="MY"
          handleClick={(val) => {
            handleViewStatus(val);
          }}
        ></StatusCard>
      )}
      {/* </Wrapper> */}
      <p className="sub-styles">Recent Status</p>

      <StatusCard
        authId={authUser?.uid ?? ""}
        users={othersSTatus!}
        type="OTHERS"
        handleClick={handleViewStatus}
      ></StatusCard>
    </>
  );
};

export default StatusClient;
