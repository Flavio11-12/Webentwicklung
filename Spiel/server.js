const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const server = http.createServer((req, res) => {
  console.log('Request:', req.url);

  if (req.url === '/daten') {
    const daten = { name: "Flavio", konto: 42 };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(daten));
    return;
  }

  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './Spiel/Web.html'; // Startseite
  } else {
    filePath = './Spiel' + req.url; // andere Dateien aus /Spiel (auch Bilder aus /Spiel/Bilder)
  }

  const ext = path.extname(filePath).toLowerCase();

  let contentType = 'text/html'; // Standard

  switch (ext) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.gif':
      contentType = 'image/gif';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.log('FEHLER beim Laden:', filePath);
      res.writeHead(404);
      res.end('404 - Datei nicht gefunden');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
