"use client";
import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";

interface SearchAreaProps {
  className?: string;
  placeholder?: string;
  onSearch?: (text: string) => void;
}
const SearchArea = ({ className, placeholder, onSearch }: SearchAreaProps) => {
  const [input, setInput] = useState<string>("");
  return (
    <div className="relative w-full">
      <input
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder || "Search something"}
        className={`${className} relative bg-[var(--pattern_3)] pl-8 text-sm p-2 rounded-md border-b-2 outline-none border-green-500 w-full`}
      />
      <div className="absolute top-2 left-2">
        <BiSearch size={20} onClick={() => onSearch && onSearch(input)} />
      </div>
    </div>
  );
};
export default SearchArea;
