"use client";
import { Button } from "../../component/button";
import { EndItems, MiddleItems, StartItems } from "../../util/data";
import { useDispatch, useSelector } from "react-redux";
import { PusherChatDispatch, PusherChatState } from "../../types";
import { setCurrentTab } from "../../lib/redux/layoutSlicer";
import { useRouter } from "next/navigation";

// one hydration error occur in this component that needed be solve
const SidebarComponent = () => {
    const dispatch = useDispatch<PusherChatDispatch>();
    const currentTab = useSelector(
        (store: PusherChatState) => store.layout.currentTab
    );
    const router = useRouter();

    return (
        <div className="bg-[var(--pattern_1)] w-14 h-full flex flex-col justify-between py-2 px-1">
            <div className="flex flex-col justify-center">
                {StartItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.name} className="relative rounded-4xl">
                            <Button
                                variant="transparent"
                                radius="md"
                                className={`w-12 ${
                                    currentTab === item.name
                                        ? "bg-[var(--pattern_2)]"
                                        : "bg-transparent"
                                }`}
                                onClick={() => {
                                    dispatch(setCurrentTab(item.name));
                                    router.push(`/${item.name}`);
                                }}
                            >
                                {/* <p>{item.name}</p> */}
                                <Icon size={16} className="relative" />
                                <div
                                    className={`${
                                        currentTab === item.name
                                            ? " border-green-500"
                                            : " border-transparent"
                                    }
                                            transition-all absolute top-0  rounded-2xl translate-x-1/2 translate-y-1/2 border-l border-4 h-5 left-0`}
                                ></div>{" "}
                            </Button>
                        </div>
                    );
                })}
            </div>
            <div className="flex flex-col justify-center">
                {MiddleItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.name} className="relative rounded-4xl">
                            <Button
                                variant="transparent"
                                radius="md"
                                className={`${
                                    currentTab === item.name
                                        ? "border-red-500 bg-[var(--pattern_2)]"
                                        : "bg-transparent"
                                }`}
                                onClick={() =>
                                    dispatch(setCurrentTab(item.name))
                                }
                            >
                                {/* <p>{item.name}</p> */}
                                <Icon size={16} className="relative" />
                                <div
                                    className={`${
                                        currentTab === item.name
                                            ? " border-green-500"
                                            : " border-transparent"
                                    }
                                            transition-all absolute top-0 rounded-2xl translate-x-1/2 translate-y-1/2 border-l border-4 h-5 left-0`}
                                ></div>{" "}
                            </Button>
                        </div>
                    );
                })}
            </div>
            <div className="flex flex-col justify-center">
                {EndItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.name} className="relative rounded-4xl">
                            <Button
                                variant="transparent"
                                radius="md"
                                className={`${
                                    currentTab === item.name
                                        ? "bg-[var(--pattern_2)]"
                                        : "bg-transparent"
                                }`}
                                onClick={() =>
                                    dispatch(setCurrentTab(item.name))
                                }
                            >
                                {/* <p>{item.name}</p> */}
                                <Icon size={16} className="relative" />
                                <div
                                    className={`${
                                        currentTab === item.name
                                            ? " border-green-500"
                                            : " border-transparent"
                                    }
                                            transition-all absolute top-0  rounded-2xl translate-x-1/2 translate-y-1/2 border-l border-4 h-5 left-0`}
                                ></div>
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SidebarComponent;
