// middleware.ts
import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // const res = NextResponse.next();
  // res.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
  // res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  // res.headers.set("Access-Control-Allow-Headers", "*");
  // res.headers.set("Access-Control-Allow-Credentials", "true");
  // return res;

  const cookie = req.cookies.get("uid")?.value;

  const isAuthenticated = cookie === "undefined" ? false : true;

  const protectedRoutes = ["/livelink", "/livelink/chats"];

  const publicRoutes = ["/sign-in"];

  const path = req.nextUrl.pathname;

  for (const route of protectedRoutes) {
    if (path.startsWith(route) && !isAuthenticated) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  for (const route of publicRoutes) {
    if (path.startsWith(route) && isAuthenticated) {
      return NextResponse.redirect(new URL("/livelink", req.url));
    }
  }

  return NextResponse.next();
}
