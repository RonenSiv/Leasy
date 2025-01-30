"use client";

import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false });

export function PageTransition() {
  //const pathname = usePathname()
  //const searchParams = useSearchParams()

  useEffect(() => {
    const handleStart = () => {
      NProgress.start();
    };
    const handleStop = () => {
      NProgress.done();
    };

    const handleRouteChange = () => {
      handleStart();
      setTimeout(handleStop, 100);
    };

    handleRouteChange();

    window.addEventListener("routeChangeStart", handleStart);
    window.addEventListener("routeChangeComplete", handleStop);
    window.addEventListener("routeChangeError", handleStop);

    return () => {
      window.removeEventListener("routeChangeStart", handleStart);
      window.removeEventListener("routeChangeComplete", handleStop);
      window.removeEventListener("routeChangeError", handleStop);
    };
  }, []);

  return null;
}
