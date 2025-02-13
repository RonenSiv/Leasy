"use client";
import { useEffect } from "react";

export default function ClosePopup() {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage("google-auth-success", "*");
    }
    // Close the popup
    window.close();
  }, []);

  return <div>Closing popup and redirecting...</div>;
}
