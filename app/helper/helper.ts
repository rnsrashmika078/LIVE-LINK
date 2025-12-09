/* eslint-disable @typescript-eslint/no-explicit-any */
export async function apiFetch(
  route: string,
  method: "GET" | "POST" | "DELETE" | "PUT",
  body?: any,
  routeType: "NATIVE" | "EXTERNAL" = "NATIVE"
) {
  let res;
  if (routeType === "EXTERNAL") {
    res = await fetch(`${route}`, {
      method,
      cache: "no-store",
      body,
    });
  } else {
    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${route}`, {
      method,
      cache: "no-store",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  return res;
}

export function modifiedMessage(input: string): string | null {
  if (!input) return null;
  const { url, format, message, name } = JSON.parse(input);

  if (url && message) {
    return message;
  } else if (url) {
    return name + "." + format;
  } else {
    return message;
  }
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
