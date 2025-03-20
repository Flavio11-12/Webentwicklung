const bilder = ["Bilder/schere.jpg", "Bilder/TheRock.jpeg", "Bilder/Papier.jpg"];
const Auswahlknöpfe = document.getElementById('Auswahl');
const final = document.getElementById('final');
const Währung_anzeige = document.getElementById('Währung');
const Ergebnis_anzeige = document.getElementById('image-ergebnis');
const Wahl = document.getElementById('image-wahl');
let finalIndex;
var Ergebnis;
var ausgesuchtesbild;
var index = 0;
var Währung = 0;
var konto = 0;

function aufladen(i){
    let index = 0;
    Währung += i;
    Währung_anzeige.innerHTML = Währung + "€";
}
function auswahl(i){
    ausgesuchtesbild = i;
    Wahl.innerHTML = `<img src="${bilder[i]}" width="100">`;
}
function slot() {
    if(Währung <= 0){
        alert("Du hast nicht genug Geld");
        return;
    }
    Auswahlknöpfe.style.display = "none";
    final.style.display = "none";
    let interval = setInterval(() => {
        Ergebnis_anzeige.innerHTML = `<img src="${bilder[index]}" width="100">`;
        index = (index + 1) % bilder.length;
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        finalIndex = Math.floor(Math.random() * bilder.length);
        Ergebnis_anzeige.innerHTML = `<img src="${bilder[finalIndex]}" alt="Ergebnis" width="100">`;
        Ergebnis();
        Auswahlknöpfe.style.display = "block";
        final.style.display = "block";
    }, 2000); 
    
}

function Ergebnis(i){
    // 0 = Schere, 1 = Stein, 2 = Papier
    // 0 > 2, 1 > 0, 2 > 1
    if(ausgesuchtesbild == 0 && finalIndex == 2){       // Schere > Papier
        final.innerHTML =  "Gewonnen";
        aufladen(Währung);
    }else if(ausgesuchtesbild == 1 && finalIndex == 0){     // Stein > Schere
        final.innerHTML =  "Gewonnen";
        aufladen(Währung);
    }else if(ausgesuchtesbild == 2 && finalIndex == 1){     // Papier > Stein
        final.innerHTML =  "Gewonnen";
        aufladen(Währung);
    }else if(ausgesuchtesbild == finalIndex){
        final.innerHTML = "Unentschieden";
    }else{
        final.innerHTML ="Verloren";
        aufladen(-Währung);
    }
}
function auszahlung(){
    if(Währung <= 0){
        alert("Du hast nicht genug Geld");
        return;
    }
   
    Währung_anzeige.innerHTML = Währung + "€";
    konto += Währung;
    alert("Du hast " + Währung + "€ ausgezahlt bekommen");
    Währung = 0;
    Währung_anzeige.innerHTML = Währung + "€";
}

function kontoauszahlung(){
    alert("Dein Konto hat " + konto + "€");
}