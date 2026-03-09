require("dotenv").config();
const axios = require("axios");
const { createObjectCsvWriter } = require("csv-writer");

const API_KEY = process.env.GOOGLE_API_KEY;

const keywords = [
  "interior designer chennai",
  "salon chennai",
  "restaurant chennai",
  "bakery chennai",
  "real estate chennai",
  "dental clinic chennai",
  "spa chennai",
  "architect chennai"
];

const delay = ms => new Promise(r => setTimeout(r, ms));

const leads = [];

function createWhatsAppLink(name, phone) {
  if (!phone) return "";

  const cleaned = phone.replace(/\D/g, "");

  const message = `Hi ${name},

I’m Anand, an AI & Web Developer. I noticed your business and saw that there isn’t a dedicated website yet.

I help businesses create modern websites to attract more customers.

I can also create a sample homepage for your business for free.

My work:
https://nexcrafttechtest.vercel.app/

Let me know if you're interested.`;

  const encoded = encodeURIComponent(message);

  return `https://wa.me/91${cleaned}?text=${encoded}`;
}

async function searchPlaces(keyword) {

  let nextPageToken = null;

  do {

    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(keyword)}&key=${API_KEY}`;

    if (nextPageToken) {
      url += `&pagetoken=${nextPageToken}`;
    }

    const res = await axios.get(url);

    const places = res.data.results;

    for (const place of places) {

      await delay(1500);

      const detailsUrl =
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website&key=${API_KEY}`;

      const detailsRes = await axios.get(detailsUrl);

      const details = detailsRes.data.result;

      if (!details) continue;

      if (!details.website) {

        const wa = createWhatsAppLink(details.name, details.formatted_phone_number);

        leads.push({
          name: details.name || "",
          phone: details.formatted_phone_number || "",
          address: details.formatted_address || "",
          whatsapp: wa
        });

        console.log("Lead:", details.name);

      }

    }

    nextPageToken = res.data.next_page_token;

    if (nextPageToken) {
      console.log("Loading next page...");
      await delay(4000);
    }

  } while (nextPageToken);

}

async function run() {

  for (const keyword of keywords) {

    console.log("\nSearching:", keyword);

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

  console.log("\nFinished. Leads saved to leads.csv");
}

run();