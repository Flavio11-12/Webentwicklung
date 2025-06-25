const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
app.use(express.json());
const port = 3000;


// MongoDB verbinden
mongoose.connect('mongodb://localhost:27017/spielDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB verbunden'))
  .catch(err => console.error('MongoDB Fehler:', err));

  const BenutzerSchema = new mongoose.Schema({
    username: String,
    password: String,
    konto: Number,
    spielverlauf: [{
      betrag: Number,
      aktion: String
    }]
  });

const Benutzer = mongoose.model('Benutzer', BenutzerSchema);

// *** LOGIN-Route ***
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ message: 'Felder fehlen' });

  const benutzer = await Benutzer.findOne({ username });

  if (!benutzer) return res.status(404).json({ message: 'Benutzer nicht gefunden' });

  if (benutzer.password === password) {
    res.json({
      message: 'Login erfolgreich',
      konto: benutzer.konto,  // Hier heißt das Feld "konto"
      verlauf: benutzer.spielverlauf
    });
  } else {
    res.status(401).json({ message: 'Falsches Passwort' });
  }
});


// *** REGISTRIER-Route ***
app.post('/api/register', async (req, res) => {
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
});

//Kontostand aktualisieren
app.put('/api/user/update', async (req, res) => {
  const { username, konto, verlauf } = req.body;

  if (!username) return res.status(400).json({ message: 'Username fehlt' });

  try {
    const benutzer = await Benutzer.findOne({ username });
    if (!benutzer) return res.status(404).json({ message: 'Benutzer nicht gefunden' });

    benutzer.konto = konto;
    benutzer.spielverlauf = verlauf;
    await benutzer.save();

    res.json({ message: 'Konto und Verlauf aktualisiert' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Serverfehler' });
  }
});




// Statische Dateien (HTML, CSS, JS) bereitstellen
app.use(express.static(path.join(__dirname, 'Spiel')));

// index.html explizit zurückgeben
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Spiel', 'Web.html'));
});

// Server starten
app.listen(port, () => {
  console.log(`Server läuft unter http://localhost:${port}`);
});
