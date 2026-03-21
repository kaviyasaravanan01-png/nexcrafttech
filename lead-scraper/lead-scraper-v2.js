// ========================================
// NexCraftTech Lead Scraper - City Runner
// Run one city at a time with resumable progress
// ========================================

const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_KEY = "AIzaSyA4RtWTm6xPXUurvb2sqREEP4rxRIEWu_g";
const delay = ms => new Promise(r => setTimeout(r, ms));

// ===== CONFIGURATION: Enable/Disable Cities =====
// Set to TRUE to run, FALSE to skip
// Just change TRUE/FALSE to enable/disable cities
const ENABLED_CITIES = {
  "india": {
    // Tier 1 - Major Metro Cities
    "chennai": false,
    "bangalore": false,
    "delhi": false,
    "mumbai": false,
    "hyderabad": false,
    "pune": false,
    
    // Tier 2 - Major Cities
    "ahmedabad": false,
    "kolkata": false,
    "jaipur": false,
    "lucknow": false,
    "chandigarh": false,
    "surat": false,
    "vadodara": false,
    "indore": false,
    "nagpur": false,
    "bhopal": false,
    "visakhapatnam": false,
    "kochi": false,
    "goa": false,
    "patna": false,
    "ranchi": false,
    "thiruvananthapuram": false,
    "coimbatore": false,
    "salem": false,
    "madurai": false,
    "trichy": false,
    
    // Tier 3 - Growing Cities
    "tiruppur": false,
    "erode": false,
    "vellore": false,
    "tirunelveli": false,
    "thoothukudi": false,
    "karur": false,
    "kumbakonam": false,
    "thanjavur": false,
    "dindigul": false,
    "hosur": false,
  },
  "usa": {
    // Top 20 US Cities
    "new_york": false,
    "los_angeles": false,
    "chicago": false,
    "houston": false,
    "phoenix": false,
    "philadelphia": false,
    "san_antonio": false,
    "san_diego": false,
    "dallas": false,
    "san_jose": false,
    "austin": false,
    "jacksonville": false,
    "denver": false,
    "boston": false,
    "seattle": false,
    "miami": false,
    "atlanta": false,
    "detroit": false,
    "minneapolis": false,
    "portland": false,
    "las_vegas": false,
    "orlando": false,
    "nashville": false,
    "new_orleans": false,
    "san_francisco": false,
  },
  "uk": {
    // Major UK Cities
    "london": false,
    "manchester": false,
    "birmingham": false,
    "leeds": false,
    "glasgow": false,
    "sheffield": false,
    "bristol": false,
    "edinburgh": false,
    "liverpool": false,
    "nottingham": false,
    "leicester": false,
    "coventry": false,
    "cardiff": false,
    "belfast": false,
    "southampton": false,
    "oxford": false,
    "cambridge": false,
    "york": false,
    "exeter": false,
  },
  "canada": {
    // Major Canadian Cities
    "toronto": false,
    "vancouver": false,
    "montreal": false,
    "calgary": false,
    "ottawa": false,
    "edmonton": false,
    "winnipeg": false,
    "quebec_city": false,
    "hamilton": false,
    "kitchener": false,
    "london": false,
    "calgary": false,
    "red_deer": false,
    "saskatoon": false,
    "halifax": false,
  },
  "australia": {
    // Major Australian Cities
    "sydney": false,
    "melbourne": true,
    "brisbane": false,
    "perth": false,
    "adelaide": false,
    "gold_coast": false,
    "newcastle": false,
    "wollongong": false,
    "logan_city": false,
    "canberra": false,
    "central_coast": false,
    "geelong": false,
    "townsville": false,
    "cairns": false,
    "sunshine_coast": false,
  },
  "uae": {
    // All Emirates + Major Cities
    "dubai": false,
    "abu_dhabi": false,
    "sharjah": false,
    "ajman": false,
    "ras_al_khaimah": false,
    "fujairah": false,
    "umm_al_quwain": false,
    "al_ain": false,
    "jebel_ali": false,
  },
  "singapore": {
    "singapore": false,
  }
};

// ===== LOCATIONS MAPPING =====
const locations = {
  "india": {
    // Tier 1
    "chennai": "Chennai, India",
    "bangalore": "Bangalore, India",
    "delhi": "Delhi, India",
    "mumbai": "Mumbai, India",
    "hyderabad": "Hyderabad, India",
    "pune": "Pune, India",
    
    // Tier 2
    "ahmedabad": "Ahmedabad, India",
    "kolkata": "Kolkata, India",
    "jaipur": "Jaipur, India",
    "lucknow": "Lucknow, India",
    "chandigarh": "Chandigarh, India",
    "surat": "Surat, India",
    "vadodara": "Vadodara, India",
    "indore": "Indore, India",
    "nagpur": "Nagpur, India",
    "bhopal": "Bhopal, India",
    "visakhapatnam": "Visakhapatnam, India",
    "kochi": "Kochi, India",
    "goa": "Goa, India",
    "patna": "Patna, India",
    "ranchi": "Ranchi, India",
    "thiruvananthapuram": "Thiruvananthapuram, India",
    "coimbatore": "Coimbatore, India",
    "salem": "Salem, India",
    "madurai": "Madurai, India",
    "trichy": "Trichy, India",
    
    // Tier 3
    "tiruppur": "Tiruppur, India",
    "erode": "Erode, India",
    "vellore": "Vellore, India",
    "tirunelveli": "Tirunelveli, India",
    "thoothukudi": "Thoothukudi, India",
    "karur": "Karur, India",
    "kumbakonam": "Kumbakonam, India",
    "thanjavur": "Thanjavur, India",
    "dindigul": "Dindigul, India",
    "hosur": "Hosur, India",
  },
  "usa": {
    "new_york": "New York, USA",
    "los_angeles": "Los Angeles, USA",
    "chicago": "Chicago, USA",
    "houston": "Houston, USA",
    "phoenix": "Phoenix, USA",
    "philadelphia": "Philadelphia, USA",
    "san_antonio": "San Antonio, USA",
    "san_diego": "San Diego, USA",
    "dallas": "Dallas, USA",
    "san_jose": "San Jose, USA",
    "austin": "Austin, USA",
    "jacksonville": "Jacksonville, USA",
    "denver": "Denver, USA",
    "boston": "Boston, USA",
    "seattle": "Seattle, USA",
    "miami": "Miami, USA",
    "atlanta": "Atlanta, USA",
    "detroit": "Detroit, USA",
    "minneapolis": "Minneapolis, USA",
    "portland": "Portland, USA",
    "las_vegas": "Las Vegas, USA",
    "orlando": "Orlando, USA",
    "nashville": "Nashville, USA",
    "new_orleans": "New Orleans, USA",
    "san_francisco": "San Francisco, USA",
  },
  "uk": {
    "london": "London, UK",
    "manchester": "Manchester, UK",
    "birmingham": "Birmingham, UK",
    "leeds": "Leeds, UK",
    "glasgow": "Glasgow, UK",
    "sheffield": "Sheffield, UK",
    "bristol": "Bristol, UK",
    "edinburgh": "Edinburgh, UK",
    "liverpool": "Liverpool, UK",
    "nottingham": "Nottingham, UK",
    "leicester": "Leicester, UK",
    "coventry": "Coventry, UK",
    "cardiff": "Cardiff, UK",
    "belfast": "Belfast, UK",
    "southampton": "Southampton, UK",
    "oxford": "Oxford, UK",
    "cambridge": "Cambridge, UK",
    "york": "York, UK",
    "exeter": "Exeter, UK",
  },
  "canada": {
    "toronto": "Toronto, Canada",
    "vancouver": "Vancouver, Canada",
    "montreal": "Montreal, Canada",
    "calgary": "Calgary, Canada",
    "ottawa": "Ottawa, Canada",
    "edmonton": "Edmonton, Canada",
    "winnipeg": "Winnipeg, Canada",
    "quebec_city": "Quebec City, Canada",
    "hamilton": "Hamilton, Canada",
    "kitchener": "Kitchener, Canada",
    "london": "London, Canada",
    "red_deer": "Red Deer, Canada",
    "saskatoon": "Saskatoon, Canada",
    "halifax": "Halifax, Canada",
  },
  "australia": {
    "sydney": "Sydney, Australia",
    "melbourne": "Melbourne, Australia",
    "brisbane": "Brisbane, Australia",
    "perth": "Perth, Australia",
    "adelaide": "Adelaide, Australia",
    "gold_coast": "Gold Coast, Australia",
    "newcastle": "Newcastle, Australia",
    "wollongong": "Wollongong, Australia",
    "logan_city": "Logan City, Australia",
    "canberra": "Canberra, Australia",
    "central_coast": "Central Coast, Australia",
    "geelong": "Geelong, Australia",
    "townsville": "Townsville, Australia",
    "cairns": "Cairns, Australia",
    "sunshine_coast": "Sunshine Coast, Australia",
  },
  "uae": {
    "dubai": "Dubai, UAE",
    "abu_dhabi": "Abu Dhabi, UAE",
    "sharjah": "Sharjah, UAE",
    "ajman": "Ajman, UAE",
    "ras_al_khaimah": "Ras Al Khaimah, UAE",
    "fujairah": "Fujairah, UAE",
    "umm_al_quwain": "Umm Al Quwain, UAE",
    "al_ain": "Al Ain, UAE",
    "jebel_ali": "Jebel Ali, UAE",
  },
  "singapore": {
    "singapore": "Singapore",
  }
};

// ===== BUSINESS CATEGORIES (120+) =====
const businesses = [
  // Construction & Real Estate
  "interior designer", "modular kitchen designer", "false ceiling designer", "architect", "construction company",
  "civil contractor", "building contractor", "home renovation service", "waterproofing contractor", "painting contractor",
  "tiles contractor", "granite supplier", "marble supplier", "aluminium fabrication", "glass works",
  "plumbing service", "electrician service", "AC service center", "pest control service", "cleaning service",
  "housekeeping service", "borewell service",
  
  // Furniture & Decor
  "furniture shop", "sofa dealer", "wooden furniture store", "modular furniture", "office furniture",
  "hardware store", "paint shop", "sanitary ware shop", "tiles showroom", "electrical shop",
  "decor shop", "home decor store", "wall art", "lighting store", "curtain shop",
  "carpet store", "wallpaper dealer", "garden decor", "landscaping service",
  
  // Beauty & Wellness
  "salon", "beauty parlour", "spa", "bridal makeup artist",
  
  // Healthcare
  "dental clinic", "physiotherapy clinic", "skin clinic", "ayurvedic clinic", "diagnostic center",
  "scan center", "medical shop", "optical shop", "eye clinic", "orthopedic clinic",
  "child specialist clinic", "fertility clinic", "veterinary clinic", "pet clinic",
  
  // Food & Hospitality
  "restaurant", "biryani restaurant", "mess", "bakery", "cafe", "tiffin service", "catering service",
  
  // Fitness & Sports
  "gym", "fitness center", "yoga center", "martial arts academy",
  
  // Real Estate
  "real estate agent", "property consultant",
  
  // Fashion & Retail
  "boutique", "tailor shop", "gift shop", "toy shop", "stationery shop",
  
  // Automotive
  "car service center", "bike service center", "car detailing service", "car wash center", "car accessories shop",
  "tyre shop", "battery shop", "car rental service", "bike rental service", "driving school",
  
  // Electronics & Technology
  "mobile shop", "electronics shop", "computer shop",
  
  // Travel & Tourism
  "travel agency", "tour operator",
  
  // Events & Entertainment
  "photography studio", "wedding photographer", "event planner", "wedding planner", "wedding hall",
  "marriage hall", "party hall", "decorator", "balloon decorator", "DJ service",
  
  // Printing & Services
  "printing press", "flex printing",
  
  // Professional Services
  "chartered accountant", "tax consultant", "insurance agent", "loan consultant", "visa consultant",
  "immigration consultant", "legal consultant", "advocate",
  
  // Education
  "play school", "montessori school", "tuition center", "coaching center", "spoken english institute",
  "computer training institute", "dance academy", "music academy",
];

// File for progress tracking
const PROGRESS_FILE = path.join(__dirname, "scraper-progress.json");
const STATS_FILE = path.join(__dirname, "scraper-stats.json");

// Load all phone numbers from CSV for duplicate detection
function loadPhoneNumbers(filename) {
  const filepath = path.join(__dirname, filename);
  const phones = new Set();
  
  if (fs.existsSync(filepath)) {
    const content = fs.readFileSync(filepath, "utf-8");
    const lines = content.split("\n").slice(1); // Skip header
    lines.forEach(line => {
      if (line.trim()) {
        const match = line.match(/,"([^"]+)"/); // Extract phone from CSV
        if (match && match[1]) {
          phones.add(match[1].trim());
        }
      }
    });
  }
  return phones;
}

// Check if phone already exists
function isPhoneDuplicate(phone, existingPhones) {
  if (!phone) return false;
  return existingPhones.has(phone.trim());
}

// Load progress
function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    const data = fs.readFileSync(PROGRESS_FILE, "utf-8");
    return JSON.parse(data);
  }
  return {};
}

// Save progress
function saveProgress(data) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2));
}

// Load existing leads count
function loadExistingLeads(filename) {
  const filepath = path.join(__dirname, filename);
  if (fs.existsSync(filepath)) {
    const content = fs.readFileSync(filepath, "utf-8");
    const lines = content.split("\n").filter(l => l.trim());
    return Math.max(0, lines.length - 1);
  }
  return 0;
}

// Append lead to CSV
async function appendLeadToCSV(filename, lead, existingPhones) {
  // Check for duplicates
  if (isPhoneDuplicate(lead.phone, existingPhones)) {
    return false; // Duplicate found
  }
  
  const filepath = path.join(__dirname, filename);
  const csvLine = `${lead.name},"${lead.phone}","${lead.address}","${lead.whatsapp}"\n`;
  
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, `NAME,PHONE,ADDRESS,WHATSAPP_LINK\n${csvLine}`);
  } else {
    fs.appendFileSync(filepath, csvLine);
  }
  
  // Add phone to existing phones set
  existingPhones.add(lead.phone.trim());
  return true; // Successfully added
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

async function searchPlaces(keyword, cityName, existingPhones) {
  let nextPageToken = null;
  let localLeads = 0;
  let duplicatesSkipped = 0;

  do {
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(keyword)}&key=${API_KEY}`;
    if (nextPageToken) url += `&pagetoken=${nextPageToken}`;

    try {
      const res = await axios.get(url);
      const places = res.data.results;

      if (!places || places.length === 0) {
        // No results - silently continue
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

            const added = await appendLeadToCSV(cityName, lead, existingPhones);
            if (added) {
              localLeads++;
              console.log(`    ✅ ${details.name}`);
            } else {
              duplicatesSkipped++;
              console.log(`    🔄 ${details.name} (duplicate phone)`);
            }
          }
        } catch (detailError) {
          // Silently skip
        }
      }

      nextPageToken = res.data.next_page_token;
      if (nextPageToken) {
        console.log(`  ⏳ Loading next page...`);
        await delay(4000);
      }
    } catch (searchError) {
      console.log(`  ❌ Search error: ${searchError.message}`);
      break;
    }
  } while (nextPageToken);

  return { localLeads, duplicatesSkipped };
}

async function runCitySearch(country, city, displayName) {
  const startTime = Date.now();
  const csvFilename = `${city}_${country}.csv`;
  const progress = loadProgress();
  
  if (!progress[csvFilename]) {
    progress[csvFilename] = { completed_keywords: [], total_leads: 0 };
  }

  const cityProgress = progress[csvFilename];
  const existingLeads = loadExistingLeads(csvFilename);
  const existingPhones = loadPhoneNumbers(csvFilename);
  let totalNewLeads = existingLeads;
  let totalDuplicates = 0;

  const keywords = businesses.map(b => `${b} ${displayName}`);

  console.log(`\n${'='.repeat(70)}`);
  console.log(`🌍 CITY: ${displayName}`);
  console.log(`📁 File: ${csvFilename}`);
  console.log(`📊 Total searches: ${keywords.length}`);
  console.log(`✅ Already processed: ${cityProgress.completed_keywords.length}`);
  console.log(`📈 Existing leads: ${existingLeads}`);
  console.log(`${'='.repeat(70)}\n`);

  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i];

    if (cityProgress.completed_keywords.includes(keyword)) {
      console.log(`⏭️  [${i + 1}/${keywords.length}] Skipped (done)`);
      continue;
    }

    console.log(`\n🔎 [${i + 1}/${keywords.length}] ${keyword}`);
    
    const result = await searchPlaces(keyword, csvFilename, existingPhones);
    const leadsFound = result.localLeads;
    const dupsInKeyword = result.duplicatesSkipped;
    
    totalNewLeads += leadsFound;
    totalDuplicates += dupsInKeyword;

    cityProgress.completed_keywords.push(keyword);
    progress[csvFilename] = cityProgress;
    saveProgress(progress);

    console.log(`  ✅ New: ${leadsFound} | 🔄 Duplicates skipped: ${dupsInKeyword} | Total: ${totalNewLeads}`);
    await delay(3000);
  }

  const elapsedMinutes = (Date.now() - startTime) / 60000;
  const leadsPerHour = totalNewLeads > 0 ? Math.round((totalNewLeads - existingLeads) / (elapsedMinutes / 60)) : 0;
  
  console.log(`\n${'='.repeat(70)}`);
  console.log(`✅ ${displayName} COMPLETE!`);
  console.log(`${'='.repeat(70)}`);
  console.log(`📊 New leads added: ${totalNewLeads - existingLeads}`);
  console.log(`🔄 Duplicates prevented: ${totalDuplicates}`);
  console.log(`📁 Total in file: ${totalNewLeads}`);
  console.log(`⏱️  Time taken: ${elapsedMinutes.toFixed(1)} minutes`);
  console.log(`🚀 ROI: ${leadsPerHour} leads/hour`);
  console.log(`${'='.repeat(70)}`);
}

async function run() {
  const scriptStartTime = Date.now();
  let totalScraped = 0;
  let totalDuplicates = 0;
  
  console.log("\n" + "=".repeat(70));
  console.log("🚀 NexCraftTech Lead Scraper - City Runner v2");
  console.log("=".repeat(70));

  // Collect enabled cities
  const citiesToRun = [];
  for (const [country, cities] of Object.entries(ENABLED_CITIES)) {
    for (const [city, enabled] of Object.entries(cities)) {
      if (enabled && locations[country] && locations[country][city]) {
        citiesToRun.push({
          country,
          city,
          displayName: locations[country][city]
        });
      }
    }
  }

  if (citiesToRun.length === 0) {
    console.log("\n❌ No cities enabled!");
    console.log("   📝 Edit ENABLED_CITIES in lead-scraper-v2.js");
    console.log("   Change: true/false to enable/disable cities\n");
    return;
  }

  console.log(`\n📍 Running for ${citiesToRun.length} city(ies):\n`);
  citiesToRun.forEach((c, i) => {
    console.log(`   ${i + 1}. ${c.displayName}`);
  });

  // Run each city
  for (const cityConfig of citiesToRun) {
    await runCitySearch(cityConfig.country, cityConfig.city, cityConfig.displayName);
    await delay(5000);
  }

  // Calculate final stats
  const totalTime = (Date.now() - scriptStartTime) / 1000 / 60; // Convert to minutes
  let grandTotal = 0;
  citiesToRun.forEach(c => {
    const count = loadExistingLeads(`${c.city}_${c.country}.csv`);
    grandTotal += count;
  });

  console.log("\n" + "=".repeat(70));
  console.log("🎉 ALL SCRAPING COMPLETE!");
  console.log("=".repeat(70));
  console.log("\n📊 FINAL STATISTICS:");
  console.log(`   📁 Generated ${citiesToRun.length} CSV file(s)`);
  console.log(`   📈 Total leads scraped: ${grandTotal}`);
  console.log(`   ⏱️  Total time: ${totalTime.toFixed(1)} minutes (${(totalTime / 60).toFixed(1)} hours)`);
  console.log(`   🚀 Overall rate: ${Math.round(grandTotal / (totalTime / 60))} leads/hour`);
  console.log("\n📁 Generated files:");
  citiesToRun.forEach(c => {
    const count = loadExistingLeads(`${c.city}_${c.country}.csv`);
    console.log(`   ✅ ${c.city}_${c.country}.csv (${count} leads)`);
  });
  console.log("\n" + "=".repeat(70) + "\n");
}

run().catch(err => console.error("Fatal error:", err));
