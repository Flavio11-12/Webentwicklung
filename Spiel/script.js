const button = document.getElementById('button');
const button5 = document.getElementById('button5');
const button10 = document.getElementById('button10');
const button25 = document.getElementById('button25');
const button50 = document.getElementById('button50');
const button100 = document.getElementById('button100');
const Währung_anzeige = document.getElementById('Währung');
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