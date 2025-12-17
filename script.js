// ───────────── DOMContentLoaded ─────────────
// Wird ausgeführt, sobald die komplette HTML-Seite geladen ist
document.addEventListener("DOMContentLoaded", () => {
    // Eventlistener für den "Hinzufügen"-Button
    document.getElementById('addButton').addEventListener('click', artikelHinzufügen);

    // Eventlistener für alle "Verkauft"-Buttons innerhalb der Tabelle
    document.getElementById("table-body").addEventListener("click", verkauftClick);

    // Tabelle beim Laden der Seite aus localStorage wiederherstellen
    ladeTabelle();
});

// ───────────── Tabelle aus localStorage laden ─────────────
function ladeTabelle() {
    // Produkte aus localStorage auslesen, falls nichts gespeichert, leeres Array
    const daten = JSON.parse(localStorage.getItem("produkte")) || [];
    // sortieren
    daten.sort((a, b) => a.tageBisAblauf - b.tageBisAblauf);
    // Jeden Artikel in die Tabelle einfügen
    daten.forEach(artikel => {
        fuegeZeileHinzu(artikel);
    });
}

// ───────────── Funktion: Zeile in die Tabelle einfügen ─────────────
function fuegeZeileHinzu(artikel) {
    const tbody = document.getElementById("table-body"); // tbody referenzieren
    const zeile = document.createElement("tr");           // neue Zeile erstellen

    //farbliche Kennzeichnung für Tage bis Ablauf
    let farbe;
    if(artikel.tageBisAblauf  <=0){
        farbe= "#620b0b";
    } else if(artikel.tageBisAblauf <=30){
        farbe= "red";
    }else if(artikel.tageBisAblauf <= 60){
        farbe= "yellow";
    } else {
        farbe = "lightgreen"
    }
    // HTML für die Zeile einfügen
    zeile.innerHTML = `
        <td>${artikel.artikelnummer}</td>
        <td>${artikel.mhd}</td>
        <td style="background-color:${farbe}">${artikel.tageBisAblauf}</td>
        <td><button class="verkauft-btn">Verkauft</button></td>
    `;

    // Zeile an das tbody anhängen
    tbody.appendChild(zeile);
}

// ───────────── Funktion: Artikel hinzufügen ─────────────
function artikelHinzufügen() {
    // Werte aus den Input-Feldern auslesen
    const artikelnummer = document.getElementById("artikelnummer").value.trim();
    const mhd = document.getElementById("mhd").value.trim();

    // Prüfen, ob etwas eingegeben wurde
    if (artikelnummer === "" || mhd === "") {
        alert("Bitte Artikelnummer und MHD eingeben");
        return;
    }

    // Berechnung der Tage bis Ablauf
    const heute = new Date();
    const mhdDatum = new Date(mhd);
    const diffZeit = mhdDatum - heute;
    const tageBisAblauf = Math.ceil(diffZeit / (1000 * 60 * 60 * 24));

    // Artikel-Objekt erstellen
    const artikel = { artikelnummer, mhd, tageBisAblauf };

    // Zeile direkt in die Tabelle einfügen
    const tbody = document.getElementById("table-body");
    const zeile = document.createElement("tr");
    zeile.innerHTML = `
        <td>${artikelnummer}</td>
        <td>${mhd}</td>
        <td>${tageBisAblauf}</td>
        <td><button class="verkauft-btn">Verkauft</button></td>
    `;
    tbody.appendChild(zeile);

    // Artikel in localStorage speichern
    const daten = JSON.parse(localStorage.getItem("produkte")) || [];
    daten.push(artikel);
    localStorage.setItem("produkte", JSON.stringify(daten));

    // Input-Felder zurücksetzen
    document.getElementById("artikelnummer").value = "";
    document.getElementById("mhd").value = "";
}

// ───────────── Funktion: Verkauft-Button ─────────────
function verkauftClick(event) {
    // Prüfen, ob der geklickte Button die Klasse "verkauft-btn" hat
    if (!event.target.classList.contains("verkauft-btn")) return;

    // Zeile des geklickten Buttons ermitteln
    const zeile = event.target.closest("tr");

    // Artikelnummer aus der ersten Spalte auslesen
    const artikelnummer = zeile.children[0].textContent;

    // Bestätigungsdialog
    if (confirm("Produkt wirklich als verkauft entfernen?")) {
        // Zeile aus Tabelle entfernen
        zeile.remove();

        // Artikel auch aus localStorage löschen
        let daten = JSON.parse(localStorage.getItem("produkte")) || [];
        daten = daten.filter(a => a.artikelnummer !== artikelnummer);
        localStorage.setItem("produkte", JSON.stringify(daten));
    }
}