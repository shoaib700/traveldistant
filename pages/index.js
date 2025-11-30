import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>TravelDistant | Last-Minute Travel Deals, Flights & Hotels</title>
        <meta name="description" content="TravelDistant: Search and compare top last-minute travel deals, book flights & hotels, and save. Monetized with ads and affiliate links." />
        {/* Google AdSense script (replace ca-pub-XXXX with yours) */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2203546185229559"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <main style={{
        maxWidth: 800, margin: "auto", padding: 32, fontFamily: "sans-serif", background: "#f6f8fa", minHeight: "100vh"
      }}>
        <h1 style={{ fontSize: "2.5rem", display: "flex", alignItems: "center", gap: 14 }}>
          <span role="img" aria-label="globe">🌍</span> TravelDistant
        </h1>
        <p style={{ fontSize: "1.2rem" }}>
          Find exclusive last-minute <b>flights</b>, <b>hotels</b>, and <b>package deals</b> from the world’s leading travel sites.
        </p>

        <section style={{
          background: "#fff",
          borderRadius: 10,
          padding: 24,
          margin: "32px 0",
          boxShadow: "0 2px 16px 0 #eee"
        }}>
          <h2 style={{ fontSize: "1.2rem" }}>Compare & Book Now</h2>
          {/* Travel affiliate links, replace with your real ones */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="https://www.booking.com/index.html?aid=YOUR_AFFILIATE_ID" target="_blank"
              style={{
                background: "#003580", color: "white", padding: "10px 24px", borderRadius: 8, textDecoration: "none"
              }}>Hotels: Booking.com</a>
            <a href="https://www.agoda.com/?cid=YOUR_CID" target="_blank"
              style={{
                background: "#00224f", color: "white", padding: "10px 24px", borderRadius: 8, textDecoration: "none"
              }}>Hotels: Agoda</a>
            <a href="https://www.skyscanner.net/?associateid=YOUR_ID" target="_blank"
              style={{
                background: "#037fff", color: "white", padding: "10px 24px", borderRadius: 8, textDecoration: "none"
              }}>Flights: Skyscanner</a>
            <a href="https://www.expedia.com/" target="_blank"
              style={{
                background: "#fcb900", color: "#222", padding: "10px 24px", borderRadius: 8, textDecoration: "none"
              }}>Flights: Expedia</a>
          </div>
          <small style={{display: "block", marginTop: 8, color: "#888"}}>
            * These are affiliate links. We may earn a commission if you book.
          </small>
        </section>

        {/* AdSense Ad Example */}
        <div style={{ margin: "40px 0", textAlign: "center" }}>
          <ins className="adsbygoogle"
               style={{ display: "block", textAlign: "center" }}
               data-ad-client="ca-pub-2203546185229559"
               data-ad-slot="1234567890"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <script>
            {`(adsbygoogle = window.adsbygoogle || []).push({});`}
          </script>
        </div>

        <footer style={{ fontSize: ".95rem", color: "#666", marginTop: 60 }}>
          <p>
            &copy; {new Date().getFullYear()} TravelDistant. <br />
            Last-minute travel deals site, powered by affiliate and advertising revenue.<br />
            <span style={{fontSize: ".8rem"}}>Not affiliated with lastminute.com or trip.com.</span>
          </p>
        </footer>
      </main>
    </>
  );
}