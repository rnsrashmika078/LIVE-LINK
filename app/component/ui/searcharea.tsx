"use client";
import { useDebounce } from "@/app/hooks/useHooks";
import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";

interface SearchAreaProps {
  className?: string;
  placeholder?: string;
  onSearch?: (text: string) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
}
const SearchArea = React.memo(
  ({ className, placeholder, onSearch, onClick }: SearchAreaProps) => {
    const [input, setInput] = useState<string>("");
    const debounce = useDebounce(input, 1000);

    useEffect(() => {
      onSearch?.(debounce);
    }, [debounce]);

    return (
      <div className="relative w-full">
        <input
          onClick={(e) => onClick?.(e)}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          placeholder={placeholder || "Search something"}
          className={`${className} relative bg-[var(--pattern_3)] pl-8 text-sm p-2 rounded-md border-b-2 outline-none border-green-500 w-full`}
        />
        <div className="absolute top-2 left-2">
          <BiSearch size={20} onClick={() => onSearch?.(debounce)} />
        </div>
      </div>
    );
  }
);
SearchArea.displayName = "SearchArea";
export default SearchArea;
