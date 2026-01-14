import { BiError } from "react-icons/bi";
import { Button } from "./button";
const Connectivity = ({ state }: { state: boolean }) => {
  if (state) return;
  return (
    <div className="bg-black  backdrop-blur-2xl fixed flex flex-col top-0 left-0 w-full h-full justify-center items-center">
      <div className="p-3 bg-red-500/20 rounded-full mb-2">
        <BiError size={40} color="red" />
      </div>
      <h2 className="text-white font-bold text-xl">Couldn&apos;t connect to Ozone</h2>
      <p className="text-gray-500 text-sm">No Internet Connection</p>
      <Button
        variant="dark"
        radius="full"
        onClick={() => window.location.reload()}
      >
        Refresh
      </Button>
    </div>
  );
};

export default Connectivity;
