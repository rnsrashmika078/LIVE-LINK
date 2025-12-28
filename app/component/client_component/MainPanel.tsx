import { useSelector } from "react-redux";
import { PusherChatState } from "@/app/types";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import { useStatusContext } from "@/app/context/StatusContext";
import IdleView from "./status/IdleView";
import StatusTextPreviewPanel from "./status/preview/StatusTextPreviewPanel";
import StatusFilePreviewPanel from "./status/preview/StatusFilePreviewPanel";
import StatusTextViewPanel from "./status/view/StatusTextViewPanel";
import StatusFileViewPanel from "./status/view/StatusFileViewPanel";
const MainPanel = () => {
  const onViewStatus = useSelector(
    (store: PusherChatState) => store.status.onViewStatus
  );
  const { currentTab } = useLiveLink();
  const { currentState } = useStatusContext();

  return (
    <div className="flex flex-col w-full h-full relative overflow-hidden">
      {currentTab === "status" ? (
        <>
          {currentState === "viewing-text" && <StatusTextViewPanel onViewStatus={onViewStatus}/>}
          {/* {currentState === "viewing-photo" && <StatusFileViewPanel onViewStatus={onViewStatus}/>} */}
          {currentState === "updating-photo" && <StatusFilePreviewPanel />}
          {currentState === "updating-text" && <StatusTextPreviewPanel />}
          {currentState === "idle" && <IdleView />}
        </>
      ) : (
        <div>WELCOME TO LIVE LINK</div>
      )}
    </div>
  );
};

export default MainPanel;
