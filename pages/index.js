import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import airports from "../data/airports-trimmed.json"; // <<-- needs to exist and be complete!

export default function Home() {
  // Locale/UX
  const [tab, setTab] = useState("flights");
  const [helpOpen, setHelpOpen] = useState(false);

  // Search fields
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [fromSuggest, setFromSuggest] = useState([]);
  const [toSuggest, setToSuggest] = useState([]);
  const [depart, setDepart] = useState("");
  const [ret, setRet] = useState("");

  // Voice
  const [listening, setListening] = useState(false);
  const recRef = useRef();

  // Autocomplete logic
  useEffect(() => {
    setFromSuggest(
      fromInput.length < 2
        ? []
        : airports
            .filter(
              (a) =>
                a.name.toLowerCase().startsWith(fromInput.toLowerCase()) ||
                a.iata.toLowerCase().startsWith(fromInput.toLowerCase()) ||
                a.country.toLowerCase().startsWith(fromInput.toLowerCase())
            )
            .slice(0, 8)
    );
  }, [fromInput]);

  useEffect(() => {
    setToSuggest(
      toInput.length < 2
        ? []
        : airports
            .filter(
              (a) =>
                a.name.toLowerCase().startsWith(toInput.toLowerCase()) ||
                a.iata.toLowerCase().startsWith(toInput.toLowerCase()) ||
                a.country.toLowerCase().startsWith(toInput.toLowerCase())
            )
            .slice(0, 8)
    );
  }, [toInput]);

  // Voice search: fills both FROM and TO
  function handleVoice() {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Voice input not supported in this browser.");
      return;
    }
    if (listening) return;
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new Recognition();
    recog.lang = "en-US";
    recog.onstart = () => setListening(true);
    recog.onend = () => setListening(false);
    recog.onerror = () => setListening(false);
    recog.onresult = (e) => {
      setListening(false);
      try {
        const text = e.results[0][0].transcript;
        // Parse "Book flight from Lahore to London"
        let re = /from ([a-zA-Z\s]+) to ([a-zA-Z\s]+)/i;
        let match = re.exec(text);
        if (match) {
          let fromName = match[1].trim();
          let toName = match[2].trim();
          const from = airports.find(
            (a) => a.name.toLowerCase() === fromName.toLowerCase() || a.iata.toLowerCase() === fromName.toLowerCase()
          );
          const to = airports.find(
            (a) => a.name.toLowerCase() === toName.toLowerCase() || a.iata.toLowerCase() === toName.toLowerCase()
          );
          if (from) setFromInput(`${from.name} (${from.iata})`);
          if (to) setToInput(`${to.name} (${to.iata})`);
        }
      } catch {}
    };
    recog.start();
    recRef.current = recog;
  }

  // Get IATA from input string (extracts codes like "London (LON)")
  function extractIata(str) {
    const m = str.match(/\(([A-Z]{3})\)/);
    if (m) return m[1];
    // fallback: try matching on city name
    const air = airports.find(
      (a) =>
        a.name.toLowerCase() === str.toLowerCase() ||
        a.iata.toLowerCase() === str.toLowerCase()
    );
    return air ? air.iata : "";
  }

  // Flight form submission
  function submit(e) {
    e.preventDefault();
    const fromCode = extractIata(fromInput);
    const toCode = extractIata(toInput);
    if (!fromCode || !toCode) {
      alert("Please select valid cities/airports from the suggestion list.");
      return;
    }
    if (!depart) {
      alert("Please enter a departure date.");
      return;
    }
    // Example for return; can extend for oneway/multi
    window.open(
      `https://www.skyscanner.net/transport/flights/${fromCode}/${toCode}/${depart.replace(
        /-/g,
        ""
      )}/${ret ? ret.replace(/-/g, "") : ""}?associateid=YOUR_SKYSCANNER_ID`,
      "_blank"
    );
  }

  // Sample deals/demo
  const deals = [
    {
      title: "London → Rome £68 (Skyscanner)",
      img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
      desc: "Nonstop last minute · Save 35%",
      badge: "EXCLUSIVE",
      link: "https://www.skyscanner.net/?associateid=YOUR_SKYSCANNER_ID"
    },
    {
      title: "Manchester to Malaga £97",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&q=80",
      desc: "Direct deal, free drinks · Book by today",
      badge: "HOT FLIGHT",
      link: "https://www.booking.com/index.html?aid=YOUR_BOOKING_AID"
    },
  ];

  return (
    <>
      <Head>
        <title>TravelDistant | Global Flights</title>
      </Head>
      <div style={{ background: "#f9faff", minHeight: "100vh", fontFamily: "Segoe UI,Arial,sans-serif" }}>
        {/* Top Navbar Demo */}
        <header style={{ background: "#2196f3", color: "#fff", padding: 18, fontWeight: 800, fontSize: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>🌎 TravelDistant</span>
          <nav>
            <button style={{ margin: "0 11px", border: "none", background: "none", color: "#fff", fontWeight: 700, cursor: "pointer" }} onClick={() => setTab("flights")}>Flights</button>
            <button style={{ margin: "0 11px", border: "none", background: "none", color: "#fff", fontWeight: 700, cursor: "pointer" }} onClick={() => setTab("blog")}>Blog</button>
            <button style={{ margin: "0 11px", border: "none", background: "none", color: "#fff", fontWeight: 700, cursor: "pointer" }} onClick={() => setHelpOpen(true)}>Help</button>
          </nav>
        </header>
        {/* Help Modal */}
        {helpOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.17)', zIndex: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setHelpOpen(false)}>
            <div style={{ background: "#fff", padding: '32px 30px', borderRadius: 15, boxShadow: "0 2px 20px #cdd" }} onClick={e => e.stopPropagation()}>
              <h2 style={{ marginTop: 0 }}>Help & FAQ</h2>
              <ul>
                <li>Select cities from the suggestions for best results.</li>
                <li>Voice command: Click the mic and speak e.g. <i>"Book flight from London to Paris"</i>.</li>
                <li>Deals update automatically. For all support, contact <a href="mailto:support@traveldistant.com">support@traveldistant.com</a></li>
              </ul>
              <button onClick={() => setHelpOpen(false)} style={{ marginTop: 20, padding: '8px 18px', fontWeight: 700, borderRadius: 8, background: '#2196f3', color: '#fff' }}>Close</button>
            </div>
          </div>
        )}
        {/* Flight Search Hero */}
        {tab === "flights" && (
          <main style={{ maxWidth: 430, margin: "48px auto 36px auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 18px #eef1fc", padding: "26px 30px", minHeight: "320px" }}>
            <form onSubmit={submit}>
              <div style={{ fontWeight: 900, fontSize: "1.35rem", marginBottom: 20 }}>Search Flights</div>
              <div style={{ marginBottom: 19, position: "relative" }}>
                <input
                  value={fromInput}
                  onChange={e => setFromInput(e.target.value)}
                  placeholder="From (city or airport)"
                  onFocus={() => setFromSuggest([])}
                  style={{ width: "100%", padding: "12px", borderRadius: 7, border: "1.1px solid #cfdbef" }}
                />
                <button type="button" aria-label="Voice" onClick={handleVoice} style={{ position: "absolute", top: 6, right: 8, background: "none", border: "none", fontSize: "1.32rem", color: listening ? "#29b6f6" : "#757575", cursor: "pointer" }}>{listening ? "🎤" : "🎙️"}</button>
                {fromSuggest.length > 0 && (
                  <div style={{ position: "absolute", top: 47, left: 0, background: "#fff", width: "100%", borderRadius: 7, boxShadow: "0 2px 13px #e4edfb", zIndex: 3 }}>
                    {fromSuggest.map((a, i) =>
                      <div key={i} style={{ padding: "9px 14px", cursor: "pointer" }}
                        onClick={() => { setFromInput(`${a.name} (${a.iata})`); setFromSuggest([]); }}>
                        {a.name} <b>({a.iata})</b> – {a.country}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 19, position: "relative" }}>
                <input
                  value={toInput}
                  onChange={e => setToInput(e.target.value)}
                  placeholder="To (city or airport)"
                  onFocus={() => setToSuggest([])}
                  style={{ width: "100%", padding: "12px", borderRadius: 7, border: "1.1px solid #cfdbef" }}
                />
                {toSuggest.length > 0 && (
                  <div style={{ position: "absolute", top: 47, left: 0, background: "#fff", width: "100%", borderRadius: 7, boxShadow: "0 2px 13px #e4edfb", zIndex: 3 }}>
                    {toSuggest.map((a, i) =>
                      <div key={i} style={{ padding: "9px 14px", cursor: "pointer" }}
                        onClick={() => { setToInput(`${a.name} (${a.iata})`); setToSuggest([]); }}>
                        {a.name} <b>({a.iata})</b> – {a.country}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 19 }}>
                <input type="date" value={depart} onChange={e => setDepart(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: 7, border: "1.1px solid #cfdbef" }} />
              </div>
              <div style={{ marginBottom: 19 }}>
                <input type="date" value={ret} onChange={e => setRet(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: 7, border: "1.1px solid #cfdbef" }} placeholder="Return (optional)" />
              </div>
              <button type="submit" style={{ background: "#176bcb", color: "#fff", fontWeight: 700, fontSize: "1.15rem", padding: "14px 25px", border: "none", borderRadius: 8, cursor: "pointer" }}>Search Flights</button>
            </form>
          </main>
        )}

        {/* Deals grid */}
        {tab === "flights" && (
          <section style={{ maxWidth: 950, margin: "0 auto", padding: "20px 0 40px 0" }}>
            <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.32rem', marginBottom: 18, color: "#1877d2" }}>Best Deals</h2>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
              {deals.map((deal, i) =>
                <div key={i} style={{ width: 280, background: '#fff', borderRadius: 13, boxShadow: '0 2px 15px #ebeafa', overflow: 'hidden', marginBottom: 14 }}>
                  <img src={deal.img} alt={deal.title} style={{ width: '100%', height: 120, objectFit: "cover" }} />
                  <div style={{ padding: '12px 14px 9px 14px' }}>
                    <div style={{ fontWeight: 900, fontSize: "1.05rem", color: "#ec3099" }}>{deal.title}</div>
                    <div style={{ margin: "7px 0 3px 0", color: "#565", fontWeight: 500 }}>{deal.desc}</div>
                    <span style={{ fontSize: ".97rem", color: "#fff", background: "#ec3099", borderRadius: 6, padding: "3px 10px 3px 10px", marginRight: 7 }}>{deal.badge}</span>
                    <a href={deal.link} target="_blank" style={{ display: 'inline-block', marginTop: 11, background: '#3494ef', color: '#fff', padding: '6px 17px', borderRadius: 6, fontWeight: 700, textDecoration: 'none' }}>Book Deal</a>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Blog (iframe for demo) */}
        {tab === "blog" && (
          <iframe src="/blog" style={{ border: "none", width: "100%", minHeight: "85vh", background: "transparent" }} title="Blog"></iframe>
        )}

        <footer style={{ marginTop: 30, textAlign: "center", padding: "20px 0 10px 0", fontSize: "1rem", color: "#888", background: "#fff", borderTop: "1px solid #e9f0fa" }}>
          &copy; {new Date().getFullYear()} Travel in UK Ltd.
        </footer>
      </div>
    </>
  );
}