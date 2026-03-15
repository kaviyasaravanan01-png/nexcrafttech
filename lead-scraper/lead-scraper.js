// require("dotenv").config();
// const axios = require("axios");
// const { createObjectCsvWriter } = require("csv-writer");

// const API_KEY = "AIzaSyA4RtWTm6xPXUurvb2sqREEP4rxRIEWu_g";

// const keywords = [
//   "interior designer chennai",
//   "salon chennai",
//   "restaurant chennai",
//   "bakery chennai",
//   "real estate chennai",
//   "dental clinic chennai",
//   "spa chennai",
//   "architect chennai"
// ];

// const delay = ms => new Promise(r => setTimeout(r, ms));

// const leads = [];

// function createWhatsAppLink(name, phone) {
//   if (!phone) return "";

//   // Remove all non-numeric characters
//   let cleaned = phone.replace(/\D/g, "");
  
//   // Format for Indian numbers, avoiding duplicate country codes
//   if (cleaned.length === 10) {
//     cleaned = "91" + cleaned;
//   } else if (cleaned.startsWith("0")) {
//     cleaned = "91" + cleaned.substring(1);
//   }

//   const message = `Hi ${name},

// I’m Anand, an AI & Web Developer. I noticed your business and saw that there isn’t a dedicated website yet.

// I help businesses create modern websites to attract more customers.

// I can also create a sample homepage for your business for free.

// My work:
// https://nexcrafttechtest.vercel.app/

// Let me know if you're interested.`;

//   const encoded = encodeURIComponent(message);

//   return `https://wa.me/${cleaned}?text=${encoded}`;
// }

// async function searchPlaces(keyword) {

//   let nextPageToken = null;

//   do {
//     let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(keyword)}&key=${API_KEY}`;
//     if (nextPageToken) {
//       url += `&pagetoken=${nextPageToken}`;
//     }
//     try {
//       const res = await axios.get(url);
//       const places = res.data.results;
//       if (!places || places.length === 0) {
//         console.log(`⚠️ No places found for keyword: ${keyword}`);
//       }
//       for (const place of places) {
//         if (place.business_status === 'CLOSED_PERMANENTLY') {
//           console.log(`⏭️ Skipped (Closed): ${place.name}`);
//           continue;
//         }
//         await delay(1500);
//         const detailsUrl =
//           `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website,business_status&key=${API_KEY}`;
//         try {
//           const detailsRes = await axios.get(detailsUrl);
//           const details = detailsRes.data.result;
//           if (!details) {
//             console.log(`⏭️ Skipped (No details): ${place.name}`);
//             continue;
//           }
//           if (details.business_status === 'CLOSED_PERMANENTLY') {
//             console.log(`⏭️ Skipped (Closed in details): ${details.name}`);
//             continue;
//           }
//           if (!details.website) {
//             const wa = createWhatsAppLink(details.name, details.formatted_phone_number);
//             leads.push({
//               name: details.name || "",
//               phone: details.formatted_phone_number || "",
//               address: details.formatted_address || "",
//               whatsapp: wa
//             });
//             console.log(`✅ Lead Found: ${details.name} (Phone: ${details.formatted_phone_number || 'N/A'})`);
//           } else {
//             console.log(`⏭️ Skipped (Has Website): ${details.name}`);
//           }
//         } catch (detailError) {
//           console.error(`❌ Error fetching details for ${place.name || place.place_id}:`, detailError.message);
//         }
//       }
//       nextPageToken = res.data.next_page_token;
//       if (nextPageToken) {
//         console.log("⏳ Loading next page...");
//         await delay(4000);
//       }
//     } catch (searchError) {
//       console.error(`❌ Error fetching search results for keyword "${keyword}":`, searchError.message);
//       break;
//     }
//   } while (nextPageToken);

// }

// async function run() {

//   for (const keyword of keywords) {

//     console.log("\nSearching:", keyword);

//     await searchPlaces(keyword);

//     await delay(3000);

//   }

//   const csvWriter = createObjectCsvWriter({
//     path: "leads.csv",
//     header: [
//       { id: "name", title: "NAME" },
//       { id: "phone", title: "PHONE" },
//       { id: "address", title: "ADDRESS" },
//       { id: "whatsapp", title: "WHATSAPP_LINK" }
//     ]
//   });

//   await csvWriter.writeRecords(leads);

//   console.log("\nFinished. Leads saved to leads.csv");
// }

// run();


// require("dotenv").config();
const axios = require("axios");
const { createObjectCsvWriter } = require("csv-writer");

const API_KEY = "AIzaSyA4RtWTm6xPXUurvb2sqREEP4rxRIEWu_g";

const delay = ms => new Promise(r => setTimeout(r, ms));

const leads = [];

const cities = [
"chennai","coimbatore","madurai","trichy","salem","erode","tiruppur",
"vellore","tirunelveli","thoothukudi","nagercoil","karur","namakkal",
"kumbakonam","thanjavur","dindigul","theni","cuddalore","pudukkottai","hosur"
];

const businesses = [
"interior designer",
"modular kitchen designer",
"false ceiling designer",
"architect",
"construction company",
"salon",
"beauty parlour",
"spa",
"bridal makeup artist",
"dental clinic",
"physiotherapy clinic",
"skin clinic",
"ayurvedic clinic",
"restaurant",
"biryani restaurant",
"mess",
"bakery",
"cafe",
"gym",
"fitness center",
"yoga center",
"real estate agent",
"property consultant",
"boutique",
"tailor shop",
"car service center",
"bike service center",
"mobile shop",
"electronics shop",
"travel agency",
"tour operator",
"photography studio",
"wedding photographer",
"printing press",
"flex printing",
"tiffin service",
"catering service"
];

const keywords = [];

for (const city of cities) {
  for (const business of businesses) {
    keywords.push(`${business} ${city}`);
  }
}

function createWhatsAppLink(name, phone) {

  if (!phone) return "";

  let cleaned = phone.replace(/\D/g,"");

  if (cleaned.length === 10) {
    cleaned = "91" + cleaned;
  } else if (cleaned.startsWith("0")) {
    cleaned = "91" + cleaned.substring(1);
  }

  const message = `Hi ${name},

I'm Anand from NexCraftTech, an AI & Web Developer specializing in custom web solutions and AI chatbots.

I noticed your business doesn't have a dedicated online presence or AI automation yet. A professional website with AI bot integration can significantly help attract customers, automate support, and establish credibility.

I've successfully built and currently manage multiple client projects, including:
✅ Portfolio sites
✅ Service platforms
✅ E-commerce solutions
✅ AI chatbots & automation

Check out NexCraftTech and our completed projects:
https://nexcrafttech.com/

I can create a custom, modern website with AI bot automation tailored to your business needs. I also offer a free consultation to understand your requirements.

Looking forward to working with you!`;

  const encoded = encodeURIComponent(message);

  return `https://wa.me/${cleaned}?text=${encoded}`;
}

async function searchPlaces(keyword) {

  let nextPageToken = null;

  do {

    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(keyword)}&key=${API_KEY}`;

    if (nextPageToken) {
      url += `&pagetoken=${nextPageToken}`;
    }

    try {

      const res = await axios.get(url);

      const places = res.data.results;

      if (!places || places.length === 0) {
        console.log(`⚠️ No results for ${keyword}`);
      }

      for (const place of places) {

        if (place.business_status === "CLOSED_PERMANENTLY") {
          continue;
        }

        await delay(1500);

        const detailsUrl =
`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website,business_status&key=${API_KEY}`;

        try {

          const detailsRes = await axios.get(detailsUrl);

          const details = detailsRes.data.result;

          if (!details) continue;

          if (details.business_status === "CLOSED_PERMANENTLY") {
            continue;
          }

          if (!details.website) {

            const wa = createWhatsAppLink(details.name, details.formatted_phone_number);

            leads.push({
              name: details.name || "",
              phone: details.formatted_phone_number || "",
              address: details.formatted_address || "",
              whatsapp: wa
            });

            console.log("✅ Lead:", details.name);

          }

        } catch (detailError) {

          console.log("❌ Details error:", detailError.message);

        }

      }

      nextPageToken = res.data.next_page_token;

      if (nextPageToken) {

        console.log("⏳ Loading next page...");
        await delay(4000);

      }

    } catch (searchError) {

      console.log("❌ Search error:", searchError.message);
      break;

    }

  } while (nextPageToken);

}

async function run() {

  console.log("Total searches:", keywords.length);

  for (const keyword of keywords) {

    console.log("\n🔎 Searching:", keyword);

    await searchPlaces(keyword);

    await delay(3000);

  }

  const csvWriter = createObjectCsvWriter({
    path: "leads.csv",
    header: [
      { id: "name", title: "NAME" },
      { id: "phone", title: "PHONE" },
      { id: "address", title: "ADDRESS" },
      { id: "whatsapp", title: "WHATSAPP_LINK" }
    ]
  });

  await csvWriter.writeRecords(leads);

  console.log("\n🎉 Finished. Leads saved to leads.csv");

}

run();