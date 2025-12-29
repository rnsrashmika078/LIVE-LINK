/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useEffect, useState } from "react";
import SearchArea from "../../ui/searcharea";
import Avatar from "../../ui/avatar";
import { PusherChatDispatch, PusherChatState } from "@/app/types";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useGetFriends } from "@/app/lib/tanstack/friendsQuery";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import TopBar from "./relatedUI/TopBar";
import { NewChatModalItem } from "@/app/util/data";
import FrequentContact from "./relatedUI/FrequentContact";
import ContactList from "./relatedUI/ContactList";
import { setFriends } from "@/app/lib/redux/friendsSlicer";

export const NewChat = React.memo(() => {
  const { setInternalClickState } = useLiveLink();
  const [selection, setSelection] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");

  const authUser = useSelector(
    (store: PusherChatState) => store.chat.authUser,
    shallowEqual
  );

  const handleSearch = useCallback(async (text: string) => {
    setSearchText(text);
  }, []);

  const { data: result, isPending } = useGetFriends(authUser?.uid ?? "");

  useEffect(() => {
    if (!result?.friends) return;
    dispatch(setFriends(result?.friends));
  }, [result?.friends]);

  const dispatch = useDispatch<PusherChatDispatch>();

  return (
    <div
      className={`z-50 transition-all bg-[var(--pattern_2)] h-full w-full sm:w-90  custom-scrollbar-y `}
    >
      {selection === "" && (
        <div className=" p-5 justify-center items-center  sticky top-0 space-y-2  bg-[var(--pattern_2)]">
          <div className="sticky top-5">
            <TopBar
              type="back"
              title="New Chat"
              route="chats"
              subTitle="Friends list"
              callback={setInternalClickState}
            />
            <SearchArea
              placeholder="Search or start a new chat"
              // onSearch={handleOnSearch}
            />
          </div>
          <div className="">
            {NewChatModalItem.map((t, i) => (
              <div
                key={i}
                onClick={() => setInternalClickState(t.title)}
                className="flex justify-start items-center gap-2 w-full hover:bg-[var(--pattern_5)] space-y-2 p-2 rounded-xl"
              >
                <Avatar image={t.image} width={10} height={10} />
                <h1 className="">{t.title}</h1>
              </div>
            ))}
            {/* frequent contact */}
            <FrequentContact />

            {/* all contact */}
            <ContactList friends={result?.friends} loading={isPending} />
          </div>
        </div>
      )}
    </div>
  );
});
NewChat.displayName = "NewChat";
