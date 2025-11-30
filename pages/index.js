import { useEffect, useState, useRef } from "react";
import Head from "next/head";

// [country/lang/currency/tab/deal data same as before, but now...]
const MULTI_DEALS = {
  flights: [
    {
      title: "London → Rome £68 (Skyscanner)",
      img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
      desc: "Nonstop last minute · Save 35%",
      badge: "EXCLUSIVE", link: "https://www.skyscanner.net/?associateid=YOUR_SKYSCANNER_ID"
    },
    {
      title: "Manchester to Malaga £97",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&q=80",
      desc: "Direct deal, free drinks · Book by today",
      badge: "HOT FLIGHT", link: "https://www.booking.com/index.html?aid=YOUR_BOOKING_AID"
    },
    // ...more
  ],
  hotels: [
    {
      title: "Dubai 5★ Resort £99/night (Booking)",
      img: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&q=80",
      desc: "Breakfast. Pool. Family Fun.",
      badge: "HOTEL DEAL", link: "https://www.booking.com/index.html?aid=YOUR_BOOKING_AID"
    },
    {
      title: "Paris Luxury Boutique £120 (Agoda)",
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80",
      desc: "Breakfast and wine included",
      badge: "EXCLUSIVE", link: "https://agoda.com"
    },
    //...more
  ],
  car: [
    {
      title: "Barcelona Car £15/day (Rentalcars)",
      img: "https://images.unsplash.com/photo-1516575529150-6b8a0b9029d4?w=600&q=80",
      desc: "Free navigation & upgrades",
      badge: "DRIVE DEAL", link: "https://www.rentalcars.com/?affiliateCode=YOUR_RENTALCARS_ID"
    },
    {
      title: "NYC SUV £22/day (Expedia)",
      img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600&q=80",
      desc: "Winter discount—ends soon",
      badge: "LIMITED", link: "https://www.expedia.com/Cars"
    },
    //...
  ],
  things: [
    {
      title: "Paris Guided Tour -25%",
      img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600&q=80",
      desc: "Skip-the-line, museum, wine",
      badge: "EXPERIENCE", link: "https://partner.getyourguide.com/?partner_id=YOUR_GYG_ID"
    },
    // ...
  ]
};