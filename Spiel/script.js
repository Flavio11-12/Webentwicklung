const bildPfadListe = ["Bilder/schere.jpg", "Bilder/TheRock.jpeg", "Bilder/Papier.jpg"];

const auswahlButtonsContainer = document.getElementById('Auswahl');
const spielErgebnisText = document.getElementById('final');
const einsatzAnzeige = document.getElementById('WettgeldAnzeige');
const kontoAnzeige = document.getElementById('KontoAnzeige');
const LoginForm = document.getElementById('loginForm');
const RegistrierenForm = document.getElementById('RegistrierenForm');
const zufallsBildAnzeige = document.getElementById('image-ergebnis');
const auszahlungsBetragInput = document.getElementById('auszahlung_input');
const benutzerWahlBildAnzeige = document.getElementById('image-wahl');
const verlauf = document.getElementById('Verlauf');

let benutzerWahlIndex = 0;
let zufallsErgebnisIndex = 0;
let bildIndexAnimation = 0;

let verlaufstand = "";
let kontoStand = 0;
let einsatzGesetzt = 0;

zufallsBildAnzeige.innerHTML = `<img src="${bildPfadListe[0]}" width="100">`;
benutzerWahlBildAnzeige.innerHTML = `<img src="${bildPfadListe[0]}" width="100">`;

// Lade gespeicherte Spielstände
const gespeicherteDaten = JSON.parse(localStorage.getItem("spielstand"));
if (gespeicherteDaten) {
    kontoStand = gespeicherteDaten.konto;
    verlaufstand = gespeicherteDaten.verlaufe;
}
aktualisiereAnzeige();
aktualisiereVerlauf();

function speichereSpielstand() {
    const spielstand = {
        konto: kontoStand,
        verlaufe: verlaufstand
    };
    localStorage.setItem("spielstand", JSON.stringify(spielstand));
}


// LOGIN
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('loginName').value;
    const password = document.getElementById('loginPasswort').value;
  
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
  
    const data = await res.json();
  
    if (res.ok) {
      alert(data.message);
      kontoStand = data.kontostand;
      verlaufstand = data.verlauf.map(e => `${e.aktion} ${e.betrag}€<br>`).join('');
      aktualisiereAnzeige();
      aktualisiereVerlauf();
    } else {
      alert('Fehler: ' + data.message);
    }
  });
  
  // REGISTRIERUNG
  document.getElementById('RegistrierenForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('RegistrierenName').value;
    const password = document.getElementById('RegistrierenPasswort1').value;
    const passwordConfirm = document.getElementById('RegistrierenPasswort2').value;
  
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, passwordConfirm })
    });
  
    const data = await res.json();
  
    if (res.ok) {
      alert(data.message);
      // Optional: automatisch zurück zur Login-Ansicht wechseln
      LoginSwitch();
    } else {
      alert('Fehler: ' + data.message);
    }
  });
  
  

function aktualisiereAnzeige() {
    kontoAnzeige.innerHTML = kontoStand + "€";
    einsatzAnzeige.innerHTML = einsatzGesetzt + "€";
}

function aktualisiereVerlauf() {
    verlauf.innerHTML += verlaufstand;
}

function einsatzSetzen(betrag) {
    if (kontoStand < betrag) {
        alert("Nicht genug Guthaben auf dem Konto.");
        return;
    }
    einsatzGesetzt += betrag;
    kontoStand -= betrag;
    aktualisiereAnzeige();
    speichereSpielstand();
}

function kontoAufladen(betrag) {
    kontoStand += betrag;
    aktualisiereAnzeige();
    speichereSpielstand();
}

function Spielverlauf(auswertung, spielstand){
    verlaufstand += auswertung + " " + spielstand +  "<br>";
    verlauf.innerHTML = verlaufstand;
    speichereSpielstand();
}

function benutzerWählt(optionIndex) {
    benutzerWahlIndex = optionIndex;
    benutzerWahlBildAnzeige.innerHTML = `<img src="${bildPfadListe[optionIndex]}" width="100">`;
}

function spielStarten() {
    if (einsatzGesetzt <= 0) {
        alert("Bitte setze einen Einsatz, bevor du spielst.");
        return;
    }

    auswahlButtonsContainer.style.display = "none";
    spielErgebnisText.style.display = "none";

    let animation = setInterval(() => {
        zufallsBildAnzeige.innerHTML = `<img src="${bildPfadListe[bildIndexAnimation]}" width="100">`;
        bildIndexAnimation = (bildIndexAnimation + 1) % bildPfadListe.length;
    }, 100);

    setTimeout(() => {
        clearInterval(animation);
        zufallsErgebnisIndex = Math.floor(Math.random() * bildPfadListe.length);
        zufallsBildAnzeige.innerHTML = `<img src="${bildPfadListe[zufallsErgebnisIndex]}" width="100">`;
        spielAuswerten();
        auswahlButtonsContainer.style.display = "block";
        spielErgebnisText.style.display = "block";
        aktualisiereAnzeige();
        speichereSpielstand();
    }, 2000);
}

function spielAuswerten() {
    // 0 = Schere, 1 = Stein, 2 = Papier
    let gewinn = false;

    if (
        (benutzerWahlIndex === 0 && zufallsErgebnisIndex === 2) || // Schere > Papier
        (benutzerWahlIndex === 1 && zufallsErgebnisIndex === 0) || // Stein > Schere
        (benutzerWahlIndex === 2 && zufallsErgebnisIndex === 1)    // Papier > Stein
    ) {
        gewinn = true;
        spielErgebnisText.innerHTML = "Gewonnen!";
        kontoStand += einsatzGesetzt * 2;
        Spielverlauf(einsatzGesetzt * 2, spielErgebnisText.innerHTML);
    } else if (benutzerWahlIndex === zufallsErgebnisIndex) {
        spielErgebnisText.innerHTML = "Unentschieden!";
        kontoStand += einsatzGesetzt;
        Spielverlauf(einsatzGesetzt, spielErgebnisText.innerHTML);
    } else {
        spielErgebnisText.innerHTML = "Verloren!";
        Spielverlauf(einsatzGesetzt, spielErgebnisText.innerHTML);
    }

    einsatzGesetzt = 0;
}

function spielstandZurücksetzen() {
    localStorage.removeItem("spielstand");
    kontoStand = 0;
    einsatzGesetzt = 0;
    aktualisiereAnzeige();
    alert("Spielstand wurde zurückgesetzt.");
}

function LoginSwitch() {
    const loginForm = document.getElementById("loginForm");
    const regForm = document.getElementById("RegistrierenForm");

    if (loginForm.style.display === "none" || loginForm.style.display === "") {
        loginForm.style.display = "flex";
        regForm.style.display = "none";
    } else {
        loginForm.style.display = "none";
        regForm.style.display = "flex";
    }
}


