import Image from "next/image";
import { FaFilePdf } from "react-icons/fa6";
const display = ({ msg }: { msg: string }) => {
  const { format, url } = JSON.parse(msg);

  const openPDF = () => {
    window.open(url, "_blank");
  };
  const openImage = () => {
    window.open(url, "_blank");
  };
  if (url) {
    if (
      String(format).includes("png") ||
      String(format).includes("jpeg") ||
      String(format).includes("jpg")
    ) {
      return (
        <Image
          onClick={openImage}
          src={url ?? "/12.png"}
          alt="upload Image"
          width={150}
          height={150}
          className="object-contain"
        ></Image>
      );
    } else if (String(format).includes("pdf")) {
      return (
        <div>
          <FaFilePdf
            size={50}
            onClick={openPDF}
            className="transition-all hover:scale-110 cursor-pointer"
          />
        </div>
      );
    }
  }
};

export default display;
