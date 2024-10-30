import React from "react";
import localFont from "next/font/local";
import chart from "../../app/images/chart.svg";
import Image from "next/image";
import savings from "../../app/images/savings.svg";
import grocery from "../../app/images/grocery.svg";
import coins from "../../app/images/coins.svg";
import sale from "../../app/images/sale.svg";
import cart from "../../app/images/cart.svg";


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
    <div style={{paddingTop:"32px"}}>
      <h1 style={{ fontSize: "20px" }} className={noir.className}>
        Welcome to Shoppy Scan, your ultimate companion for savvy shopping and
        significant savings!
      </h1>
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Image src={chart} width={40} height={40} alt="chart" />
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "600",
            paddingBottom: "0px",
            marginBottom: "0px",
          }}
          className={noir.className}
        >
          Compare Prices in Different Stores
        </h1>
      </div>
      <p
        style={{ marginTop: "2px", fontSize: "16px" }}
        className={noir.className}
      >
        Easily compare the prices of your favorite products across various
        stores to ensure you're getting the best deals. Shoppy Scan empowers you
        to make informed decisions, helping you save on every item on your
        shopping list.
      </p>
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Image src={sale} width={40} height={40} alt="chart" />
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "600",
            paddingBottom: "0px",
            marginBottom: "0px",
          }}
          className={noir.className}
        >
          Check What's on Sale
        </h1>
      </div>
      <p
        style={{ marginTop: "2px", fontSize: "16px" }}
        className={noir.className}
      >
        Stay in the loop with the latest discounts and promotions. Shoppy Scan
        allows you to quickly identify products currently on sale, making it a
        breeze to capitalize on special offers and maximize your savings.
      </p>
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Image src={cart} width={40} height={40} alt="chart" />
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "600",
            paddingBottom: "0px",
            marginBottom: "0px",
          }}
          className={noir.className}
        >
          Add to Cart for Easy Tracking and Comparison
        </h1>
      </div>
      <p
        style={{ marginTop: "2px", fontSize: "16px" }}
        className={noir.className}
      >
        Simplify your shopping strategy by adding items to your virtual cart.
        Keep track of products you're interested in purchasing and receive
        updates on their prices. With Shoppy Scan, you can easily compare prices
        in your cart across different stores, ensuring you never miss out on a
        great deal.
      </p>
      {/* <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Image src={savings} width={40} height={40} alt="chart" />
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "600",
            paddingBottom: "0px",
            marginBottom: "0px",
          }}
          className={noir.className}
        >
          Find Where It's Cheaper to Buy Today
        </h1>
      </div>
      <p
        style={{ marginTop: "2px", fontSize: "17px" }}
        className={noir.className}
      >
     Take the guesswork out of your
        shopping decisions. Shoppy Scan lets you discover the most
        cost-effective options by comparing prices at different stores. Whether
        it's your regular grocery run or a special purchase, make sure you're
        getting the best value for your money. Save time, save money, and shop
        smarter with Shoppy Scan!
      </p> */}
    </div>
  );
};

export default index;
