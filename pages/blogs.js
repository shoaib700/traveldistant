import Head from "next/head";
const ALL_TRAVEL_KEYWORDS = `
cheap flights, flights to London, hotels Paris, vacation deals, holidays, car rental, travel insurance, city guide, best airline, discount hotel,
flight deals Dubai, reviews, direct flights, book online, ...[many more]
`;

const AUTO_BLOGS = [
  {title:"How to Always Find the Cheapest Flights", snippet:"Tips using Skyscanner, Booking, and more...", url:"#"},
  {title:"Hotel Hacks for 2024", snippet:"Best loyalty tactics, when to book...", url:"#"}
];

export default function Blog() {
  return (
    <>
      <Head>
        <title>TravelDistant Blog | Flight, Hotel & Travel SEO Tips</title>
        <meta name="description" content="Huge keyword travel blog for SEO: flights, hotels, car hire, last minute, top deals and tips." />
        <meta name="keywords" content={ALL_TRAVEL_KEYWORDS} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context":"https://schema.org",
            "@type":"Blog",
            headline:"TravelDistant: SEO Blog",
            keywords: ALL_TRAVEL_KEYWORDS.split(",").map(x=>x.trim())
          })
        }}/>
      </Head>
      <div style={{maxWidth:900,margin:'40px auto',padding:'24px',background:'#fff',borderRadius:17,boxShadow:'0 2px 22px #dde6f1'}}>
        <h1 style={{fontWeight:900,fontSize:"2.2rem",marginBottom:20}}>Travel Blog & SEO Tips</h1>
        {AUTO_BLOGS.map((b,i) =>
          <div key={i} style={{marginBottom:35,borderBottom:'1px solid #eef',paddingBottom:17}}>
            <h2 style={{fontWeight:700,fontSize:'1.26rem'}}>{b.title}</h2>
            <p>{b.snippet}</p>
            <a href={b.url} style={{color:'#3097fa',fontWeight:700}}>Read More</a>
          </div> )}
        <hr/>
        <div style={{color:'#ad233b',fontSize:"1.06rem",marginTop:22}}>Topics: <span style={{color:'#444'}}>{ALL_TRAVEL_KEYWORDS}</span></div>
      </div>
    </>
  );
}