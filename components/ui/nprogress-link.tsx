"use client";
 
import { useRouter, usePathname } from "next/navigation"; 
import Link, { LinkProps } from "next/link"; 
import NProgress from "nprogress"; 
import { useRef } from "react";

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
  const isNavigating = useRef(false); // ← prevents consecutive clicks
 
  const handleClick = (e: React.MouseEvent) => { 
    e.preventDefault();

    // Already navigating, ignore
    if (isNavigating.current) return;

    if (typeof href === "string" && pathname === href) { 
      NProgress.done(); 
      return; 
    } 
 
    isNavigating.current = true;
    NProgress.start(); 

    setTimeout(() => {
      router.push(typeof href === "string" ? href : href.pathname || "/");
      isNavigating.current = false;
    }, 1000);
  }; 
 
  return ( 
    <Link href={href} onClick={handleClick} className={className} {...props}> 
      {children} 
    </Link> 
  ); 
}