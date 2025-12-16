import { PusherChatState } from "@/app/types";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const AnalyzerModal = () => {
  const chat = useSelector((store: PusherChatState) => store.chat);
  const friends = useSelector((store: PusherChatState) => store.friends);
  const layout = useSelector((store: PusherChatState) => store.layout);
  const notify = useSelector((store: PusherChatState) => store.notify);

  const size = useMemo(() => {
    return [chat, friends, layout, notify].reduce((acc, slicer) => {
      return acc + new TextEncoder().encode(JSON.stringify(slicer)).length;
    }, 0);
  }, [chat, friends, layout, notify]);

  const mb = (size / 1024 / 1024).toFixed(4);
  return (
    <div className="fixed top-1/3 right-5 h-[350px] bg-gray-800 p-5 w-[300px] space-y-5 rounded-xl">
      <h1 className="font-bold text-center bg-gray-700 rounded-t-2xl ">
        Analyzer 1.0
      </h1>
      <div className="flex justify-between">
        <h2 className="font-extralight">Redux Size Usage</h2>
        <h2>{mb} MB</h2>
      </div>
    </div>
  );
};
export default AnalyzerModal;
