import { useSelector } from "react-redux";
import { FileType, PusherChatState, StatusType } from "@/app/types";
import Avatar from "../../../ui/avatar";
import { MdDelete } from "react-icons/md";
import { useDeleteHook } from "@/app/hooks/statusHook";
import MessageFormat from "@/app/component/ui/format";
import { IoCloseCircleSharp } from "react-icons/io5";
import { useStatusContext } from "@/app/context/StatusContext";
import { BsInfo } from "react-icons/bs";
import { useState } from "react";
import StatusInfo from "@/app/component/modal/StatusInfo";
import { AnimatePresence } from "framer-motion";

const StatusTextViewPanel = ({
  onViewStatus,
}: {
  onViewStatus: StatusType | null;
}) => {
  const deleteStatus = useDeleteHook();
  const { setCurrentState } = useStatusContext();

  let file: FileType | undefined;
  let statusId: string | undefined;
  let caption: string | undefined;
  let color: string | undefined;

  if (onViewStatus) {
    file = onViewStatus.content.file!;
    statusId = onViewStatus?.statusId ?? "";
    caption = onViewStatus?.content?.caption?.caption ?? "";
    color = onViewStatus?.content?.caption?.color ?? "";
  }
  const uid = useSelector((store: PusherChatState) => store.chat.authUser?.uid);
  const [isViewInfo, setIsViewInfo] = useState<boolean>(false);
  return (
    <>
      <div className=" flex p-5 w-full bg-[var(--pattern_3)] items-center  sticky top-0">
        <div className=" flex items-center gap-3  justify-between w-full ">
          <Avatar image={onViewStatus?.dp || "/no_avatar2.png"} />
          <div className="w-full">
            <h1 className="">{onViewStatus?.name}</h1>
            <p className="text-xs text-[var(--pattern_4)]"></p>
          </div>
        </div>
      </div>{" "}
      <div
        className="flex flex-col w-[450px] h-full bg-black justify-center items-center m-auto"
        style={{ backgroundColor: color }}
      >
        <MessageFormat
          size="w-[500px] h-[500px]"
          url={file?.url}
          format={file?.format}
          message={""}
        />
        {/* this is use for show the content */}
        <h1 className="text-4xl px-10 text-center">{caption}</h1>
        {/* <h1 className="p-3 pattern_3">{caption}</h1> */}
      </div>
      <div className="flex justify-center gap-10 mx-5 items-center p-5 ">
        <>
          {onViewStatus?.uid === uid && (
            <>
              <MdDelete
                size={30}
                onClick={() => deleteStatus(statusId, file?.public_id)}
                className="hover:scale-120 transition-all cursor-pointer"
              />
              <BsInfo
                size={30}
                onClick={() => setIsViewInfo((prev) => !prev)}
                className="hover:scale-110 transition-all cursor-pointer text-end"
              />
            </>
          )}
          <IoCloseCircleSharp
            size={30}
            onClick={() => setCurrentState("idle")}
            className="hover:scale-110 transition-all cursor-pointer text-end"
          />
        </>
      </div>
      <AnimatePresence>
        {onViewStatus?.uid === uid && isViewInfo && (
          <StatusInfo setIsViewInfo={setIsViewInfo} />
        )}
      </AnimatePresence>
    </>
  );
};

export default StatusTextViewPanel;
