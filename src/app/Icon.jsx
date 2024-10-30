"use client"
import lottie from 'lottie-web';
import { defineElement } from 'lord-icon-element';

// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);

export default function Lordicon() {
    return (
       <>  
        <lord-icon
         src="https://cdn.lordicon.com/afqjkqgo.json"
         trigger="hover"
         style={{
           width: "75px",
           height: "75px",
         }}
       ></lord-icon>
       </>
     ); 
   }