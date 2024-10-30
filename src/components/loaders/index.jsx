import React from 'react'
import Spiner from '../spiner'
import Funfact from "../facts/facts.jsx";
import localFont from "next/font/local";

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
    {
      path: "../../app/fonts/NoirPro-Medium.otf",
      weight: "500",
      style: "normal",
    },
  ],
});

const index = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column",alignItems:'center',paddingTop:'48px' }}>
      <Spiner style={{width:'40px',height:'40px'}}/>
    <p style={{marginBottom:"0px"}} className={noir.className}>We're loading the best deals for you, but here's an interesting fact
    you didnt know...</p>
    <Funfact />
  </div>
  )
}

export default index