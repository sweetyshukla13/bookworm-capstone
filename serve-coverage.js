const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const COVERAGE_DIR = path.join(__dirname, 'coverage');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let filePath = path.join(COVERAGE_DIR, req.url === '/' ? 'index.html' : req.url);
  
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('Coverage report not found. Please run: npm test -- --coverage');
      } else {
        res.writeHead(500);
        res.end('Server error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n📊 Coverage Report Server Running!`);
  console.log(`\n🌐 Open in browser: http://localhost:${PORT}`);
  console.log(`\n📁 Serving from: ${COVERAGE_DIR}`);
  console.log(`\nPress Ctrl+C to stop\n`);
});

// Made with Bob
