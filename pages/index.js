import Head from "next/head";
import { useState, useRef } from "react";

const TEQUILA_API_KEY = "YOUR_TEQUILA_API_KEY"; // Get yours at https://tequila.kiwi.com/portal

// Simple date helpers
const ymStr = (dt) => dt.toISOString().slice(0,7);

export default function Home() {
  const today = new Date(), 
      tomorrow = new Date(Date.now() + 86400000);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [depart, setDepart] = useState(today.toISOString().slice(0,10));
  const [calendarMonth, setCalendarMonth] = useState(ymStr(today));
  const [calendar, setCalendar] = useState([]); // [{date, price}]
  const [showCalendar, setShowCalendar] = useState(false);
  const [results, setResults] = useState([]);
  const [sort, setSort] = useState("recommended"); // recommended|cheapest|fastest|direct
  const [loading, setLoading] = useState(false);

  // Fetch calendar pricing
  async function fetchCalendarPrices() {
    setShowCalendar(true);
    setCalendar([]); // Reset
    if (!from || !to || !calendarMonth) return;
    setLoading(true);
    // Kiwi: fetch cheapest per each day in month
    // Use "date_from" as yyyy-mm-01, "date_to" as yyyy-mm-last
    const [y,m] = calendarMonth.split("-");
    const lastDay = new Date(+y, +m, 0).getDate();
    const res = await fetch(`https://tequila-api.kiwi.com/v2/search?fly_from=${from}&fly_to=${to}&date_from=${calendarMonth}-01&date_to=${calendarMonth}-${lastDay}&curr=GBP&limit=31&one_for_city=1&sort=price`, {
      headers: { apikey: TEQUILA_API_KEY }
    });
    const data = await res.json();
    const dayPrice = {};
    if (data && data.data) {
      // For each flight, record min price for that particular day
      data.data.forEach(f => {
        const d = f.local_departure.split("T")[0];
        if (!dayPrice[d] || f.price < dayPrice[d].price) 
          dayPrice[d] = { date:d, price:f.price };
      });
    }
    // Calendar: [{date, price}]
    setCalendar(Object.values(dayPrice));
    setLoading(false);
  }

  // Fetch flights for a specific search
  async function handleFlightSearch(e) {
    if (e) e.preventDefault();
    setResults([]); setLoading(true);
    const url = `https://tequila-api.kiwi.com/v2/search?fly_from=${from}&fly_to=${to}&dateFrom=${depart}&dateTo=${depart}&curr=GBP&limit=20`;
    const res = await fetch(url, {
      headers: { apikey: TEQUILA_API_KEY }
    });
    const data = await res.json();
    setResults(data && data.data ? data.data : []);
    setLoading(false);
  }

  // Sorting/filter logic for results
  const showResults = () => {
    let res = results.slice();
    if (sort === "cheapest") res.sort((a,b)=>a.price-b.price);
    if (sort === "fastest")  res.sort((a,b)=>a.duration.total-b.duration.total);
    if (sort === "direct")   res = res.filter(f => f.route.length === 1);
    // "recommended" = default order
    return res;
  };

  // Click calendar date to pick date and search
  function pickDay(d) {
    setDepart(d); setShowCalendar(false); handleFlightSearch();
  }

  // Voice and city suggest omitted: see previous answer for those features, can be combined with this code

  return (
    <>
      <Head>
        <title>TravelDistant | Cheap Flights Search & Comparison</title>
        <meta name="description" content="Compare flights, see daily pricing calendar, find cheapest airfares, and filter results by best, cheapest, fastest or direct. Modern, high-revenue meta-search." />
        {/* ...meta, adsense, og, etc. as before ... */}
      </Head>
      <div style={{fontFamily:"'Segoe UI',sans-serif", background:"#f7fafe", minHeight:"100vh"}}>
        <header style={{background:"#037fff", color:"#fff", padding:"15px 4vw"}}>
          <div style={{fontWeight:900, fontSize:"1.65rem"}}>TravelDistant</div>
        </header>
        <div style={{maxWidth:880,background:"#fff",margin:"38px auto 20px auto",borderRadius:17,boxShadow:"0 2.5px 22px #e6ecf1",padding:"0 0 30px 0"}}>
          {/* CALENDAR + SEARCH BAR */}
          <section style={{padding:"52px 42px 20px 42px", minHeight:210}}>
            <form onSubmit={handleFlightSearch} style={{display:"flex",gap:12,alignItems:"end"}}>
              <div>
                <label>From (IATA code)<br/>
                  <input type="text" value={from} onChange={e=>setFrom(e.target.value.toUpperCase())}
                    required placeholder="LHR" style={{width:90,padding:10,borderRadius:6,border:"1px solid #ccd"}}/>
                </label>
              </div>
              <div>
                <label>To (IATA code)<br/>
                  <input type="text" value={to} onChange={e=>setTo(e.target.value.toUpperCase())}
                    required placeholder="JFK" style={{width:90,padding:10,borderRadius:6,border:"1px solid #ccd"}}/>
                </label>
              </div>
              <div>
                <label>Depart<br/>
                  <input type="date" value={depart} onChange={e=>setDepart(e.target.value)}
                    style={{width:148,padding:10,borderRadius:6,border:"1px solid #ccd"}} required/>
                </label>
              </div>
              <button type="button" onClick={fetchCalendarPrices}
                style={{marginLeft:10,padding:"8px 16px",background:"#e0e9fd",border:"none",borderRadius:8,fontWeight:600,color:"#037fff",cursor:"pointer"}}>
                Show Calendar
              </button>
              <button type="submit"
                style={{
                  background:"#037fff",color:"#fff",fontWeight:700,fontSize:"1.1rem",
                  border:"none",padding:"14px 22px",borderRadius:8,cursor:"pointer"
                }}>
                Search Flights
              </button>
            </form>
            {/* Calendar modal */}
            {showCalendar && (
              <div style={{
                position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(47,58,77,0.16)",zIndex:50,
                display:"flex",alignItems:"center",justifyContent:"center"
              }}
                onClick={()=>setShowCalendar(false)}
              >
                <div style={{
                  background:"#fff",padding:"32px",borderRadius:14,
                  boxShadow:"0 2px 14px #d4dcef",maxWidth:500,minWidth:300
                }} onClick={e=>e.stopPropagation()}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <input type="month" value={calendarMonth}
                      onChange={e=>setCalendarMonth(e.target.value)}
                      style={{fontSize:"1.04rem",fontWeight:600,border:"1px solid #ccd",borderRadius:5,padding:"6px"}}
                    />
                    <button onClick={fetchCalendarPrices} style={{marginLeft:12,background:"#e8f2fc",border:"none",borderRadius:5,padding:"6px 15px",fontWeight:600,cursor:"pointer"}}>Refresh</button>
                  </div>
                  <div style={{margin:"0 0 10px 0",color:"#666"}}>Click a day to pick:</div>
                  <div style={{
                    display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3
                  }}>
                    {Array.from({length: 31}, (_,i)=>{
                      const d = `${calendarMonth}-${String(i+1).padStart(2,"0")}`;
                      const c = calendar.find(x=>x.date===d);
                      return (
                        <div key={d}
                          onClick={()=>c && pickDay(c.date)}
                          style={{
                            background:c?"#ebf8ea":"#f7f7fa",color:"#263674",
                            borderRadius:5,padding:8,minHeight:38,margin:1,
                            cursor:c?"pointer":"default",border:c?"1px solid #12a45f":"1px solid #eee",textAlign:"center",fontWeight:600
                          }}>
                          <div>{i+1}</div>
                          {c && <div style={{fontSize:"0.9em",color:"#26b347"}}>£{c.price}</div>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </section>
          {/* SORT/FILTER TABS */}
          <div style={{display:"flex",gap:0,margin:"5px 44px 7px 44px"}}>
            {["recommended","cheapest","fastest","direct"].map(s=>(
              <button key={s} style={{
                flex:1, border:"none",background:"#f2f7fe",
                fontWeight:600,fontSize:"1.07rem",color:sort===s?"#fff":"#037fff",
                backgroundColor: sort===s ? "#037fff" : "#f2f7fe",padding:"8px 0",borderRadius:7,marginRight:9,cursor:"pointer"
              }} onClick={()=>setSort(s)}>
                {s[0].toUpperCase()+s.slice(1)}
              </button>
            ))}
          </div>
          {/* FLIGHT RESULTS */}
          <div style={{padding:"5px 42px 36px 42px"}}>
            {loading && <div>Finding best fares...</div>}
            {showResults().length > 0 && <section>
              <h4 style={{fontWeight:700,margin:"0 0 12px 0",color:"#037fff"}}>
                Flights for {from} → {to} on {depart}
              </h4>
              <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                {showResults().map((f,idx)=>(
                  <div key={idx} style={{
                    background:"#eef6ff",borderRadius:13,padding:"18px 19px",minWidth:210,boxShadow:"0 2px 10px #ecf0ff"
                  }}>
                    <div><b>{f.cityFrom} → {f.cityTo}</b></div>
                    <div>{new Date(f.local_departure).toLocaleString()} <span style={{color:"#aaa"}}>({f.fly_duration})</span></div>
                    <div style={{fontSize:"1.07rem",fontWeight:700,padding:"9px 0",color:"#178323"}}>
                      £{f.price}
                    </div>
                    {f.route.length===1 && <div style={{fontSize:"0.98rem",color:"#1cbb82",marginBottom:2}}>Direct</div>}
                    <button style={{
                      background:"#037fff",padding:"6px 13px",color:"#fff",
                      border:"none",borderRadius:8,cursor:"pointer"
                    }} 
                      onClick={()=>window.open(
                        `https://www.skyscanner.net/transport/flights/${from}/${to}/${depart.replace(/-/g,"")}/?associateid=YOUR_SKYSCANNER_AFFILIATE_ID`
                        ,"_blank")}>
                      Book &rarr;
                    </button>
                  </div>
                ))}
              </div>
            </section>}
          </div>
        </div>
        {/* Could now add blog/ads/affiliate links/footer/etc here ... */}
        <footer style={{
          marginTop:30,
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