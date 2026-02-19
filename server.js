const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'plan.json');
const HTML_FILE = path.join(__dirname, 'index.html');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const server = http.createServer((req, res) => {
  // CORS-safe, single-origin app — no need for CORS headers

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(HTML_FILE).pipe(res);
    return;
  }

  if (req.method === 'GET' && req.url === '/api/plan') {
    if (fs.existsSync(DATA_FILE)) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      fs.createReadStream(DATA_FILE).pipe(res);
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('null');
    }
    return;
  }

  if (req.method === 'POST' && req.url === '/api/plan') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        JSON.parse(body); // validate JSON
        fs.writeFileSync(DATA_FILE, body, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end('{"error":"Invalid JSON"}');
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Annual Plan running at http://localhost:${PORT}`);
});
