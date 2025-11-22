import { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex bg-[var(--pattern_1)] w-full h-screen ">
            {children}
            {/* side nav bar */}

            {/* chat list section */}

            {/* chatting section */}

            {/* chat info section */}
        </div>
    );
};

export default MainLayout;
