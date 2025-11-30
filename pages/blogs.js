import Head from "next/head";
const ALL_TRAVEL_KEYWORDS = `
cheap flights, last minute flights, direct flights, flights to London, best hotels, hotel in Dubai, holiday deals, car rental, car hire deals, airport shuttle, all inclusive, vacation, city guide, booking tips, reviews, airline offers, train tickets, travel insurance, European breaks, airport transfers, best price guarantee, group travel, business flights, ... // extend
`;

const AUTO_BLOGS = [
  {title:"How to Always Find the Cheapest Flights", snippet:"Tips using Skyscanner, Booking.com, Expedia, lastminute.com, and insider hacks...", url:"#"},
  {title:"14 Hacks for Better Hotel Prices in Dubai", snippet:"Get the deal by booking at the right time and using the right platforms...", url:"#"},
  {title:"Car Rental: Save Big at the Airport", snippet:"Why you should always use Rentalcars, which upgrades to watch for, and when to book...", url:"#"},
];

export default function Blog() {
  return (
    <>
      <Head>
        <title>TravelDistant Blog | Cheap Flights, Hotels, Travel SEO Tips</title>
        <meta name="description" content="Travel blog with hundreds of travel keywords: cheap flights, hotels, cars, tips, guides, and reviews to boost SEO & attract visits for every search term." />
        <meta name="keywords" content={ALL_TRAVEL_KEYWORDS} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context":"https://schema.org",
            "@type":"Blog",
            headline:"TravelDistant: Travel Blog and SEO",
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
        <div style={{color:'#ad233b',fontSize:"1.06rem",marginTop:22}}>Travel topics: <span style={{color:'#444'}}>{ALL_TRAVEL_KEYWORDS}</span></div>
      </div>
    </>
  );
}