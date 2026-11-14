// nibble – Lesetexte, Stolperfallen und Lückencode, Teil 1 (EIP, PUP)
// Eigene Ausarbeitung entlang der Lerneinheiten; keine Originaltexte.
// read: Absätze (Markdown light) oder {code}  ·  pit: Stolperfallen  ·  fill: Lückentext/-code
var READ = READ || {};

// ====================== EIP – Einführung in die Programmierung ======================
READ["EIP-0"] = {
  read: [
    "Ein **Computer** ist eine elektronische, programmgesteuerte Maschine zur Verarbeitung von **Daten**. „Computer“ und „Rechner“ meinen dasselbe – das englische *compute* heißt berechnen. Früher sprach man von *EDVA* (elektronische Datenverarbeitungsanlage), heute eher von Computer oder Computersystem.",
    "Daten sind dabei Informationen in einer Form, die eine Maschine verarbeiten kann. Wichtig für das ganze Studium: Daten und Programme bilden immer nur ein **Modell** der Wirklichkeit ab. Ein Kundendatensatz ist nicht der Kunde, sondern eine Auswahl von Eigenschaften, die für die Aufgabe wichtig sind.",
    "**Wo Computer überlegen sind:** Sie führen Millionen Arbeitsschritte pro Sekunde aus (*Geschwindigkeit*), wiederholen sie fehlerfrei (*Zuverlässigkeit*) und können riesige Datenmengen speichern und schnell darauf zugreifen (*Speichervolumen*). Nach dem sogenannten Moore'schen Gesetz verdoppelt sich die Transistorzahl – und damit grob die Leistung – etwa alle 18 Monate.",
    "Die Fehler, die uns im Alltag nerven, sind fast nie Rechenfehler der Maschine. Es sind **Programmierfehler** (falsch formulierte Anweisungen) oder **Eingabefehler**. Der Computer tut genau das, was im Programm steht – auch wenn es falsch ist.",
    "**Wo es Grenzen gibt:** Manche Probleme lassen sich wegen riesiger Datenmengen oder Rechenzeiten nicht kostengünstig lösen. Bei sehr komplexen Systemen wie dem Wetter sind exakte Vorhersagen nicht möglich. Und es gibt rechtliche und ethische Grenzen: Internetkriminalität, Datenschutz, Urheberrecht – und Entscheidungen, die moralische Urteile verlangen, gehören nicht an eine Maschine."
  ],
  pit: ["„Der Computer hat sich verrechnet“ stimmt fast nie – meist steckt ein Programmier- oder Eingabefehler dahinter.", "Daten sind ein Modell, nicht die Wirklichkeit selbst."],
  fill: { kind: "text", t: "Ergänze die Begriffe.", text: "Ein Computer ist eine elektronische, [[0]] Maschine zur Verarbeitung von [[1]]. Die meisten Fehler im Alltag sind keine Rechenfehler, sondern Programmierfehler oder [[2]].",
    gaps: [["programmgesteuerte", "programmierbare"], ["Daten"], ["Eingabefehler", "Fehler bei der Eingabe"]] }
};
READ["EIP-1"] = {
  read: [
    "Egal ob Smartphone, Laptop oder Server – jeder Computer besitzt mindestens ein **Eingabegerät**, eine **Verarbeitungseinheit**, die die Daten nach einer Lösungsvorschrift bearbeitet, und mindestens ein **Ausgabegerät**. Diese Grundstruktur heißt **EVA-Prinzip**: Eingabe → Verarbeitung → Ausgabe. Ein- und Ausgabegeräte sind die Schnittstelle zwischen Mensch und Maschine.",
    "Auch viele Programme folgen diesem Muster: Eine Suchmaschine liest Suchwörter ein (E), verarbeitet sie (V) und gibt eine Trefferliste aus (A). Deine ersten Java-Programme werden genauso aufgebaut sein: Werte einlesen, rechnen, Ergebnis ausgeben.",
    "**Von-Neumann-Architektur:** John von Neumann ordnete die Bestandteile eines Computers nach genau diesen Aufgaben. Die **Zentraleinheit** besteht aus **Prozessor** (CPU) und **Arbeitsspeicher**. Über eine **Ein-/Ausgabesteuerung** (Controller) sind die Geräte angebunden. Alles außer Prozessor, Arbeitsspeicher und E/A-Steuerung heißt **Peripherie** – auch wenn es im Gehäuse steckt, wie die Festplatte.",
    "Entscheidend: **Programm und Daten** müssen zur Ausführung im **Arbeitsspeicher** (RAM) liegen. Der ist schnell, aber **flüchtig** – beim Ausschalten ist sein Inhalt weg. Dauerhaft gespeichert wird auf Medien wie Festplatte (HDD), SSD oder USB-Stick.",
    "Auf Speicher wird **gelesen** (eine Kopie wird übernommen, das Original bleibt), **geschrieben** (ggf. wird Vorhandenes überschrieben) oder **gelöscht**. Normales Löschen entfernt meist nur den Verweis im Dateisystem – die Daten selbst sind erst nach „sicherem“ Löschen wirklich weg. Für IT-Sicherheit ein wichtiger Punkt!"
  ],
  pit: ["Peripherie hängt nicht davon ab, ob ein Gerät innen oder außen sitzt – die Festplatte ist Peripherie.", "Der Arbeitsspeicher ist flüchtig, Festplatte/SSD nicht."],
  fill: { kind: "text", t: "Ergänze die Begriffe.", text: "Das [[0]]-Prinzip beschreibt Eingabe, Verarbeitung und Ausgabe. Prozessor und [[1]] bilden die Zentraleinheit. Alle übrigen Geräte heißen [[2]]. Der Arbeitsspeicher ist [[3]]: Beim Ausschalten geht sein Inhalt verloren.",
    gaps: [["EVA"], ["Arbeitsspeicher", "RAM", "Hauptspeicher"], ["Peripherie", "Peripheriegeräte"], ["flüchtig"]] }
};
READ["EIP-2"] = {
  read: [
    "Hardware allein ist kein funktionierender Computer. Damit beim Druck auf die Taste A auch ein A erscheint, braucht es Programme. **Software** umfasst die verschiedenen Computerprogramme **samt ihrer Daten und Dokumentation**. Ein **Programm** ist eine Folge präziser Anweisungen, die ein Computer ausführen kann.",
    "Hardware und Software bilden eine Einheit: Zwei baugleiche Smartphones können ganz unterschiedliche Software haben und damit ganz unterschiedlich nutzbar sein. Deshalb versteht man unter einem Computer(system) die **Einheit von Hardware und Software**.",
    "Im **Schalenmodell** liegt die Hardware innen. Darum liegt die **Systemsoftware**, die eng mit der Hardware zusammenarbeitet: vor allem das **Betriebssystem**, aber auch Treiber sowie Compiler und Interpreter. Außen liegt die **Anwendersoftware** – alles, was für konkrete Anwendungsfälle geschrieben wurde, von der Textverarbeitung bis zum SIEM im SOC.",
    "Es gibt zwei Rollen: **Anwender** benutzen Programme. **Programmentwickler** entwerfen und implementieren Programme nach den Vorgaben der Anwender. Beim Testen wechseln Entwickler bewusst die Perspektive und betrachten ihr Programm mit den Augen der Anwender."
  ],
  pit: ["Dokumentation gehört laut Definition zur Software dazu.", "Compiler und Interpreter zählen zur Systemsoftware, weil sie hardwareabhängig sind."],
  fill: { kind: "text", t: "Ergänze die Begriffe.", text: "Software umfasst Programme, die zugehörigen Daten und die [[0]]. Das Betriebssystem gehört zur [[1]]. Ein Programm für einen konkreten Anwendungsfall ist [[2]].",
    gaps: [["Dokumentation", "Dokumentationen"], ["Systemsoftware"], ["Anwendersoftware", "Anwendungssoftware"]] }
};
READ["EIP-3"] = {
  read: [
    "Menschen verstehen auch ungenaue Anweisungen: „Schließ bitte das Fenster!“ funktioniert, obwohl eigentlich mehrere Schritte nötig sind (hingehen, Griff fassen, Fenster schließen, Griff drehen). Ein Computer ergänzt nichts – er braucht **präzise und vollständige** Anweisungen und tut genau das, was dasteht.",
    "Ein **Algorithmus** ist eine Folge von Anweisungen, die eine **formale, endliche, eindeutige und wiederholbare** Vorschrift zur Lösung einer Menge **gleichartiger** Aufgaben darstellt. Die einzelnen Anweisungen heißen **Arbeitsschritte**. Bekannte Beispiele: der euklidische Algorithmus für den größten gemeinsamen Teiler, Sortierverfahren, Dijkstra für kürzeste Wege im Navi.",
    "Einen umgangssprachlich beschriebenen Algorithmus versteht der Computer nicht. Erst wenn er in einer Programmiersprache aufgeschrieben ist, entsteht **Programmcode** (Quellcode, *source code*). Das Schreiben des Programms heißt **Implementierung**. Danach wird übersetzt, damit der Prozessor ihn ausführen kann.",
    "Für komplexe Aufgaben gibt es die **Methode der schrittweisen Verfeinerung**: Die Aufgabe wird in Teilaufgaben zerlegt, diese wieder in kleinere – bis jeder Schritt eindeutig ist. Dabei achtet man auf Abhängigkeiten (was muss vorher fertig sein?) und erkennt wiederkehrende Schritte. Beim Kaffeekochen ist egal, ob zuerst Wasser oder Pulver eingefüllt wird – beides muss aber vor dem Einschalten passiert sein.",
    { code: "Kaffee kochen\n  1. Wasser eingießen\n     1.1 Kanne nehmen\n     1.2 Kanne bis zur Markierung füllen\n     1.3 Wasser in den Tank gießen\n  2. Kaffeepulver eingeben\n     2.1 Filter einsetzen\n     2.2 Pulver einfüllen\n  3. Kaffeemaschine starten   (erst nach 1 und 2!)" },
    "Genau so wirst du später programmieren: erst grob überlegen (welche Methoden brauche ich?), dann jede Methode Schritt für Schritt ausformulieren."
  ],
  pit: ["„Endlich“ heißt: Der Algorithmus muss nach endlich vielen Schritten fertig sein (keine Endlosschleife).", "Ein Algorithmus löst eine ganze Klasse gleichartiger Aufgaben, nicht nur einen Einzelfall."],
  fill: { kind: "text", t: "Ergänze die vier Eigenschaften und den Fachbegriff.", text: "Ein Algorithmus ist eine formale, [[0]], [[1]] und wiederholbare Vorschrift. Das Erstellen eines Programms in einer Programmiersprache nennt man [[2]].",
    gaps: [["endliche"], ["eindeutige"], ["Implementierung", "Implementieren"]] }
};

// ====================== PUP – Programmiersprachen und Programmierung ======================
READ["PUP-0"] = {
  read: [
    "Die Hardware eines Computers ist vereinfacht ein riesiges System von Schaltern. Ein Schalter kennt zwei Zustände: geschlossen (Strom fließt, **1**) und offen (kein Strom, **0**). Die kleinste Dateneinheit – ein einzelnes Symbol 0 oder 1 – heißt **Bit** (*binary digit*). 8 Bit sind ein **Byte**, damit lassen sich 2⁸ = 256 verschiedene Werte darstellen.",
    "**Maschinensprache** ist die Sprache, die ein Prozessor direkt ausführen kann. Jeder Prozessortyp hat seine eigene. Ein Programm in Maschinensprache heißt **Maschinencode** – für Menschen kaum lesbar. Heute schreibt fast niemand mehr direkt Maschinencode, er wird von Übersetzern erzeugt.",
    "Damit Computer Texte austauschen können, braucht es eine **Zeichenkodierung**: eine Tabelle, die jedem Zeichen eine Zahl zuordnet. **ASCII** (1963) war ursprünglich ein 7-Bit-Code mit 128 Zeichen, später auf 8 Bit erweitert. Ziffern und Buchstaben sind aufsteigend kodiert (`'0' < '9'`, `'A' < 'Z'`, `'a' < 'z'`), Großbuchstaben liegen aber vor den Kleinbuchstaben – ein Vergleich ohne Rücksicht auf Groß-/Kleinschreibung klappt also nicht direkt.",
    "**Unicode** hat das Ziel, alle Zeichen aller Schriftkulturen zu kodieren. Jedes Zeichen bekommt eine weltweit eindeutige Nummer. Häufige Zeichen werden mit 2 Byte (16 Bit), seltenere mit 4 Byte kodiert. Die Zeichen sind in benannte **Blöcke** gruppiert – die Nummern 0 bis 127 bilden den Block *Basic Latin*, der mit ASCII übereinstimmt. Java verwendet Unicode für `char` und `String`.",
    "Das erklärt später ein Verhalten, das in Klausuren gern abgefragt wird: Ein `char` ist intern eine Zahl. `'A' + 1` ergibt deshalb 66, und `(char) ('A' + 1)` ist `'B'`."
  ],
  pit: ["Bit ≠ Byte: 1 Byte = 8 Bit.", "ASCII-Vergleich: 'Z' < 'a' – Großbuchstaben kommen zuerst."],
  fill: { kind: "text", t: "Ergänze.", text: "Die kleinste Dateneinheit heißt [[0]]. Ein Byte besteht aus [[1]] Bit und kann [[2]] verschiedene Werte darstellen. Java kodiert Zeichen mit [[3]].",
    gaps: [["Bit"], ["8", "acht"], ["256"], ["Unicode"]] }
};
READ["PUP-1"] = {
  read: [
    "„Mein Computer versteht mich nicht!“ – das Grundproblem: Menschliche Sprache ist voller Ungenauigkeiten und Mehrdeutigkeiten, die ein Prozessor nicht auflösen kann. **Programmiersprachen** sind das Bindeglied: für Menschen verständlich, für den Computer eindeutig. Dafür haben sie starre Regeln.",
    "Eine Programmiersprache ist eine **formale Sprache** zur Formulierung von Computerprogrammen. Wie natürliche Sprachen hat sie eine Grammatik, aber im Unterschied dazu ist diese präzise festgelegt.",
    "Die **Syntax** legt fest, aus welchen Zeichen und nach welchen Regeln Wörter und „Sätze“ (Anweisungen) gebildet werden. Verletzt man sie – fehlendes Semikolon, falsch geschriebenes Schlüsselwort, offene Klammer –, ist das ein **Syntaxfehler**: Der Compiler kann das Programm gar nicht übersetzen.",
    "Die **Semantik** beschreibt die Bedeutung syntaktisch korrekter Konstrukte – also was das Programm tatsächlich tut. Ein Programm kann syntaktisch einwandfrei sein und trotzdem Unsinn berechnen oder zur Laufzeit abstürzen.",
    { code: "int x = 10 / 0;   // Syntax ok – zur Laufzeit: ArithmeticException\nint y = 10 /;     // Syntaxfehler – wird gar nicht erst übersetzt\nint z = 7 / 2;    // Syntax ok, Ergebnis 3 – gewollt? Das ist eine Frage der Semantik" }
  ],
  pit: ["Syntaxfehler findet der Compiler, semantische Fehler nicht.", "„Kompiliert“ heißt nicht „funktioniert“."],
  fill: { kind: "text", t: "Ergänze.", text: "Die [[0]] regelt den formalen Aufbau eines Programms, die [[1]] seine Bedeutung. Ein fehlendes Semikolon ist ein [[2]].",
    gaps: [["Syntax"], ["Semantik"], ["Syntaxfehler"]] }
};
READ["PUP-2"] = {
  read: [
    "Die ersten Computer wurden direkt in Maschinensprache programmiert, Bit für Bit über Schalterleisten. Ein vertipptes Bit fiel erst beim Ausführen auf. Darum entstanden **höhere, problemorientierte Programmiersprachen**: an die menschliche Denkweise angepasst und unabhängig vom Prozessor.",
    "Man unterscheidet drei Konzepte (**Programmier-Paradigmen**):",
    "**Imperativ** (lat. *imperare*, befehlen): Das Programm besteht aus Anweisungen und Daten, die diese Anweisungen verändern – nah am Algorithmus. Anweisungsfolgen fasst man zu Unterprogrammen (Prozeduren) zusammen, daher auch *prozedural*. Beispiele: C, Pascal, FORTRAN.",
    "**Objektorientiert:** Daten und die Anweisungen, die sie verändern, bilden eine Einheit – das **Objekt** mit Zustand und Verhalten. Objekte kommunizieren über **Botschaften** (Methodenaufrufe). Ziele: Wiederverwendbarkeit, Beherrschbarkeit komplexer Programme, Erweiterbarkeit und Schutz vor Datenmanipulation. Beispiele: Java, C++, Smalltalk.",
    "**Deklarativ** (lat. *declarare*, erklären): Beschrieben wird das *Problem*, nicht der Lösungsweg. **Funktionale** Sprachen bilden Eingaben über Funktionen auf Ausgaben ab (z. B. LISP), **logische** Sprachen werten Aussagen nach Regeln der Prädikatenlogik aus (z. B. PROLOG). Einsatz z. B. in der KI und bei wissensbasierten Systemen.",
    "Viele moderne Sprachen sind **Hybridsprachen** und kombinieren Paradigmen – Scala etwa ist funktional und objektorientiert."
  ],
  pit: ["Prozedural = imperativ (synonym).", "Deklarativ beschreibt WAS, imperativ WIE."],
  fill: { kind: "text", t: "Ordne zu.", text: "Java ist eine [[0]] Sprache. PROLOG ist eine [[1]] Sprache. Bei [[2]] Sprachen wird nur das Problem beschrieben, nicht der Lösungsweg.",
    gaps: [["objektorientierte"], ["logische", "deklarative"], ["deklarativen"]] }
};
READ["PUP-3"] = {
  read: [
    "Ein Prozessor kann nur Maschinencode ausführen. Programme in einer höheren Sprache liegen als **Quellcode** vor und müssen übersetzt werden – so, dass der Maschinencode genau das tut, was der Quellcode verlangt (semantisch gleichwertig). Weil Übersetzer prozessorabhängig sind, gehören sie zur Systemsoftware.",
    "Ein **Compiler** übersetzt den **gesamten** Quellcode vorab in Objektcode. Programmteile aus **Bibliotheken** sind darin nur als Verweis enthalten. Der **Linker** (Binder) fügt sie ein und erzeugt ein ausführbares Programm (unter Windows meist `.exe`).",
    "Ein **Interpreter** liest **eine Anweisung**, analysiert sie, übersetzt sie und führt sie **sofort** aus – dann die nächste. Er erzeugt kein ausführbares Programm; bei jedem Start wird neu übersetzt.",
    "**Vergleich:** Kompilierte Programme laufen schneller, sind aber an Prozessor und Betriebssystem gebunden. Interpretierte Programme sind langsamer, laufen aber überall, wo der Interpreter vorhanden ist, und erlauben das Testen von Programmteilen während der Entwicklung.",
    "**Bibliotheken** sind Dateien mit wiederverwendbaren Programmbausteinen. Heute werden sie meist dynamisch zur Laufzeit eingebunden. In Java sind sie in **Modulen** und **Packages** organisiert.",
    "**Java nutzt eine Mischform:** `javac` kompiliert den Quellcode in plattformunabhängigen **Bytecode** (`.class`). Die **JVM** (Java Virtual Machine) führt diesen Bytecode auf der jeweiligen Plattform aus. So verbindet Java die Vorteile beider Ansätze."
  ],
  pit: ["Der Interpreter erzeugt keine ausführbare Datei.", "Java ist weder rein kompiliert noch rein interpretiert."],
  fill: { kind: "text", t: "Ergänze.", text: "Ein [[0]] übersetzt das gesamte Programm vorab, ein [[1]] jede Anweisung einzeln zur Laufzeit. Der [[2]] bindet Bibliotheksteile in den Objektcode ein. Java übersetzt in [[3]], der von der JVM ausgeführt wird.",
    gaps: [["Compiler"], ["Interpreter"], ["Linker", "Binder"], ["Bytecode"]] }
};
READ["PUP-4"] = {
  read: [
    "**Software-Engineering** beschäftigt sich mit Methoden und Werkzeugen zur systematischen Softwareerstellung, mit dem Ziel guter Qualität. Ausgangspunkt ist immer ein Problem: eine Produktidee, ein Kundenauftrag – oder im Studium die Aufgabenstellung einer Übung.",
    "**Analyse:** Die Anforderungen werden genau festgelegt (Anforderungsdefinition) und mit dem Kunden abgestimmt. Ergebnis ist das **Pflichtenheft**, oft die Vertragsgrundlage. Im Studium ist die Kursbetreuung dein Kunde und die Aufgabenstellung dein Pflichtenheft.",
    "**Entwurf:** Vom Grobentwurf (welche Teile gibt es, wie hängen sie zusammen?) zum Feinentwurf (wie genau arbeitet jeder Teil?).",
    "**Implementierung:** Der Entwurf wird in einer Programmiersprache umgesetzt.",
    "**Test:** Das Programm wird gegen die Anforderungen geprüft – auch aus Sicht der Anwender. Fehler führen zurück in frühere Phasen.",
    "Für Einsendeaufgaben und die Klausur heißt das ganz praktisch: Aufgabe genau lesen (Analyse), Methoden und Klassen skizzieren (Entwurf), dann erst schreiben (Implementierung) und mit Grenzwerten prüfen (Test)."
  ],
  pit: ["Das Pflichtenheft entsteht in der Analyse, nicht im Entwurf.", "Wer sofort losprogrammiert, überspringt Analyse und Entwurf – und schreibt oft am Problem vorbei."],
  fill: { kind: "text", t: "Ergänze die Phasen in der richtigen Reihenfolge.", text: "1. [[0]] → 2. [[1]] → 3. Implementierung → 4. [[2]]",
    gaps: [["Analyse"], ["Entwurf"], ["Test", "Testen"]] }
};

// ====================== PJA – Die Programmiersprache Java ======================
READ["PJA-0"] = {
  read: [
    "Java ist so verbreitet, weil es vielseitig ist: Desktop-Anwendungen (Standard Edition), Server (Enterprise Edition), Android-Apps und unzählige Frameworks. Entworfen wurde Java für das Internet – nach dem Motto „Das Netz ist der Computer“: Programme sollen auf verschiedensten, vernetzten Rechnern laufen.",
    "Compiler und virtuelle Maschine gibt es kostenlos. Seit Java 11 (2018) verlangt Oracle für kommerziellen Support Lizenzen; freie Versionen gibt es z. B. von **Adoptium (Eclipse Temurin)** und als **OpenJDK**. Im Kurs wird **Temurin 17** verwendet, eine LTS-Version (Langzeit-Support).",
    "Die Entwickler beschrieben Java als *einfach, objektorientiert, verteilt, interpretiert, robust, sicher, plattformunabhängig, portabel, leistungsfähig, nebenläufig und dynamisch*. Die wichtigsten Punkte:",
    "**Einfach:** wenige Sprachkonstrukte, Syntax angelehnt an C++, aber ohne fehleranfällige Konzepte wie Zeigerarithmetik. Die **Garbage Collection** gibt nicht mehr benötigten Speicher automatisch frei. Dazu kommen große, ausgetestete **Bibliotheken**.",
    "**Plattformunabhängig:** Der Compiler erzeugt **Bytecode**, kein Maschinencode. Die **JVM** – ein Bytecode-Interpreter für das jeweilige Betriebssystem – übersetzt ihn zur Laufzeit in Maschinencode. Bytecode läuft also überall, wo eine JVM installiert ist.",
    "**Robust und sicher:** Robustheit heißt, dass ein Programm aus Ausnahmesituationen in einen definierten Zustand zurückkehren kann. Dafür gibt es das **Exception-Handling**. Die **strenge Typisierung** verhindert Fehler durch unverträgliche Datentypen schon beim Kompilieren, die Garbage Collection Speicherfehler.",
    "**Nebenläufig:** Mehrere Aufgaben gleichzeitig, z. B. Musik hören, während eine Datei lädt. Ein **Thread** ist eine sequentielle Arbeitsfolge innerhalb eines Prozesses.",
    "**Leistungsfähig:** Interpretierter Code ist langsamer als kompilierter. **Just-in-Time-Compiler** merken sich bereits übersetzten Bytecode, **HotSpot**-Compiler optimieren besonders häufig genutzte Stellen. Für die meisten Anwendungen ist Java damit schnell genug."
  ],
  pit: ["Die JVM ist ein Interpreter – javac ist der Compiler.", "Plattformunabhängig ist der Bytecode, nicht die JVM (die gibt es je Betriebssystem)."],
  fill: { kind: "text", t: "Ergänze.", text: "Der Java-Compiler erzeugt [[0]]. Die [[1]] führt ihn auf dem jeweiligen Betriebssystem aus. Nicht mehr benötigter Speicher wird von der [[2]] freigegeben. Ein [[3]]-Compiler beschleunigt die Ausführung, indem er übersetzten Code wiederverwendet.",
    gaps: [["Bytecode"], ["JVM", "Java Virtual Machine", "virtuelle Maschine", "Java Virtuelle Maschine"], ["Garbage Collection", "Garbage Collector"], ["Just-in-Time", "JIT", "Just in Time"]] }
};
READ["PJA-1"] = {
  read: [
    "„Everything is an Object!“ – in Java steht das Objekt im Mittelpunkt. Ein typisches Programm erzeugt viele Objekte, die miteinander kommunizieren. Vereinfacht heißt Java-Programmierung: **Klassen definieren, Objekte erzeugen, Methoden aufrufen.**",
    "Objektorientierung modelliert die reale Welt: Gegenstände (Computer, Uhr), Lebewesen, künstliche Objekte (ein Browserfenster). Objekte bestehen oft wieder aus Objekten – ein Computer aus Tastatur, Bildschirm und Gehäuse mit Motherboard. Wie bei jedem Modell bildet man nur die Merkmale ab, die für die Aufgabe zählen: Beim Fahrrad sind Geschwindigkeit und Fahrtrichtung wichtiger als die Farbe.",
    "Ein Objekt wird beschrieben durch **Namen** (*identifier*, Identität), **Zustand** (*state*, die Werte seiner **Attribute**) und **Verhalten** (*behavior*, seine **Methoden**). Das Verhalten kann vom Zustand abhängen.",
    "Eine **Klasse** beschreibt Objekte mit denselben Eigenschaften und demselben Verhalten. Sie ist gekennzeichnet durch **Name, Attribute, Konstruktoren, Methoden** und **Beziehungen** zu anderen Klassen. In Java beginnt sie mit dem Schlüsselwort `class`.",
    "Anders als in der Realität kommt zuerst die Klasse, dann das Objekt: Die Klasse ist der **Bauplan** bzw. die **Objekt-Fabrik**. Ein Uhrmacher programmiert eine Klasse `Uhr` und erzeugt daraus beliebig viele Uhren. Erzeugt wird mit dem **new-Operator** und einem **Konstruktor** – das nennt man auch instanziieren; die Objekte heißen dann Instanzen.",
    { code: "Uhr meineUhr = new Uhr();     // Objekt erzeugen (instanziieren)\nmeineUhr.stelleZeit(12, 30);  // Botschaft = Methodenaufruf\nmeineUhr.zeigeZeit();" },
    "Es geht auch ohne eigene Objekte: **statische Methoden** (Klassenmethoden) ruft man direkt über den Klassennamen auf, z. B. `Math.max(3, 8)`. Und Rechnen mit primitiven Datentypen wie `int` erzeugt keine Objekte."
  ],
  pit: ["Klasse = Bauplan, Objekt = konkretes Exemplar.", "Erst die Klasse schreiben, dann Objekte mit new erzeugen."],
  fill: { kind: "text", t: "Ergänze.", text: "Ein Objekt hat eine Identität, einen [[0]] (die Werte seiner Attribute) und ein [[1]] (seine Methoden). Objekte werden mit dem Operator [[2]] und einem [[3]] erzeugt.",
    gaps: [["Zustand"], ["Verhalten"], ["new"], ["Konstruktor"]] }
};
READ["PJA-2"] = {
  read: [
    "**Datenkapselung (encapsulation):** Die Werte der Attribute eines Objekts sollen **nur über Methoden** verändert werden. `meineUhr.stelleZeit(12, 30)` setzt Stunden und Minuten – direkt von außen herankommen soll niemand. Das verhindert unbeabsichtigte Datenänderungen, einen häufigen und schwer zu findenden Fehler in imperativen Programmen. Die Daten sind in den Methoden „eingekapselt“.",
    "**Vererbung:** Alle Fahrräder haben eine Geschwindigkeit und eine Fahrtrichtung. Ein Rennrad hat zusätzlich eine Gangschaltung (Attribut *aktueller Gang*, Methode *schalten*), ein Hollandrad einen Gepäckträger. Die Klasse `Rennrad` **erweitert** die Klasse `Fahrrad`: Sie besitzt alles von `Fahrrad` und ergänzt Eigenes. Bestehende Klassen lassen sich so wiederverwenden.",
    "**Polymorphie (Vielgestaltigkeit):** Die Methode `bremsen` funktioniert beim Rennrad anders (Felgenbremse) als beim Hollandrad (Rücktritt). Eine Unterklasse kann geerbte Methoden deshalb neu implementieren – **überschreiben**. So gibt es gleichnamige Methoden in verschiedenen Objekten, die unterschiedlich arbeiten. Welche Variante läuft, entscheidet das Objekt, auf dem sie aufgerufen wird.",
    { code: "Fahrrad r = new Rennrad();\nFahrrad h = new Hollandrad();\nr.bremsen();   // Bremshebel ziehen\nh.bremsen();   // Rücktritt treten" },
    "Diese drei Prinzipien – Kapselung, Vererbung, Polymorphie – tauchen in KLA und VRB ausführlich und mit Code wieder auf. Hier geht es erst um die Idee."
  ],
  pit: ["Überschreiben (gleiche Signatur in der Unterklasse) ≠ Überladen (gleicher Name, andere Parameter).", "Kapselung schützt den Zustand – zentral auch für sichere Software."],
  fill: { kind: "text", t: "Ordne die Begriffe zu.", text: "Attribute nur über Methoden ändern: [[0]]. Eine Unterklasse übernimmt Attribute und Methoden: [[1]]. Gleichnamige Methoden verhalten sich je nach Objekt verschieden: [[2]].",
    gaps: [["Datenkapselung", "Kapselung"], ["Vererbung"], ["Polymorphie"]] }
};
READ["PJA-3"] = {
  read: [
    "Für Java braucht man zwei Programme: den **Übersetzer** (Quellcode → Bytecode) und den **Interpreter** zum Ausführen. Programmieren besteht aber aus mehr: entwerfen, editieren, implementieren, übersetzen, ausführen, dokumentieren – und viel Fehlersuche. Dafür gibt es Werkzeuge.",
    "Das **JDK** (Java Development Kit, früher auch SDK genannt) enthält den Compiler `javac`, den Bytecode-Interpreter `java`, das Dokumentationswerkzeug `javadoc`, das Archivwerkzeug `jar` und eine große Menge an Bibliotheken.",
    "Eine **IDE** (*integrated development environment*) fasst hilfreiche Werkzeuge unter einer Oberfläche zusammen: Projekt- und Klassenübersicht, Editor mit Syntax-Highlighting, Debugger mit verständlichen Fehlermeldungen, Zugriff auf die Dokumentation. Viele sind kostenlos. Einarbeitungszeit braucht man trotzdem.",
    "Für den **Entwurf** großer Programme gibt es Modellierungswerkzeuge. Standard für objektorientierte Konzepte ist die **UML** (*Unified Modeling Language*) – im Kurs werden UML-Diagramme zum Entwurf verwendet, die Sprache selbst wird aber nicht vertieft. Werkzeuge, die die Softwareerstellung unterstützen, heißen **CASE-Tools**.",
    "Tipp für die Klausur: Auf Papier hast du keine IDE. Übe deshalb regelmäßig ohne Autovervollständigung – genau dafür gibt es in dieser App den Papier-Modus."
  ],
  pit: ["javac = Compiler, java = Interpreter/Starter, javadoc = Doku, jar = Archiv.", "Eine IDE ist bequem, ersetzt aber nicht das Verständnis von javac/java."],
  fill: { kind: "text", t: "Ordne die Werkzeuge zu.", text: "Quellcode übersetzen: [[0]]. Programm starten: [[1]]. HTML-Dokumentation erzeugen: [[2]]. Dateien zu einem Archiv bündeln: [[3]].",
    gaps: [["javac"], ["java"], ["javadoc"], ["jar"]] }
};

// ====================== EJP – Das erste Java-Programm ======================
READ["EJP-0"] = {
  read: [
    "Im Kurs wird das **OpenJDK Eclipse Temurin 17** verwendet (LTS-Version). Neuere Versionen wie 21 funktionieren auch, sprich das aber mit der Kursbetreuung ab. Nach der Installation liegen im Ordner `bin` die Werkzeuge (`javac`, `java`, `javadoc`, `jar`), in `lib` die Bibliotheken.",
    "Jede Java-Applikation hat einen festen Aufbau. Von oben nach unten:",
    "1. **Import-Anweisungen** – verweisen auf Klassen aus anderen Paketen (entfallen, wenn keine gebraucht werden).\n2. **Dokumentationskommentar** `/** … */` – optional, in guten Programmen aber immer da.\n3. **Klassenkopf** – Sichtbarkeit (`public`), Schlüsselwort `class`, Klassenname.\n4. **Klassenrumpf** – zwischen `{` und `}`, enthält Methoden und Datenfelder.\n5. **main-Methode** – der definierte Einstiegspunkt der Ausführung.",
    { code: "/**\n * Gibt eine Begrüßung aus.\n *\n * @author Dein Name\n * @version 1.0, 11.2026\n */\npublic class HalloSOC {\n\n    /**\n     * Einstiegspunkt des Programms.\n     */\n    public static void main(String[] args) {\n        // Ausgabe auf der Konsole\n        System.out.println(\"Hallo SOC!\");\n    }\n}" },
    "Der Kopf der main-Methode ist immer genau `public static void main(String[] args)`. `public` = von außen aufrufbar, `static` = ohne Objekt aufrufbar, `void` = kein Rückgabewert, `String[] args` = Kommandozeilenargumente.",
    "**Syntaxregeln** muss man wie Vokabeln lernen. Java ist **case-sensitiv**: `Main` und `main` sind verschiedene Bezeichner, `system.out` statt `System.out` ist ein Fehler. Jede Anweisung endet mit `;`, jede geöffnete Klammer muss geschlossen werden. Zeilennummern wie in Lehrbüchern gehören **nicht** in den Quellcode.",
    "Zwei Arten von Kommentaren: `//` bis zum Zeilenende und `/* … */` über mehrere Zeilen. `/** … */` ist der Dokumentationskommentar für javadoc."
  ],
  pit: ["`System` mit großem S, `main` mit kleinem m.", "Jede `{` braucht eine `}` – auf Papier Klammern direkt paarweise setzen.", "Textverarbeitungsprogramme wie Word sind für Quellcode ungeeignet – nur Texteditoren oder IDE."],
  fill: { kind: "java", wrap: "program", t: "Vervollständige das Programm, sodass es „Hallo SOC!“ ausgibt.",
    code: "public [[0]] HalloSOC {\n    public [[1]] void [[2]](String[] args) {\n        System.out.[[3]](\"Hallo SOC!\");\n    }\n}",
    gaps: [["class"], ["static"], ["main"], ["println"]] }
};
READ["EJP-1"] = {
  read: [
    "Quellcode schreibst du in einem **Texteditor** (z. B. Notepad++, vi, Sublime) oder einer IDE. Textverarbeitungen wie Word speichern Formatierungen mit, die der Compiler nicht versteht. Der Editor sollte Syntax-Highlighting haben – das erleichtert die Arbeit enorm.",
    "Gespeichert wird als **.java**-Datei. Wichtig: Enthält die Datei eine `public class HalloSOC`, muss sie **HalloSOC.java** heißen – Groß- und Kleinschreibung inklusive.",
    "**Kompilieren:** Im Terminal (Eingabeaufforderung) in den Ordner wechseln, in dem die Datei liegt (`cd`), dann `javac HalloSOC.java`. Der Compiler sucht die Datei im aktuellen Verzeichnis. Unter macOS/Linux zeigt `pwd`, wo du gerade bist. Ohne Fehler entsteht daneben **HalloSOC.class** – der Bytecode. Diese Datei ist kein Text; im Editor ist sie unlesbar.",
    "**Ausführen:** `java HalloSOC` – **ohne** Endung `.class`. Der Interpreter übersetzt den Bytecode in die Maschinensprache des Rechners, der Prozessor führt ihn aus.",
    { code: "$ cd ~/gp1/ejp\n$ javac HalloSOC.java     # erzeugt HalloSOC.class\n$ java HalloSOC           # ohne .class!\nHallo SOC!" },
    "**Fehlermeldungen lesen lernen:** javac nennt Datei und Zeile, z. B. `HalloSOC.java:3: error: ';' expected`. Korrigieren, speichern, neu kompilieren. Programmieren lernt man auch durch Experimentieren: Ändere bewusst etwas, kompiliere und beobachte, was passiert.",
    "Eine gute Gewohnheit aus dem Kurs: Leg dir eine **Schablone** an – eine leere Klasse mit Dokumentationskopf und leerer main-Methode – und kopiere sie für jede neue Übung."
  ],
  pit: ["`java HalloSOC.class` ist falsch – ohne Endung starten.", "Dateiname ≠ Klassenname → Compilerfehler.", "javac im falschen Ordner → „file not found“."],
  fill: { kind: "text", t: "Ergänze die Befehle für die Klasse Begruessung.", text: "Datei: [[0]] · Kompilieren: [[1]] · Ausführen: [[2]]",
    gaps: [["Begruessung.java"], ["javac Begruessung.java"], ["java Begruessung"]] }
};
READ["EJP-2"] = {
  read: [
    "Größere Programme bestehen aus vielen Dateien. Eine **JAR-Datei** (*Java Archive*) bündelt alle zu einer Anwendung gehörenden Dateien – Class-Dateien, Bilder, weitere Ressourcen – in einer einzigen, komprimierten Datei.",
    "JAR-Dateien haben die Endung **.jar**, sind vollständig **ZIP-kompatibel** und enthalten eine **Manifest-Datei** `manifest.mf` mit Zusatzinformationen, z. B. welche Klasse die main-Methode enthält. Die Java-Laufzeitumgebung kann Klassen direkt aus der JAR laden.",
    { code: "jar cf programm.jar *.class   # Archiv erstellen (c = create, f = file)\njar tf programm.jar           # Inhalt anzeigen (t = table)\njar xf programm.jar           # entpacken (x = extract)\njava -jar programm.jar        # ausführbares JAR starten (Hauptklasse aus dem Manifest)" },
    "Die Buchstaben merkst du dir am besten so: **c**reate, **t**able of contents, e**x**tract – und **f** heißt, dass danach der Dateiname kommt."
  ],
  pit: ["Starten mit `java -jar`, nicht `java programm.jar`.", "Damit `java -jar` funktioniert, muss im Manifest die Hauptklasse stehen."],
  fill: { kind: "text", t: "Ergänze die Befehle.", text: "Archiv app.jar aus allen Class-Dateien erstellen: jar [[0]] app.jar *.class · Inhalt anzeigen: jar [[1]] app.jar · Ausführbares JAR starten: java [[2]] app.jar",
    gaps: [["cf"], ["tf"], ["-jar"]] }
};
READ["EJP-3"] = {
  read: [
    "Kommentare schreibst du für zwei Zielgruppen. **Kommentare in Methoden** (`//`, `/* */`) erklären den Ablauf – für dich und andere Entwickler. **Dokumentationskommentare** (`/** */`) stehen vor der Klasse und vor jeder öffentlichen Methode und beschreiben, *was* sie tut und *wie* man sie aufruft. Nutzer deiner Klasse interessiert nicht, wie sie programmiert ist, sondern wie man sie benutzt.",
    "Ein **Dokumentationskopf** steht nach den Import-Anweisungen vor der Klasse und enthält mindestens: Name des Autors (mit E-Mail), kurze Beschreibung, Versionsnummer mit Datum.",
    "Das Werkzeug **javadoc** erzeugt daraus eine **HTML-Dokumentation**. Es wertet nur Kommentare aus, die mit `/**` beginnen und vor einer Klasse oder Methode stehen. `/* */` und `//` werden ignoriert.",
    "Wichtige **Tags:** `@author` (Autor), `@version` (Version), `@param name Beschreibung` (je Parameter), `@return` (Rückgabewert), `@throws`/`@exception` (ausgelöste Ausnahmen), `@see` (Verweis), `@deprecated` (veraltet), `{@link …}` (Link im Text).",
    { code: "/**\n * Berechnet den Mittelwert zweier Zahlen.\n *\n * @param a die erste Zahl\n * @param b die zweite Zahl\n * @return der Mittelwert von a und b\n */\npublic static double mittelwert(int a, int b) {\n    return (a + b) / 2.0;\n}" },
    "Aufruf: `javadoc -d doku MeineKlasse.java` erzeugt die Doku im Ordner `doku`; `javadoc -d doku *.java` für alle Dateien im Ordner. Unter Windows wird der Pfad mit `\\` geschrieben, unter Linux/macOS mit `/`. Öffne danach `doku/index.html` im Browser."
  ],
  pit: ["`/*` statt `/**` → javadoc ignoriert den Kommentar.", "Für jeden Parameter ein eigenes @param."],
  fill: { kind: "java", wrap: "main", t: "Vervollständige den javadoc-Kommentar und die Methode.",
    pre: "[[0]]\n * Berechnet das Quadrat einer Zahl.\n *\n * [[1]] x die Zahl\n * [[2]] x * x\n */\nstatic int quadrat(int x) {\n    [[3]] x * x;\n}\n",
    code: "System.out.println(quadrat(7));",
    gaps: [["/**"], ["@param"], ["@return"], ["return"]] }
};
