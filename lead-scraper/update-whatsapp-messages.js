// Script to update WhatsApp messages in CSV files
const fs = require("fs");
const path = require("path");

function escapeCSV(str) {
  if (!str) return "";
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function createWhatsAppLink(name, phone) {
  if (!phone) return "";

  let cleaned = phone.replace(/\D/g, "");

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

      const whatsappLink = createWhatsAppLink(name, phone);

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

// Update firstleads.csv
const inputPath = path.join(__dirname, "firstleads.csv");
const outputPath = path.join(__dirname, "firstleads.csv");

console.log("🔄 Updating WhatsApp messages in firstleads.csv...");
updateCSV(inputPath, outputPath);
