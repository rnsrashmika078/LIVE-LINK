import { useSelector } from "react-redux";
import { FileType, PusherChatState, StatusType } from "@/app/types";
import MessageFormat from "../../../ui/format";
import Avatar from "../../../ui/avatar";
import { MdDelete } from "react-icons/md";

import { useDeleteHook } from "@/app/hooks/statusHook";

const StatusFileViewPanel = ({
  onViewStatus,
}: {
  onViewStatus: StatusType | null;
}) => {
  const deleteStatus = useDeleteHook();
  let file: FileType | undefined;
  let statusId: string | undefined;
  let caption: string | undefined;

  if (onViewStatus) {
    file = onViewStatus.content.file!;
    statusId = onViewStatus?.statusId ?? "";
    caption = onViewStatus?.content?.caption?.caption ?? "";
  }

  console.log("file", file);
  const uid = useSelector((store: PusherChatState) => store.chat.authUser?.uid);
  return (
    <>
      <div className=" flex p-5 w-full bg-[var(--pattern_3)] items-center  sticky top-0">
        <div
          className=" flex items-center gap-3  justify-between w-full "
          // onClick={() =>
          //   setActionMenuSelection({
          //     selection: "message-Info",
          //     message: null,
          //   })
          // }
        >
          <Avatar image={onViewStatus?.dp || "/no_avatar2.png"} />
          <div className="w-full">
            <h1 className="">{onViewStatus?.name}</h1>
            <p className="text-xs text-[var(--pattern_4)]">
              {/* {presence === "Online"
                ? "Online"
                : lastSeen
                ? "Last seen " + new Date(lastSeen).toLocaleTimeString() ||
                  "Offline"
                : "Offline"} */}
            </p>
          </div>
        </div>
      </div>{" "}
      <div className="flex flex-col justify-center items-center mt-10">
        {/* this is use for show the content */}
        <MessageFormat
          size="w-[500px] h-[500px]"
          url={file?.url}
          format={file?.format}
          message={""}
        />
        <h1 className="p-3 pattern_3">{caption}</h1>
        {onViewStatus?.uid === uid && (
          <MdDelete
            size={35}
            onClick={() => deleteStatus(statusId, file?.public_id)}
            className="hover:scale-120 transition-all cursor-pointer"
          />
        )}
      </div>
    </>
  );
};

export default StatusFileViewPanel;
