const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Spiel')));

// MongoDB-Verbindung
mongoose.connect('mongodb://localhost:27017/spielDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB-Fehler:'));
db.once('open', () => {
  console.log('✅ MongoDB verbunden');
});

// Benutzer-Schema mit Kontostand & Verlauf
const BenutzerSchema = new mongoose.Schema({
  username: String,
  password: String, // Achtung: in echter App solltest du mit bcrypt hashen!
  kontostand: {
    type: Number,
    default: 0
  },
  verlauf: [
    {
      datum: { type: Date, default: Date.now },
      aktion: String,
      betrag: Number
    }
  ]
});

const Benutzer = mongoose.model('Benutzer', BenutzerSchema);

// Registrierung
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const benutzer = await Benutzer.findOne({ username });
  if (!benutzer) {
    return res.status(404).json({ message: 'Benutzer nicht gefunden' });
  }

  if (benutzer.password !== password) {
    return res.status(401).json({ message: 'Falsches Passwort' });
  }

  res.json({
    message: 'Login erfolgreich!',
    kontostand: benutzer.kontostand,
    verlauf: benutzer.verlauf
  });
});

// Kontostand & Verlauf aktualisieren
app.post('/api/updateKonto', async (req, res) => {
  const { username, betrag, aktion } = req.body;

  const benutzer = await Benutzer.findOne({ username });
  if (!benutzer) {
    return res.status(404).json({ message: 'Benutzer nicht gefunden' });
  }

  benutzer.kontostand += betrag;

  benutzer.verlauf.push({
    aktion,
    betrag
  });

  await benutzer.save();

  res.json({ message: 'Kontostand aktualisiert', neuerKontostand: benutzer.kontostand });
});

// HTML ausliefern
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Spiel', 'Web.html'));
});

// Server starten
app.listen(port, () => {
  console.log(`🌐 Server läuft auf http://localhost:${port}`);
});
