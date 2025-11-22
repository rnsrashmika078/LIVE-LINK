import React from "react";
import { BiSearch } from "react-icons/bi";

interface SearchAreaProps {
    className?: string;
    placeholder?: string;
}
const SearchArea = ({ className, placeholder }: SearchAreaProps) => {
    return (
        <div className="relative w-full">
            <input
                placeholder={placeholder || "Search someting"}
                className={`${className} relative bg-[var(--pattern_3)] pl-8 text-sm p-2 rounded-md border-b-2 outline-none border-green-500 w-full`}
            />
            <div className="absolute top-2 left-2">
                <BiSearch size={20} />
            </div>
        </div>
    );
};

export default SearchArea;
