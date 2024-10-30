"use client";

import React from "react";
import Link from "next/link";
import localFont from "next/font/local";
import "./style.css";
import { usePathname } from "next/navigation";

const noir = localFont({
  src: [
    {
      path: "../../app/fonts/NoirPro-Light.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../app/fonts/NoirPro-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../app/fonts/NoirPro-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});

const index = () => {
  const pathname = usePathname();

  // Function to determine if a route is active

  return (
    <div>
    <nav style={{display: "flex",
      alignItems: "center",
      justifyContent: "center"}}>
        <Link style={{paddingRight:'16px'}}
          href="/"
          className={`${noir.className} ${pathname === '/' ? 'active' : 'link'}`} 
        >
          Special Price
        </Link>
        <Link
          href="/about"
          className={`${noir.className} ${pathname === '/about' ? 'active' : 'link'}`} 
        >
          Compare Prices
        </Link>
    </nav>
    </div>
  );
};

export default index;
