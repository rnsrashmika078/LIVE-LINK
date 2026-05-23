import { FaRegCircleDot } from "react-icons/fa6";

const IdleView = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-dark to-black/10">
      <div className="text-center px-8 max-w-2xl">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <FaRegCircleDot color="green" className="w-16 h-16 animate-pulse" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4">
          Share your status updates with your colleagues
        </h1>

        <p className="sub-styles mb-12">
          select status from left panel to view them or add status
        </p>
      </div>
    </div>
  );
};

export default IdleView;
