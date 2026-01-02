import { motion } from "framer-motion";

const ScheduleMessage = ({
  setTime,
}: {
  setTime: React.Dispatch<React.SetStateAction<Date>>;
}) => {
 
  return (
    <motion.div
      initial={{ y: 10, x: 0, opacity: 100 }}
      animate={{ y: 0, x: 0 }}
      exit={{ y: 10, x: 0, opacity: 0 }}
      className="absolute bottom-16 left-10 w-fit text-xs bg-white text-black p-2 rounded-xl"
    >
      <div className=" justify-between w-full">
        <div className="flex w-full gap-5">
          <strong className="w-full">Send Date: </strong>
          {/* <input
            type="date"
            className="w-full"
            onChange={(e) => setDate(e.target.value)}
          /> */}
        </div>
        <div className="flex w-full gap-5">
          <strong className="w-full">Send Time: </strong>
          <input
            type="datetime-local"
            className="w-full text"
            onChange={(e) => setTime(new Date(e.target.value))}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ScheduleMessage;
