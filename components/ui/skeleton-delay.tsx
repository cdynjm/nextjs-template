"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface SkeletonDelayProps {
  delay?: number;
  skeleton: React.ReactNode;
  children: React.ReactNode;
}

const visitedPaths = new Set<string>();

export function SkeletonDelay({
  delay = 500,
  skeleton,
  children,
}: SkeletonDelayProps) {
  const pathname = usePathname();
  const [showSkeleton, setShowSkeleton] = useState(() => !visitedPaths.has(pathname));

  useEffect(() => {
    if (!visitedPaths.has(pathname)) {
      const timer = setTimeout(() => {
        setShowSkeleton(false);
        visitedPaths.add(pathname);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowSkeleton(false), 0);
      return () => clearTimeout(timer);
    }
  }, [pathname, delay]);

  return <>{showSkeleton ? skeleton : children}</>;
}