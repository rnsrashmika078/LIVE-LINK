import SearchArea from "@/app/component/ui/searcharea";
import { BiSearch } from "react-icons/bi";
import { MdOutlineAddIcCall } from "react-icons/md";

const CallsPanel = () => {
    return (
        <div
            className={`transition-all bg-[var(--pattern_2)] h-full relative w-full sm:w-72`}
        >
            <div className="p-5 space-y-2">
                <div className="flex justify-between items-center">
                    <h1 className="header">Calls</h1>
                    <div className="flex gap-4">
                        {/* <BiEdit size={20} />
                        <BiFilter size={20} /> */}
                        <MdOutlineAddIcCall
                            size={30}
                            className="hover:bg-[var(--pattern_5)] p-1 rounded-md"
                        />
                    </div>
                </div>
                <SearchArea placeholder="Search or start a new chat" />
            </div>
        </div>
    );
};

export default CallsPanel;
