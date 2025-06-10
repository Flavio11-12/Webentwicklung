const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Statische Dateien freigeben (style.css, script.js, Bilder etc.)
app.use(express.static(path.join(__dirname, 'Spiel')));

// HTML-Datei für Startseite ausliefern
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Spiel', 'Web.html'));
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
