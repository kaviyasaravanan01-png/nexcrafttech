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
const fs = require("fs");
const path = require("path");
const { createObjectCsvWriter } = require("csv-writer");

const API_KEY = "AIzaSyA4RtWTm6xPXUurvb2sqREEP4rxRIEWu_g";

const delay = ms => new Promise(r => setTimeout(r, ms));

// File for progress tracking
const PROGRESS_FILE = path.join(__dirname, "scraper-progress.json");
const OUTPUT_FILE = path.join(__dirname, "leads.csv");

// Countries with cities
const locations = {
  "india": {
    country_code: "IN",
    cities: ["chennai", "coimbatore", "madurai", "trichy", "salem", "erode", "tiruppur", "vellore", "tirunelveli", "thoothukudi", "nagercoil", "karur", "namakkal", "kumbakonam", "thanjavur", "dindigul", "theni", "cuddalore", "pudukkottai", "hosur"]
  },
  "usa": {
    country_code: "US",
    cities: ["new york", "los angeles", "chicago", "houston", "phoenix", "philadelphia", "san antonio", "san diego", "dallas", "san jose", "austin", "jacksonville", "miami", "denver", "boston", "seattle"]
  },
  "uk": {
    country_code: "GB",
    cities: ["london", "manchester", "birmingham", "leeds", "glasgow", "sheffield", "bristol", "edinburgh", "liverpool", "nottingham"]
  },
  "canada": {
    country_code: "CA",
    cities: ["toronto", "vancouver", "montreal", "calgary", "ottawa", "quebec city", "winnipeg", "edmonton", "hamilton", "kitchener"]
  },
  "australia": {
    country_code: "AU",
    cities: ["sydney", "melbourne", "brisbane", "perth", "adelaide", "gold coast", "newcastle", "wollongong", "logan city", "canberra"]
  },
  "uae": {
    country_code: "AE",
    cities: ["dubai", "abu dhabi", "sharjah", "ajman", "ras al khaimah", "fujairah", "umm al quwain"]
  },
  "singapore": {
    country_code: "SG",
    cities: ["singapore"]
  }
};

const businesses = [
  "interior designer", "modular kitchen designer", "false ceiling designer", "architect", "construction company",
  "civil contractor", "building contractor", "home renovation service", "waterproofing contractor", "painting contractor",
  "tiles contractor", "granite supplier", "marble supplier", "aluminium fabrication", "glass works",
  "plumbing service", "electrician service", "AC service center", "pest control service", "cleaning service",
  "housekeeping service", "borewell service",
  "salon", "beauty parlour", "spa", "bridal makeup artist",
  "dental clinic", "physiotherapy clinic", "skin clinic", "ayurvedic clinic", "diagnostic center",
  "scan center", "medical shop", "optical shop", "eye clinic", "orthopedic clinic",
  "child specialist clinic", "fertility clinic", "veterinary clinic", "pet clinic",
  "restaurant", "biryani restaurant", "mess", "bakery", "cafe", "tiffin service", "catering service",
  "gym", "fitness center", "yoga center", "martial arts academy",
  "real estate agent", "property consultant",
  "boutique", "tailor shop", "gift shop", "toy shop", "stationery shop",
  "car service center", "bike service center", "car detailing service", "car wash center", "car accessories shop",
  "tyre shop", "battery shop", "car rental service", "bike rental service", "driving school",
  "mobile shop", "electronics shop", "computer shop",
  "travel agency", "tour operator",
  "photography studio", "wedding photographer", "event planner", "wedding planner", "wedding hall",
  "marriage hall", "party hall", "decorator", "balloon decorator", "DJ service",
  "printing press", "flex printing",
  "chartered accountant", "tax consultant", "insurance agent", "loan consultant", "visa consultant",
  "immigration consultant", "legal consultant", "advocate",
  "play school", "montessori school", "tuition center", "coaching center", "spoken english institute",
  "computer training institute", "dance academy", "music academy",
  "furniture shop", "hardware store", "paint shop", "sanitary ware shop", "tiles showroom", "electrical shop"
];

// Load progress
function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    const data = fs.readFileSync(PROGRESS_FILE, "utf-8");
    return JSON.parse(data);
  }
  return { completed_keywords: [], total_leads: 0 };
}

// Save progress
function saveProgress(completed, total) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ completed_keywords: completed, total_leads: total }, null, 2));
}

// Load existing leads
function loadExistingLeads() {
  if (fs.existsSync(OUTPUT_FILE)) {
    const content = fs.readFileSync(OUTPUT_FILE, "utf-8");
    const lines = content.split("\n");
    return lines.length - 2; // subtract header and empty line
  }
  return 0;
}

// Append lead to CSV
async function appendLeadToCSV(lead) {
  const csvLine = `${lead.name},"${lead.phone}","${lead.address}","${lead.whatsapp}"\n`;
  
  if (!fs.existsSync(OUTPUT_FILE)) {
    fs.writeFileSync(OUTPUT_FILE, `NAME,PHONE,ADDRESS,WHATSAPP_LINK\n${csvLine}`);
  } else {
    fs.appendFileSync(OUTPUT_FILE, csvLine);
  }
}

function createWhatsAppLink(name, phone) {
  if (!phone) return "";
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) cleaned = "91" + cleaned;
  else if (cleaned.startsWith("0")) cleaned = "91" + cleaned.substring(1);

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

  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

async function searchPlaces(keyword) {
  let nextPageToken = null;
  let localLeads = 0;

  do {
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(keyword)}&key=${API_KEY}`;
    if (nextPageToken) url += `&pagetoken=${nextPageToken}`;

    try {
      const res = await axios.get(url);
      const places = res.data.results;

      if (!places || places.length === 0) {
        console.log(`⚠️ No results for: ${keyword}`);
      }

      for (const place of places) {
        if (place.business_status === "CLOSED_PERMANENTLY") continue;

        await delay(1500);

        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website,business_status&key=${API_KEY}`;

        try {
          const detailsRes = await axios.get(detailsUrl);
          const details = detailsRes.data.result;

          if (!details) continue;
          if (details.business_status === "CLOSED_PERMANENTLY") continue;

          if (!details.website) {
            const wa = createWhatsAppLink(details.name, details.formatted_phone_number);
            const lead = {
              name: details.name || "",
              phone: details.formatted_phone_number || "",
              address: details.formatted_address || "",
              whatsapp: wa
            };

            await appendLeadToCSV(lead);
            localLeads++;
            console.log(`✅ Lead: ${details.name} (Total: ${localLeads})`);
          }
        } catch (detailError) {
          console.log(`❌ Details error: ${detailError.message}`);
        }
      }

      nextPageToken = res.data.next_page_token;
      if (nextPageToken) {
        console.log("⏳ Loading next page...");
        await delay(4000);
      }
    } catch (searchError) {
      console.log(`❌ Search error: ${searchError.message}`);
      break;
    }
  } while (nextPageToken);

  return localLeads;
}

async function run() {
  const progress = loadProgress();
  const existingLeads = loadExistingLeads();
  
  let totalNewLeads = existingLeads;
  const keywords = [];

  // Generate keywords from locations
  for (const [country, data] of Object.entries(locations)) {
    for (const city of data.cities) {
      for (const business of businesses) {
        keywords.push(`${business} ${city}`);
      }
    }
  }

  console.log(`\n🔎 Total searches to process: ${keywords.length}`);
  console.log(`📊 Already processed: ${progress.completed_keywords.length}`);
  console.log(`📁 Existing leads: ${existingLeads}\n`);

  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i];

    if (progress.completed_keywords.includes(keyword)) {
      console.log(`⏭️  Skipping (already done): ${keyword}`);
      continue;
    }

    console.log(`\n[${i + 1}/${keywords.length}] 🔎 Searching: ${keyword}`);
    
    const leadsFound = await searchPlaces(keyword);
    totalNewLeads += leadsFound;

    progress.completed_keywords.push(keyword);
    saveProgress(progress.completed_keywords, totalNewLeads);

    console.log(`✅ Found ${leadsFound} leads | Total: ${totalNewLeads}`);
    await delay(3000);
  }

  console.log(`\n🎉 Scraping complete!`);
  console.log(`📊 New leads found: ${totalNewLeads - existingLeads}`);
  console.log(`📁 Total leads saved: ${totalNewLeads}`);
  console.log(`📄 Saved to: ${OUTPUT_FILE}`);
}

run().catch(err => console.error("Fatal error:", err));
