import Head from "next/head";
const ALL_TRAVEL_KEYWORDS = `
cheap flights, direct flights, flights to London, flights to Dubai, book hotels, 
hotel deals, last minute travel, car rental, car deals, cheap holiday, travel blog, 
how to book flights, best flight tickets, cheapest hotels, flight reviews, vacation tips, 
airline offers, travel insurance, airport transfers, business travel, group travel, ...[many more]
`;

const AUTO_BLOGS = [
  {
    title: "How to Find the Cheapest Flights Every Time",
    snippet: "Tips using Skyscanner, lastminute.com, and insider hacks...",
    url: "#"
  },
  {
    title: "Travel Hacks: Save on Hotels in Dubai & Paris",
    snippet: "Best booking windows, loyalty tips, and instant discounts...",
    url: "#"
  },
  // ...auto-expand with OpenAI or fetch from content API in production
];

export default function Blog() {
  return (
    <>
      <Head>
        <title>TravelDistant Blog | Best Flight, Hotel, and Travel Tips</title>
        <meta name="description" content="Huge travel keyword blog for SEO: cheap flights, best hotels, car rental, holiday tips, last minute deals, money saving and more." />
        <meta name="keywords" content={ALL_TRAVEL_KEYWORDS} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            headline: "TravelDistant: Mega-SEO Blog",
            keywords: ALL_TRAVEL_KEYWORDS.split(',').map(x => x.trim())
          })
        }}/>
      </Head>
      <div style={{maxWidth:900,margin:'40px auto',padding:'24px',background:'#fff',borderRadius:17,boxShadow:'0 2px 22px #dde6f1'}}>
        <h1 style={{fontWeight:900,fontSize:"2.2rem",marginBottom:20}}>Travel Blog & Tips</h1>
        {AUTO_BLOGS.map((b,i) =>
          <div key={i} style={{marginBottom:35,borderBottom:'1px solid #eef',paddingBottom:17}}>
            <h2 style={{fontWeight:700,fontSize:'1.26rem'}}>{b.title}</h2>
            <p>{b.snippet}</p>
            <a href={b.url} style={{color:'#3097fa',fontWeight:700}}>Read More</a>
          </div> )}
        <hr/>
        <div style={{color:'#ad233b',fontSize:"1.06rem",marginTop:22}}>Travel topics: <span style={{color:'#444'}}>{ALL_TRAVEL_KEYWORDS}</span></div>
      </div>
    </>
  );
}