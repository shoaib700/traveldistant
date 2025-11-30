import { useEffect, useState, useRef } from "react";
import Head from "next/head";

// ---------------- Data Setup (LANG/COUNTRY/CURRENCY/DEALS/AFFiliates) -------------
const LANGUAGES = [
  { code: 'en', label: 'English' }, { code: 'fr', label: 'Français' }, { code: 'es', label: 'Español' }, { code: 'de', label: 'Deutsch' }
];
const COUNTRIES = [
  { code: 'GB', label: 'United Kingdom', flag: "🇬🇧" }, { code: 'US', label: 'United States', flag: "🇺🇸" }, { code: 'PK', label: 'Pakistan', flag: "🇵🇰" }
];
const CURRENCIES = [
  { code: "GBP", symbol: "£" }, { code: "USD", symbol: "$" }, { code: "EUR", symbol: "€" }, { code: "PKR", symbol: "₨" }
];
const countryToCurrency = { GB: "GBP", US: "USD", PK: "PKR" };

// ---------------- Deal Feed / Affiliates Per Tab --------------
const TABS = [
  { key: "flights",     label: "Flights"     },
  { key: "hotels",      label: "Hotels"      },
  { key: "car",         label: "Car Rental"  },
  { key: "things",      label: "Things to Do"}
];

const TAB_AFFILIATES = {
  flights: [
    { name: "Skyscanner", url: "https://www.skyscanner.net/?associateid=YOUR_SKYSCANNER_ID", color: "#1776da" },
    { name: "Expedia",    url: "https://www.expedia.com/", color: "#fcb900", fontColor: "#222" }
  ],
  hotels: [
    { name: "Booking.com", url: "https://www.booking.com/index.html?aid=YOUR_BOOKING_AID", color: "#023580" },
    { name: "Agoda", url: "https://www.agoda.com/?cid=YOUR_AGODA_CID", color: "#073763" }
  ],
  car: [
    { name: "Rentalcars.com", url: "https://www.rentalcars.com/?affiliateCode=YOUR_RENTALCARS_ID", color: "#ffad1f", fontColor: "#222" },
    { name: "Expedia Cars", url: "https://www.expedia.com/Cars", color: "#fcb900", fontColor: "#222" }
  ],
  things: [
    { name: "GetYourGuide", url: "https://partner.getyourguide.com/?partner_id=YOUR_GYG_ID", color: "#23bf67" },
    { name: "Klook", url: "https://www.klook.com/affiliate/invite/YOUR_KLOOK_REF", color: "#ff4c68" }
  ]
};

// Important: Deals below have a "tab" key (for each tab)
const DEALS = [
  {
    tab: "flights",
    title: "London → Rome, Save 35%",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
    desc: "£68 return · Nonstop · Book now!",
    badge: "EXCLUSIVE",
    expires: "today",
    link: "https://www.skyscanner.net/?associateid=YOUR_SKYSCANNER_ID"
  },
  {
    tab: "hotels",
    title: "Dubai 5★ Resort, £99/night",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&q=80",
    desc: "Breakfast. Pool. Family fun.",
    badge: "HOT HOTEL",
    expires: "this week",
    link: "https://www.booking.com/index.html?aid=YOUR_BOOKING_AID"
  },
  {
    tab: "car",
    title: "Barcelona Car Rental Special",
    image: "https://images.unsplash.com/photo-1516575529150-6b8a0b9029d4?w=600&q=80",
    desc: "£15/day · Free navigation & upgrades",
    badge: "DRIVE DEAL",
    expires: "in 3 days",
    link: "https://www.rentalcars.com/?affiliateCode=YOUR_RENTALCARS_ID"
  },
  {
    tab: "things",
    title: "Paris City Guided Tour ~ 25% off",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600&q=80",
    desc: "Skip-the-line, museum & wine, single price",
    badge: "FEATURED EXPERIENCE",
    expires: "today",
    link: "https://partner.getyourguide.com/?partner_id=YOUR_GYG_ID"
  }
];

// Helper: Get the best deal for a tab (could be automated with APIs)
function getBestDeal(tab) {
  const ds = DEALS.filter(d => d.tab === tab);
  return ds.length ? ds[0] : null;
}

// Helper: Pick ad for tab (here, AdSense slot id per tab)
function getTabAd(tab) {
  if(tab==="flights") return { adSlot: "flights-slot", label: "Google Flights Ad" }; // replace with your real AdSense/affiliate unit
  if(tab==="hotels") return { adSlot: "hotels-slot", label: "Google Hotels Ad" };
  if(tab==="car")    return { adSlot: "car-slot", label: "Car Rental Offer Ad" };
  if(tab==="things") return { adSlot: "things-slot", label: "Tour/Activity Ad" };
}

// --------------- Main Component -------------------
export default function Home() {
  // Locale state
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

  // Tabs
  const [tab, setTab] = useState("flights");
  const [flightType, setFlightType] = useState("return");
  const [segments, setSegments] = useState([{ from: "", to: "", depart: "" }]);
  const [ret, setRet] = useState("");

  // ----------- AI Voice Command & Autofill (SpeechRecognition) -----------
  const [listening, setListening] = useState(false);
  const recRef = useRef();
  function speechToFields() {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Voice Input not supported in this browser.");
      return;
    }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new Recognition();
    recog.lang = lang;
    recog.onstart = () => setListening(true);
    recog.onend = () => setListening(false);
    recog.onresult = e => {
      setListening(false);
      const text = e.results[0][0].transcript;
      // Basic parse: "Book me a flight from Lahore to Dubai on December 10"
      // Could use GPT for smarter parse, for MVP do basic patterns:
      const fMatch = /(from)\s+([a-zA-Z ]+)\s+(to)\s+([a-zA-Z ]+)\s+(on)\s+([\w- ]+)/i.exec(text);
      if(fMatch) {
        setSegments([{ from: fMatch[2].trim().toUpperCase(), to: fMatch[4].trim().toUpperCase(), depart: formatDateInput(fMatch[6]) }]);
      }
      // else just fill the "from" for demo
      else if(text.match(/from/i)) setSegments([{ ...segments[0], from: text.split("from")[1].split(" ")[0].toUpperCase() }]);
    };
    recog.start();
    recRef.current = recog;
  }
  function formatDateInput(txt) {
    // try to parse as normal date string; fallback: today
    const d = new Date(txt);
    if (!isNaN(d)) return d.toISOString().slice(0,10);
    return new Date().toISOString().slice(0,10);
  }

  function addSegment() {
    setSegments([...segments, { from: "", to: "", depart: "" }]);
  }
  function removeSegment(idx) { if(segments.length<=1)return; setSegments(segments.filter((_,i)=>i!==idx)); }
  function setSegment(idx, field, val) {
    setSegments(segments.map((s,i)=>i===idx?{ ...s, [field]: val }:s));
  }

  function submit(e) {
    e.preventDefault();
    if(tab==="flights") {
      if(flightType==="return") {
        const { from, to, depart } = segments[0];
        window.open(`https://www.skyscanner.net/transport/flights/${from}/${to}/${depart.replace(/-/g,"")}/${ret.replace(/-/g,"")}?associateid=YOUR_SKYSCANNER_ID`,'_blank');
      } else if(flightType==="oneway") {
        const { from, to, depart } = segments[0];
        window.open(`https://www.skyscanner.net/transport/flights/${from}/${to}/${depart.replace(/-/g,"")}?associateid=YOUR_SKYSCANNER_ID`,'_blank');
      } else if(flightType==="multi") {
        window.open("https://www.skyscanner.net/transport/flights/multi?associateid=YOUR_SKYSCANNER_ID",'_blank');
      }
    }
    // ...similar for hotels, car, things
  }

  return (
    <>
      <Head>
        <title>TravelDistant | Cheap Flights, Hotels, Cars, Tours</title>
        <meta name="description" content={`All-in-one travel: compare flights, hotels, car hire, activities. Auto language/country/currency. Voice AI search. Live deals feed. Best commission!`} />
      </Head>
      <div style={{ background: "#f4f8fc", minHeight: "100vh", width: "100vw", fontFamily: "'Segoe UI',sans-serif" }}>
        {/* --------------- TOP NAVBAR ------------- */}
        <header style={{
          width: "100%", background: "linear-gradient(90deg,#26a8ff 85%,#ff7eb4 100%)", color: "#fff",
          padding: "21px 0 13px 0", display: "flex", alignItems: "center", justifyContent: "space-between", fontWeight: 700
        }}>
          {/* LOGO */}
          <span style={{ marginLeft: "4vw",display:'flex',alignItems:'center',fontWeight:900,fontSize:'1.56rem'}}>
            {/* SVG Globe+Plane Icon */}
            <svg width="38" height="38" viewBox="0 0 120 120" fill="none" style={{marginRight:10}} xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="54" stroke="#fff" strokeWidth="11" fill="url(#g1)" />
              <ellipse cx="60" cy="90" rx="28" ry="6" fill="#c1ebff" opacity="0.7" />
              <path d="M76,46 L88,60 L44,75 L52,58 Z" fill="#2ea6df" stroke="#1877d2" strokeWidth="3" />
              <circle cx="60.5" cy="60.5" r="30" fill="#fafdff" stroke="#34b1fb" strokeWidth="3"/>
              <defs>
                <radialGradient id="g1" cx="0.5" cy="0.5" r="0.9">
                  <stop stopColor="#36ddfa" />
                  <stop offset="1" stopColor="#1877d2" />
                </radialGradient>
              </defs>
            </svg>
            <span>TravelDistant</span>
          </span>
          {/* NAV + SETTINGS */}
          <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
            {TABS.map(t =>
              <button key={t.key} onClick={() => setTab(t.key)}
                style={{
                  border: "none", background: "none",
                  color: tab === t.key ? "#fce283" : "#fff", fontWeight: tab === t.key ? 800 : 500,
                  fontSize: "1.11rem", margin: "0 6px", cursor: "pointer", padding: "4px 9px", borderBottom: tab === t.key ? "3px solid #fff" : "none"
                }}>
                {t.label}
              </button>)}
            <span style={{ marginLeft: 15, fontWeight: 500 }}>Help</span>
            {/* Locale Controls */}
            <span style={{ fontSize: "1.1rem", marginLeft: 23 }}>🌐</span>
            <select value={lang} onChange={e => setLang(e.target.value)}
              style={{ padding: "7px 12px", borderRadius: 6, border: "none", fontWeight: 700, fontSize: "1rem" }}>
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
            <select value={country} onChange={handleCountryChange}
              style={{ padding: "7px 12px", borderRadius: 6, border: "none", fontWeight: 700, fontSize: "1rem" }}>
              {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag + " " + c.label}</option>)}
            </select>
            <select value={currency} onChange={e => setCurrency(e.target.value)}
              style={{ padding: "7px 10px", borderRadius: 6, border: "none", fontWeight: 700, fontSize: "1rem" }}>
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
            </select>
          </div>
        </header>

        {/* ------------- HERO / DEAL BANNER (Best Deal for This Tab) ------------- */}
        <div style={{
          width: "100%", background: "linear-gradient(90deg,#ffe6fa 40%,#c5eafb 100%)", 
          boxShadow: "0 8px 32px #d7e7fa"
        }}>
          <div style={{
            maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 37, justifyContent: "start", minHeight: "160px"
          }}>
            {/* "Best" deal card */}
            {getBestDeal(tab) &&
              <img src={getBestDeal(tab).image} alt="Deal" style={{
                width: 210, height: 135, objectFit: "cover", borderRadius: 21, marginTop: 26, boxShadow: "0 2px 30px #dcc4e0"
              }} />
            }
            <div style={{
              fontSize: "2.2rem", fontWeight: 900, color: "#ea3199", marginTop: getBestDeal(tab)?19:0,marginLeft:12,letterSpacing:".5px"
            }}>
              {getBestDeal(tab) &&
                <>{getBestDeal(tab).badge}&nbsp;<span style={{color:"#22b4ed"}}>{getBestDeal(tab).title}</span><br />
                <span style={{color:"#faa010",fontWeight:900,fontSize:"1.73rem"}}>{getBestDeal(tab).desc}</span></>
              }
            </div>
          </div>
        </div>

        {/* ------------- SEARCH CARD + Tab-specific Ad Unit ------------- */}
        <main style={{
          maxWidth: 640, margin: "-52px auto 36px auto", background: "#fff", borderRadius: 23, boxShadow: "0 8px 44px #e2eaf6", padding: "38px 2vw 36px 2vw"
        }}>
          {/* Tab-specific Ad */}
          <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
            {/* Render AdSense or affiliate widget/HTML dynamically by tab, or use ad component */}
            <div style={{
              background:"#fffbee",color:"#e86336",borderRadius:8,minHeight:35,
              fontWeight:600,textAlign:'center',padding:'7px 15px',fontSize:'1.03rem',border:"1.5px solid #ffe1a3",boxShadow:"0 2px 10px #f6dec9"
            }}>
              {getTabAd(tab).label}
            </div>
          </div>
          {/* Flights tab: Main search + voice mic */}
          {tab === "flights" &&
            <>
              <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 23 }}>
                {["return", "oneway", "multi"].map(ft =>
                  <button key={ft} onClick={() => setFlightType(ft)} style={{
                    background: flightType === ft ? "#ea3199" : "#f5f7fa", color: flightType === ft ? "#fff" : "#222",
                    fontWeight: 800, fontSize: "1.09rem", border: "none", borderRadius: 12, padding: "10px 30px", cursor: "pointer"
                  }}>{ft === "return" ? "Return" : ft === "oneway" ? "One-way" : "Multi-trip"}</button>
                )}
              </div>
              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 19 }}>
                {flightType === "multi" ?
                  segments.map((seg, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 11, width: "100%" }}>
                      <div style={{position:"relative"}}>
                        <input required placeholder="From" value={seg.from} onChange={e => setSegment(i, "from", e.target.value.toUpperCase())}
                          style={{ flex: 1, padding: "12px", borderRadius: 7, border: "1px solid #d2defa" }} />
                        <button type="button" aria-label="Mic" title="Voice input (AI)" onClick={speechToFields}
                          style={{ position: "absolute", top: 6, right: 4, background: "none", border: "none", fontSize: "1.32rem", color: "#22a6ee", cursor: "pointer" }}>{listening ? "🎤" : "🎙️"}</button>
                      </div>
                      <input required placeholder="To" value={seg.to} onChange={e => setSegment(i, "to", e.target.value.toUpperCase())}
                        style={{ flex: 1, padding: "12px", borderRadius: 7, border: "1px solid #d2defa" }} />
                      <input required type="date" value={seg.depart} onChange={e => setSegment(i, "depart", e.target.value)}
                        style={{ flex: 1, padding: "12px", borderRadius: 7, border: "1px solid #d2defa" }} />
                      <button type="button" onClick={() => removeSegment(i)} style={{ background: "#eee", border: "none", borderRadius: 5, padding: "0 13px", fontWeight: 700, fontSize: "1.1rem", color: "#ea3199" }} disabled={segments.length <= 1}>−</button>
                    </div>
                  ))
                  :
                  <div style={{ display: "flex", gap: 11, width: "100%", marginBottom: flightType === "return" ? '13px' : '0' }}>
                    <div style={{position:"relative",flex:1}}>
                      <input required placeholder="From" value={segments[0].from} onChange={e => setSegment(0, "from", e.target.value.toUpperCase())}
                        style={{ flex: 1, padding: "12px", borderRadius: 7, border: "1px solid #d2defa" }} />
                      <button type="button" aria-label="Mic" title="Voice input (AI)" onClick={speechToFields}
                        style={{ position: "absolute", top: 6, right: 4, background: "none", border: "none", fontSize: "1.32rem", color: "#22a6ee", cursor: "pointer" }}>{listening ? "🎤" : "🎙️"}</button>
                    </div>
                    <input required placeholder="To" value={segments[0].to} onChange={e => setSegment(0, "to", e.target.value.toUpperCase())}
                      style={{ flex: 1, padding: "12px", borderRadius: 7, border: "1px solid #d2defa" }} />
                    <input required type="date" value={segments[0].depart} onChange={e => setSegment(0, "depart", e.target.value)}
                      style={{ flex: 1, padding: "12px", borderRadius: 7, border: "1px solid #d2defa" }} />
                    {flightType === "return" && <input required type="date" value={ret} onChange={e => setRet(e.target.value)}
                      style={{ flex: 1, padding: "12px", borderRadius: 7, border: "1px solid #d2defa" }} />}
                  </div>
                }
                {flightType === "multi" &&
                  <button type="button" onClick={addSegment} style={{
                    background: "#ffe8f6", color: "#ea3199", padding: "5px 15px", border: "none", borderRadius: 8,
                    fontWeight: 700, fontSize: "1.02rem"
                  }}>+ Add Segment</button>
                }
                <button type="submit" style={{
                  background: "#ea3199", color: "#fff", fontWeight: 700, padding: "14px 48px", border: "none", borderRadius: 10, fontSize: "1.19rem", marginTop: 8, cursor: "pointer"
                }}>Search Flights</button>
              </form>
            </>
          }
          {/* TODO: Add hotels, car, things forms and ad/affiliate logic for those (see tab-specific examples above) */}
        </main>

        {/* -------------- Last Minute Deals Feed -------------- */}
        <section style={{ maxWidth: 1190, margin: "0 auto", padding: "15px 0 42px 0" }}>
          <h2 style={{
            textAlign: "center", margin: "12px 0 11px 0", fontWeight: 800, letterSpacing: ".7px", fontSize: "1.58rem"
          }}>Last Minute <span style={{ color: "#ffe95b", background: "#ea3199", borderRadius: 6, padding: "0 6px" }}>DEALS</span></h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "22px", justifyContent: "center" }}>
            {DEALS.filter(d => d.tab === tab).map((d, i) => (
              <div key={i}
                style={{
                  width: 300, background: "#fff", borderRadius: 17, boxShadow: "0 3px 20px #e7e6eb", padding: 0,
                  display: "flex", flexDirection: "column", marginBottom: 18, overflow: "hidden"
                }}>
                <div style={{ position: "relative" }}>
                  <img src={d.image} alt={d.title} style={{ width: "100%", height: 175, objectFit: "cover" }} />
                  <span style={{
                    position: "absolute", top: 15, left: 15,
                    background: "#ea3199", color: "#fff", fontWeight: 700, padding: "5px 13px", borderRadius: 9, letterSpacing: ".5px", fontSize: "1rem"
                  }}>{d.badge}</span>
                  <span style={{
                    position: "absolute", top: 15, right: 15,
                    background: "#131338c2", color: "#ffe95b", fontWeight: 700, padding: "3px 9px", borderRadius: 8, fontSize: "0.97rem"
                  }}><span role="img" aria-label="timer">⏰</span> {d.expires}</span>
                </div>
                <div style={{ padding: "14px 18px 10px 18px", fontSize: "1.09rem", fontWeight: 700 }}>
                  {d.title}
                  <div style={{ fontWeight: 500, color: "#444", margin: "7px 0 0 0", fontSize: "1.05rem" }}>{d.desc}</div>
                  <a href={d.link} target="_blank" style={{
                    background: "#ea3199", color: "#fff", fontWeight: 600, padding: "10px 0", display: "block", borderRadius: 7,
                    textAlign: "center", margin: "13px 0 0 0", fontSize: "1.08rem", textDecoration: "none"
                  }}>Book Deal</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ----------- Affiliate Promo Buttons Per Tab ----------- */}
        <div style={{
          display: "flex", gap: 22, flexWrap: "wrap", justifyContent: "center", maxWidth: 930, margin: "8px auto 0"
        }}>
          {TAB_AFFILIATES[tab].map(a =>
            <a key={a.name} href={a.url} target="_blank"
              style={{
                background: a.color, color: a.fontColor || "#fff", padding: "14px 26px", borderRadius: 9, textDecoration: "none",
                fontWeight: 700, fontSize: "1.07rem", marginBottom: 12, boxShadow: "0 2px 8px #e5eefc"
              }}
            >{a.name}</a>
          )}
        </div>

        <footer style={{ marginTop: 36, textAlign: "center", padding: "32px 8px 18px 8px", fontSize: "1.05rem", color: "#888", background: "#fff", borderTop: "1px solid #ebebeb" }}>&copy; {new Date().getFullYear()} Travel in UK Ltd. All rights reserved.</footer>
      </div>
    </>
  );
}