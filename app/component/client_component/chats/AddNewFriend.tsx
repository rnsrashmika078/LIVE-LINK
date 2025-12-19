import { AuthUser, PusherChatState } from "@/app/types";
import Spinner from "../../ui/spinner";
import { UserCard } from "../../ui/cards";
import {
  useSearchFriend,
  useSendFriendRequests,
} from "@/app/lib/tanstack/friendsQuery";
import { useSelector } from "react-redux";
import { useCallback, useState } from "react";
import React from "react";
import SearchArea from "../../ui/searcharea";
import TopBar from "./relatedUI/TopBar";
import { useLiveLink } from "@/app/context/LiveLinkContext";

export const AddNewFriend = React.memo(() => {
  const [searchText, setSearchText] = useState<string>("");
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);

  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchFriend(searchText, authUser?.uid ?? "");

  const { mutate: sendReqMutate, error: sendReqError } =
    useSendFriendRequests();

  const handleSearch = useCallback(async (text: string) => {
    setSearchText(text);
  }, []);

  const { setInternalClickState } = useLiveLink();

  const handleButtonClick = (user: AuthUser) => {
    if (!user) return;
    sendReqMutate({
      requestSender: authUser as AuthUser, // this is me
      requestReceiver: user as AuthUser, // this is friend
    });
    // setInternalClickState("");
  };
  return (
    <div
      className={`z-50 transition-all bg-[var(--pattern_2)] h-full w-full sm:w-90  custom-scrollbar-y `}
    >
      <div className=" p-5 justify-center items-center  sticky top-0 space-y-2  bg-[var(--pattern_2)]">
        <div className="sticky top-5">
          <div className="flex flex-col gap-2 justify-start items-center  sticky top-0 bg-[var(--pattern_2)]">
            <TopBar
              type="back"
              title="Add New Friend"
              route="edit"
              subTitle="Search friends by their name"
              callback={setInternalClickState}
            />
            <SearchArea
              onSearch={handleSearch}
              placeholder="Search name"
              className="w-full "
            />
          </div>

          <div className="flex flex-col w-auto gap-2 mt-2 ">
            <h1 className="text-start text-[var(--pattern_4)] text-xs">
              {isSearchLoading
                ? ""
                : `${searchData?.users?.length ?? "0"} result found`}
            </h1>

            <Spinner condition={isSearchLoading} />

            {searchData && searchData?.users?.length > 0 ? (
              searchData?.users.map((user: AuthUser, i: number) => (
                <UserCard
                  avatar={user.dp}
                  key={i}
                  useFor="send-req"
                  name={user.name}
                  handleClick={() => handleButtonClick(user)}
                />
              ))
            ) : (
              <h1 className="text-center">
                {searchData && searchData?.message}
              </h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
AddNewFriend.displayName = "AddNewFriend";
