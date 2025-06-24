const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = 3000;

// Middleware: JSON Body Parser
app.use(express.json());

// Statischer Ordner für Frontend-Dateien
app.use(express.static(path.join(__dirname)));

// MongoDB-Verbindung
mongoose.connect('mongodb://localhost:27017/spielDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB verbunden'))
.catch(err => console.error('MongoDB Verbindung fehlgeschlagen:', err));

// Schema & Modell
const benutzerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  kontostand: { type: Number, default: 0 },
  verlauf: [
    {
      datum: { type: Date, default: Date.now },
      aktion: String,
      betrag: Number
    }
  ]
});

const Benutzer = mongoose.model('Benutzer', benutzerSchema);

// Startseite ausliefern
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Spiel', 'Web.html'));
});

// Registrierung
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, passwordConfirm } = req.body;

    if (!username || !password || !passwordConfirm) {
      return res.status(400).json({ message: 'Bitte alle Felder ausfüllen.' });
    }
    if (password !== passwordConfirm) {
      return res.status(400).json({ message: 'Passwörter stimmen nicht überein.' });
    }

    const existiert = await Benutzer.findOne({ username });
    if (existiert) {
      return res.status(409).json({ message: 'Benutzername ist bereits vergeben.' });
    }

    const neuerBenutzer = new Benutzer({ username, password });
    await neuerBenutzer.save();

    res.status(201).json({ message: 'Registrierung erfolgreich.' });
  } catch (err) {
    console.error('Fehler bei Registrierung:', err);
    res.status(500).json({ message: 'Interner Serverfehler.' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Benutzername und Passwort erforderlich.' });
    }

    const benutzer = await Benutzer.findOne({ username });
    if (!benutzer) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
    }

    if (benutzer.password !== password) {
      return res.status(401).json({ message: 'Falsches Passwort.' });
    }

    res.json({
      message: 'Login erfolgreich.',
      kontostand: benutzer.kontostand,
      verlauf: benutzer.verlauf
    });
  } catch (err) {
    console.error('Fehler beim Login:', err);
    res.status(500).json({ message: 'Interner Serverfehler.' });
  }
});

// Kontostand aktualisieren
app.post('/api/updateKonto', async (req, res) => {
  try {
    const { username, betrag, aktion } = req.body;

    if (!username || typeof betrag !== 'number') {
      return res.status(400).json({ message: 'Ungültige Anfrage.' });
    }

    const benutzer = await Benutzer.findOne({ username });
    if (!benutzer) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
    }

    benutzer.kontostand += betrag;
    benutzer.verlauf.push({ aktion, betrag });
    await benutzer.save();

    res.json({
      message: 'Kontostand aktualisiert.',
      neuerKontostand: benutzer.kontostand
    });
  } catch (err) {
    console.error('Fehler bei Kontostand aktualisieren:', err);
    res.status(500).json({ message: 'Interner Serverfehler.' });
  }
});

// Server starten
app.listen(port, () => {
  console.log(`Server läuft unter http://localhost:${port}`);
});
