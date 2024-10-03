"use client";

import "nprogress/nprogress.css";
import NProgress from "nprogress";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

NProgress.configure({
  template: `<div class="bar" role="bar" style="height:3px;background:#2CA15D"></div>`,
});

export function Progress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
    return () => {
      NProgress.start();
    };
  }, [pathname, searchParams]);

  return <></>;
}
