// Script to update WhatsApp messages in CSV files
const fs = require("fs");
const path = require("path");

// Country code mapping
const COUNTRY_CODES = {
  "India": "91",
  "India, ": "91",
  "Australia": "61",
  "Australia, ": "61",
  "USA": "1",
  "United States": "1",
  "UK": "44",
  "United Kingdom": "44",
  "Canada": "1",
  "Canada, ": "1",
  "UAE": "971",
  "United Arab Emirates": "971",
  "Singapore": "65",
};

// Function to detect country from address
function detectCountry(address) {
  if (!address) return "India"; // Default to India
  
  const upperAddress = address.toUpperCase();
  
  if (upperAddress.includes("AUSTRALIA") || upperAddress.includes("VIC") || upperAddress.includes("NSW") || upperAddress.includes("QLD")) {
    return "Australia";
  } else if (upperAddress.includes("USA") || upperAddress.includes("UNITED STATES") || upperAddress.includes("NEW YORK") || upperAddress.includes("LOS ANGELES")) {
    return "USA";
  } else if (upperAddress.includes("UK") || upperAddress.includes("UNITED KINGDOM") || upperAddress.includes("LONDON")) {
    return "UK";
  } else if (upperAddress.includes("CANADA")) {
    return "Canada";
  } else if (upperAddress.includes("UAE") || upperAddress.includes("DUBAI") || upperAddress.includes("ABU DHABI")) {
    return "UAE";
  } else if (upperAddress.includes("SINGAPORE")) {
    return "Singapore";
  }
  
  return "India"; // Default
}

function getCountryCode(country) {
  return COUNTRY_CODES[country] || COUNTRY_CODES["India"];
}

function formatPhoneNumber(phone, country) {
  if (!phone) return "";

  let cleaned = phone.replace(/\D/g, "");
  const countryCode = getCountryCode(country);
  
  // If number already starts with country code, use it as-is
  if (cleaned.startsWith(countryCode)) {
    return cleaned;
  }
  
  // If it starts with 0, remove it and add country code
  if (cleaned.startsWith("0")) {
    cleaned = countryCode + cleaned.substring(1);
    return cleaned;
  }
  
  // For Australia: if it's 10 digits, add country code
  if (country === "Australia" && cleaned.length === 10) {
    cleaned = countryCode + cleaned;
    return cleaned;
  }
  
  // For India: if it's 10 digits, add country code
  if (country === "India" && cleaned.length === 10) {
    cleaned = countryCode + cleaned;
    return cleaned;
  }
  
  // For USA/Canada: if it's 10 digits, add country code
  if ((country === "USA" || country === "Canada") && cleaned.length === 10) {
    cleaned = countryCode + cleaned;
    return cleaned;
  }
  
  // Default: add country code if not already present
  if (!cleaned.startsWith(countryCode)) {
    cleaned = countryCode + cleaned;
  }
  
  return cleaned;
}

function escapeCSV(str) {
  if (!str) return "";
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function createWhatsAppLink(name, phone, address) {
  if (!phone) return "";

  const country = detectCountry(address);
  const cleaned = formatPhoneNumber(phone, country);

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

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

async function updateCSV(inputFile, outputFile) {
  try {
    const fileContent = fs.readFileSync(inputFile, "utf-8");
    const lines = fileContent.split("\n");

    if (lines.length < 2) {
      console.log("❌ CSV file is empty or not properly formatted");
      return;
    }

    const leads = [];
    let processedCount = 0;

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const parts = parseCSVLine(lines[i]);

      if (parts.length < 2) continue;

      const name = parts[0].replace(/"/g, "").trim();
      const phone = parts[1] ? parts[1].replace(/"/g, "").trim() : "";
      const address = parts[2] ? parts[2].replace(/"/g, "").trim() : "";

      const whatsappLink = createWhatsAppLink(name, phone, address);

      leads.push({
        name,
        phone,
        address,
        whatsapp: whatsappLink
      });

      processedCount++;
    }

    // Write updated CSV
    let csvContent = "NAME,PHONE,ADDRESS,WHATSAPP_LINK\n";
    for (const lead of leads) {
      csvContent += `${escapeCSV(lead.name)},${escapeCSV(lead.phone)},${escapeCSV(lead.address)},${escapeCSV(lead.whatsapp)}\n`;
    }

    fs.writeFileSync(outputFile, csvContent, "utf-8");
    console.log(`✅ Updated CSV saved to: ${outputFile}`);
    console.log(`📊 Total leads processed: ${processedCount}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Update all location-based CSV files
const csvFiles = [
  "firstleads.csv",
  "melbourne_australia.csv",
  "chennai_india.csv"
];

async function updateAllCSVs() {
  for (const csvFile of csvFiles) {
    const inputPath = path.join(__dirname, csvFile);
    
    // Check if file exists before processing
    if (!fs.existsSync(inputPath)) {
      console.log(`⏭️  Skipping ${csvFile} (file not found)`);
      continue;
    }
    
    console.log(`\n🔄 Updating WhatsApp links in ${csvFile}...`);
    await new Promise((resolve) => {
      // Small delay between file processing
      setTimeout(() => {
        updateCSV(inputPath, inputPath);
        resolve();
      }, 500);
    });
  }
  console.log("\n✨ All CSV files updated!");
}

updateAllCSVs();
