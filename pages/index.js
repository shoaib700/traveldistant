import { useEffect, useState, useRef } from "react";
import Head from "next/head";

// --- Language, Country, Currency, and IATA lookup ---
const LANGUAGES = [ { code: 'en', label: 'English' },{ code: 'fr', label: 'Français' },{ code: 'es', label: 'Español' }];
const COUNTRIES = [ { code: 'GB', label: 'United Kingdom', flag: "🇬🇧" }, { code: 'US', label: 'United States', flag: "🇺🇸" }, { code: 'PK', label: 'Pakistan', flag: "🇵🇰" }];
const CURRENCIES = [ { code: "GBP", symbol: "£" }, { code: "USD", symbol: "$" }, { code: "EUR", symbol: "€" }, { code: "PKR", symbol: "₨" } ];
const countryToCurrency = { GB: "GBP", US: "USD", PK: "PKR" };

// IATA minimal list for demo/autocomplete
const IATA_CITIES = [
  { name: "London", code: "LON" },
  { name: "Dubai", code: "DXB" },
  { name: "Lahore", code: "LHE" },
  { name: "Rome", code: "ROM" },
  { name: "Malaga", code: "AGP" },
  { name: "Manchester", code: "MAN" },
  { name: "Paris", code: "PAR" },
  // ... expand with more for production
];

const TABS = [
  { key: "flights", label: "Flights"},
  { key: "hotels", label: "Hotels"},
  { key: "car", label: "Car Rental"},
  { key: "things", label: "Things to Do"},
  { key: "blog", label: "Blog"}
];
const TAB_AFFILIATES = {
  flights: [
    { name: "Skyscanner", url: "https://www.skyscanner.net/?associateid=YOUR_SKYSCANNER_ID", color: "#1776da" },
    { name: "Expedia", url: "https://www.expedia.com/", color: "#fcb900", fontColor: "#222" }
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
    }
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
    }
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
    }
  ],
  things: [
    {
      title: "Paris Guided Tour -25%",
      img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600&q=80",
      desc: "Skip-the-line, museum, wine",
      badge: "EXPERIENCE", link: "https://partner.getyourguide.com/?partner_id=YOUR_GYG_ID"
    }
  ]
};

function getBestDeal(tab) {
  const ds = MULTI_DEALS[tab];
  return ds && ds.length ? ds[0] : null;
}

export default function Home() {
  const [lang, setLang] = useState('en');
  const [country, setCountry] = useState('GB');
  const [currency, setCurrency] = useState('GBP');
  useEffect(() => {
    let browserLang = navigator.language || navigator.userLanguage || "en";
    if (browserLang.includes('-')) browserLang = browserLang.split('-')[0];
    if (LANGUAGES.some(l => l.code === browserLang)) setLang(browserLang);
    fetch('https://ipapi.co/json').then(r => r.json()).then(data => {
      if (data && data.country && COUNTRIES.some(c => c.code === data.country)) {
        setCountry(data.country);
        const mapped = countryToCurrency[data.country];
        if (mapped && CURRENCIES.some(c => c.code === mapped)) setCurrency(mapped);
      }
    });
  }, []);
  function handleCountryChange(e) {
    const newCountry = e.target.value; setCountry(newCountry);
    const mapped = countryToCurrency[newCountry];
    if (mapped && CURRENCIES.some(c => c.code === mapped)) setCurrency(mapped);
  }

  // --- Search, tab, help/blog ---
  const [tab, setTab] = useState("flights");
  // Help modal
  const [helpOpen, setHelpOpen] = useState(false);

  // --- Flights: IATA search fields, AI mic, auto-suggest
  const [flightType, setFlightType] = useState("return");
  const [segments, setSegments] = useState([{ from: "", to: "", depart: "" }]);
  const [ret, setRet] = useState("");
  const [fromSuggest, setFromSuggest] = useState([]);
  const [toSuggest, setToSuggest] = useState([]);
  const [focusInput, setFocusInput] = useState('');
  const [listening, setListening] = useState(false);
  const recRef = useRef();

  // Autocomplete (IATA)
  useEffect(() => {
    if (focusInput === "from" && segments[0].from.length > 0) setFromSuggest(IATA_CITIES.filter(c => c.name.toLowerCase().startsWith(segments[0].from.toLowerCase())));
    else setFromSuggest([]);
    if (focusInput === "to" && segments[0].to.length > 0) setToSuggest(IATA_CITIES.filter(c => c.name.toLowerCase().startsWith(segments[0].toLowerCase())));
    else setToSuggest([]);
  }, [segments, focusInput]);

  function setSegment(idx, field, val) {
    setSegments(segments.map((s,i)=>i===idx?{ ...s, [field]: val }:s));
  }
  function addSegment() { setSegments([...segments, { from: "", to: "", depart: "" }]); }
  function removeSegment(idx) { if(segments.length<=1)return; setSegments(segments.filter((_,i)=>i!==idx)); }
  function speechToFields() {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) { alert("Voice Input not supported in this browser."); return; }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new Recognition(); recog.lang = lang;
    recog.onstart = () => setListening(true);
    recog.onend = () => setListening(false);
    recog.onresult = e => {
      setListening(false); const text = e.results[0][0].transcript;
      const fMatch = /(from)\s+([a-zA-Z ]+)\s+(to)\s+([a-zA-Z ]+)\s+(on)\s+([\w- ]+)/i.exec(text);
      if(fMatch) {
        const from = findIATA(fMatch[2]);
        const to = findIATA(fMatch[4]);
        setSegments([{ from: from, to: to, depart: formatDateInput(fMatch[6]) }]);
      }
    };
    recog.start();
    recRef.current = recog;
  }
  function findIATA(cityName) {
    let city = IATA_CITIES.find(c=>c.name.toLowerCase()===cityName.trim().toLowerCase());
    return city ? city.code : cityName.toUpperCase();
  }
  function formatDateInput(txt) {
    const d = new Date(txt); if (!isNaN(d)) return d.toISOString().slice(0,10);
    return new Date().toISOString().slice(0,10);
  }
  function submit(e) {
    e.preventDefault();
    const from = segments[0].from.length===3?segments[0].from:findIATA(segments[0].from); // always IATA code
    const to = segments[0].to.length===3?segments[0].to:findIATA(segments[0].to);
    if (tab==="flights") {
      if(flightType==="return") window.open(`https://www.skyscanner.net/transport/flights/${from}/${to}/${segments[0].depart.replace(/-/g,"")}/${ret.replace(/-/g,"")}?associateid=YOUR_SKYSCANNER_ID`,'_blank');
      else if(flightType==="oneway") window.open(`https://www.skyscanner.net/transport/flights/${from}/${to}/${segments[0].depart.replace(/-/g,"")}?associateid=YOUR_SKYSCANNER_ID`,'_blank');
      else if(flightType==="multi") window.open("https://www.skyscanner.net/transport/flights/multi?associateid=YOUR_SKYSCANNER_ID",'_blank');
    }
  }

  function navButton(txt, tabKey) {
    return (
      <button key={tabKey} onClick={()=>setTab(tabKey)} style={{
        border:"none",background:"none",color:tab===tabKey?"#fce283":"#fff",fontWeight:tab===tabKey?800:500,
        fontSize:"1.11rem",margin:"0 6px",cursor:"pointer",padding:"4px 10px",borderBottom:tab===tabKey?"3px solid #fff":"none"
      }}>{txt}</button>
    );
  }

  return (
    <>
      <Head>
        <title>TravelDistant | Cheap Flights, Hotels, Cars, Tours, Blog</title>
        <meta name="description" content="Travel meta-search: best deals, live blog/ad/affiliate/voice AI, help modal, country/language/currency auto-detect, everything designed for traffic & conversion." />
      </Head>
      <div style={{ background: "#f4f8fc", minHeight: "100vh", width: "100vw", fontFamily: "'Segoe UI',sans-serif" }}>
        <header style={{
          width: "100%", background: "linear-gradient(90deg,#26a8ff 85%,#ff7eb4 100%)", color: "#fff",
          padding: "21px 0 13px 0", display: "flex", alignItems: "center", justifyContent: "space-between", fontWeight: 700
        }}>
          <span style={{ marginLeft: "4vw",display:'flex',alignItems:'center',fontWeight:900,fontSize:'1.56rem'}}>
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
            TravelDistant
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
            {TABS.map(t=>navButton(t.label,t.key))}
            <button onClick={()=>setHelpOpen(true)} style={{marginLeft: 15, background:"none",border:"none",color:'#fff',fontWeight:600,fontSize:"1.1rem",cursor:"pointer"}}>Help</button>
            <span style={{ fontSize: "1.1rem", marginLeft: 23 }}>🌐</span>
            <select value={lang} onChange={e => setLang(e.target.value)} style={{ padding: "7px 12px", borderRadius: 6, border: "none", fontWeight: 700, fontSize: "1rem" }}>
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
            <select value={country} onChange={handleCountryChange} style={{ padding: "7px 12px", borderRadius: 6, border: "none", fontWeight: 700, fontSize: "1rem" }}>
              {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag + " " + c.label}</option>)}
            </select>
            <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ padding: "7px 10px", borderRadius: 6, border: "none", fontWeight: 700, fontSize: "1rem" }}>
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
            </select>
          </div>
        </header>
        {/* --- Help Modal --- */}
        {helpOpen && (
          <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.18)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={()=>setHelpOpen(false)}>
            <div style={{background:'#fff',padding:'38px 40px',borderRadius:16,maxWidth:440,width:'100%',boxShadow:'0 2px 22px #abb'}} onClick={e=>e.stopPropagation()}>
              <h2 style={{marginTop:0}}>Help & FAQ</h2>
              <ul>
                <li><b>How do I book?</b> Fill search, hit "Search", and book on the partner site (Skyscanner, Booking, etc).</li>
                <li><b>Page Not Found?</b> Ensure cities are selected from dropdown (always using IATA codes like DXB).</li>
                <li><b>Multi-trip doesn't auto-fill on Skyscanner?</b> Use the multi-trip search then fill in on their website (due to partner limitation).</li>
                <li><b>More questions?</b> Email <a href="mailto:support@traveldistant.com">support@traveldistant.com</a></li>
              </ul>
              <button onClick={()=>setHelpOpen(false)} style={{marginTop:14,padding:'8px 18px',fontWeight:700,borderRadius:8,background:'#eee'}}>Close</button>
            </div>
          </div>
        )}
        {/* --- Blog page --- */}
        {tab==="blog" && (
          <iframe src="/blog" style={{border:"none",width:"100%",minHeight:"85vh",background:"transparent"}} title="Blog"></iframe>
        )}
        {/* --- HERO/BEST DEAL  --- */}
        {tab!=="blog" &&
        <div style={{
          width: "100%", background: "linear-gradient(90deg,#ffe6fa 40%,#c5eafb 100%)", boxShadow: "0 8px 32px #d7e7fa"
        }}>
          <div style={{
            maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 37, justifyContent: "start", minHeight: "160px"
          }}>
            {getBestDeal(tab) &&
              <img src={getBestDeal(tab).img} alt="Deal" style={{
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
        }
        {/* --- Flights Search (for flights tab only) --- */}
        {tab==="flights" &&
          <main style={{
            maxWidth: 640, margin: "-52px auto 36px auto", background: "#fff", borderRadius: 23, boxShadow: "0 8px 44px #e2eaf6", padding: "38px 2vw 36px 2vw"
          }}>
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
                      <input required placeholder="From" value={seg.from} onChange={e => setSegment(i, "from", e.target.value)} 
                        onFocus={()=>setFocusInput("from")} autoComplete="off"
                        style={{ flex: 1, padding: "12px", borderRadius: 7, border: "1px solid #d2defa" }} />
                      <button type="button" aria-label="Mic" title="Voice input (AI)" onClick={speechToFields}
                        style={{ position: "absolute", top: 6, right: 4, background: "none", border: "none", fontSize: "1.32rem", color: "#22a6ee", cursor: "pointer" }}>{listening ? "🎤" : "🎙️"}</button>
                      {fromSuggest.length>0 && focusInput==="from" &&
                        <div style={{position:"absolute",top:41,left:0,background:"#fff",boxShadow:"0 2px 9px #e5eefe",borderRadius:6}}>
                          {fromSuggest.map((c,i)=>
                            <div key={i} style={{padding:"7px 15px",cursor:"pointer"}} onClick={()=>{setSegment(i,'from',c.code);setFromSuggest([]);setFocusInput('');}}>{c.name} – {c.code}</div>
                          )}
                        </div>}
                    </div>
                    <div style={{position:"relative"}}>
                      <input required placeholder="To" value={seg.to} onChange={e => setSegment(i, "to", e.target.value)} 
                        onFocus={()=>setFocusInput("to")} autoComplete="off"
                        style={{ flex: 1, padding: "12px", borderRadius: 7, border: "1px solid #d2defa" }} />
                      {toSuggest.length>0 && focusInput==="to" &&
                        <div style={{position:"absolute",top:41,left:0,background:"#fff",boxShadow:"0 2px 9px #e5eefe",borderRadius:6}}>
                          {toSuggest.map((c,i)=>
                            <div key={i} style={{padding:"7px 15px",cursor:"pointer"}} onClick={()=>{setSegment(0,'to',c.code);setToSuggest([]);setFocusInput('');}}>{c.name} – {c.code}</div>
                          )}
                        </div>}
                    </div>
                    <input required type="date" value={seg.depart} onChange={e => setSegment(i, "depart", e.target.value)}
                      style={{ flex: 1, padding: "12px", borderRadius: 7, border: "1px solid #d2defa" }} />
                    <button type="button" onClick={() => removeSegment(i)} style={{
                      background: "#eee", border: "none", borderRadius: 5, padding: "0 13px", fontWeight: 700, fontSize: "1.1rem", color: "#ea3199"
                    }} disabled={segments.length <= 1}>−</button>
                  </div>
                ))
                :
                <div style={{ display: "flex", gap: 11, width: "100%", marginBottom: flightType === "return" ? '13px' : '0' }}>
                  <div style={{position:"relative",flex:1}}>
                    <input required placeholder="From" value={segments[0].from} onChange={e => setSegment(0, "from", e.target.value)} 
                      onFocus={()=>setFocusInput("from")} autoComplete="off"
                      style={{ flex: 1, padding: "12px", borderRadius: 7, border: "1px solid #d2defa" }} />
                    <button type="button" aria-label="Mic" title="Voice input (AI)" onClick={speechToFields}
                      style={{ position: "absolute", top: 6, right: 4, background: "none", border: "none", fontSize: "1.32rem", color: "#22a6ee", cursor: "pointer" }}>{listening ? "🎤" : "🎙️"}</button>
                    {fromSuggest.length>0 && focusInput==="from" &&
                      <div style={{position:"absolute",top:41,left:0,background:"#fff",boxShadow:"0 2px 9px #e5eefe",borderRadius:6}}>
                        {fromSuggest.map((c,i)=>
                          <div key={i} style={{padding:"7px 15px",cursor:"pointer"}} onClick={()=>{setSegment(0,'from',c.code);setFromSuggest([]);setFocusInput('');}}>{c.name} – {c.code}</div>
                        )}
                      </div>}
                  </div>
                  <div style={{position:"relative",flex:1}}>
                    <input required placeholder="To" value={segments[0].to} onChange={e => setSegment(0, "to", e.target.value)} 
                      onFocus={()=>setFocusInput("to")} autoComplete="off"
                      style={{ flex: 1, padding: "12px", borderRadius: 7, border: "1px solid #d2defa" }} />
                    {toSuggest.length>0 && focusInput==="to" &&
                      <div style={{position:"absolute",top:41,left:0,background:"#fff",boxShadow:"0 2px 9px #e5eefe",borderRadius:6}}>
                        {toSuggest.map((c,i)=>
                          <div key={i} style={{padding:"7px 15px",cursor:"pointer"}} onClick={()=>{setSegment(0,'to',c.code);setToSuggest([]);setFocusInput('');}}>{c.name} – {c.code}</div>
                        )}
                      </div>}
                  </div>
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
          </main>
        }
        {/* --- Deals grid for tab --- */}
        {tab!=="blog" && (
        <section style={{ maxWidth: 1250, margin: "0 auto", padding: "20px 0 38px 0" }}>
          <h2 style={{textAlign:'center',fontWeight:800,fontSize:'1.55rem',marginBottom:24}}>
            Best <span style={{color:'#ec3099'}}>Deals</span> Right Now
          </h2>
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
        )}
        {/* --- Affiliates row for current tab --- */}
        {tab!=="blog" && (
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
        )}
        <footer style={{ marginTop: 36, textAlign: "center", padding: "32px 8px 18px 8px", fontSize: "1.05rem", color: "#888", background: "#fff", borderTop: "1px solid #ebebeb" }}>
          &copy; {new Date().getFullYear()} Travel in UK Ltd. All rights reserved.
        </footer>
      </div>
    </>
  );
}