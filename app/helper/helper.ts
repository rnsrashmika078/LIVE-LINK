/* eslint-disable @typescript-eslint/no-explicit-any */
export async function apiFetch(
  route: string,
  method: "GET" | "POST" | "DELETE" | "PUT",
  body?: any,
  routeType: "NATIVE" | "EXTERNAL" = "NATIVE",
  cache:
    | "no-store"
    | "force-cache"
    | "no-cache"
    | "default"
    | "only-if-cached"
    | "reload" = "no-store"
) {
  let res;
  if (routeType === "EXTERNAL") {
    res = await fetch(`${route}`, {
      method,
      cache,
      body,
    });
  } else {
    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${route}`, {
      method,
      cache,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  return res;
}

export function modifiedMessage(input: string): string | null {
  if (!input) return null;
  let msg;
  try {
    const parsedMessage =
      typeof input === "string" ? JSON?.parse(input) : input;
    const { url, format, message, name } = parsedMessage;

    if (url && message) {
      msg = message;
    } else if (url) {
      msg = name + "." + format;
    } else {
      msg = message;
    }
  } catch (err) {
    console.log(err);
  }

  return msg;
}

export function modifiedMessageOnMessageArea(
  input: string,
  to: "file" | "message" = "message"
): string | null {
  if (!input) return null;

  const { message, url } = JSON.parse(input);

  if (to === "file" && url) {
    return url;
  }
  if (to === "message" && message) {
    return message;
  }
  return null;
}
export function elapsedTime(startedAt: number) {
  const time = new Date();
  return time;
}
//action menu operations functions
