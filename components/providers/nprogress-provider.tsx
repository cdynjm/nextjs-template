"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "@/app/styles/nprogress.css";

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 30,
  speed: 100,
  minimum: 0.1,
});

function NProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.start();

    const timeout = setTimeout(() => {
      NProgress.done();
    }, 200);

    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  return null;
}

export function NProgressProvider() {
  return (
    <Suspense fallback={null}>
      <NProgressInner />
    </Suspense>
  );
}