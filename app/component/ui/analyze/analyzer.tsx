"use client";
import React, { Suspense, useState } from "react";
import { TbReportSearch } from "react-icons/tb";
import Spinner from "../spinner";
const AnalyzerModal = React.lazy(
  () => import("@/app/component/ui/analyze/AnalyzerModal")
);
const Analyzer = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <div className=" flex fixed  bottom-20 right-10 w-10 h-10 justify-center items-center z-[99999] ">
      <div className="hover:scale-125  transition-all cursor-pointer  bg-amber-600 rounded-full p-2">
        <TbReportSearch
          size={30}
          onClick={() => setOpenModal((prev) => !prev)}
        />
      </div>
      {openModal && (
        <Suspense fallback={null}>
          <AnalyzerModal />
        </Suspense>
      )}
    </div>
  );
};

export default Analyzer;
