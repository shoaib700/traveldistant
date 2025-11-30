import { useState } from "react";
import Head from "next/head";

const BOOKING_AID = "YOUR_BOOKING_AID";          // Booking.com
const SKYSCANNER_ID = "YOUR_SKYSCANNER_ID";      // Skyscanner
const EXPEDIA_ID = "";                           // Optional: Expedia Partners
const RENTALCARS_PARTNER = "YOUR_RENTALCARS_ID"; // Rentalcars.com
const GETYOURGUIDE_PARTNER = "YOUR_GYG_ID";      // GetYourGuide
const KLOOK_REF = "YOUR_KLOOK_REF";              // Klook

const todayStr = () => new Date().toISOString().slice(0,10);
const tomorrowStr = () => {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return t.toISOString().slice(0, 10);
};

export default function Home() {
  const [tab, setTab] = useState("flights");

  // all search form state
  const [flightFrom, setFlightFrom] = useState("");
  const [flightTo, setFlightTo] = useState("");
  const [flightDepart, setFlightDepart] = useState(todayStr());
  const [flightReturn, setFlightReturn] = useState(tomorrowStr());

  const [hotelPlace, setHotelPlace] = useState("");
  const [hotelCheckin, setHotelCheckin] = useState(todayStr());
  const [hotelCheckout, setHotelCheckout] = useState(tomorrowStr());

  const [carLocation, setCarLocation] = useState("");
  const [carPick, setCarPick] = useState(todayStr());
  const [carDrop, setCarDrop] = useState(tomorrowStr());

  const [activityPlace, setActivityPlace] = useState("");
  const [activityDate, setActivityDate] = useState(todayStr());

  // Generic tab config
  function tabStyle(active) {
    return {
      border: "none",
      borderBottom: active ? "3px solid #037fff" : "1px solid #f2f2f2",
      background: active ? "#eef6ff" : "#fff",
      fontWeight: active ? 700 : 500,
      fontSize: "1.03rem",
      color: "#037fff",
      padding: "17px 32px 12px 32px",
      cursor: "pointer",
      outline: 0,
    };
  }

  // Form handlers (redirect to affiliate with pre-filled fields)
  function goFlights(e) {
    e.preventDefault();
    if (!flightFrom || !flightTo || !flightDepart) return;
    // Example: Skyscanner affiliate deep link
    // Docs: https://partners.skyscanner.net/affiliate-tools/tracking-links
    const url = `https://www.skyscanner.net/transport/flights/${encodeURIComponent(flightFrom)}/${encodeURIComponent(flightTo)}/${flightDepart.replace(/-/g,'')}/${
      flightReturn ? flightReturn.replace(/-/g,'') : ""
    }/?associateid=${SKYSCANNER_ID}`;
    window.open(url, "_blank");
  }
  function goHotels(e) {
    e.preventDefault();
    if (!hotelPlace || !hotelCheckin || !hotelCheckout) return;
    // Booking.com affiliate deep link
    let inDate = new Date(hotelCheckin), outDate = new Date(hotelCheckout);
    const url = `https://www.booking.com/searchresults.html?aid=${BOOKING_AID}&ss=${encodeURIComponent(hotelPlace)
      }&checkin_year=${inDate.getFullYear()
      }&checkin_month=${inDate.getMonth()+1
      }&checkin_monthday=${inDate.getDate()
      }&checkout_year=${outDate.getFullYear()
      }&checkout_month=${outDate.getMonth()+1
      }&checkout_monthday=${outDate.getDate()}`;
    window.open(url, "_blank");
  }
  function goCars(e) {
    e.preventDefault();
    if (!carLocation || !carPick || !carDrop) return;
    // Rentalcars.com deep link (read their affiliate docs for params)
    const url = `https://www.rentalcars.com/SearchResults.do?affiliateCode=${RENTALCARS_PARTNER}&dropCity=${encodeURIComponent(carLocation)}&puDay=${carPick.slice(-2)}&puMonth=${carPick.slice(5,7)}&puYear=${carPick.slice(0,4)}&doDay=${carDrop.slice(-2)}&doMonth=${carDrop.slice(5,7)}&doYear=${carDrop.slice(0,4)}`;
    window.open(url, "_blank");
  }
  function goActivities(e) {
    e.preventDefault();
    if (!activityPlace || !activityDate) return;
    // GetYourGuide example; adapt for any best commission provider
    const url = `https://partner.getyourguide.com/?partner_id=${GETYOURGUIDE_PARTNER}&q=${encodeURIComponent(activityPlace)}&date_from=${activityDate}`;
    window.open(url, "_blank");
  }

  return (
    <>
      <Head>
        <title>TravelDistant | Compare Flights, Hotels, Cars – Book & Save</title>
        <meta name="description" content="TravelDistant – Instantly compare flights, hotels, cars, and tours on major brands. Book with one click and get deals via affiliate partners." />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2203546185229559"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <div style={{background:"#f4f7fa", minHeight:"100vh", fontFamily:"'Segoe UI',sans-serif"}}>
        {/* Header */}
        <header style={{
          width: "100%",
          background: "#037fff",
          color: "#fff",
          padding: "18px 4vw 12px 4vw",
          fontWeight:700,
          letterSpacing:".7px",
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center"
        }}>
          <div style={{fontWeight:800, fontSize:"1.45rem", letterSpacing:".5px"}}>
            <span role="img" aria-label="globe">🌍</span> TravelDistant
          </div>
          <nav>
            <a href="#" style={{color:"#fff", marginRight:22, textDecoration:"none"}}>Flights</a>
            <a href="#" style={{color:"#fff", marginRight:22, textDecoration:"none"}}>Hotels</a>
            <a href="#" style={{color:"#fff", marginRight:22, textDecoration:"none"}}>Car Rental</a>
            <a href="#" style={{color:"#fff", marginRight:22, textDecoration:"none"}}>Things to Do</a>
            <a href="#" style={{color:"#fff", textDecoration:"none"}}>Help</a>
          </nav>
        </header>

        {/* Tabs: Flights, Hotels, Cars, Activities */}
        <div style={{
          maxWidth:780, background:"#fff", margin:"36px auto 30px auto",
          borderRadius:18, boxShadow:"0 2px 20px #e4eaf1", padding: "0 0 25px 0"
        }}>
          {/* Tab Buttons */}
          <div style={{display:"flex",borderBottom:"1px solid #e2eaf1", background:"#f8fafe"}}>
            <button style={tabStyle(tab==="flights")} onClick={()=>setTab("flights")}>Flights</button>
            <button style={tabStyle(tab==="hotels")} onClick={()=>setTab("hotels")}>Hotels</button>
            <button style={tabStyle(tab==="cars")} onClick={()=>setTab("cars")}>Car Rental</button>
            <button style={tabStyle(tab==="activities")} onClick={()=>setTab("activities")}>Things to Do</button>
          </div>
          {/* Tabs' Content */}
          <div style={{padding: "40px 32px", minHeight:230}}>
            {tab==="flights"&&(
              <form onSubmit={goFlights} style={{display:"flex", gap:12, flexWrap:"wrap", alignItems:"end"}}>
                <div>
                  <label>From<br/>
                    <input placeholder="e.g. LON" value={flightFrom} onChange={e=>setFlightFrom(e.target.value.toUpperCase())}
                      required style={{width:100,padding:9,borderRadius:7,border:"1px solid #ccd"}} />
                  </label>
                </div>
                <div>
                  <label>To<br/>
                    <input placeholder="e.g. NYC" value={flightTo} onChange={e=>setFlightTo(e.target.value.toUpperCase())}
                      required style={{width:100,padding:9,borderRadius:7,border:"1px solid #ccd"}} />
                  </label>
                </div>
                <div>
                  <label>Depart<br/>
                    <input type="date" value={flightDepart} onChange={e=>setFlightDepart(e.target.value)}
                      required style={{width:125,padding:9,borderRadius:7,border:"1px solid #ccd"}} />
                  </label>
                </div>
                <div>
                  <label>Return<br/>
                    <input type="date" value={flightReturn} onChange={e=>setFlightReturn(e.target.value)}
                      style={{width:125,padding:9,borderRadius:7,border:"1px solid #ccd"}} />
                  </label>
                </div>
                <button type="submit"
                  style={{
                    background:"#037fff", color:"#fff",
                    padding:"14px 32px", border:"none",borderRadius:8,
                    fontWeight:700,fontSize:"1rem",cursor:"pointer"
                  }}>
                  Search Flights
                </button>
              </form>
            )}
            {tab==="hotels"&&(
              <form onSubmit={goHotels} style={{display:"flex", gap:12, flexWrap:"wrap", alignItems:"end"}}>
                <div>
                  <label>Place/Hotel<br/>
                    <input placeholder="e.g. London" value={hotelPlace} onChange={e=>setHotelPlace(e.target.value)}
                      required style={{width:155,padding:9,borderRadius:7,border:"1px solid #ccd"}} />
                  </label>
                </div>
                <div>
                  <label>Check-in<br/>
                    <input type="date" value={hotelCheckin} onChange={e=>setHotelCheckin(e.target.value)}
                      required style={{width:125,padding:9,borderRadius:7,border:"1px solid #ccd"}} />
                  </label>
                </div>
                <div>
                  <label>Check-out<br/>
                    <input type="date" value={hotelCheckout} onChange={e=>setHotelCheckout(e.target.value)}
                      required style={{width:125,padding:9,borderRadius:7,border:"1px solid #ccd"}} />
                  </label>
                </div>
                <button type="submit"
                  style={{
                    background:"#12a45f", color:"#fff",
                    padding:"14px 32px", border:"none",borderRadius:8,
                    fontWeight:700,fontSize:"1rem",cursor:"pointer"
                  }}>
                  Search Hotels
                </button>
              </form>
            )}
            {tab==="cars"&&(
              <form onSubmit={goCars} style={{display:"flex", gap:12, flexWrap:"wrap", alignItems:"end"}}>
                <div>
                  <label>Pick-up City<br/>
                    <input placeholder="e.g. Paris" value={carLocation} onChange={e=>setCarLocation(e.target.value)}
                      required style={{width:155,padding:9,borderRadius:7,border:"1px solid #ccd"}} />
                  </label>
                </div>
                <div>
                  <label>Pick-up Date<br/>
                    <input type="date" value={carPick} onChange={e=>setCarPick(e.target.value)}
                      required style={{width:125,padding:9,borderRadius:7,border:"1px solid #ccd"}} />
                  </label>
                </div>
                <div>
                  <label>Drop-off Date<br/>
                    <input type="date" value={carDrop} onChange={e=>setCarDrop(e.target.value)}
                      required style={{width:125,padding:9,borderRadius:7,border:"1px solid #ccd"}} />
                  </label>
                </div>
                <button type="submit"
                  style={{
                    background:"#fe9000", color:"#fff",
                    padding:"14px 32px", border:"none",borderRadius:8,
                    fontWeight:700,fontSize:"1rem",cursor:"pointer"
                  }}>
                  Search Cars
                </button>
              </form>
            )}
            {tab==="activities"&&(
              <form onSubmit={goActivities} style={{display:"flex", gap:12, flexWrap:"wrap", alignItems:"end"}}>
                <div>
                  <label>City/Place<br/>
                    <input placeholder="e.g. Rome" value={activityPlace} onChange={e=>setActivityPlace(e.target.value)}
                      required style={{width:155,padding:9,borderRadius:7,border:"1px solid #ccd"}} />
                  </label>
                </div>
                <div>
                  <label>Date<br/>
                    <input type="date" value={activityDate} onChange={e=>setActivityDate(e.target.value)}
                      required style={{width:125,padding:9,borderRadius:7,border:"1px solid #ccd"}} />
                  </label>
                </div>
                <button type="submit"
                  style={{
                    background:"#eb003e", color:"#fff",
                    padding:"14px 32px", border:"none",borderRadius:8,
                    fontWeight:700,fontSize:"1rem",cursor:"pointer"
                  }}>
                  Search Things to Do
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main Banner Ad */}
        <div style={{textAlign:"center",margin:"38px 0 16px 0"}}>
          <ins className="adsbygoogle"
            style={{ display: "block", textAlign: "center", minHeight: 90 }}
            data-ad-client="ca-pub-2203546185229559"
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
          <script>{`(adsbygoogle = window.adsbygoogle || []).push({});`}</script>
        </div>

        {/* Popular Affiliate Links Row */}
        <div style={{maxWidth:810,margin:"35px auto 15px auto",display:"flex",gap:15,flexWrap:"wrap",justifyContent:"center"}}>
          <a href="https://www.booking.com/index.html?aid=YOUR_BOOKING_AID" target="_blank"
            style={{background:"#003580",color:"white",padding:"10px 18px",borderRadius:7,textDecoration:"none",fontWeight:600}}>Booking.com</a>
          <a href="https://www.skyscanner.net/?associateid=YOUR_SKYSCANNER_ID" target="_blank"
            style={{background:"#037fff",color:"white",padding:"10px 18px",borderRadius:7,textDecoration:"none",fontWeight:600}}>Skyscanner</a>
          <a href="https://www.expedia.com/" target="_blank"
             style={{background:"#fcb900", color:"#222", padding:"10px 18px", borderRadius:7,textDecoration:"none",fontWeight:600}}>Expedia</a>
          <a href="https://www.rentalcars.com/?affiliateCode=YOUR_RENTALCARS_ID" target="_blank"
            style={{background:"#fe9000",color:"white",padding:"10px 18px",borderRadius:7,textDecoration:"none",fontWeight:600}}>Rentalcars.com</a>
          <a href="https://partner.getyourguide.com/?partner_id=YOUR_GYG_ID" target="_blank"
              style={{background:"#22bf67",color:"white",padding:"10px 18px",borderRadius:7,textDecoration:"none",fontWeight:600}}>GetYourGuide</a>
          <a href="https://www.klook.com/affiliate/invite/YOUR_KLOOK_REF" target="_blank"
            style={{background:"#ff4c68",color:"white",padding:"10px 18px",borderRadius:7,textDecoration:"none",fontWeight:600}}>Klook</a>
        </div>

        {/* Footer */}
        <footer style={{
          marginTop:36,
          textAlign:"center",
          padding:"36px 0 14px 0",
          fontSize:"1rem",
          color:"#888",
          background:"#fff",
          borderTop:"1px solid #ebebeb"
        }}>
          &copy; {new Date().getFullYear()} Travel in UK Ltd. All rights reserved.
        </footer>
      </div>
    </>
  );
}