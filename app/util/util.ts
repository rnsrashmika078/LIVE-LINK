import { cookies } from "next/headers";

export async function setUserCookies(uid: string) {
  (await cookies()).set("uid", uid, {
    httpOnly: true, // cookies can access only within server: same as express . this is important
    secure: true,
    sameSite: "strict",
    path: "/", // across the app
  });
}
//npm install firebase-admin

//currently not in use
