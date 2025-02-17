"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

/**
 * Helper to open a centered popup window
 */
function openPopupCenter(url: string, title: string, w = 500, h = 550) {
  const dualScreenLeft = window.screenLeft ?? window.screenX;
  const dualScreenTop = window.screenTop ?? window.screenY;

  const width = window.innerWidth || document.documentElement.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight;
  const systemZoom = width / window.screen.availWidth;

  const left = (width - w) / 2 / systemZoom + dualScreenLeft;
  const top = (height - h) / 2 / systemZoom + dualScreenTop;

  const newWindow = window.open(
    url,
    title,
    `width=${w / systemZoom},height=${h / systemZoom},top=${top},left=${left}`,
  );

  if (newWindow) {
    newWindow.focus();
  }
  return newWindow;
}

/**
 * Hook that handles opening Google OAuth in a popup and listens for events.
 */
export function useGoogleAuthPopup() {
  const [loading, setLoading] = useState(false);
  const popUpRef = useRef<Window | null>(null);
  const router = useRouter();

  // 1) Function to open the popup
  const openGooglePopup = (url: string) => {
    try {
      setLoading(true);
      popUpRef.current = openPopupCenter(url, "Google Login");
      if (!popUpRef.current) {
        setLoading(false);
        toast.error("Unable to open popup.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  // 2) Poll every 0.5s to see if the popup was manually closed
  useEffect(() => {
    if (!loading || !popUpRef.current) return;

    const timer = setInterval(() => {
      if (popUpRef.current && popUpRef.current.closed) {
        clearInterval(timer);
        setLoading(false);
        toast.error("Popup closed before login.");
      }
    }, 500);

    return () => clearInterval(timer);
  }, [loading]);

  // 3) Listen for postMessage from the popup (in case your backend / final page does window.opener.postMessage)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Optionally, check event.origin if you want to ensure the message is from your backend domain
      if (event.data === "google-auth-success") {
        popUpRef.current?.close();
        setLoading(false);
        toast.success("Login successful!");
        // Or do whatever next step:
        router.push("/dashboard");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  return {
    loading, // rename to googleAuthLoading in your component if you want
    openGooglePopup,
  };
}
