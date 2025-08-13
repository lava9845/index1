const http = require('http');  // Load built-in module for HTTP

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'}); // Set response header
  res.end('Hello, world!\n');  // Send response body
});

server.listen(3000);  // Listen on port 3000

console.log('Server running at http://localhost:3000/');
