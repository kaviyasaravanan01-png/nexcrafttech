#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const os = require('os');

// Get the local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Listen on all network interfaces
const SCRIPT_DIR = __dirname;

// Serve files
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = path.normalize(parsedUrl.pathname);

  // Remove leading slash
  if (pathname.startsWith('/')) {
    pathname = pathname.slice(1);
  }

  // Default to index.html
  if (pathname === '' || pathname === '/') {
    pathname = 'leads_dashboard.html';
  }

  const filePath = path.join(SCRIPT_DIR, pathname);

  // Security: prevent path traversal
  if (!filePath.startsWith(SCRIPT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Denied');
    return;
  }

  // Read and serve files
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - File Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 - Server Error');
      }
      return;
    }

    // Set content type
    let contentType = 'application/octet-stream';
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css',
      '.js': 'text/javascript',
      '.csv': 'text/csv',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.ico': 'image/x-icon',
    };

    if (mimeTypes[ext]) {
      contentType = mimeTypes[ext];
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  });
});

const localIP = getLocalIP();

server.listen(PORT, HOST, () => {
  console.log('\n================================================');
  console.log('🚀 WhatsApp Leads Dashboard Server Started');
  console.log('================================================\n');
  console.log('📍 Local Access:');
  console.log(`   http://localhost:${PORT}`);
  console.log(`   http://127.0.0.1:${PORT}\n`);
  console.log('🌐 Network Access (for other devices):');
  console.log(`   http://${localIP}:${PORT}\n`);
  console.log('📂 Serving files from:', SCRIPT_DIR);
  console.log('\n💡 TIP: Share this link with team members to access the dashboard');
  console.log('⚠️  Make sure your firewall allows port 3000 for network access');
  console.log('\n🔚 Press Ctrl+C to stop the server\n');
  console.log('================================================\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Server shutting down...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});
