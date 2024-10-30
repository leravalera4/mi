import React from "react";
import funFacts from "./facts";
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

const facts = () => {
  const randomIndex = Math.floor(Math.random() * funFacts.length);
  const randomFunFact = funFacts[randomIndex];

  return (
    <div>
      <h2 style={{marginTop:"0px"}} className={noir.className}>{randomFunFact}</h2>
    </div>
  );
};

export default facts;
