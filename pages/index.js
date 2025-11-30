import { useState } from "react";
import Head from "next/head";

// Replace with your real Booking.com affiliate ID!
const BOOKING_AID = "YOUR_AFFILIATE_ID";

export default function Home() {
  const [ss, setSs] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    if (!ss || !checkin || !checkout) return;
    const inDate = new Date(checkin);
    const outDate = new Date(checkout);
    const url = `https://www.booking.com/searchresults.html?aid=${BOOKING_AID
      }&ss=${encodeURIComponent(ss)
      }&checkin_year=${inDate.getFullYear()
      }&checkin_month=${inDate.getMonth() + 1
      }&checkin_monthday=${inDate.getDate()
      }&checkout_year=${outDate.getFullYear()
      }&checkout_month=${outDate.getMonth() + 1
      }&checkout_monthday=${outDate.getDate()}`;

    window.open(url, "_blank");
  }

  return (
    <>
      <Head>
        <title>TravelDistant | Compare Hotels & Book Last-Minute</title>
        <meta name="description" content="TravelDistant - Instantly compare last-minute deals for hotels and holidays. Powered by affiliate booking—get paid every booking!" />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2203546185229559"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <main style={{ fontFamily: "sans-serif", background: "#f5f6fa", minHeight: "100vh", padding: 0 }}>
        <header style={{ background: "#fff", padding: "25px 0 10px 0", textAlign: "center", boxShadow: "0 1px 12px #ebeaea" }}>
          <h1 style={{ fontSize: "2.3rem", color: "#037fff" }}>
            <span role="img" aria-label="globe">🌍</span> TravelDistant
          </h1>
          <div style={{fontSize: "1.2rem", color: "#222"}}>Search the best live hotel deals and book with one click.</div>
        </header>

        <section style={{
          maxWidth: 540, margin: "40px auto", background: "#fff",
          borderRadius: 12, padding: "26px 5vw", boxShadow: "0 2px 16px #ececec"
        }}>
          <form onSubmit={handleSearch}
            style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "end" }}>
            <div style={{ flex: 1 }}>
              <label>Destination / Hotel<br />
                <input
                  type="text"
                  value={ss}
                  onChange={e => setSs(e.target.value)}
                  required
                  style={{
                    width: "100%", padding: 12, borderRadius: 7, border: "1px solid #ccd"
                  }} />
              </label>
            </div>
            <div>
              <label>Check-in<br />
                <input
                  type="date"
                  value={checkin}
                  onChange={e => setCheckin(e.target.value)}
                  required
                  style={{
                    width: "140px", padding: 12, borderRadius: 7, border: "1px solid #ccd"
                  }} />
              </label>
            </div>
            <div>
              <label>Check-out<br />
                <input
                  type="date"
                  value={checkout}
                  onChange={e => setCheckout(e.target.value)}
                  required
                  style={{
                    width: "140px", padding: 12, borderRadius: 7, border: "1px solid #ccd"
                  }} />
              </label>
            </div>
            <button
              type="submit"
              style={{
                background: "#037fff", color: "#fff",
                padding: "12px 28px", border: "none", borderRadius: 8,
                fontWeight: 700, fontSize: "1rem", cursor: "pointer"
              }}>
              Search Deals
            </button>
          </form>
          <div style={{marginTop:18, fontSize:".95rem", color:"#686"}}>We earn a commission from our booking partner, at no extra cost to you.</div>
        </section>

        {/* Demo AdSense ad slot */}
        <div style={{ textAlign: "center", margin: "38px 0" }}>
          <ins className="adsbygoogle"
            style={{ display: "block", textAlign: "center", minHeight: 90 }}
            data-ad-client="ca-pub-2203546185229559"
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
          <script>
            {`(adsbygoogle = window.adsbygoogle || []).push({});`}
          </script>
        </div>

        <footer style={{
          marginTop: 40,
          textAlign: "center",
          fontSize: ".97rem",
          color: "#999"
        }}>
          <hr style={{border:"none", height:1, background:"#ddd", margin:"32px auto", width:"80%"}}/>
          © {new Date().getFullYear()} TravelDistant<br />
          Site powered by affiliate and Google AdSense revenue.
        </footer>
      </main>
    </>
  );
}