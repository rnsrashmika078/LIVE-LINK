import { PusherChatState } from "@/app/types";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const AnalyzerModal = () => {
  const chat = useSelector((store: PusherChatState) => store.chat);
  const friends = useSelector((store: PusherChatState) => store.friends);
  const notify = useSelector((store: PusherChatState) => store.notify);

  const size = useMemo(() => {
    return [chat, friends, notify].reduce((acc, slicer) => {
      return acc + new TextEncoder().encode(JSON.stringify(slicer)).length;
    }, 0);
  }, [chat, friends, notify]);

  const mb = (size / 1024 / 1024).toFixed(4);

  const heavy = ["ChatListPanel.tsx", "MessagePanel.tsx"];
  return (
    <div className="fixed top-1/3 right-5 h-[350px] bg-gray-800 p-5 w-[300px] space-y-5 rounded-xl">
      <h1 className="font-bold text-center bg-gray-700 rounded-t-2xl ">
        Analyzer 1.0
      </h1>
      <h2 className="font-extralight italic underline">Redux Size Usage</h2>
      <div className="flex justify-between pl-5">
        <h2>{mb} MB</h2>
      </div>
      <h2 className="font-extralight italic underline">Heavy Component</h2>
      {heavy.map((tsx) => (
        <div className="flex justify-between pl-5" key={tsx}>
          <h2>{tsx}</h2>
        </div>
      ))}

      <div>
        {["top", "bottom"].map((pos, i) => (
          <p key={i}>{pos}</p>
        ))}
      </div>
    </div>
  );
};
export default AnalyzerModal;
