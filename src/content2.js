// nibble – Lerninhalte GP1, Teil 2 (Variablen bis Klassen)
var CONTENT = CONTENT || [];
CONTENT.push(
{
  id: "VAR", title: "Variablen und primitive Datentypen", color: "#3DDC97",
  nibbles: [
    {
      t: "Deklaration, Zuweisung, Initialisierung",
      learn: [
        "Lokale Variablen sind wie **Behälter**: vor der Verwendung mit **Typ und Bezeichner** deklarieren.",
        "Eine **Zuweisung** schreibt einen Wert hinein: `x = 5;`",
        "Zuweisung direkt bei der Deklaration heißt **Initialisierung**: `int x = 5;`",
        "Bezeichner beginnen mit Buchstabe, `_` oder `$`, dürfen keine Schlüsselwörter sein; Variablen schreibt man in **camelCase**."
      ],
      code: "int anzahlLogins;        // Deklaration\nanzahlLogins = 3;        // Zuweisung\nint fehlversuche = 0;    // Initialisierung",
      quiz: [
        { q: "Welcher Bezeichner ist ungültig?", a: ["port2", "_temp", "2port", "maxVersuche"], c: 2, why: "Bezeichner dürfen nicht mit einer Ziffer beginnen." },
        { q: "`int x = 7;` ist eine …", a: ["reine Deklaration", "Initialisierung", "Typumwandlung", "Konstante"], c: 1, why: "Deklaration plus erste Wertzuweisung = Initialisierung." }
      ]
    },
    {
      t: "Die primitiven Datentypen",
      learn: [
        "Ganzzahlen: **byte** (8 Bit), **short** (16), **int** (32), **long** (64, Literal mit `L`).",
        "Fließkomma: **float** (32 Bit, Literal mit `F`) und **double** (64 Bit, Standard).",
        "**char**: ein Unicode-Zeichen in einfachen Hochkommas: `'A'`.",
        "**boolean**: nur `true` oder `false`.",
        "Dezimaltrenner ist der **Punkt**: `1.7`, nicht `1,7`."
      ],
      code: "byte  b = 100;\nlong  l = 3000000000L;\nfloat f = 3.5F;\ndouble d = 1.7;\nchar  c = 'S';\nboolean ok = true;",
      quiz: [
        { q: "Welche Deklaration ist korrekt?", a: ["double d = 1,7;", "byte b = 780;", "char c = '22';", "float f = 32;"], c: 3, why: "int 32 wird implizit zu float. 780 sprengt byte (max. 127), '22' sind zwei Zeichen." },
        { q: "Welcher Typ ist der Standard für Fließkomma-Literale?", a: ["float", "double", "long", "int"], c: 1, why: "1.5 ist automatisch double; für float braucht man F." }
      ]
    },
    {
      t: "Arithmetik und die Ganzzahl-Falle",
      learn: [
        "Operatoren: `+  -  *  /  %` sowie `++` und `--`.",
        "**Ganzzahldivision schneidet ab**: `7 / 2` ergibt `3`.",
        "`%` liefert den **Rest**: `7 % 2` ergibt `1`.",
        "Kombinierte Operatoren: `x += 5` entspricht `x = x + 5`.",
        "Präfix `++x` erhöht **vor**, Postfix `x++` **nach** der Verwendung."
      ],
      code: "int a = 7, b = 2;\nSystem.out.println(a / b);    // 3\nSystem.out.println(a % b);    // 1\nSystem.out.println(a / 2.0);  // 3.5\nint i = 5;\nint j = i++;   // j = 5, i = 6",
      quiz: [
        { q: "Was ergibt `20 % 5 / 10 % 2`?", a: ["0", "1", "2", "Compilerfehler"], c: 0, why: "20 % 5 = 0, 0 / 10 = 0, 0 % 2 = 0 (Auswertung von links)." },
        { q: "`int i = 3; int k = ++i * 2;` – welchen Wert hat k?", a: ["6", "7", "8", "9"], c: 2, why: "Präfix: i wird zuerst 4, dann 4 * 2 = 8." }
      ],
      task: "Schreib ein Programm, das eine Anzahl Sekunden (z. B. 3725) in Stunden, Minuten und Sekunden zerlegt. Tipp: / und %."
    },
    {
      t: "Type Casting",
      learn: [
        "**Implizit** (erweiternd) geht automatisch: `byte → short → int → long → float → double`.",
        "**Explizit** (einschränkend) braucht den **Cast-Operator**: `(int) 3.9`.",
        "Beim Cast nach int werden Nachkommastellen **abgeschnitten**, nicht gerundet.",
        "Rechnen mit byte/short ergibt immer **int** – das Ergebnis muss ggf. zurückgecastet werden."
      ],
      code: "double d = 3.9;\nint i = (int) d;       // 3\nbyte a = 10, b = 20;\nbyte c = (byte)(a + b); // a + b ist int!",
      quiz: [
        { q: "Was ergibt `(int) 9.99`?", a: ["10", "9", "9.99", "Compilerfehler"], c: 1, why: "Der Cast schneidet ab." },
        { q: "Warum kompiliert `byte c = a + b;` (a, b sind byte) nicht?", a: ["byte kann nicht addiert werden", "a + b ist vom Typ int", "Es fehlt ein Semikolon", "byte ist kein primitiver Typ"], c: 1, why: "Arithmetik mit kleinen Ganzzahltypen liefert int." }
      ]
    },
    {
      t: "boolean und logische Operatoren",
      learn: [
        "Vergleiche liefern boolean: `<  <=  ==  !=  >=  >`.",
        "Logische Operatoren: `&&` (und), `||` (oder), `!` (nicht), `^` (exklusiv oder).",
        "`&&` und `||` werten **kurzschließend** aus: steht das Ergebnis fest, wird rechts nicht mehr geprüft.",
        "Achtung: `=` ist Zuweisung, `==` ist Vergleich."
      ],
      code: "int versuche = 4;\nboolean gesperrt = versuche >= 3 && !istAdmin;\nboolean verdaechtig = vomAusland ^ vpnAktiv;",
      quiz: [
        { q: "Was ergibt `true ^ true`?", a: ["true", "false", "Compilerfehler", "1"], c: 1, why: "Exklusiv-oder ist nur true, wenn genau eine Seite true ist." },
        { q: "Bei `x != 0 && 10 / x > 1` mit x = 0 …", a: ["kommt eine ArithmeticException", "wird rechts nicht ausgewertet, Ergebnis false", "ist das Ergebnis true", "kompiliert es nicht"], c: 1, why: "Kurzschluss: links ist false, also wird rechts gar nicht berechnet." }
      ]
    },
    {
      t: "Konstanten, Ein- und Ausgabe",
      learn: [
        "Lokale **Konstanten** mit `final`: nur einmal zuweisbar, Name in GROSSBUCHSTABEN.",
        "Ausgabe: `System.out.println(...)` mit, `System.out.print(...)` ohne Zeilenumbruch.",
        "Strings in doppelten Anführungszeichen, Verknüpfung mit `+`.",
        "Eingabe z. B. mit einem **Scanner**-Objekt: `new Scanner(System.in)`."
      ],
      code: "import java.util.Scanner;\n...\nfinal int MAX_VERSUCHE = 3;\nScanner sc = new Scanner(System.in);\nSystem.out.print(\"Port: \");\nint port = sc.nextInt();\nSystem.out.println(\"Prüfe Port \" + port);",
      quiz: [
        { q: "Was passiert bei `final int MAX = 3; MAX = 4;`?", a: ["MAX wird 4", "Compilerfehler", "Laufzeitfehler", "MAX bleibt still 3"], c: 1, why: "Einer final-Variablen kann man nicht erneut zuweisen." }
      ]
    }
  ]
},
{
  id: "STA", title: "Statische Methoden und Konstanten", color: "#3DDC97",
  nibbles: [
    {
      t: "Statische Methoden aufrufen",
      learn: [
        "Statische Methoden (**Klassenmethoden**) ruft man über den **Klassennamen** auf.",
        "Syntax: `ergebnis = Klassenname.methode(arg1, arg2);`",
        "Methoden ohne Rückgabewert (**void**) ruft man ohne Zuweisung auf.",
        "Beispiele aus `Math`: `Math.sqrt`, `Math.pow`, `Math.abs`, `Math.max`."
      ],
      code: "double c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));\nint groesser = Math.max(3, 8);   // 8",
      quiz: [
        { q: "Was liefert `Math.pow(2, 10)`?", a: ["20", "1024.0", "100", "12"], c: 1, why: "2¹⁰ = 1024, Rückgabetyp ist double." },
        { q: "Wie ruft man eine void-Methode korrekt auf?", a: ["x = Klasse.m();", "Klasse.m();", "void Klasse.m();", "return Klasse.m();"], c: 1, why: "Ohne Rückgabewert gibt es nichts zuzuweisen." }
      ]
    },
    {
      t: "Eigene Methoden deklarieren",
      learn: [
        "**Methodenkopf**: `public static rueckgabetyp name(typ param, ...)`.",
        "**Methodenrumpf**: ein Block `{ ... }` mit Anweisungen und lokalen Variablen.",
        "`return` beendet die Methode und liefert einen Wert passenden Typs zurück.",
        "Bei `void` darf `return` fehlen."
      ],
      code: "public static double hypotenuse(double a, double b) {\n    return Math.sqrt(a * a + b * b);\n}\n\npublic static void banner(String text) {\n    System.out.println(\"=== \" + text + \" ===\");\n}",
      quiz: [
        { q: "Was muss hinter `return` stehen, wenn der Rückgabetyp `int` ist?", a: ["Nichts", "Ein Ausdruck vom Typ int", "Ein String", "void"], c: 1, why: "Der Rückgabewert muss zum deklarierten Typ passen." },
        { q: "Welcher Teil gehört zum Methodenkopf?", a: ["Die Parameterliste", "Die lokalen Variablen", "Die return-Anweisung", "Die Schleifen"], c: 0, why: "Modifizierer, Rückgabetyp, Name und Parameter bilden den Kopf." }
      ],
      task: "Schreib eine Methode `public static boolean istPrivateIP(int a)`, die true liefert, wenn das erste Oktett 10 ist. Teste sie aus main heraus."
    },
    {
      t: "Überladen von Methoden",
      learn: [
        "Mehrere Methoden dürfen **gleich heißen**, wenn ihre **Parameterlisten** sich unterscheiden.",
        "Die **Signatur** = Methodenname + Parametertypen.",
        "Der Rückgabetyp allein reicht **nicht** zur Unterscheidung.",
        "Der Compiler wählt anhand der Argumenttypen die passende Variante."
      ],
      code: "static int max(int a, int b) { ... }\nstatic double max(double a, double b) { ... }\nstatic int max(int a, int b, int c) { ... }",
      quiz: [
        { q: "Welches Paar ist KEINE gültige Überladung?", a: ["f(int) / f(double)", "f(int) / f(int, int)", "int f(int) / double f(int)", "f(String) / f(char)"], c: 2, why: "Nur der Rückgabetyp unterscheidet sich – das ist nicht erlaubt." }
      ]
    },
    {
      t: "Sichtbarkeit lokaler Variablen & Konstanten",
      learn: [
        "Lokale Variablen und Parameter gelten **nur in ihrem Block/ihrer Methode**.",
        "Am Methodenende wird ihr Speicher freigegeben, der Wert ist weg.",
        "**Statische Konstanten**: `public static final double MWST = 0.19;`",
        "Zugriff von außen über den Klassennamen: `Steuer.MWST`, z. B. `Math.PI`."
      ],
      code: "public class Netz {\n    public static final int MAX_PORT = 65535;\n}\n// anderswo:\nif (port > Netz.MAX_PORT) { ... }",
      quiz: [
        { q: "Wie greift man auf die Konstante PI der Klasse Math zu?", a: ["PI", "Math.PI", "Math.PI()", "new Math().PI"], c: 1, why: "Statische Konstanten werden über den Klassennamen angesprochen." },
        { q: "Was passiert mit einer lokalen Variablen nach dem Methodenende?", a: ["Sie bleibt global erhalten", "Ihr Speicher wird freigegeben", "Sie wird zur Konstanten", "Sie wird an main übergeben"], c: 1, why: "Lokale Variablen leben nur während der Methodenausführung." }
      ]
    },
    {
      t: "Methoden testen",
      learn: [
        "Bevor man Methoden weitergibt, sollte man sie **systematisch testen**.",
        "Teste **typische Werte**, **Grenzwerte** (0, Maximum, Minimum) und **ungültige Eingaben**.",
        "Eine einfache Testklasse ruft die Methode mit bekannten Werten auf und vergleicht mit dem erwarteten Ergebnis.",
        "Grenzwerttests sind auch in der IT-Security Gold wert: viele Lücken stecken an den Rändern."
      ],
      code: "System.out.println(istGueltig(0));      // erwartet true\nSystem.out.println(istGueltig(65535));  // erwartet true\nSystem.out.println(istGueltig(65536));  // erwartet false\nSystem.out.println(istGueltig(-1));     // erwartet false",
      quiz: [
        { q: "Welche Testwerte sind für einen Bereich 1–100 am wichtigsten?", a: ["50", "1, 100, 0 und 101", "Nur 100", "Zufallswerte"], c: 1, why: "Grenzwerte und knapp daneben decken typische Off-by-one-Fehler auf." }
      ]
    }
  ]
},
{
  id: "OBJ", title: "Objekte", color: "#3DDC97",
  nibbles: [
    {
      t: "Klassen der Standardbibliothek nutzen",
      learn: [
        "Eine **Klasse ist ein Datentyp**, ihre Werte heißen **Objekte** oder **Instanzen**.",
        "Klassen liegen in **Paketen**; mit `import` macht man sie bekannt: `import java.util.Scanner;`",
        "`java.lang` (String, Math, System) ist automatisch importiert.",
        "Objekte erzeugt man mit `new` und einem **Konstruktor**."
      ],
      code: "import java.time.LocalDate;\nimport java.util.Random;\n\nRandom r = new Random();\nint wuerfel = r.nextInt(6) + 1;\nLocalDate heute = LocalDate.now();",
      quiz: [
        { q: "Welche Klasse muss NICHT importiert werden?", a: ["Scanner", "Random", "String", "LocalDate"], c: 2, why: "String liegt in java.lang, das immer verfügbar ist." },
        { q: "`new Random()` ist ein …", a: ["Methodenaufruf einer Konstante", "Konstruktoraufruf", "Import", "Cast"], c: 1, why: "new ruft den Konstruktor auf und erzeugt ein Objekt." }
      ]
    },
    {
      t: "Instanz- vs. statische Methoden",
      learn: [
        "**Instanzmethoden** arbeiten mit einem konkreten Objekt: `objekt.methode(...)`.",
        "**Statische Methoden** gehören zur Klasse: `Klasse.methode(...)`.",
        "Viele Methoden liefern selbst **fertige Objekte** zurück, z. B. `LocalDate.now()`.",
        "In der API-Doku steht `this` für das aktuelle Objekt."
      ],
      code: "String s = \"Firewall\";\nint n = s.length();           // Instanzmethode\nString t = String.valueOf(42); // statische Methode",
      quiz: [
        { q: "`\"abc\".toUpperCase()` ist ein Aufruf einer …", a: ["statischen Methode", "Instanzmethode", "Konstante", "Konstruktors"], c: 1, why: "Sie wird auf einem konkreten String-Objekt aufgerufen." }
      ]
    },
    {
      t: "Referenzen verstehen",
      learn: [
        "Variablen von Klassentypen speichern **Referenzen** (Verweise), nicht das Objekt selbst.",
        "`b = a;` kopiert nur die Referenz – beide zeigen auf **dasselbe Objekt**.",
        "Hat eine Variable kein Objekt, ist ihr Wert **null**.",
        "Ein Methodenaufruf auf null führt zur **NullPointerException**."
      ],
      code: "StringBuilder a = new StringBuilder(\"log\");\nStringBuilder b = a;\nb.append(\"-1\");\nSystem.out.println(a);  // log-1  (!)\n\nString x = null;\nx.length();  // NullPointerException",
      quiz: [
        { q: "Nach `b = a;` (beides Objekte) und einer Änderung über b …", a: ["ist nur b geändert", "sieht man die Änderung auch über a", "wird a gelöscht", "kompiliert es nicht"], c: 1, why: "a und b verweisen auf dasselbe Objekt." },
        { q: "Was löst `s.length()` aus, wenn s null ist?", a: ["0", "NullPointerException", "Compilerfehler", "-1"], c: 1, why: "Auf null gibt es kein Objekt, dessen Methode man aufrufen könnte." }
      ]
    },
    {
      t: "== versus equals()",
      learn: [
        "`==` prüft bei Objekten auf **Identität**: dasselbe Objekt im Speicher?",
        "`equals()` prüft auf **inhaltliche Gleichheit**.",
        "Für Strings also **immer** `equals` verwenden.",
        "Bei primitiven Typen vergleicht `==` die Werte direkt."
      ],
      code: "String a = new String(\"admin\");\nString b = new String(\"admin\");\nSystem.out.println(a == b);       // false\nSystem.out.println(a.equals(b));  // true",
      quiz: [
        { q: "Wie prüft man sicher, ob ein eingegebener Username \"root\" ist?", a: ["user == \"root\"", "user.equals(\"root\")", "user = \"root\"", "user.compare(\"root\")"], c: 1, why: "equals vergleicht den Inhalt; == nur die Referenz." }
      ]
    }
  ]
},
{
  id: "KLA", title: "Eigene Klassen programmieren", color: "#3DDC97",
  nibbles: [
    {
      t: "Klasse, Paket, Attribute",
      learn: [
        "Klassen sind **Baupläne** und modellieren eine Sache der Wirklichkeit.",
        "Mit `package` ordnet man die Klasse einem Paket zu (erste Zeile der Datei).",
        "Attribute: `private Datentyp name;` – sie halten den Zustand jedes Objekts.",
        "Dateiname = Name der öffentlichen Klasse."
      ],
      code: "package de.nibble.soc;\n\npublic class Alarm {\n    private String quelle;\n    private int prioritaet;\n    private boolean bearbeitet;\n}",
      quiz: [
        { q: "Wo steht die package-Anweisung?", a: ["Am Ende der Datei", "Als erste Anweisung der Datei", "In der main-Methode", "Im Konstruktor"], c: 1, why: "package muss vor imports und Klassendeklaration stehen." }
      ]
    },
    {
      t: "Sichtbarkeit & Kapselung",
      learn: [
        "`public`: überall sichtbar. `private`: nur innerhalb der Klasse.",
        "`protected`: Klasse, Paket und Unterklassen. Ohne Angabe: **package-private**.",
        "Attribute sind üblicherweise **private** – das ist der Kern der Datenkapselung.",
        "Zugriff von außen nur über kontrollierte Methoden."
      ],
      quiz: [
        { q: "Welche Sichtbarkeit sollten Attribute normalerweise haben?", a: ["public", "private", "protected", "keine Angabe"], c: 1, why: "private schützt den Zustand vor unkontrolliertem Zugriff." },
        { q: "Ein Member ohne Sichtbarkeitsmodifizierer ist sichtbar …", a: ["überall", "nur in der Klasse", "im selben Paket", "nur in Unterklassen"], c: 2, why: "Das ist die package-private Standardsichtbarkeit." }
      ]
    },
    {
      t: "Getter, Setter, toString",
      learn: [
        "**Getter** lesen ein Attribut: `getQuelle()`, bei boolean auch `isBearbeitet()`.",
        "**Setter** schreiben ein Attribut und können Werte **validieren**.",
        "Innerhalb der Klasse greift man mit `this.attribut` zu.",
        "`toString()` liefert eine lesbare Textdarstellung des Objekts."
      ],
      code: "public int getPrioritaet() {\n    return this.prioritaet;\n}\npublic void setPrioritaet(int p) {\n    if (p >= 1 && p <= 5) {\n        this.prioritaet = p;\n    }\n}\n@Override\npublic String toString() {\n    return \"Alarm[\" + quelle + \", P\" + prioritaet + \"]\";\n}",
      quiz: [
        { q: "Welchen Vorteil hat ein Setter gegenüber einem public-Attribut?", a: ["Er ist schneller", "Er kann ungültige Werte abweisen", "Er spart Speicher", "Keinen"], c: 1, why: "Validierung im Setter hält das Objekt in einem gültigen Zustand." }
      ]
    },
    {
      t: "Konstruktoren",
      learn: [
        "Ein Konstruktor **heißt wie die Klasse** und hat **keinen Rückgabetyp**.",
        "Seine Aufgabe: **alle Attribute initialisieren**.",
        "Ohne eigenen Konstruktor gibt es den **impliziten Defaultkonstruktor** (0, 0.0, false, null).",
        "Konstruktoren lassen sich **überladen**; mit `this(...)` ruft man einen anderen Konstruktor derselben Klasse auf.",
        "**final**-Attribute bekommen genau einmal einen Wert, meist im Konstruktor."
      ],
      code: "public Alarm(String quelle, int prioritaet) {\n    this.quelle = quelle;\n    this.prioritaet = prioritaet;\n}\npublic Alarm(String quelle) {\n    this(quelle, 3);   // Standardpriorität\n}",
      quiz: [
        { q: "Welchen Rückgabetyp hat ein Konstruktor?", a: ["void", "Den Klassentyp", "Keinen", "int"], c: 2, why: "Konstruktoren haben gar keinen Rückgabetyp, auch nicht void." },
        { q: "Was gilt, sobald man einen eigenen Konstruktor schreibt?", a: ["Der Defaultkonstruktor bleibt zusätzlich", "Der implizite Defaultkonstruktor entfällt", "Man braucht keine Attribute", "Die Klasse wird abstrakt"], c: 1, why: "Der implizite Defaultkonstruktor existiert nur, wenn kein eigener definiert ist." }
      ],
      task: "Schreib eine Klasse `Benutzer` mit den Attributen name (final) und fehlversuche. Konstruktor, Getter, eine Methode `fehlversuch()` und `istGesperrt()` (ab 3 Versuchen)."
    },
    {
      t: "Statische Attribute & Methoden in eigenen Klassen",
      learn: [
        "Statische Attribute gehören zur **Klasse**, nicht zu einzelnen Objekten – alle teilen sich einen Wert.",
        "Typisch: ein **Zähler** für erzeugte Objekte.",
        "Statische Methoden haben **kein this** und können keine Instanzattribute direkt nutzen."
      ],
      code: "private static int anzahl = 0;\n\npublic Alarm(String quelle) {\n    this.quelle = quelle;\n    anzahl++;\n}\npublic static int getAnzahl() { return anzahl; }",
      quiz: [
        { q: "Warum darf eine statische Methode nicht auf `this.quelle` zugreifen?", a: ["quelle ist private", "Es gibt in ihr kein aktuelles Objekt", "Strings sind verboten", "Sie darf es doch"], c: 1, why: "Statische Methoden laufen ohne Bezug zu einer Instanz." }
      ]
    },
    {
      t: "Enums",
      learn: [
        "Eine **Enum** ist eine Klasse mit einer festen Liste von **Konstanten**.",
        "Die Konstantenliste steht **immer zuerst**, danach Attribute, Konstruktoren, Methoden.",
        "Konstruktoren einer Enum sind immer **private**.",
        "Jede Enum hat `name()`, `ordinal()` sowie statisch `valueOf()` und `values()`."
      ],
      code: "public enum Schweregrad {\n    NIEDRIG(1), MITTEL(5), HOCH(8), KRITISCH(10);\n\n    private final int score;\n    Schweregrad(int score) { this.score = score; }\n    public int getScore() { return score; }\n}\n// Schweregrad.HOCH.ordinal() -> 2",
      quiz: [
        { q: "Was liefert `Schweregrad.KRITISCH.ordinal()`?", a: ["10", "3", "4", "\"KRITISCH\""], c: 1, why: "ordinal() ist die Position in der Liste, beginnend bei 0." },
        { q: "Welche Methode liefert alle Konstanten einer Enum?", a: ["all()", "values()", "list()", "ordinal()"], c: 1, why: "values() gibt ein Array aller Konstanten zurück." }
      ]
    }
  ]
}
);
