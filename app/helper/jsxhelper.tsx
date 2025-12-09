import {
  IoCheckmark,
  IoCheckmarkDone,
  IoCheckmarkDoneSharp,
} from "react-icons/io5";
export function OnMessageSeen(condition: boolean, status: string) {
  if (condition) {
    return (
      <div>
        {status === "seen" && <IoCheckmarkDoneSharp color="lightgreen" />}
        {status === "delivered" && <IoCheckmarkDone />}
        {status === "sent" && <IoCheckmark />}
      </div>
    );
  }
  return <div>{null}</div>;
}

export function formattedDate(createdAt: string) {
  const now = new Date(createdAt);
  const date = new Date();

  const difference = (now.getTime() - date.getTime()) / 1000;

  const days = Math.floor(difference / 86400);

  return days;
}
