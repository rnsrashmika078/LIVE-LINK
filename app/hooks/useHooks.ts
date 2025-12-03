"use client";
export function usePathName() {
  if (typeof window !== "undefined") {
    return window.location.pathname;
  } else {
    return "";
  }
}
