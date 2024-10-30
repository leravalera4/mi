"use client"
import React from "react";
import localFont from "next/font/local";
import header from "../../app/images/header.svg";
import Image from "next/image";
import Cart from "../cart";
import Navigation from "../navigation";
import Link from "next/link";
import './styles.css'
import Headroom from 'react-headroom';
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

const Header = () => {

  const [isSticky, setIsSticky] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      // Set isSticky to true if the user has scrolled past a certain point, else set it to false
      setIsSticky(window.scrollY > 0); // Adjust 100 to the desired scroll position
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Headroom style={{
      webkitTransition: 'all .5s ease-in-out',
      mozTransition: 'all .5s ease-in-out',
      oTransition: 'all .5s ease-in-out',
      transition: 'all .5s ease-in-out'
    }}>
            <header className="header"
        // style={{
        //   boxShadow: "rgba(37,39,89,0.08) 0px 8px 8px 0",
        //   display: "flex",
        //   alignItems: "center",
        //   paddingLeft: "80px",
        //   position: "fixed",
        //   top: "0",
        //   width: "100%",
        //   zIndex: "1000",
        //   backgroundColor:'white'
        // }}
      >
        <div style={{display:'flex',flexDirection:'row'}}>
        <Link href="/">
          <Image alt="header" src={header} width={70} height={70} />
        </Link>
        <Link style={{ textDecoration: "none" }} href="/">
          <h1
            style={{ textDecoration: "none", color: "black" }}
            className={noir.className}
          >
            Shoppy Scan
          </h1>
        </Link> 
        </div>      
        <Navigation style={{display:'flex',justifyContent:'center',alignItms:'center'}} />
        <Cart style={{paddingRigt:'80px',zIndex:'100000'}}/>
      </header>
    </Headroom>

  );
};

export default Header;
