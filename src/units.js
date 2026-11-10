// nibble – Lernpfad entlang des Lehrplans GP1
// gens: Übungstypen dieser Einheit (in der Reihenfolge des Kurses: nur Stoff, der bis hier behandelt wurde)
// esa: Einsendeaufgaben der Einheit – nur Titel und benötigte Fähigkeiten, keine Lösungen.
var UNITS = [
  { id: "EIP", gens: [], esa: [] },
  { id: "PUP", gens: [], esa: [] },
  { id: "PJA", gens: [], esa: [] },
  { id: "EJP", gens: ["p-doku"], esa: [
    { id: "EJP-E1", title: "MyMath", skills: ["Eine vorhandene Klasse um eine statische Methode erweitern", "javadoc-Kommentare mit @param und @return schreiben", "Dokumentation mit javadoc erzeugen", "Methoden aus einem Hauptprogramm heraus testen"], gens: ["p-doku"] }] },
  { id: "VAR", gens: ["t-expr", "w-linear"], esa: [
    { id: "VAR-E1", title: "Kostenberechnung Blumenkauf", skills: ["Variablen für Mengen und Preise anlegen", "Zahlen per Scanner einlesen", "Zwischenergebnisse speichern und wiederverwenden", "Text und Werte ausgeben"], gens: ["w-linear", "t-expr"] },
    { id: "VAR-E2", title: "Kreis- und Zylinderdaten", skills: ["Konstante mit final anlegen", "Mit double rechnen, Ganzzahldivision vermeiden", "Berechnete Werte wiederverwenden statt neu rechnen"], gens: ["w-linear", "t-expr"] }] },
  { id: "STA", gens: ["w-formel"], esa: [
    { id: "STA-E1", title: "Klasse Dreieck ergänzen", skills: ["Statische Methoden mit Parametern und Rückgabewert", "boolean-Ausdrücke zurückgeben", "Math.sqrt verwenden", "Auf Nachkommastellen runden"], gens: ["w-formel"] },
    { id: "STA-E2", title: "Zinsrechnung", skills: ["Methoden überladen", "Math.pow für Potenzen", "Formeln korrekt in Java übersetzen"], gens: ["w-formel"] },
    { id: "STA-E3", title: "Zeichenanalyse", skills: ["Statische Methoden der Klasse Character (is…/to…)", "void-Methoden mit Ausgabe"], gens: ["w-formel"] }] },
  { id: "OBJ", gens: ["t-date", "t-ref"], esa: [
    { id: "OBJ-E1", title: "Datum", skills: ["Klasse importieren", "Objekte über statische Methoden erhalten (now, of)", "Instanzmethoden aufrufen und Rückgabewerte nutzen"], gens: ["t-date"] },
    { id: "OBJ-E2", title: "Abstand zwischen zwei Zeitangaben", skills: ["Mit Objekten der Standardbibliothek arbeiten", "Dokumentation lesen und Methoden finden"], gens: ["t-date"] },
    { id: "OBJ-E3", title: "Rechteck", skills: ["Objekte einer fremden Klasse erzeugen und verändern", "Referenzen verstehen"], gens: ["t-ref"] }] },
  { id: "KLA", gens: ["w-klasse", "w-objekt", "p-zinsen"], esa: [
    { id: "KLA-E1", title: "Mathematischer Bruch", skills: ["Klasse mit Attributen und zwei Konstruktoren", "Konstruktor ruft Konstruktor mit this(...)", "Methode, die ein neues Objekt zurückgibt", "Kommadivision trotz int-Attributen", "toString überschreiben"], gens: ["w-objekt", "w-klasse"] },
    { id: "KLA-E2", title: "Kunde einer Bank", skills: ["Attribute, Konstruktor, Getter und Setter", "Ungültige Werte im Konstruktor/Setter abfangen", "Objekt-Attribute (z. B. LocalDate)"], gens: ["w-klasse", "p-zinsen"] }] },
  { id: "VER", gens: ["t-switch", "w-if", "w-switch", "p-note", "p-blume", "p-ssp"], esa: [
    { id: "VER-E1", title: "Taschenrechner", skills: ["Statische Methode mit switch über ein char", "Division durch 0 vorher abfangen", "Datentypen aus vorhandenem Code ablesen"], gens: ["w-switch", "w-if"] },
    { id: "VER-E2", title: "Konto (Menü)", skills: ["Menüauswahl mit switch", "Methoden eines Objekts je nach Fall aufrufen"], gens: ["w-switch", "p-note"] },
    { id: "VER-E3", title: "Datum", skills: ["switch mit mehreren Werten pro case", "Verknüpfte Bedingungen mit && und ||"], gens: ["w-switch", "w-if"] },
    { id: "VER-E4", title: "Stein-Schere-Papier", skills: ["Alle Fälle einer Entscheidung systematisch abdecken", "Bedingungen mit || bündeln"], gens: ["p-ssp", "w-if"] }] },
  { id: "ITR", gens: ["t-while", "t-nested", "t-forswitch", "w-summe", "w-zahl", "p-quersumme", "p-dreieck", "p-folge"], esa: [
    { id: "ITR-E1", title: "Würfelspiel", skills: ["Wiederholen, bis ein Ereignis eintritt (do-while)", "Versuche zählen", "Vorgegebene Methoden einer Klasse benutzen"], gens: ["p-folge", "w-zahl"] },
    { id: "ITR-E2", title: "Quadratwurzel ziehen", skills: ["Näherungsverfahren mit while-Schleife", "Abbruchbedingung formulieren"], gens: ["w-zahl", "t-while"] },
    { id: "ITR-E3", title: "Geschenkpapier", skills: ["Muster mit verschachtelten Schleifen", "Mehrfachverzweigung in Schleifen"], gens: ["t-nested", "p-dreieck"] },
    { id: "ITR-E4", title: "Gefüllte Raute", skills: ["Zeilenweise Muster mit abhängigen Schleifengrenzen", "Methode mit Parametern für Zeichen und Größe"], gens: ["p-dreieck", "t-nested"] }] },
  { id: "VRB", gens: ["t-poly", "w-erben", "p-koerper", "p-dispo"], esa: [
    { id: "VRB-E1", title: "Vererbung von Klassen", skills: ["Zweistufige Vererbung", "Abstrakte Methoden implementieren", "Konstruktoren mit super(...)", "toString überschreiben", "Polymorphe Methode mit Parameter vom Typ der Oberklasse"], gens: ["p-koerper", "w-erben"] }] },
  { id: "EXC", gens: ["t-exc", "p-potenz", "p-ausnahme"], esa: [
    { id: "EXC-E1", title: "Ausnahmen für das Programm Bruch", skills: ["Eigene checked Exception schreiben", "throws vs. try-catch entscheiden", "InputMismatchException abfangen und Eingabe wiederholen"], gens: ["p-ausnahme", "t-exc"] },
    { id: "EXC-E2", title: "Ausnahmen für das Konto-Projekt", skills: ["Eigene Exception-Klasse erbt von Exception", "In mehreren Methoden werfen und weiterreichen"], gens: ["p-ausnahme", "p-potenz"] }] },
  { id: "ARR", gens: ["t-array", "w-array", "w-2d", "p-temp", "p-auto", "p-kino", "p-verwaltung"], esa: [
    { id: "ARR-E1", title: "Radiospiel", skills: ["boolean-Array als Merker", "Index aus Zahl berechnen", "Prüfen, ob alle Einträge gesetzt sind"], gens: ["p-kino", "w-array"] },
    { id: "ARR-E2", title: "Girokonten einer Bank", skills: ["Array von Objekten als Attribut", "Freien Platz suchen (null)", "Eigene Exception bei ungültiger Nummer"], gens: ["p-verwaltung", "p-auto"] },
    { id: "ARR-E3", title: "Vier gewinnt", skills: ["Zweidimensionales Array füllen und durchsuchen", "Zeilen/Spalten richtig indizieren"], gens: ["w-2d"] },
    { id: "ARR-E4", title: "Rundreise", skills: ["Tabelle als 2D-Array", "Werte entlang einer Indexfolge aufsummieren"], gens: ["w-2d", "w-array"] }] },
  { id: "ZKT", gens: ["t-string", "w-string", "w-zaehler"], esa: [
    { id: "ZKT-E1", title: "Zeichenkettenanalyse", skills: ["Zeichen mit charAt durchlaufen", "Zähler in einem int-Array führen", "Arrays als Rückgabewert"], gens: ["w-zaehler", "w-string"] },
    { id: "ZKT-E2", title: "Texte kodieren", skills: ["String zeichenweise in ein 2D-Array verteilen", "Spaltenweise wieder auslesen", "StringBuilder"], gens: ["w-2d", "w-string"] },
    { id: "ZKT-E3", title: "Texte ersetzen", skills: ["Zeichen prüfen und ersetzen", "StringBuilder zum Zusammenbauen"], gens: ["w-string"] },
    { id: "ZKT-E4", title: "Datum formatieren", skills: ["LocalDate und plusDays", "DateTimeFormatter mit Locale"], gens: ["t-date"] }] }
];
