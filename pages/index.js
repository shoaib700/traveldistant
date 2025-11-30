import { useEffect, useState } from "react";
import Head from "next/head";

// Basic language/country/currency lists (expand if needed)
const LANGUAGES = [
  { code: 'en', label: 'English' }, { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' }, { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' }, { code: 'ar', label: 'العربية' }
];
const COUNTRIES = [
  { code: 'GB', label: 'United Kingdom', flag: "🇬🇧" },
  { code: 'US', label: 'United States', flag: "🇺🇸" },
  { code: 'FR', label: 'France', flag: "🇫🇷" },
  { code: 'DE', label: 'Germany', flag: "🇩🇪" },
  { code: 'IT', label: 'Italy', flag: "🇮🇹" },
  { code: 'PK', label: 'Pakistan', flag: "🇵🇰" },
  // ...add more as needed
];
const CURRENCIES = [
  { code: "GBP", symbol: "£" }, { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" }, { code: "PKR", symbol: "₨" }
];

const countryToCurrency = { GB: "GBP", US: "USD", FR: "EUR", DE: "EUR", IT: "EUR", PK: "PKR" };

export default function Home() {
  // Default states
  const [lang, setLang] = useState('en');
  const [country, setCountry] = useState('GB');
  const [currency, setCurrency] = useState('GBP');

  // On mount: auto-detect using browser and ipapi.co
  useEffect(() => {
    // Language: from browser, fallback English
    let browserLang = navigator.language || navigator.userLanguage || "en";
    if (browserLang.includes('-')) browserLang = browserLang.split('-')[0];
    if (LANGUAGES.some(l => l.code === browserLang)) setLang(browserLang);

    // Country: fetch from ipapi.co (can also use geolocation)
    fetch('https://ipapi.co/json')
      .then(r => r.json())
      .then(data => {
        if(data && data.country && COUNTRIES.some(c=>c.code===data.country)) {
          setCountry(data.country);
          // Auto-set currency only if not manually changed
          const mapped = countryToCurrency[data.country];
          if(mapped && CURRENCIES.some(c=>c.code === mapped)) setCurrency(mapped);
        }
      });
  }, []);

  // When user manually changes country, update currency if auto
  function handleCountryChange(e) {
    const newCountry = e.target.value;
    setCountry(newCountry);
    const mapped = countryToCurrency[newCountry];
    if(mapped && CURRENCIES.some(c=>c.code === mapped)) setCurrency(mapped);
  }

  return (
    <>
      <Head>
        <title>TravelDistant | Cheap Flights, Deals, Hotels, Car Rental</title>
      </Head>
      <div style={{background:"#f7f7fc",minHeight:"100vh"}}>
        {/* Nav Bar with Language/Country/Currency */}
        <header style={{
          width:"100%",background:"linear-gradient(90deg,#2495f8 85%,#fa3fa6 100%)",color:"#fff",padding:"24px 0 13px 0",
          display:"flex",alignItems:"center",justifyContent:"space-between",fontWeight:700,fontSize:"1.37rem"
        }}>
          <span style={{marginLeft:"5vw"}}>🌍 TravelDistant</span>
          {/* Dropdowns */}
          <div style={{marginRight:"6vw",display:"flex",alignItems:"center",gap:15}}>
            <span style={{fontSize:"1.06rem"}}>🌐</span>
            <select value={lang} onChange={e=>setLang(e.target.value)}
              style={{padding:"7px 12px",borderRadius:6,border:"none",fontWeight:700,fontSize:"1rem"}}>
              {LANGUAGES.map(l=> <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
            <select value={country} onChange={handleCountryChange}
              style={{padding:"7px 12px",borderRadius:6,border:"none",fontWeight:700,fontSize:"1rem"}}>
              {COUNTRIES.map(c=>
                <option key={c.code} value={c.code}>{c.flag}&nbsp;{c.label}</option>
              )}
            </select>
            <select value={currency} onChange={e=>setCurrency(e.target.value)}
              style={{padding:"7px 10px",borderRadius:6,border:"none",fontWeight:700,fontSize:"1rem"}}>
              {CURRENCIES.map(c=>
                <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
              )}
            </select>
          </div>
        </header>

        {/* ...rest of your site... */}

      </div>
    </>
  );
}