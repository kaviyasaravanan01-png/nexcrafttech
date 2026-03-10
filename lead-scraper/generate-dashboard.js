const fs = require("fs");
const { exec } = require("child_process");
const csv = require("csv-parser");

const results = [];

console.log("Reading leads.csv...");

fs.createReadStream("leads.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>WhatsApp Leads Dashboard</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; margin: 0; padding: 20px; color: #333; }
        .container { max-width: 800px; margin: 0 auto; }
        h1 { text-align: center; color: #128C7E; }
        .lead-card { background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 20px; margin-bottom: 20px; transition: transform 0.2s; }
        .lead-card:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
        .lead-name { font-size: 1.2em; font-weight: bold; margin-bottom: 10px; color: #075E54; }
        .lead-info { margin-bottom: 5px; color: #555; }
        .btn { display: inline-block; background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 50px; font-weight: bold; margin-top: 15px; transition: background-color 0.2s; }
        .btn:hover { background-color: #128C7E; }
        .stats { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .visited { opacity: 0.6; }
      </style>
      <script>
        function markVisited(element) {
          element.closest('.lead-card').classList.add('visited');
          element.innerText = "WhatsApp Opened ✓";
          element.style.backgroundColor = "#999";
        }
      </script>
    </head>
    <body>
      <div class="container">
        <h1>WhatsApp Leads Dashboard</h1>
    `;

    const leadsWithWhatsapp = results.filter(r => r.WHATSAPP_LINK);

    html += `
        <div class="stats">
          Total Leads: ${results.length} | Leads with WhatsApp: ${leadsWithWhatsapp.length}
        </div>
    `;

    leadsWithWhatsapp.forEach((lead, index) => {
      html += `
        <div class="lead-card">
          <div class="lead-name">${index + 1}. ${lead.NAME || 'Unknown Business'}</div>
          <div class="lead-info">📞 <strong>Phone:</strong> ${lead.PHONE || 'N/A'}</div>
          <div class="lead-info">📍 <strong>Address:</strong> ${lead.ADDRESS || 'N/A'}</div>
          <a class="btn" href="${lead.WHATSAPP_LINK}" target="_blank" onclick="markVisited(this)">💬 Open WhatsApp</a>
        </div>
      `;
    });

    html += `
      </div>
    </body>
    </html>
    `;

    fs.writeFileSync("leads_dashboard.html", html);
    console.log("✅ leads_dashboard.html created successfully!");
    
    // Open in default browser
    const startCmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start ""' : 'xdg-open';
    exec(`${startCmd} leads_dashboard.html`);
    console.log("Opening dashboard in your web browser...");
  });
