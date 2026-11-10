// nibble – Lerninhalte GP1, Teil 1 (Grundlagen)
// Eigene Zusammenfassungen und Fragen auf Basis der Lerneinheiten.
var CONTENT = CONTENT || [];
CONTENT.push(
{
  id: "EIP", title: "Einführung in die Programmierung", color: "#5AA9FF",
  nibbles: [
    {
      t: "Was ein Computer kann – und was nicht",
      learn: [
        "Computer sind dem Menschen bei **Geschwindigkeit, Zuverlässigkeit und Speichervolumen** überlegen.",
        "Grenzen gibt es bei sehr komplexen Problemen und bei Fragen, die **ethisch-moralische Urteile** verlangen.",
        "Daten und Programme bilden ein **Modell** realer Sachverhalte ab – nie die Wirklichkeit selbst.",
        "Jeder Computer besteht aus **Hardware** (Elektronik) und **Software** (Programme, Daten, Dokumentation)."
      ],
      quiz: [
        { q: "Was gehört laut Definition zur Software?", a: ["Nur ausführbare Programme", "Programme, Daten und Dokumentation", "Prozessor und Arbeitsspeicher", "Alle Peripheriegeräte"], c: 1, why: "Software umfasst Programme, die zugehörigen Daten und deren Dokumentation." },
        { q: "Wobei ist ein Computer dem Menschen NICHT überlegen?", a: ["Rechengeschwindigkeit", "Fehlerfreies Wiederholen", "Ethische Abwägungen", "Speichern großer Datenmengen"], c: 2, why: "Moralische Urteile lassen sich nicht sinnvoll an eine Maschine delegieren." }
      ]
    },
    {
      t: "Von-Neumann-Architektur & EVA-Prinzip",
      learn: [
        "**Prozessor + Arbeitsspeicher** bilden die Zentraleinheit, alles andere sind **Peripheriegeräte**.",
        "Programm **und** Daten müssen zur Ausführung im Arbeitsspeicher liegen – er ist schnell, aber **flüchtig**.",
        "Dauerhaft gespeichert wird auf Speichermedien wie Festplatte oder USB-Stick.",
        "Daraus folgt das **EVA-Prinzip**: Eingabe → Verarbeitung → Ausgabe."
      ],
      quiz: [
        { q: "Was passiert mit dem Inhalt des Arbeitsspeichers beim Ausschalten?", a: ["Er bleibt erhalten", "Er wird auf die Festplatte kopiert", "Er geht verloren", "Er wird komprimiert"], c: 2, why: "Der Arbeitsspeicher (RAM) ist flüchtig." },
        { q: "Welches Gerät ist ein reines Eingabegerät?", a: ["Drucker", "Maus", "Festplatte", "Monitor"], c: 1, why: "Die Maus dient nur der Eingabe, der Drucker nur der Ausgabe." }
      ]
    },
    {
      t: "System- vs. Anwendersoftware",
      learn: [
        "**Systemsoftware** ist eng mit der Hardware verbunden, z. B. das Betriebssystem. Sie erfordert hardwarenahe Programmierung.",
        "**Anwendersoftware** ist alles, was für konkrete Anwendungsfälle entwickelt wurde.",
        "**Anwender** benutzen Programme, **Programmentwickler** entwerfen und implementieren sie nach Anwendervorgaben.",
        "Beim Testen nimmt der Entwickler bewusst die **Anwendersicht** ein."
      ],
      quiz: [
        { q: "Ein Betriebssystem gehört zur …", a: ["Anwendersoftware", "Systemsoftware", "Hardware", "Firmware des Monitors"], c: 1, why: "Das Betriebssystem ist der klassische Vertreter der Systemsoftware." },
        { q: "Ein SIEM-Tool im SOC ist aus Sicht der Einteilung …", a: ["Systemsoftware", "Anwendersoftware", "Hardware", "Ein Algorithmus"], c: 1, why: "Es wurde für einen konkreten Anwendungsfall (Log-Analyse) entwickelt." }
      ]
    },
    {
      t: "Algorithmen & schrittweise Verfeinerung",
      learn: [
        "Ein **Algorithmus** ist eine **endliche, eindeutige** Vorschrift zur Lösung eines Problems in Einzelschritten.",
        "Er muss **terminieren** und für gleiche Eingaben das gleiche Ergebnis liefern.",
        "Bei der **schrittweisen Verfeinerung** zerlegt man ein grobes Problem („Kaffee kochen“) immer weiter in präzise Teilschritte.",
        "Aus dem fertigen Algorithmus wird durch Formulierung in einer Programmiersprache ein **Programm**."
      ],
      code: "Kaffee kochen\n  1. Wasser einfüllen\n     1.1 Kanne nehmen\n     1.2 Kanne bis Markierung füllen\n  2. Filter einsetzen\n  3. Pulver einfüllen\n  4. Maschine einschalten",
      quiz: [
        { q: "Welche Eigenschaft muss ein Algorithmus NICHT haben?", a: ["Endlichkeit", "Eindeutigkeit", "Grafische Oberfläche", "Ausführbarkeit der Einzelschritte"], c: 2, why: "Eine GUI hat mit dem Algorithmus-Begriff nichts zu tun." },
        { q: "„Schrittweise Verfeinerung“ bedeutet …", a: ["Code nachträglich optimieren", "Ein Problem von grob nach fein in Teilschritte zerlegen", "Einen Algorithmus mehrmals ausführen", "Fehler nach und nach entfernen"], c: 1, why: "Man arbeitet vom groben Ablauf hin zu präzisen Einzelschritten." }
      ]
    }
  ]
},
{
  id: "PUP", title: "Programmiersprachen und Programmierung", color: "#5AA9FF",
  nibbles: [
    {
      t: "Bits, Bytes und Zeichenkodierung",
      learn: [
        "Maschinencode basiert auf dem **Binärsystem**: ein Symbol (0/1) ist ein **Bit**, 8 Bit sind ein **Byte**.",
        "Zeichen werden über **Kodierungstabellen** auf Zahlen abgebildet, z. B. ASCII (7 Bit).",
        "**Unicode** erfasst die Zeichen nahezu aller Schriftsysteme. Java verwendet Unicode intern.",
        "Ein **Nibble** sind übrigens 4 Bit – ein halbes Byte, genau eine Hex-Ziffer."
      ],
      quiz: [
        { q: "Wie viele verschiedene Werte kann ein Byte darstellen?", a: ["8", "128", "256", "1024"], c: 2, why: "2⁸ = 256." },
        { q: "Welche Kodierung verwendet Java für Zeichen?", a: ["ASCII", "EBCDIC", "Unicode", "Morse"], c: 2, why: "char und String basieren in Java auf Unicode." }
      ]
    },
    {
      t: "Syntax und Semantik",
      learn: [
        "Eine Programmiersprache ist eine **künstliche Sprache** mit exakter Syntax und Semantik.",
        "**Syntax**: Symbole und Regeln für den Aufbau von Wörtern und Sätzen.",
        "Ein **Syntaxfehler** verhindert die Übersetzung in Maschinencode.",
        "**Semantik**: die Bedeutung syntaktisch korrekter Konstrukte, also was das Programm tatsächlich tut."
      ],
      code: "int x = 10 / 0;   // syntaktisch korrekt, semantisch problematisch\nint y = 10 /;     // Syntaxfehler: kompiliert nicht",
      quiz: [
        { q: "Ein fehlendes Semikolon ist ein …", a: ["Semantikfehler", "Syntaxfehler", "Laufzeitfehler", "Logikfehler"], c: 1, why: "Es verletzt die formalen Aufbauregeln der Sprache." },
        { q: "Was bestimmt die Semantik?", a: ["Welche Zeichen erlaubt sind", "Die Bedeutung bzw. Wirkung des Programms", "Die Dateiendung", "Die Einrückung"], c: 1, why: "Semantik = Bedeutung korrekter Konstrukte." }
      ]
    },
    {
      t: "Imperativ, objektorientiert, deklarativ",
      learn: [
        "**Imperativ**: Anweisungen manipulieren Daten Schritt für Schritt (z. B. C, Pascal).",
        "**Objektorientiert**: Objekte vereinen Zustand und Verhalten und kommunizieren miteinander (z. B. Java, C++).",
        "**Deklarativ**: man beschreibt *was* gilt, nicht *wie* – logisch (PROLOG) oder funktional (LISP).",
        "Höhere Sprachen sind **prozessorunabhängig** und problemorientiert."
      ],
      quiz: [
        { q: "Zu welchem Konzept gehört Java?", a: ["Rein imperativ", "Objektorientiert", "Logisch", "Funktional"], c: 1, why: "Java ist eine objektorientierte Sprache." },
        { q: "PROLOG ist eine …", a: ["logische Sprache", "imperative Sprache", "Assemblersprache", "Auszeichnungssprache"], c: 0, why: "PROLOG basiert auf Prädikatenlogik." }
      ]
    },
    {
      t: "Compiler vs. Interpreter",
      learn: [
        "Quellcode muss in **Maschinencode** übersetzt werden.",
        "Ein **Compiler** übersetzt das ganze Programm vorab in eine ausführbare Datei.",
        "Ein **Interpreter** übersetzt und führt Anweisung für Anweisung direkt aus.",
        "**Bibliotheken** lagern Programmteile aus, die zur Laufzeit eingebunden werden.",
        "Java kombiniert beides: **javac** erzeugt Bytecode, die **JVM** interpretiert ihn."
      ],
      quiz: [
        { q: "Was erzeugt ein klassischer Compiler?", a: ["Nichts, er führt direkt aus", "Eine ausführbare Datei", "Nur Fehlermeldungen", "HTML-Doku"], c: 1, why: "Das gesamte Programm wird vorab übersetzt." },
        { q: "Wie arbeitet Java?", a: ["Nur kompiliert", "Nur interpretiert", "Kompiliert zu Bytecode, der von der JVM ausgeführt wird", "Gar nicht übersetzt"], c: 2, why: "Das hybride Modell ist die Basis der Plattformunabhängigkeit." }
      ]
    },
    {
      t: "Phasen der Softwareentwicklung",
      learn: [
        "**Analyse**: Anforderungen werden exakt und vollständig festgehalten, oft im **Pflichtenheft**.",
        "**Entwurf**: vom Grob- zum Feinentwurf.",
        "**Implementierung**: der Entwurf wird in einer Programmiersprache umgesetzt.",
        "**Test**: das Programm wird gegen die Anforderungen geprüft – auch aus Anwendersicht."
      ],
      quiz: [
        { q: "In welcher Phase entsteht typischerweise das Pflichtenheft?", a: ["Analyse", "Entwurf", "Implementierung", "Test"], c: 0, why: "Die Anforderungen werden in der Analyse festgelegt." }
      ]
    }
  ]
},
{
  id: "PJA", title: "Die Programmiersprache Java", color: "#5AA9FF",
  nibbles: [
    {
      t: "Eigenschaften von Java",
      learn: [
        "Java ist **einfach, objektorientiert, plattformunabhängig, robust und sicher**.",
        "**Plattformunabhängig**: Bytecode läuft überall, wo eine JVM existiert („write once, run anywhere“).",
        "**Robust**: strenge Typprüfung und automatische Speicherverwaltung (Garbage Collection), keine Zeigerarithmetik.",
        "Java unterstützt **Nebenläufigkeit** (Threads) und bringt eine riesige **Standardbibliothek** mit."
      ],
      quiz: [
        { q: "Was macht Java plattformunabhängig?", a: ["Der Compiler erzeugt für jedes OS eigenen Maschinencode", "Bytecode wird von einer JVM ausgeführt", "Java läuft nur im Browser", "Java nutzt keine Bibliotheken"], c: 1, why: "Die JVM übernimmt die Übersetzung in den plattformspezifischen Maschinencode." },
        { q: "Was trägt zur Robustheit von Java bei?", a: ["Manuelle Speicherfreigabe", "Zeigerarithmetik", "Garbage Collection", "Fehlende Typprüfung"], c: 2, why: "Der Garbage Collector verhindert typische Speicherfehler." }
      ]
    },
    {
      t: "Klassen und Objekte – die Idee",
      learn: [
        "Eine **Klasse** ist ein **Bauplan** mit Name, Attributen, Methoden und Beziehungen.",
        "Ein **Objekt** hat **Identität**, **Zustand** (Attribute) und **Verhalten** (Methoden).",
        "Objekte werden mit **new** und einem **Konstruktor** erzeugt.",
        "Man kommuniziert mit Objekten über **Methodenaufrufe**."
      ],
      code: "Konto k = new Konto();   // Objekt nach Bauplan Konto\nk.einzahlen(100);        // Verhalten aufrufen",
      quiz: [
        { q: "Womit wird ein Objekt in Java erzeugt?", a: ["class", "new", "import", "static"], c: 1, why: "Der new-Operator ruft den Konstruktor auf." },
        { q: "Der Zustand eines Objekts steckt in seinen …", a: ["Methoden", "Attributen", "Paketen", "Kommentaren"], c: 1, why: "Attribute speichern die Daten des Objekts." }
      ]
    },
    {
      t: "Kapselung, Vererbung, Polymorphie",
      learn: [
        "**Datenkapselung**: Attribute nur über Methoden verändern – zentral auch für sichere Software.",
        "**Vererbung**: Unterklassen erben Attribute und Methoden ihrer Oberklassen und sparen Code.",
        "**Polymorphie**: gleichnamige Methoden führen je nach Objekt unterschiedliche Anweisungen aus (durch Überschreiben)."
      ],
      quiz: [
        { q: "Welches Prinzip schützt Attribute vor direktem Zugriff?", a: ["Vererbung", "Polymorphie", "Datenkapselung", "Nebenläufigkeit"], c: 2, why: "Kapselung erzwingt Zugriff über definierte Methoden." },
        { q: "Polymorphie entsteht in Java vor allem durch …", a: ["Überschreiben von Methoden", "Importieren von Paketen", "Konstanten", "Kommentare"], c: 0, why: "Überschriebene Methoden verhalten sich je nach Objekttyp unterschiedlich." }
      ]
    },
    {
      t: "JDK, JVM und IDE",
      learn: [
        "Das **JDK** (Java Development Kit) enthält Compiler **javac**, Starter **java**, **javadoc** und mehr.",
        "Die **JVM** ist ein Bytecode-Interpreter, der Bytecode in plattformspezifischen Maschinencode umsetzt.",
        "Eine **IDE** bündelt Editor, Compiler, Debugger und weitere Werkzeuge unter einer Oberfläche.",
        "Modellierungswerkzeuge (z. B. UML) helfen beim Entwurf."
      ],
      quiz: [
        { q: "Welches Werkzeug übersetzt .java in .class?", a: ["java", "javac", "javadoc", "jar"], c: 1, why: "javac ist der Java-Compiler." },
        { q: "Die JVM ist im Kern ein …", a: ["Texteditor", "Bytecode-Interpreter", "Betriebssystem", "Webserver"], c: 1, why: "Sie führt Bytecode auf der jeweiligen Plattform aus." }
      ]
    }
  ]
},
{
  id: "EJP", title: "Das erste Java-Programm", color: "#3DDC97",
  nibbles: [
    {
      t: "Aufbau eines Java-Programms",
      learn: [
        "**import**-Anweisungen stehen ganz oben.",
        "Danach folgt der **Dokumentationskopf** (Datei, Autor, Beschreibung, Datum, Version).",
        "Die Klasse beginnt mit **class** und ihrem Bezeichner.",
        "Jede Applikation startet in der **main-Methode**.",
        "Java ist **case-sensitiv**: `Hallo` ≠ `hallo`."
      ],
      code: "/**\n * HalloWelt.java\n * @author Dein Name\n * @version 1.0\n */\npublic class HalloWelt {\n    public static void main(String[] args) {\n        System.out.println(\"Hallo SOC!\");\n    }\n}",
      quiz: [
        { q: "Wie lautet der korrekte Kopf der main-Methode?", a: ["public void main()", "public static void main(String[] args)", "static int main(String args)", "public main(String[] args)"], c: 1, why: "Genau diese Signatur sucht die JVM als Einstiegspunkt." },
        { q: "Sind `MeinProgramm` und `meinProgramm` derselbe Bezeichner?", a: ["Ja", "Nein, Java ist case-sensitiv", "Nur unter Windows", "Nur bei Klassen"], c: 1, why: "Groß- und Kleinschreibung wird immer unterschieden." }
      ]
    },
    {
      t: "Kompilieren und Ausführen",
      learn: [
        "Quellcode wird als **.java**-Datei gespeichert.",
        "**Dateiname und Klassenname müssen identisch sein**: `HalloWelt` → `HalloWelt.java`.",
        "Kompilieren: `javac HalloWelt.java` erzeugt `HalloWelt.class` (Bytecode).",
        "Ausführen: `java HalloWelt` – **ohne** `.class`!"
      ],
      code: "$ javac HalloWelt.java\n$ java HalloWelt\nHallo SOC!",
      quiz: [
        { q: "Welcher Aufruf startet das Programm korrekt?", a: ["java HalloWelt.class", "java HalloWelt", "javac HalloWelt", "run HalloWelt.java"], c: 1, why: "Beim java-Aufruf wird die Endung .class weggelassen." },
        { q: "Die Klasse heißt `LogParser`. Wie muss die Datei heißen?", a: ["logparser.java", "LogParser.java", "LogParser.class", "Main.java"], c: 1, why: "Dateiname = Klassenname (inkl. Groß-/Kleinschreibung) + .java." }
      ],
      task: "Schreib ein Programm `Begruessung`, das zwei Zeilen ausgibt: deinen Namen und deinen Studiengang. Kompiliere es mit javac und führe es mit java aus."
    },
    {
      t: "JAR-Dateien",
      learn: [
        "Eine **JAR-Datei** (Java Archive) bündelt mehrere .class-Dateien und Ressourcen in einem ZIP-Archiv.",
        "Mit einem **Manifest** lässt sich die Hauptklasse festlegen.",
        "Start eines ausführbaren JARs: `java -jar programm.jar`."
      ],
      quiz: [
        { q: "Wie startet man ein ausführbares JAR?", a: ["java programm.jar", "java -jar programm.jar", "javac -jar programm.jar", "jar programm"], c: 1, why: "Der Schalter -jar weist java an, das Manifest auszuwerten." }
      ]
    },
    {
      t: "Dokumentieren mit javadoc",
      learn: [
        "Dokukommentare beginnen mit `/**` und enden mit `*/`.",
        "Gebräuchliche Tags: **@author**, **@version**, **@param**, **@return**, **@throws**.",
        "`javadoc` erzeugt daraus eine **HTML-Dokumentation**.",
        "Guter Code ist ausreichend kommentiert – besonders, wenn andere ihn weiterverwenden."
      ],
      code: "/**\n * Prüft, ob ein Port im erlaubten Bereich liegt.\n * @param port die Portnummer\n * @return true, wenn 0 bis 65535\n */\npublic static boolean istGueltig(int port) { ... }",
      quiz: [
        { q: "Mit welcher Zeichenfolge beginnt ein javadoc-Kommentar?", a: ["//", "/*", "/**", "#"], c: 2, why: "Nur /** … */ wird von javadoc ausgewertet." },
        { q: "Welches Tag beschreibt den Rückgabewert?", a: ["@param", "@return", "@author", "@see"], c: 1, why: "@return dokumentiert, was die Methode zurückgibt." }
      ]
    }
  ]
}
);
