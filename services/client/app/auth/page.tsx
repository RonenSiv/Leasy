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
      Cookies.set("LeasyToken", token, {
        path: "/",
        // expires: 7 // (optional) set how many days until it expires
      });
      console.log(token);
      router.push("/dashboard");
    }
  }, [token, router]);

  return <p>Finalizing login...</p>;
}
