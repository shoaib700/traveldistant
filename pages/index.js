import { useEffect, useState, useRef } from "react";
import Head from "next/head";

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
  ],
  things: [
    {
      title: "Paris Guided Tour -25%",
      img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600&q=80",
      desc: "Skip-the-line, museum, wine",
      badge: "EXPERIENCE", link: "https://partner.getyourguide.com/?partner_id=YOUR_GYG_ID"
    },
  ]
};

export default function Home() {
  // ... Rest of your previous homepage code structure, as in the last answers.
  // Example rendering for deals below search:
  const [tab, setTab] = useState("flights");
  
  return (
    <>
      <Head>
        <title>TravelDistant | Cheap Flights, Hotels, Cars, Tours</title>
        <meta name="description" content="Auto-updating travel portal. Last minute deals, real-time SEO blogs, tabbed UI, auto Google ads, affiliate deals, and more." />
      </Head>
      <div>
        {/* ... YOUR NAVBAR, HERO, SEARCH ... */}
        
        {/* Deal Grid - Render only deals for current tab */}
        <section style={{ maxWidth: 1250, margin: "0 auto", padding: "20px 0 38px 0" }}>
          <h2 style={{textAlign:'center',fontWeight:800,fontSize:'1.55rem',marginBottom:24}}>Best <span style={{color:'#ec3099'}}>Deals</span> Right Now</h2>
          <div style={{display:"flex",gap:"18px",flexWrap:"wrap",justifyContent:"center"}}>
            {MULTI_DEALS[tab]?.map((deal,i) =>
              <div key={i} style={{width:290,background:'#fff',borderRadius:15,boxShadow:'0 2px 15px #eaeaf1',overflow:'hidden',marginBottom:14}}>
                <img src={deal.img} alt={deal.title} style={{width:'100%',height:150,objectFit:"cover"}}/>
                <div style={{padding:'15px 13px 12px 13px'}}>
                  <div style={{fontWeight:900,fontSize:"1.08rem",color:"#ea3199"}}>{deal.title}</div>
                  <div style={{margin:"6px 0 0px 0",color:"#565",fontWeight:500}}>{deal.desc}</div>
                  <span style={{fontSize:".98rem",color:"#fff",background:"#ea3199",borderRadius:6,padding:"3px 11px 3px 11px",marginRight:7}}>{deal.badge}</span>
                  <a href={deal.link} target="_blank" style={{display:'inline-block',marginTop:10,background:'#53adf6',color:'#fff',padding:'6px 16px',borderRadius:6,fontWeight:700,textDecoration:'none'}}>Book Deal</a>
                </div>
              </div>
            )}
          </div>
        </section>
        {/* ... rest of your page, tabs, footer, etc ... */}
      </div>
    </>
  );
}