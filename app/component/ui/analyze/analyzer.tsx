"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { Suspense, useState } from "react";
import { TbReportSearch } from "react-icons/tb";
const AnalyzerModal = React.lazy(
  () => import("@/app/component/ui/analyze/AnalyzerModal")
);
const Analyzer = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <div
      className=" flex fixed  bottom-20 right-10 w-10 h-10 justify-center items-center z-[99999] "
      onClick={() => setOpenModal((prev) => !prev)}
    >
      <div className="hover:scale-125 opacity-20 hover:opacity-100 transition-all cursor-pointer  bg-amber-600 rounded-full p-2">
        <TbReportSearch size={30} />
      </div>
      <AnimatePresence>
        {openModal && (
          <Suspense fallback={null}>
            <motion.div
              initial={{ y: -350, scale: 0.8, opacity: 0 }}
              animate={{ y: -400, scale: 1, opacity: 1 }}
              exit={{ y: -350, scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <AnalyzerModal />
            </motion.div>
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Analyzer;
