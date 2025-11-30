import { useEffect, useState } from "react";
import Head from "next/head";

// ------------ Language, Country, Currency Data Setup -------------
const LANGUAGES = [
  { code: 'en', label: 'English' }, { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' }, { code: 'de', label: 'Deutsch' }, 
  { code: 'it', label: 'Italiano' }, { code: 'ar', label: 'العربية' }
];
const COUNTRIES = [
  { code: 'GB', label: 'United Kingdom', flag: "🇬🇧" }, { code: 'US', label: 'United States', flag: "🇺🇸" },
  { code: 'FR', label: 'France', flag: "🇫🇷" }, { code: 'DE', label: 'Germany', flag: "🇩🇪" },
  { code: 'IT', label: 'Italy', flag: "🇮🇹" }, { code: 'PK', label: 'Pakistan', flag: "🇵🇰" },
];
const CURRENCIES = [
  { code: "GBP", symbol: "£" }, { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" }, { code: "PKR", symbol: "₨" }
];
const countryToCurrency = { GB: "GBP", US: "USD", FR: "EUR", DE: "EUR", IT: "EUR", PK: "PKR" };

// ------------ Affiliate and Deal Data (fill in with your IDs/links as needed) -------------
const AFFILIATES = [
  { name: "Booking.com", url: "https://www.booking.com/index.html?aid=YOUR_BOOKING_AID", color: "#023580" },
  { name: "Skyscanner", url: "https://www.skyscanner.net/?associateid=YOUR_SKYSCANNER_ID", color: "#1776da" },
  { name: "Expedia", url: "https://www.expedia.com/", color: "#fcb900", fontColor: "#222" },
  { name: "Rentalcars.com", url: "https://www.rentalcars.com/?affiliateCode=YOUR_RENTALCARS_ID", color: "#ffad1f" },
  { name: "GetYourGuide", url: "https://partner.getyourguide.com/?partner_id=YOUR_GYG_ID", color: "#23bf67" },
  { name: "Klook", url: "https://www.klook.com/affiliate/invite/YOUR_KLOOK_REF", color: "#ff4c68" }
];
const DEALS = [
  {
    title: "Prague City Break",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80",
    desc: "£124 pp · 5★ hotel · 2 nights + flights · BONUS: Free bottle of wine",
    badge: "EXCLUSIVE",
    expires: "in 2 days",
    link: "https://www.booking.com/index.html?aid=YOUR_BOOKING_AID"
  },
  {
    title: "Rome, Italy – Flights + 4★ hotel",
    image: "https://images.unsplash.com/photo-1413882353314-73389f63b6fa?w=600&q=80",
    desc: "£217 pp · Centrally located · Flights included",
    badge: "HOT",
    expires: "in 3 days",
    link: "https://www.expedia.com/"
  },
  {
    title: "Last Minute: Paris Dream Trip",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600&q=80",
    desc: "£181 pp · Boutique 3★ · Breakfast incl.",
    badge: "LAST MINUTE",
    expires: "today",
    link: "https://www.skyscanner.net/?associateid=YOUR_SKYSCANNER_ID"
  }
  // ...Add more deals as desired
];

// ------------- Main Page UI -----------------
export default function Home() {
  // Language/Country/Currency state and auto-detection logic
  const [lang, setLang] = useState('en');
  const [country, setCountry] = useState('GB');
  const [currency, setCurrency] = useState('GBP');
  useEffect(() => {
    let browserLang = navigator.language || navigator.userLanguage || "en";
    if (browserLang.includes('-')) browserLang = browserLang.split('-')[0];
    if (LANGUAGES.some(l => l.code === browserLang)) setLang(browserLang);
    fetch('https://ipapi.co/json')
      .then(r => r.json())
      .then(data => {
        if (data && data.country && COUNTRIES.some(c => c.code === data.country)) {
          setCountry(data.country);
          const mapped = countryToCurrency[data.country];
          if (mapped && CURRENCIES.some(c => c.code === mapped)) setCurrency(mapped);
        }
      });
  }, []);
  function handleCountryChange(e) {
    const newCountry = e.target.value;  setCountry(newCountry);
    const mapped = countryToCurrency[newCountry];
    if (mapped && CURRENCIES.some(c => c.code === mapped)) setCurrency(mapped);
  }

  // Tabs/smart search UI management
  const [tab, setTab] = useState("flights");
  const [flightType, setFlightType] = useState("return"); // return|oneway|multi
  const [segments, setSegments] = useState([{ from: "", to: "", depart: "" }]);
  const [ret, setRet] = useState("");

  function addSegment() {
    setSegments([...segments, { from: "", to: "", depart: "" }]);
  }
  function removeSegment(idx) {
    if (segments.length <= 1) return;
    setSegments(segments.filter((_, i) => i !== idx));
  }
  function setSegment(idx, field, val) {
    setSegments(segments.map((s, i) =>
      i === idx ? { ...s, [field]: val } : s
    ));
  }

  // Search submit logic for each tab
  function submit(e) {
    e.preventDefault();
    if (tab === "flights") {
      if (flightType === "return") {
        const { from, to, depart } = segments[0];
        const url = `https://www.skyscanner.net/transport/flights/${from}/${to}/${depart.replace(/-/g, "")}/${ret.replace(/-/g, "")}?associateid=YOUR_SKYSCANNER_ID`;
        window.open(url, '_blank');
      } else if (flightType === "oneway") {
        const { from, to, depart } = segments[0];
        const url = `https://www.skyscanner.net/transport/flights/${from}/${to}/${depart.replace(/-/g, "")}?associateid=YOUR_SKYSCANNER_ID`;
        window.open(url, '_blank');
      } else if (flightType === "multi") {
        window.open("https://www.skyscanner.net/transport/flights/multi?associateid=YOUR_SKYSCANNER_ID", '_blank');
      }
    }
    // Extend for other tabs (see earlier answers for booking.com, rentalcars etc.)
  }

  // Navigation bar button UI
  function navButton(name, state) {
    return (
      <button key={name}
        onClick={() => setTab(state)}
        style={{
          border: "none",
          background: "none",
          color: tab === state ? "#ff3880" : "#fff",
          fontWeight: tab === state ? 700 : 500,
          fontSize: "1.07rem",
          margin: "0 13px",
          cursor: "pointer",
          borderBottom: tab === state ? "2.5px solid #ffe1f0" : "none",
          paddingBottom: tab === state ? "8px" : "10px"
        }}>
        {name}
      </button>
    );
  }

  return (
    <>
      <Head>
        <title>TravelDistant | Cheap Flights, Hotels, Car Hire, Activities, Deals</title>
        <meta name="description" content="Book flights, hotels, cars, activities. Last minute deals, multi-trip, exclusive offers. With auto language/country/currency detection and selection." />
      </Head>
      <div style={{ background: "#f7f7fc", minHeight: "100vh" }}>
        {/* -------- TOP NAV & DROPDOWNS ---------- */}
        <header style={{
          width: "100%", background: "linear-gradient(90deg,#2495f8 85%,#fa3fa6 100%)", color: "#fff", padding: "24px 0 13px 0", display: "flex", alignItems: "center", justifyContent: "space-between", fontWeight: 700, fontSize: "1.37rem"
        }}>
          <span style={{ marginLeft: "5vw" }}>🌍 TravelDistant</span>
          {/* DROPDOWNS + NAV */}
          <div style={{ display: "flex", alignItems: "center", gap: 15, marginRight: "5vw" }}>
            {navButton("Flights", "flights")}
            {navButton("Hotels", "hotels")}
            {navButton("Car Rental", "car")}
            {navButton("Things to Do", "things")}
            <span style={{ marginLeft: 15, fontWeight: 500 }}>Help</span>
            <span style={{ fontSize: "1.06rem", marginLeft: 20 }}>🌐</span>
            <select value={lang} onChange={e => setLang(e.target.value)}
              style={{ padding: "7px 12px", borderRadius: 6, border: "none", fontWeight: 700, fontSize: "1rem" }}>
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
            <select value={country} onChange={handleCountryChange}
              style={{ padding: "7px 12px", borderRadius: 6, border: "none", fontWeight: 700, fontSize: "1rem" }}>
              {COUNTRIES.map(c =>
                <option key={c.code} value={c.code}>{c.flag}&nbsp;{c.label}</option>
              )}
            </select>
            <select value={currency} onChange={e => setCurrency(e.target.value)}
              style={{ padding: "7px 10px", borderRadius: 6, border: "none", fontWeight: 700, fontSize: "1rem" }}>
              {CURRENCIES.map(c =>
                <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
              )}
            </select>
          </div>
        </header>

        {/* BANNER/HERO SECTION (optional) */}
        <div style={{ width: "100%", background: "linear-gradient(90deg,#f5e3fc 40%,#c9e0fb 100%)", }}>
          <div style={{
            margin: "0 auto", maxWidth: 980,
            display: "flex", alignItems: "center", gap: 35, justifyContent: "start"
          }}>
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=540&q=80"
              alt="Hero Prague" style={{
                width: 275, height: 175, objectFit: "cover", borderRadius: 19, marginTop: 26, boxShadow: "0 2px 30px #dcc4e0"
              }} />
            <div style={{ fontSize: "2.6rem", fontWeight: 800, color: "#e81e65", marginTop: 19 }}>EXCLUSIVE DEAL <br />
              <span style={{ fontSize: "2rem", color: "#2495f8", fontWeight: 900, letterSpacing: ".5px" }}>PRAGUE <span style={{ color: "#ffb800", fontWeight: 900 }}>£124 pp</span></span>
              <br /><span style={{ fontSize: "1.2rem", color: "#784a90", fontWeight: 600 }}>5★ hotel & flights + <span style={{ color: "#01ba65" }}>FREE BOTTLE OF WINE</span></span>
            </div>
          </div>
        </div>

        {/* --------- SEARCH CARD ----------- */}
        <main style={{
          maxWidth: 620, margin: "-48px auto 34px auto", background: "#fff", borderRadius: 21, boxShadow: "0 8px 44px #e2eaf6", padding: "38px 2vw 36px 2vw", position: "relative", zIndex: 2
        }}>
          {/* Flights tab - Return / One-way / Multi (multi as skeleton) */}
          {tab === "flights" &&
            <>
              <div style={{ display: "flex", justifyContent: "center", gap: 11, marginBottom: 24, fontWeight: 700 }}>
                {["return", "oneway", "multi"].map(ft =>
                  <button key={ft} onClick={() => setFlightType(ft)} style={{
                    background: flightType === ft ? "#e81e65" : "#f5f7fa", color: flightType === ft ? "#fff" : "#222",
                    fontWeight: 700, fontSize: "1.08rem", border: "none", borderRadius: 12, padding: "10px 33px", cursor: "pointer"
                  }}>{ft === "return" ? "Return" : ft === "oneway" ? "One-way" : "Multi-trip"}</button>
                )}
              </div>
              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 17 }}>
                {flightType === "multi" ?
                  segments.map((seg, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 11, width: "100%" }}>
                      <input required placeholder="From" value={seg.from} onChange={e => setSegment(i, "from", e.target.value.toUpperCase())} style={{ flex: 1, padding: "12px", borderRadius: 7, border: "1px solid #d2defa" }} />
                      <input required placeholder="To" value={seg.to} onChange={e => setSegment(i, "to", e.target.value.toUpperCase())} style={{ flex: 1, padding: "12px", borderRadius: 7, border: "1px solid #d2defa" }} />
                      <input required type="date" value={seg.depart} onChange={e => setSegment(i, "depart", e.target.value)} style={{ flex: 1, padding: "12px", borderRadius: 7, border: "1px solid #d2defa" }} />
                      <button type="button" onClick={() => removeSegment(i)} style={{ background: "#eee", border: "none", borderRadius: 5, padding: "0 13px", fontWeight: 700, fontSize: "1.1rem", color: "#e81e65" }} disabled={segments.length <= 1}>−</button>
                    </div>
                  ))
                  :
                  <div style={{ display: "flex", gap: 11, width: "100%", marginBottom: flightType === "return" ? '13px' : '0' }}>
                    <input required placeholder="From" value={segments[0].from} onChange={e => setSegment(0, "from", e.target.value.toUpperCase())} style={{ flex: 1, padding: "12px", borderRadius: 7, border: "1px solid #d2defa" }} />
                    <input required placeholder="To" value={segments[0].to} onChange={e => setSegment(0, "to", e.target.value.toUpperCase())} style={{ flex: 1, padding: "12px", borderRadius: 7, border: "1px solid #d2defa" }} />
                    <input required type="date" value={segments[0].depart} onChange={e => setSegment(0, "depart", e.target.value)} style={{ flex: 1, padding: "12px", borderRadius: 7, border: "1px solid #d2defa" }} />
                    {flightType === "return" && <input required type="date" value={ret} onChange={e => setRet(e.target.value)} style={{ flex: 1, padding: "12px", borderRadius: 7, border: "1px solid #d2defa" }} />}
                  </div>
                }
                {flightType === "multi" &&
                  <button type="button" onClick={addSegment} style={{ background: "#fbe7fc", color: "#e81e65", padding: "6px 18px", border: "none", borderRadius: 9, fontWeight: 700, fontSize: "1.02rem" }}>+ Add Segment</button>
                }
                <button type="submit" style={{ background: "#e81e65", color: "#fff", fontWeight: 700, padding: "14px 48px", border: "none", borderRadius: 10, fontSize: "1.19rem", marginTop: 8, cursor: "pointer" }}>Search Flights</button>
              </form>
            </>
          }
          {/* TODO: Add hotel, car, things forms here same as Flights, reusing your own code/pattern */}
        </main>

        {/* -------- Deals Grid Feed --------- */}
        <section style={{ maxWidth: 1190, margin: "0 auto", padding: "15px 0 40px 0" }}>
          <h2 style={{ textAlign: "center", margin: "12px 0 11px 0", fontWeight: 800, letterSpacing: ".7px", fontSize: "1.58rem" }}>Last Minute <span style={{ color: "#ffe95b", background: "#e81e65", borderRadius: 7, padding: "0 6px" }}>DEALS</span></h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "22px", justifyContent: "center" }}>
            {DEALS.map((d, i) => (
              <div key={i}
                style={{
                  width: 295, background: "#fff", borderRadius: 17, boxShadow: "0 3px 20px #e7e6eb", padding: 0,
                  display: "flex", flexDirection: "column", marginBottom: 18, overflow: "hidden"
                }}>
                <div style={{ position: "relative" }}>
                  <img src={d.image} alt={d.title} style={{ width: "100%", height: 173, objectFit: "cover" }} />
                  <span style={{
                    position: "absolute", top: 15, left: 15,
                    background: "#e81e65", color: "#fff", fontWeight: 700, padding: "4.5px 13px", borderRadius: 9, letterSpacing: ".5px", fontSize: "0.98rem"
                  }}>{d.badge}</span>
                  <span style={{
                    position: "absolute", top: 15, right: 15,
                    background: "#131338dd", color: "#ffe95b", fontWeight: 600, padding: "3px 8px", borderRadius: 8, fontSize: "0.95rem"
                  }}><span role="img" aria-label="timer">⏰</span> {d.expires}</span>
                </div>
                <div style={{ padding: "14px 17px 10px 17px", fontSize: "1.08rem", fontWeight: 700 }}>
                  {d.title}
                  <div style={{ fontWeight: 500, color: "#444", margin: "7px 0 0 0", fontSize: "1.06rem" }}>{d.desc}</div>
                  <a href={d.link} target="_blank" style={{
                    background: "#e81e65", color: "#fff", fontWeight: 600, padding: "10px 0", display: "block", borderRadius: 7, textAlign: "center", margin: "13px 0 0 0", fontSize: "1.07rem", textDecoration: "none"
                  }}>Book Deal</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* -------- Affiliate Buttons Row --------- */}
        <div style={{ display: "flex", gap: 22, flexWrap: "wrap", justifyContent: "center", maxWidth: 930, margin: "8px auto 0" }}>
          {AFFILIATES.map(a =>
            <a key={a.name} href={a.url} target="_blank"
              style={{ background: a.color, color: a.fontColor || "#fff", padding: "14px 26px", borderRadius: 9, textDecoration: "none", fontWeight: 700, fontSize: "1.07rem", marginBottom: 12, boxShadow: "0 2px 8px #e5eefc" }}
            >{a.name}</a>
          )}
        </div>
        {/* Footer */}
        <footer style={{ marginTop: 34, textAlign: "center", padding: "32px 8px 18px 8px", fontSize: "1.05rem", color: "#888", background: "#fff", borderTop: "1px solid #ebebeb" }}>&copy; {new Date().getFullYear()} Travel in UK Ltd. All rights reserved.</footer>
      </div>
    </>
  );
}