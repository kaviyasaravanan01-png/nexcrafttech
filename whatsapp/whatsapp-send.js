const { exec } = require("child_process");

const contacts = [
  { name: "BLUE HOMES INTERIORS", phone: "919677067989" },
  { name: "FALSE CEILING DESIGNER", phone: "918248595974" },
  { name: "Arcturus Infrastructure", phone: "919791091195" },
  { name: "Kumar interior design", phone: "919884752737" },
  { name: "Target Interiors pvt Ltd", phone: "919444409009" },
  { name: "MAYA INTERIORS", phone: "919840808883" },
  { name: "Nick Interior Design", phone: "919941645290" },
];

function openWhatsApp(url, delay) {
  setTimeout(() => {
    exec(`cmd /c start "" "${url}"`);
  }, delay);
}

contacts.forEach((c, index) => {
  const message = `Hi ${c.name},

I’m Anand, an AI & Web Developer. I noticed your interior business online and saw that there isn’t a dedicated website yet.

I help businesses create modern websites to showcase their work and attract more customers through online enquiries.

I can also create a sample homepage for your interior business for free so you can see how it would look.

My work: https://nexcrafttechtest.vercel.app/

Let me know if you're interested. Thank you!`;

  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${c.phone}?text=${encoded}`;

  // open tab every 10 seconds
  openWhatsApp(url, index * 10000);
});