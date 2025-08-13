const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const PORT = 3000;

http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  // Serve HTML page
  if (pathname === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500); res.end('Error loading page');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });

  // Read file content
  } else if (pathname === '/read' && req.method === 'GET') {
    const filePath = path.resolve(parsed.query.path || '');
    fs.readFile(filePath, 'utf8', (err, data) => {
      res.writeHead(err ? 500 : 200, { 'Content-Type': 'text/plain' });
      res.end(err ? `Error: ${err.message}` : data);
    });

  // Append to file
  } else if (pathname === '/append' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      const { path: filePath, text } = JSON.parse(body);
      fs.appendFile(path.resolve(filePath), text + '\n', err => {
        res.writeHead(err ? 500 : 200, { 'Content-Type': 'text/plain' });
        res.end(err ? `Error: ${err.message}` : 'Appended');
      });
    });

  // Delete file
  } else if (pathname === '/delete' && req.method === 'DELETE') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      const { path: filePath } = JSON.parse(body);
      fs.unlink(path.resolve(filePath), err => {
        res.writeHead(err ? 500 : 200, { 'Content-Type': 'text/plain' });
        res.end(err ? `Error: ${err.message}` : 'Deleted');
      });
    });

  // Create new file
  } else if (pathname === '/create' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      const { path: filePath } = JSON.parse(body);
      fs.writeFile(path.resolve(filePath), '', err => {
        res.writeHead(err ? 500 : 200, { 'Content-Type': 'text/plain' });
        res.end(err ? `Error: ${err.message}` : 'Created');
      });
    });

  } else {
    res.writeHead(404); res.end('Not found');
  }
}).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
