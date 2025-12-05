export function formattedDate(createdAt: string) {
  const now = new Date(createdAt);
  const date = new Date();

  const difference = (now.getTime() - date.getTime()) / 1000;

  const days = Math.floor(difference / 86400);

  return days;
}
