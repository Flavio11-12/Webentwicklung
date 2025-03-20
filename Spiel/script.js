const button = document.getElementById('button');
const button5 = document.getElementById('button5');
const button10 = document.getElementById('button10');
const button25 = document.getElementById('button25');
const button50 = document.getElementById('button50');
const button100 = document.getElementById('button100');
const Währung_anzeige = document.getElementById('Währung');
const Ergebnis_anzeige = document.getElementById('Ergebnis');
var Ergebnis;
var Währung = 0;
button.addEventListener('click', () => {
});
button5.addEventListener('click', () => {
    Währung += 5;
    Währung_anzeige.innerHTML = Währung + "€";
});
button10.addEventListener('click', () => {
    Währung += 10;
    Währung_anzeige.innerHTML = Währung + "€";
});
button25.addEventListener('click', () => {
    Währung += 25;
    Währung_anzeige.innerHTML = Währung + "€";
});

button.addEventListener('click', () => {
    Ergebnis = Math.floor(Math.random() * 3);
    switch (Ergebnis) {
        case 0:
            Ergebnis_anzeige.innerHTML = '<img src="Bilder/schere.jpg" alt="Ergebnis" width="100">';
            break;
        case 1:
            Ergebnis_anzeige.innerHTML = '<img src="Bilder/TheRock.jpeg" alt="Ergebnis" width="100">';
            break;
        case 2:
            Ergebnis_anzeige.innerHTML = '<img src="Bilder/Papier.jpg" alt="Ergebnis" width="100">';
            break;
    }
});