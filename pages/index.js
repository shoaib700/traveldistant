import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>TravelDistant | Compare & Book Last-Minute Journeys</title>
        <meta name="description" content="TravelDistant: Exclusive last-minute travel deals, compare top hotels & flights, find adventure tours, and save more on every booking!" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2203546185229559"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <main style={{ maxWidth: 850, margin: "auto", padding: 24, fontFamily: "sans-serif" }}>
        <header>
          <h1 style={{ color: "#375A7F" }}>🌍 TravelDistant — Your Travel. Your Way.</h1>
          <p>Instantly compare the world's best last-minute deals on flights, hotels, tours & more.</p>
        </header>

        {/* Deals Carousel */}
        <section style={{ margin: "2.5rem 0" }}>
          <h2 style={{ fontSize: '1.25rem' }}>🔥 This Week's Hottest Deals</h2>
          <ul style={{ display: "flex", overflowX: "auto", listStyle: "none", padding: 0 }}>
            <li style={{ minWidth: 200, marginRight: 24, background: "#eef1f9", borderRadius: 8, padding: 10 }}>
              <p>🏖️ Cancun 5-star Stay: <b>$299</b></p>
              <a href="https://www.booking.com/index.html?aid=YOUR_AFFILIATE_ID"
                rel="noopener noreferrer" target="_blank">Book Hotel</a>
            </li>
            <li style={{ minWidth: 200, marginRight: 24, background: "#eef1f9", borderRadius: 8, padding: 10 }}>
              <p>✈️ Europe Return Flights: <b>$389</b></p>
              <a href="https://www.skyscanner.com/?associateid=YOUR_ID"
                rel="noopener noreferrer" target="_blank">Compare Flights</a>
            </li>
            <li style={{ minWidth: 200, marginRight: 24, background: "#eef1f9", borderRadius: 8, padding: 10 }}>
              <p>🌇 Dubai City Adventure: <b>30% OFF</b></p>
              <a href="https://www.getyourguide.com/?partner_id=YOUR_ID"
                rel="noopener noreferrer" target="_blank">Tour Excursion</a>
            </li>
          </ul>
        </section>

        {/* Search UI */}
        <section>
          <h2>Compare Flights & Hotels</h2>
          <form action="https://www.google.com/travel/flights" style={{ margin: "32px 0" }} target="_blank">
            <span>From:</span> <input name="origin" required style={{margin: '0 8px'}} />
            <span>To:</span> <input name="destination" required style={{margin: '0 8px'}} />
            <span>Depart:</span> <input name="depart" type="date" required style={{margin: '0 8px'}} />
            <button style={{ marginLeft: 16, padding: '8px 24px', background: '#375A7F', color: '#fff' }}>Search</button>
          </form>
        </section>

        {/* AdSense Placement */}
        <div style={{ margin: "40px 0" }}>
          <ins className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-2203546185229559"
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
          <script>
            {`
              (adsbygoogle = window.adsbygoogle || []).push({});
            `}
          </script>
        </div>

        {/* Newsletter/Lead Capture */}
        <section style={{ margin: "2rem 0", background: "#e8ffe9", padding: "1.2rem", borderRadius: 8 }}>
          <h3 style={{ margin: "0 0 .5rem 0" }}>💌 Get Fresh Deals Weekly</h3>
          <form action="https://YOUR-MAILER/subscribe" method="post" target="_blank">
            <input name="EMAIL" type="email" required placeholder="your@email.com" style={{ marginRight: 8, padding: 8 }} />
            <button type="submit" style={{ background: "#54ce5d", color: "white", padding: "8px 18px", border: "none", borderRadius: 4 }}>Subscribe</button>
          </form>
          <small>No spam ever. Just top deals & tips.</small>
        </section>

        {/* Affiliate Deep-Links Grid */}
        <section style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", margin: "2rem 0"}}>
          <div style={{ flex: 1, minWidth: 200, background: "#f8f8ff", borderRadius: 8, padding: 12, marginRight: 12 }}>
            <span>Hotels: </span>
            <a href="https://www.booking.com/index.html?aid=YOUR_AFFILIATE_ID" target="_blank">Booking.com</a>
            <span> | </span>
            <a href="https://www.agoda.com/partners/default.aspx?cid=YOUR_CID" target="_blank">Agoda</a>
          </div>
          <div style={{ flex: 1, minWidth: 200, background: "#f8f8ff", borderRadius: 8, padding: 12, marginRight: 12 }}>
            <span>Flights: </span>
            <a href="https://www.skyscanner.com/?associateid=YOUR_ID" target="_blank">Skyscanner</a>
            <span> | </span>
            <a href="https://www.expedia.com/" target="_blank">Expedia</a>
          </div>
          <div style={{ flex: 1, minWidth: 200, background: "#f8f8ff", borderRadius: 8, padding: 12 }}>
            <span>Activities: </span>
            <a href="https://www.getyourguide.com/?partner_id=YOUR_ID" target="_blank">GetYourGuide</a>
            <span> | </span>
            <a href="https://www.klook.com/affiliate/invite/YOUR_ID" target="_blank">Klook</a>
          </div>
        </section>

        {/* Blog/SEO Section */}
        <section style={{ margin: "40px 0" }}>
          <h3>TravelDistant Blog: Save More, Explore More</h3>
          <ul>
            <li><a href="#">Why Booking Last-Minute Can Save You Hundreds</a></li>
            <li><a href="#">Top 10 Adventure Destinations for Spontaneous Travelers</a></li>
            <li><a href="#">How to Find Secret Hotel & Flight Deals (Even During Holidays)</a></li>
          </ul>
        </section>

        <footer style={{ fontSize: 12, color: '#555', marginTop: 40 }}>
          <p>
            As a TravelDistant partner, we use affiliate links & ads to support this platform and bring you the best prices.
          </p>
          <p>
            © {new Date().getFullYear()} TravelDistant. An independent travel platform. Not associated with Lastminute.com or Trip.com.
          </p>
        </footer>
      </main>
    </>
  );
}