"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      // 1) Store the token in a cookie
      Cookies.set("LeasyToken", token, {
        path: "/",
        // expires: 7 // optional
      });

      // 2) Check if we're in a popup:
      if (window.opener) {
        // If so, optionally tell the parent we've succeeded:
        window.opener.postMessage("google-auth-success", "*");
        // Then close the popup:
        window.close();
      }
    }
  }, [token, router]);

  return <div>Preparing to exit..</div>;
}
