"use client";

import { useRouter, usePathname } from "next/navigation";
import Link, { LinkProps } from "next/link";
import NProgress from "nprogress";

type Props = {
  href: LinkProps["href"];
  children: React.ReactNode;
  className?: string;
};
export function route(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function NProgressLink({
  href,
  children,
  className,
  ...props
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (typeof href === "string" && pathname === href) {
      NProgress.done();
      return;
    }

    NProgress.start();
    router.push(typeof href === "string" ? href : href.pathname || "/");
  };

  return (
    <Link href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </Link>
  );
}