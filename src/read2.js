// nibble – Lesetexte, Stolperfallen und Lückencode, Teil 2 (VAR, STA, OBJ, KLA)
var READ = READ || {};

// ====================== VAR – Variablen und primitive Datentypen ======================
READ["VAR-0"] = {
  read: [
    "Ein sinnvolles Programm folgt dem **EVA-Prinzip**: Werte einlesen, verarbeiten, Ergebnis ausgeben. Für alles Weitere brauchst du einen Ort, an dem Werte gespeichert werden: **Variablen**. Vorerst steht dein ganzer Code zwischen den geschweiften Klammern der main-Methode – nur dort wird er ausgeführt.",
    "**Deklaration:** Bevor du eine Variable benutzt, legst du sie mit Datentyp und Bezeichner an: `int zahl1;` Mehrere auf einmal (`int a, b, c;`) sind erlaubt, gelten aber als unübersichtlich – besser einzeln.",
    "**Regeln für Bezeichner:** Buchstaben, Ziffern und Unterstrich sind erlaubt (Java erlaubt zusätzlich `$`); **keine** Leerzeichen, Bindestriche oder Punkte. Ein Bezeichner darf **nicht mit einer Ziffer beginnen** und kein Schlüsselwort sein (`int`, `class`, `new` …). Konvention: Variablen in **camelCase** – `anzahlLogins`, nicht `Anzahl_logins`.",
    "**Zuweisung:** `variable = ausdruck;` Ein Ausdruck ist eine Regel zur Berechnung eines Werts – eine Zahl, eine Rechnung, ein Text. Das `=` ist **keine Gleichung**: Es gilt „rechts vor links“. Erst wird rechts ausgerechnet, dann landet das Ergebnis links. Deshalb ist `zaehler = zaehler + 1;` völlig sinnvoll. Ein neuer Wert überschreibt den alten – der ist dann weg.",
    { code: "int zahl1;          // Deklaration\nzahl1 = 7;          // Zuweisung\nzahl1 = 99;         // 7 wird überschrieben\nzahl1 = zahl1 + 1;  // rechts: 99 + 1 → links: 100\nint zahl2 = 5;      // Deklaration + Zuweisung = Initialisierung" },
    "**Initialisierung** heißt: Deklaration und erste Zuweisung in einem Schritt. Eine lokale Variable, die noch keinen Wert hat, darfst du nicht lesen – der Compiler meldet *variable might not have been initialized*."
  ],
  pit: ["`=` weist zu, `==` vergleicht.", "Lokale Variablen haben keinen Standardwert – vor dem Lesen initialisieren.", "`2te` ist kein gültiger Name, `zweite` schon."],
  fill: { kind: "java", wrap: "main", t: "Ergänze die Datentypen und den Wert, sodass „Gesamt: 7.5“ ausgegeben wird.",
    code: "[[0]] anzahl = 3;\ndouble preis;\npreis = [[1]];\n[[2]] gesamt = anzahl * preis;\nSystem.out.println(\"Gesamt: \" + gesamt);",
    gaps: [["int"], ["2.5", "2.50"], ["double"]] }
};
READ["VAR-1"] = {
  read: [
    "Java hat acht **primitive Datentypen**. Für ganze Zahlen (*Integers*) gibt es vier, die sich im Speicherbedarf und damit im **Wertebereich** unterscheiden:",
    { code: "Typ     Speicher   Wertebereich\nbyte    1 Byte     -128 … 127\nshort   2 Byte     -32 768 … 32 767\nint     4 Byte     ca. -2,1 Mrd. … 2,1 Mrd.\nlong    8 Byte     ca. ±9,2 · 10^18" },
    "Ganzzahl-Literale sind automatisch `int`. Für größere Werte hängst du ein `L` an: `long l = 3000000000L;` Weist du einer `byte`-Variable 128 zu, meldet der Compiler einen Fehler (*possible lossy conversion*).",
    "**Fließkommazahlen** (Gleitkomma): `float` (4 Byte) und `double` (8 Byte). `double` hat nicht nur den größeren Bereich, sondern vor allem die **höhere Genauigkeit** – deshalb ist es der Standard. Fließkomma-Literale sind automatisch `double`, für `float` brauchst du ein `F`: `float f = 3.5F;` Achtung: Dezimaltrenner ist der **Punkt**.",
    "`char` speichert **ein einzelnes Zeichen** in einfachen Hochkommas: `'A'`. Intern ist es eine Zahl aus der Unicode-Tabelle (2 Byte, 0 bis 65535) – `char c = 65;` ist ebenfalls `'A'`. Sonderzeichen schreibt man mit **Escape-Sequenzen**: `'\\n'` (neue Zeile), `'\\t'` (Tabulator), `'\\''` (Hochkomma), `'\\\\'` (Backslash).",
    "`boolean` hat nur die Werte `true` und `false` (benannt nach George Boole). Man merkt sich damit, ob etwas eingetreten ist: Ist die Karte gesperrt? Ist die Zahl gerade? Eine **Bedingung** ist ein Ausdruck vom Typ `boolean`.",
    "Und `String`? Der ist **kein** primitiver Typ, sondern eine Klasse – Text steht in doppelten Anführungszeichen: `\"Hallo\"`. Mehr dazu in OBJ und ZKT."
  ],
  pit: ["`char c = \"A\";` ist falsch – char braucht einfache Hochkommas.", "`double d = 1,5;` ist falsch – Punkt statt Komma.", "`float f = 2.5;` ist falsch – es fehlt das F."],
  fill: { kind: "java", wrap: "main", t: "Ergänze Datentypen und Literale, sodass „3000000000 1.25 J true“ ausgegeben wird.",
    code: "[[0]] grosseZahl = 3000000000L;\n[[1]] kurs = 1.25F;\nchar initial = [[2]];\nboolean aktiv = [[3]];\nSystem.out.println(grosseZahl + \" \" + kurs + \" \" + initial + \" \" + aktiv);",
    gaps: [["long"], ["float"], ["'J'"], ["true"]] }
};
READ["VAR-2"] = {
  read: [
    "Die **arithmetischen Operatoren** kennst du aus der Schule: `+`, `-`, `*`, `/` und das negative Vorzeichen. Es gilt **Punkt vor Strich**, Klammern verändern die Reihenfolge.",
    "**Die Ganzzahl-Falle:** Stehen links und rechts von `/` zwei ganze Zahlen, ist das Ergebnis wieder ganzzahlig – die Nachkommastellen werden **abgeschnitten** (nicht gerundet!). `7 / 2` ergibt `3`. Sobald einer der beiden Operanden eine Fließkommazahl ist, wird mit Komma gerechnet: `7 / 2.0` ergibt `3.5`.",
    "Der **Modulo-Operator** `%` liefert den Rest der Ganzzahldivision: `7 % 2` ergibt `1`. Super nützlich: `n % 2 == 0` prüft, ob n gerade ist; `n % 10` liefert die letzte Ziffer; `/` und `%` zusammen zerlegen Sekunden in Stunden, Minuten und Sekunden.",
    "**Kombinierte Zuweisungsoperatoren:** `x += 5` heißt `x = x + 5`, entsprechend `-=`, `*=`, `/=`, `%=`. **Inkrement/Dekrement:** `x++` bzw. `x--` erhöht bzw. verringert um 1.",
    "Feiner Unterschied: **Präfix** `++x` erhöht **vor** der Verwendung, **Postfix** `x++` **danach**. Alleine in einer Zeile ist das egal; in einem Ausdruck nicht:",
    { code: "int i = 5;\nint a = i++;   // a = 5, danach i = 6\nint b = ++i;   // i = 7, dann b = 7\n\nint sekunden = 3725;\nint h = sekunden / 3600;          // 1\nint m = (sekunden % 3600) / 60;   // 2\nint s = sekunden % 60;            // 5" },
    "Operatoren gleicher Stufe werden **von links nach rechts** ausgewertet: `20 % 5 / 10 % 2` ist `((20 % 5) / 10) % 2` = 0."
  ],
  pit: ["`7 / 2` = 3, nicht 3.5.", "`i++` in einem Ausdruck liefert den alten Wert.", "Gleiche Stufe: links nach rechts – `*`, `/`, `%` sind gleichrangig."],
  fill: { kind: "java", wrap: "main", t: "Zerlege 3725 Sekunden. Ausgabe: „1h 2m 5s“.",
    code: "int sekunden = 3725;\nint h = sekunden [[0]] 3600;\nint m = (sekunden % 3600) [[1]] 60;\nint s = sekunden [[2]] 60;\nSystem.out.println(h + \"h \" + m + \"m \" + s + \"s\");",
    gaps: [["/"], ["/"], ["%"]] }
};
READ["VAR-3"] = {
  read: [
    "Java ist **streng typisiert**: Jeder Wert hat einen Typ, und nicht jeder Wert passt in jede Variable. Wenn Typen nicht zusammenpassen, braucht es eine **Typumwandlung** (*Type Casting*).",
    "**Implizit (erweiternd):** In einen größeren Typ passt der Wert immer – das macht Java automatisch: `byte → short → int → long → float → double` (und `char → int`). `double d = 5;` ist also kein Problem.",
    "**Explizit (einschränkend):** In einen kleineren Typ geht eventuell Information verloren. Das musst du mit dem **Cast-Operator** ausdrücklich verlangen: `(zieltyp) wert`. Nach `int` werden Nachkommastellen **abgeschnitten**, nicht gerundet: `(int) 3.9` ist `3`.",
    "Der klassische Anwendungsfall ist die Ganzzahl-Falle: Zwei `int`-Werte sollen mit Komma geteilt werden. Wichtig ist, **wo** der Cast steht:",
    { code: "int punkte = 47, maximal = 60;\ndouble a = punkte / maximal;            // 0.0  (erst int-Division, dann umgewandelt)\ndouble b = (double) punkte / maximal;   // 0.7833…  (Cast bindet stärker als /)\ndouble c = (double) (punkte / maximal); // 0.0  (Klammer: erst int-Division!)" },
    "Noch eine Falle: Rechnungen mit `byte` und `short` ergeben immer **int**. `byte c = a + b;` kompiliert deshalb nicht, auch wenn a und b bytes sind – du brauchst `byte c = (byte) (a + b);`.",
    "Bei `%` mit Fließkommazahlen kommt der Rest beim Teilen ohne Nachkommastellen heraus – selten sinnvoll und wegen Rundungsfehlern ungenau."
  ],
  pit: ["`(double) (a / b)` rettet nichts mehr – die int-Division ist schon passiert.", "Cast nach int rundet nicht, er schneidet ab.", "byte + byte = int."],
  fill: { kind: "java", wrap: "main", t: "Berechne den Prozentwert mit Kommastellen und eine abgeschnittene Ganzzahl. Ausgabe: „78.33333333333333 78“.",
    code: "int punkte = 47;\nint maximal = 60;\ndouble prozent = [[0]] punkte / maximal * 100;\nint ganz = [[1]] prozent;\nSystem.out.println(prozent + \" \" + ganz);",
    gaps: [["(double)"], ["(int)"]] }
};
READ["VAR-4"] = {
  read: [
    "**Vergleichsoperatoren** liefern einen `boolean`: `<`, `<=`, `>`, `>=`, `==` (gleich), `!=` (ungleich). Ein Ausdruck vom Typ `boolean` heißt **Bedingung**.",
    "**Logische Operatoren** verknüpfen Bedingungen:\n- `&&` (und): nur true, wenn **beide** true sind\n- `||` (oder): true, wenn **mindestens eine** true ist\n- `!` (nicht): kehrt den Wert um\n- `^` (exklusiv oder): true, wenn **genau eine** true ist",
    { code: "a      b      a && b   a || b   a ^ b\ntrue   true   true     true     false\ntrue   false  false    true     true\nfalse  true   false    true     true\nfalse  false  false    false    false" },
    "**Kurzschlussauswertung:** `&&` und `||` werten die rechte Seite gar nicht erst aus, wenn das Ergebnis schon feststeht. Bei `x != 0 && 10 / x > 1` wird für x = 0 nicht geteilt – das schützt vor einem Absturz. Die Reihenfolge der Bedingungen ist also wichtig.",
    "**Rangfolge:** `!` bindet am stärksten, dann Vergleiche, dann `&&`, dann `||`. Im Zweifel Klammern setzen – das macht den Code auch lesbarer.",
    { code: "int versuche = 4;\nboolean istAdmin = false;\nboolean gesperrt = versuche >= 3 && !istAdmin;   // true\nboolean gerade = versuche % 2 == 0;              // true" }
  ],
  pit: ["`if (x = 5)` ist ein Fehler – Vergleich ist `==`.", "Mathematische Schreibweise `1 < x < 10` geht nicht – richtig: `x > 1 && x < 10`.", "`true ^ true` ist false."],
  fill: { kind: "java", wrap: "main", t: "Ein Konto wird ab 3 Fehlversuchen gesperrt, außer bei Admins. Ausgabe: „true“.",
    code: "int versuche = 4;\nboolean istAdmin = false;\nboolean gesperrt = versuche [[0]] 3 [[1]] [[2]]istAdmin;\nSystem.out.println(gesperrt);",
    gaps: [[">="], ["&&"], ["!"]] }
};
READ["VAR-5"] = {
  read: [
    "**Konstanten** haben einen Namen, aber ihr Wert ändert sich während des Programmlaufs nie – etwa der Mehrwertsteuersatz. Deklaration und Initialisierung in einem: `final double MWST = 19;` Das Schlüsselwort `final` verhindert jede spätere Zuweisung. Konvention: **GROSSBUCHSTABEN**, Wörter mit Unterstrich: `MAX_VERSUCHE`.",
    "Warum Konstanten? Der Code wird lesbarer (`MWST` statt einer magischen 19) und Änderungen passieren an genau einer Stelle.",
    "**Ausgabe:** `System.out.println(...)` gibt aus und beginnt danach eine neue Zeile, `System.out.print(...)` ohne Zeilenumbruch. Mit `+` verknüpfst du Text und Werte: `\"Summe: \" + summe`.",
    "**Eingabe:** Dafür brauchst du ein **Scanner**-Objekt aus dem Paket `java.util`. Ganz oben steht `import java.util.Scanner;` – damit darfst du den langen Namen `java.util.Scanner` zu `Scanner` abkürzen. Dann erzeugst du das Objekt und liest Werte:",
    { code: "import java.util.Scanner;\n\npublic class Mehrwertsteuer {\n    public static void main(String[] args) {\n        final double MWST = 19;\n        Scanner tastatur = new Scanner(System.in);\n        System.out.print(\"Nettobetrag: \");\n        double netto = tastatur.nextDouble();\n        double steuer = netto * MWST / 100;\n        System.out.println(\"Steuer: \" + steuer);\n        System.out.println(\"Brutto: \" + (netto + steuer));\n    }\n}" },
    "Wichtige Scanner-Methoden: `nextInt()`, `nextDouble()`, `next()` (ein Wort), `nextLine()` (ganze Zeile). Gibt jemand Text ein, wo eine Zahl erwartet wird, bricht `nextInt()` mit einer `InputMismatchException` ab – wie man das abfängt, lernst du in EXC.",
    "Achtung bei der Klammer in der letzten Zeile: Ohne sie würde `\"Brutto: \" + netto + steuer` zuerst Text und dann die Zahlen **anhängen** statt zu addieren."
  ],
  pit: ["Ohne `import java.util.Scanner;` kennt der Compiler Scanner nicht.", "`\"Summe: \" + a + b` hängt an, `\"Summe: \" + (a + b)` rechnet.", "Konstante später ändern → Compilerfehler."],
  fill: { kind: "java", wrap: "main", imports: ["java.util.Scanner"], t: "Ergänze Konstante, Einlesen und Ausgabe. (Zum Testen liest der Scanner hier aus einem Text statt von der Tastatur.) Ausgabe: „Brutto: 297.5“.",
    code: "[[0]] double MWST = 19;\nScanner sc = new Scanner(\"250\");   // im echten Programm: new Scanner(System.in)\ndouble netto = sc.[[1]]();\ndouble brutto = netto + netto * MWST / 100;\nSystem.out.[[2]](\"Brutto: \" + brutto);",
    gaps: [["final"], ["nextDouble"], ["println"]] }
};

// ====================== STA – Statische Methoden und Konstanten ======================
READ["STA-0"] = {
  read: [
    "Für Wurzel, Potenz, Sinus oder Logarithmus gibt es keine Operatoren. Diese Berechnungen haben die Java-Entwickler als **Methoden** programmiert. Wie aufwendig das intern ist, muss dich nicht kümmern – du rufst sie einfach auf.",
    "In Java ist **jede Methode Teil einer Klasse**. Die Wurzelmethode heißt `sqrt` und steht in der Klasse `Math`. Um eine **statische Methode** (Klassenmethode) aufzurufen, brauchst du vier Informationen – sie stehen in der Dokumentation der Standardbibliothek:\n- die **Klasse**, in der sie steht\n- ihren **Namen**\n- welche **Parameter** (Werte und Datentypen) sie braucht\n- den **Datentyp des Ergebnisses**",
    { code: "// In der Doku:  class Math:  public static double sqrt(double a)\ndouble zahl = 2.0;\ndouble wurzel = Math.sqrt(zahl);       // Klassenname.methode(argument)\ndouble potenz = Math.pow(2, 10);       // 1024.0\nint groesser = Math.max(3, 8);         // 8\nint betrag = Math.abs(-5);             // 5" },
    "Allgemein: Steht in der Doku `public static Datentyp methode(Typ1 p1, Typ2 p2)`, dann rufst du sie so auf: `Datentyp ergebnis = Klassenname.methode(wert1, wert2);` Die Werte müssen zu den Parametertypen passen.",
    "**Methoden ohne Rückgabewert** erkennst du an `void`. Sie erledigen eine Aufgabe (etwas ausgeben, warten, eine Datei schließen), liefern aber nichts zurück. Deshalb gibt es beim Aufruf auch **keine Zuweisung**: `Klassenname.methode(wert);`",
    "**Statische Konstanten** gibt es auch in der Bibliothek, etwa `Math.PI` und `Math.E`. In der Doku steht `public static final double PI` – `static` = gehört zur Klasse, `final` = unveränderlich. Anders als lokale Konstanten aus VAR sind sie in jedem Programm nutzbar."
  ],
  pit: ["`double x = System.out.println(...)` geht nicht – println ist void.", "Math.pow liefert immer double, auch bei ganzen Zahlen.", "`sqrt(2)` ohne `Math.` kennt der Compiler nicht."],
  fill: { kind: "java", wrap: "main", t: "Ergänze die Aufrufe der Klassenmethoden. Ausgabe: „1.4142135623730951 1024.0“.",
    code: "double zahl = 2.0;\ndouble wurzel = [[0]].[[1]](zahl);\ndouble hoch = Math.[[2]](zahl, 10);\nSystem.out.println(wurzel + \" \" + hoch);",
    gaps: [["Math"], ["sqrt"], ["pow"]] }
};
READ["STA-1"] = {
  read: [
    "Eigene statische Methoden lohnen sich, wenn ein Problem mehrfach zu lösen ist, wenn ein Programm übersichtlicher werden soll oder wenn du die Lösung später wiederverwenden willst. Jede Methode steht **innerhalb der Klasse** (zwischen ihren geschweiften Klammern), aber **außerhalb** anderer Methoden.",
    "Eine Methode besteht aus **Methodenkopf** und **Methodenrumpf**:",
    { code: "/**\n * Berechnet die Hypotenuse eines rechtwinkligen Dreiecks.\n * @param a erste Kathete\n * @param b zweite Kathete\n * @return Länge der Hypotenuse\n */\npublic static double hypotenuse(double a, double b) {   // Kopf\n    double c = Math.sqrt(a * a + b * b);                // Rumpf\n    return c;\n}" },
    "**Kopf:** Sichtbarkeit (`public`), `static`, **Rückgabetyp** (oder `void`), **Name** (Verb, camelCase) und die **formalen Parameter** in Klammern – jeder mit Typ und Name, durch Komma getrennt. Leere Klammern, wenn es keine gibt.",
    "**Rumpf:** ein Block `{ … }` mit Anweisungen und lokalen Variablen. `return wert;` beendet die Methode und gibt den Wert an die Aufrufstelle zurück – sein Typ muss zum Rückgabetyp passen. Bei `void` fehlt `return` oder steht ohne Wert.",
    "Beim Aufruf werden die **aktuellen Parameter** (die konkreten Werte) der Reihe nach in die formalen Parameter kopiert: `hypotenuse(3, 4)` → `a = 3`, `b = 4`. Innerhalb derselben Klasse darf der Klassenname beim Aufruf entfallen.",
    "Trenne sprachlich sauber: **Zurückgeben** (`return`) heißt, einen Wert an die aufrufende Stelle weiterreichen. **Ausgeben** (`System.out.println`) heißt, ihn für einen Menschen auf die Konsole schreiben. Eine Methode, die etwas *berechnen* soll, gibt in der Regel zurück und gibt nicht selbst aus.",
    "Jeder Datentyp ist als Rückgabetyp erlaubt, z. B. `boolean`: Eine Methode `istDreieck(a, b, c)` kann prüfen, ob drei Längen ein Dreieck bilden können."
  ],
  pit: ["Methode in einer anderen Methode deklarieren → Compilerfehler.", "Rückgabetyp double, aber kein return → Compilerfehler „missing return statement“.", "Ausgeben statt zurückgeben, obwohl die Aufgabe „gibt zurück“ sagt."],
  fill: { kind: "java", wrap: "main", t: "Ergänze Rückgabetypen und return. Ausgabe: drei Zeilen „----------“, „5.0“, „----------“.",
    pre: "public static [[0]] hypotenuse(double a, double b) {\n    [[1]] Math.sqrt(a * a + b * b);\n}\n\npublic static [[2]] schreibeLinie() {\n    System.out.println(\"----------\");\n}\n",
    code: "schreibeLinie();\nSystem.out.println(hypotenuse(3, 4));\nschreibeLinie();",
    gaps: [["double"], ["return"], ["void"]] }
};
READ["STA-2"] = {
  read: [
    "In der Klasse `Math` gibt es `max` mehrfach: für `int`, `long`, `float` und `double`. Mehrere Methoden **gleichen Namens** in einer Klasse sind erlaubt, wenn sich ihre **Parameterlisten** unterscheiden – in der **Anzahl** oder in den **Datentypen** der Parameter. Das heißt **Überladen**.",
    "Die **Signatur** einer Methode besteht aus ihrem Namen und den Typen ihrer Parameter. Der **Rückgabetyp gehört nicht dazu** – zwei Methoden, die sich nur im Rückgabetyp unterscheiden, sind verboten.",
    { code: "public static void javaMethode(String text) {\n    System.out.println(\"Das ist Ihr Text: \" + text);\n}\n\npublic static void javaMethode(String text, int i) {\n    System.out.println(text + \" \" + i);\n}\n\njavaMethode(\"Hallo\");      // erste Variante\njavaMethode(\"Hallo\", 3);   // zweite Variante" },
    "Der Compiler wählt anhand der **Argumente** beim Aufruf, welche Variante passt. Gibt es keine exakt passende, versucht er es mit erweiternden Umwandlungen (z. B. `int` → `double`).",
    "Ein typisches Muster: Die Variante mit weniger Parametern ruft die allgemeinere auf und setzt einen Standardwert ein. So steht die eigentliche Logik nur an einer Stelle."
  ],
  pit: ["`int f(int x)` und `double f(int x)` zusammen → Compilerfehler.", "Parameternamen zählen nicht zur Signatur, nur die Typen."],
  fill: { kind: "java", wrap: "main", t: "Ergänze die überladenen Methoden. Ausgabe: „9 11 2.5“.",
    pre: "public static int groesste(int a, int b) {\n    return Math.max(a, b);\n}\n\npublic static int groesste(int a, int b, [[0]] c) {\n    return groesste(groesste(a, b), [[1]]);\n}\n\npublic static [[2]] groesste(double a, double b) {\n    return Math.max(a, b);\n}\n",
    code: "System.out.println(groesste(3, 9) + \" \" + groesste(4, 11, 7) + \" \" + groesste(2.5, 1.5));",
    gaps: [["int"], ["c"], ["double"]] }
};
READ["STA-3"] = {
  read: [
    "**Sichtbarkeit lokaler Variablen:** Eine lokale Variable ist nur in dem **Block** sichtbar, in dem sie deklariert wurde. Ein Block ist ein zusammengehöriges Paar geschweifter Klammern. Ihre Lebensdauer beginnt mit der Deklaration und endet beim Verlassen des Blocks – Name und Wert werden dann „vergessen“.",
    "Folge: Jede Methode hat ihre **eigenen** lokalen Variablen. Gleiche Namen in verschiedenen Methoden sind erlaubt und haben nichts miteinander zu tun – sie können sogar verschiedene Datentypen haben. Auch **Parameter** sind lokale Variablen ihrer Methode.",
    { code: "public static void a() {\n    int x = 5;       // x von a\n}\npublic static void b() {\n    int x = 99;      // ein ganz anderes x\n    // a() kann das x von b nicht sehen und umgekehrt\n}" },
    "**Eigene statische Konstanten** legst du auf Klassenebene an – außerhalb aller Methoden: `public static final double WINKELSUMME = 180.0;` Statt `public` ginge auch `private` oder keine Angabe (Bedeutung in KLA). Konvention: **komplett in Großbuchstaben**.",
    "Zugriff von außen über den Klassennamen: `Dreieck.WINKELSUMME` – genau wie bei `Math.PI`. Innerhalb der eigenen Klasse reicht der Name allein."
  ],
  pit: ["Variable in Methode a deklariert, in Methode b benutzt → „cannot find symbol“.", "Statische Konstante innerhalb von main deklariert – dann ist sie nur lokal.", "Konstante ohne `final` ist keine Konstante."],
  fill: { kind: "java", wrap: "class", t: "Ergänze die statische Konstante und die Zugriffe. Ausgabe: „60.0“ und „true“.",
    code: "public class Dreieck {\n    /** Summe der Innenwinkel eines Dreiecks */\n    public [[0]] final double WINKELSUMME = 180.0;\n}",
    run: "double alpha = 90;\ndouble beta = 30;\ndouble gamma = [[1]].WINKELSUMME - alpha - beta;\nSystem.out.println(gamma);\nSystem.out.println(Math.[[2]] > 3);",
    gaps: [["static"], ["Dreieck"], ["PI"]] }
};
READ["STA-4"] = {
  read: [
    "Methoden schreibt man, damit andere sie benutzen. Darum musst du sie **testen**: aufrufen und die Ergebnisse überprüfen – Rückgabewerte und sonstige Wirkungen. Ein einziger Aufruf reicht nie.",
    "Wichtig: Durch Testen kann man die **Abwesenheit von Fehlern nicht beweisen**, nur die Wahrscheinlichkeit von Fehlern senken. Deshalb wählt man die Testwerte mit System:",
    "- **typische Werte** aus der Mitte des erlaubten Bereichs\n- **Grenzwerte**: der kleinste und der größte erlaubte Wert\n- **knapp daneben**: einen Schritt unter bzw. über der Grenze\n- **Sonderfälle**: 0, negative Zahlen, leere Eingaben",
    { code: "// Test für eine Rundungsmethode\ndouble b;\nb = Dreieck.rundeDouble(Math.PI, 1);\nSystem.out.println(\"pi, 1 Stelle: \" + b + \" (erwartet 3.1)\");\nb = Dreieck.rundeDouble(Math.PI, 0);\nSystem.out.println(\"pi, 0 Stellen: \" + b + \" (erwartet 3.0)\");" },
    "Schreib dir zu jedem Testaufruf den **erwarteten Wert** dazu – sonst siehst du nicht, ob das Ergebnis stimmt. Genau so arbeiten die Test.java-Dateien in dieser App: Sie rufen deine Methode auf und vergleichen mit dem erwarteten Wert.",
    "Grenzwerttests sind in der IT-Sicherheit besonders wertvoll: Viele Schwachstellen stecken genau an den Rändern – ein Index zu viel, eine Länge zu groß, ein negativer Wert, mit dem niemand gerechnet hat."
  ],
  pit: ["Nur mit „schönen“ Werten testen.", "Ergebnis ausgeben, aber nicht mit dem erwarteten Wert vergleichen."],
  fill: { kind: "java", wrap: "main", t: "Teste die Portprüfung an den Grenzen. Ausgabe: „true“, „true“, „false“, „false“.",
    pre: "public static boolean istGueltigerPort(int port) {\n    return port >= 0 && port <= 65535;\n}\n",
    code: "System.out.println(istGueltigerPort([[0]]));   // kleinster gültiger Port\nSystem.out.println(istGueltigerPort([[1]]));   // größter gültiger Port\nSystem.out.println(istGueltigerPort([[2]]));   // knapp über der Grenze\nSystem.out.println(istGueltigerPort(-1));      // knapp unter der Grenze",
    gaps: [["0"], ["65535"], ["65536"]] }
};

// ====================== OBJ – Objekte ======================
READ["OBJ-0"] = {
  read: [
    "Bisher hast du mit einfachen Zahlen gearbeitet. Ein typisches Java-Programm erzeugt dagegen viele **Objekte** – Zusammenfassungen vieler einzelner Daten mit eigener Funktionalität –, die miteinander kommunizieren. Auch eine Benutzeroberfläche besteht aus Objekten: Buttons, Textfelder, Schieberegler.",
    "**Klassen sind Datentypen.** Sie legen fest, welche Werte (Objekte) gespeichert werden können und welche Operationen (Methoden) damit möglich sind. Das konkrete Exemplar ist die **Instanz**. Die Uhr auf deinem Schreibtisch ist eine Instanz des Konzepts „Uhr“; ihre Attributwerte (Uhrzeit, Farbe) unterscheiden sie von anderen Uhren.",
    "Die Standardbibliothek hat Tausende Klassen. Niemand kennt sie alle – wichtig ist die **allgemeine Syntax**, dann kannst du jede nutzen. Beispiel aus dem Kurs: `BigInteger` für ganze Zahlen fast beliebiger Größe, weit über `long` hinaus.",
    "**1. Variable deklarieren** – der Klassenname ist der Typ: `BigInteger zahl1;`",
    "**2. Importieren** – Klassen liegen in **Paketen**. `BigInteger` heißt vollständig `java.math.BigInteger` (*qualifizierter Name*). Ohne Import meldet der Compiler *cannot find symbol*. Mit `import java.math.BigInteger;` ganz oben darfst du den kurzen Namen verwenden. Ausnahme: Klassen aus `java.lang` (`String`, `Math`, `System`) sind automatisch bekannt.",
    "**3. Objekt erzeugen** – Objekte lassen sich nicht einfach zuweisen wie Zahlen. Man braucht einen **Konstruktoraufruf** mit `new`. Der Konstruktor heißt immer wie die Klasse und kann Parameter haben. Er reserviert Speicher für das Objekt und setzt Startwerte in alle Attribute.",
    { code: "import java.math.BigInteger;\n...\nBigInteger zahl1 = new BigInteger(\"012345678901234567890\");\nBigInteger zahl2 = new BigInteger(\"98765432109876543210\");\nBigInteger summe = zahl1.add(zahl2);   // Instanzmethode\nSystem.out.println(summe);" },
    "**4. Methoden aufrufen** – mit der **Punktnotation** auf dem Objekt: `zahl1.add(zahl2)`. Welche Methoden es gibt, steht in der Dokumentation der Klasse."
  ],
  pit: ["`BigInteger x = 123;` geht nicht – Objekte brauchen new.", "import vergessen → „cannot find symbol“.", "Konstruktor heißt wie die Klasse – inklusive Großschreibung."],
  fill: { kind: "java", wrap: "main", imports: ["java.math.BigInteger"], t: "Ergänze Objekterzeugung und Methodenaufruf. Ausgabe: „123456789012345678901234567891“.",
    code: "BigInteger a = [[0]] BigInteger(\"123456789012345678901234567890\");\nBigInteger b = new BigInteger(\"1\");\nBigInteger summe = a.[[1]](b);\nSystem.out.println(summe);",
    gaps: [["new"], ["add"]] }
};
READ["OBJ-1"] = {
  read: [
    "Objekte speichern nicht nur Werte, sie bringen vor allem **Operationen** mit, die mit diesen Werten arbeiten: **Instanzmethoden**. Sie werden immer **auf einem Objekt** aufgerufen: `objekt.methode(…)`. Das Ergebnis hängt vom Zustand genau dieses Objekts ab.",
    "**Klassenmethoden** (statisch) gehören dagegen zur Klasse und brauchen kein Objekt: `Klassenname.methode(…)`. Du kennst sie aus STA (`Math.sqrt`).",
    { code: "String s = \"Firewall\";\nint n = s.length();               // Instanzmethode: Länge DIESES Strings → 8\nString t = String.valueOf(42);    // Klassenmethode: \"42\"\n\nScanner tastatur = new Scanner(System.in);  // Objekt erzeugen\nint zahl = tastatur.nextInt();              // Instanzmethode des Scanners" },
    "In der Dokumentation erkennst du den Unterschied am Wort `static`. Bei Instanzmethoden steht der Rückgabetyp direkt vor dem Namen: `public BigInteger add(BigInteger val)` – sie liefert also ein **neues** BigInteger-Objekt. Das ursprüngliche Objekt bleibt unverändert.",
    "Viele Klassenmethoden liefern übrigens selbst ein Objekt, ohne dass du `new` schreibst: `LocalDate.now()` gibt ein Datumsobjekt für heute zurück, `LocalDate.of(2027, 1, 28)` eins für deinen Klausurtag. Auch das ist eine Form der Objekterzeugung.",
    "Methodenaufrufe kann man **verketten**, wenn eine Methode ein Objekt zurückgibt: `s.toUpperCase().charAt(0)` – zuerst entsteht ein neuer String in Großbuchstaben, darauf wird `charAt` aufgerufen."
  ],
  pit: ["`String.length()` geht nicht – length ist eine Instanzmethode, man braucht einen konkreten String.", "`summe.add(b)` ohne Zuweisung ändert summe NICHT – das Ergebnis geht verloren."],
  fill: { kind: "java", wrap: "main", t: "Ergänze die Methodenaufrufe. Ausgabe: „8 42 FIREWALL“.",
    code: "String s = \"Firewall\";\nint n = s.[[0]]();\nString t = [[1]].valueOf(42);\nSystem.out.println(n + \" \" + t + \" \" + s.[[2]]());",
    gaps: [["length"], ["String"], ["toUpperCase"]] }
};
READ["OBJ-2"] = {
  read: [
    "Wie werden Objekte gespeichert? Bei **primitiven Typen** steht der Wert direkt im Speicherplatz der Variable. `zwei = eins;` kopiert den Wert – danach gibt es ihn zweimal, und beide sind völlig unabhängig.",
    "Bei **Klassentypen** ist das anders: Das Objekt liegt an einer eigenen Stelle im Speicher. Die Variable enthält nur einen **Verweis** darauf – eine **Referenz**. `b = a;` kopiert deshalb **nur die Referenz**. Danach zeigen beide Variablen auf **dasselbe Objekt**:",
    { code: "StringBuilder a = new StringBuilder(\"log\");\nStringBuilder b = a;          // Referenz kopiert, kein neues Objekt\nb.append(\"-1\");\nSystem.out.println(a);        // log-1  – die Änderung über b sieht man über a!\n\nStringBuilder c = new StringBuilder(\"log\");   // eigenes Objekt\nc.append(\"-2\");\nSystem.out.println(a);        // weiterhin log-1" },
    "Bei `String` und `BigInteger` merkt man davon meist nichts, weil diese Objekte **unveränderlich** sind – ihre Methoden liefern immer neue Objekte. Bei veränderbaren Objekten wie `StringBuilder` oder später deinen eigenen Klassen ist es entscheidend.",
    "**null:** Eine Referenzvariable, die auf kein Objekt verweist, hat den Wert `null`. Ruft man auf `null` eine Methode auf, gibt es zur Laufzeit eine **NullPointerException** – einer der häufigsten Fehler überhaupt.",
    "Objekte, auf die keine Referenz mehr zeigt, räumt die **Garbage Collection** automatisch weg."
  ],
  pit: ["`b = a` erzeugt kein neues Objekt.", "Methodenaufruf auf null → NullPointerException.", "Änderung über eine Referenz ist über alle Referenzen auf dasselbe Objekt sichtbar."],
  fill: { kind: "java", wrap: "main", t: "b soll auf dasselbe Objekt zeigen wie a, c auf ein eigenes. Ausgabe: „log-1 log“.",
    code: "StringBuilder a = new StringBuilder(\"log\");\nStringBuilder b = [[0]];\nb.append(\"-1\");\nStringBuilder c = [[1]] StringBuilder(\"log\");\nSystem.out.println(a + \" \" + c);",
    gaps: [["a"], ["new"]] }
};
READ["OBJ-3"] = {
  read: [
    "Beim Vergleich zweier Objekte muss man an die Referenzen denken. Bei `int x = 7, y = 7;` ist `x == y` natürlich `true` – der Operator prüft, ob die **Inhalte der Variablen** gleich sind.",
    "Bei Objekten sind die Inhalte der Variablen aber **Referenzen**. Zwei Konstruktoraufrufe erzeugen zwei Objekte an zwei Speicherstellen – also zwei verschiedene Referenzen:",
    { code: "BigInteger x = new BigInteger(\"7\");\nBigInteger y = new BigInteger(\"7\");\nSystem.out.println(x == y);        // false – zwei verschiedene Objekte\nSystem.out.println(x.equals(y));   // true  – gleicher Inhalt\nBigInteger z = x;\nSystem.out.println(z == x);        // true  – dieselbe Referenz" },
    "`==` prüft bei Objekten also **Identität** (dasselbe Objekt?). Für **inhaltliche Gleichheit** gibt es die Methode `equals`. Jede Klasse erbt sie von `Object`; Klassen wie `String` und `BigInteger` haben sie so überschrieben, dass sie die Inhalte vergleicht. Für eigene Klassen schreibst du `equals` selbst (KLA/VRB).",
    "**Merksatz für Strings:** Niemals mit `==` vergleichen, immer mit `equals`. Manchmal liefert `==` zufällig `true` (wenn Java gleiche String-Literale intern wiederverwendet) – darauf darfst du dich nie verlassen. Gerade bei Eingaben von Nutzern („ist der Benutzername root?“) wäre das ein echter Fehler.",
    "Bei primitiven Typen vergleicht `==` immer die Werte – dort ist es richtig."
  ],
  pit: ["`name == \"root\"` ist ein Fehler – `name.equals(\"root\")`.", "`equals` auf null aufrufen → NullPointerException; sicherer: `\"root\".equals(name)`."],
  fill: { kind: "java", wrap: "main", imports: ["java.math.BigInteger"], t: "Ergänze die Vergleiche. Ausgabe: „false“, „true“, „true“.",
    code: "BigInteger x = new BigInteger(\"7\");\nBigInteger y = new BigInteger(\"7\");\nSystem.out.println(x [[0]] y);     // Identität\nSystem.out.println(x.[[1]](y));    // Inhalt\nBigInteger z = x;\nSystem.out.println(z [[2]] x);     // dieselbe Referenz?",
    gaps: [["=="], ["equals"], ["=="]] }
};

// ====================== KLA – Eigene Klassen programmieren ======================
READ["KLA-0"] = {
  read: [
    "Jetzt schreibst du eigene Baupläne. Das Beispiel im Kurs ist ein **Bankkonto** – aus dem Alltag bekannt, also kannst du dein Wissen über die Realität für Entwurfsentscheidungen nutzen. So eine Klasse könnte die Grundlage eines echten Bankprogramms sein.",
    "**Klasse anlegen:** `public class Konto { … }` in der Datei `Konto.java`. Klassennamen beginnen mit einem **Großbuchstaben** und sind ein **Substantiv in der Einzahl** (`Konto`, nicht `Konten`) – du hast es im Code immer mit einem Objekt auf einmal zu tun. Eine solche Klasse braucht **keine** main-Methode; die steht in einem separaten Hauptprogramm.",
    "**Paket:** Gehört die Klasse zu einem Paket, steht als **allererste Anweisung** `package bankprogramm;` – vor allen import-Anweisungen. Die Datei muss dann in einem Ordner liegen, der so heißt wie das Paket. Der qualifizierte Name lautet `bankprogramm.Konto`. Paketnamen beginnen klein; mehrteilige Namen werden mit Punkten getrennt.",
    "**Attribute** (auch Eigenschaften, Felder oder Instanzvariablen) speichern die Daten jedes Objekts: Welche Nummer hat das Konto, wem gehört es, wie hoch ist der Stand? Deklariert werden sie **in der Klasse, außerhalb aller Methoden**, mit einem javadoc-Kommentar zur Bedeutung:",
    { code: "package bankprogramm;\n\n/**\n * Ein Konto bei einer Bank.\n */\npublic class Konto {\n    /** die Kontonummer, eindeutig */\n    private long kontonummer;\n    /** der aktuelle Kontostand in Euro */\n    private double kontostand;\n    /** Name des Inhabers, nicht leer */\n    private String inhaber;\n}" },
    "Attributnamen beginnen klein. Guter Stil: oben die Attribute, darunter Konstruktoren und Methoden.",
    "**Impliziter Defaultkonstruktor:** Schon jetzt kannst du `new Konto()` schreiben. Hat eine Klasse keinen eigenen Konstruktor, stellt Java einen bereit. Er reserviert Speicher und setzt alle Attribute auf Standardwerte: **0** (ganzzahlig), **0.0** (Fließkomma), **false** (boolean), **null** (Klassentypen). Anders als lokale Variablen haben Attribute also immer einen Wert."
  ],
  pit: ["package muss die erste Zeile sein.", "Attribute innerhalb einer Methode deklariert sind keine Attribute, sondern lokale Variablen.", "String-Attribute starten mit null, nicht mit \"\"."],
  fill: { kind: "java", wrap: "class", t: "Ergänze Sichtbarkeit, Getter und den Konstruktoraufruf. Die Ausgabe zeigt die Standardwerte: „0.0 null“.",
    code: "public class Konto {\n    [[0]] long kontonummer;\n    private double kontostand;\n    private String inhaber;\n\n    public double getKontostand() {\n        return this.kontostand;\n    }\n\n    public String getInhaber() {\n        return this.[[1]];\n    }\n}",
    run: "Konto k = new [[2]]();   // impliziter Defaultkonstruktor\nSystem.out.println(k.getKontostand() + \" \" + k.getInhaber());",
    gaps: [["private"], ["inhaber"], ["Konto"]] }
};
READ["KLA-1"] = {
  read: [
    "`private`, `protected` und `public` heißen **Sichtbarkeitsmodifizierer**. Sie legen fest, wo im Code auf ein Element (Attribut, Methode, Konstruktor) zugegriffen werden darf:",
    { code: "public       überall im gesamten Programm\nprotected    im gleichen Paket und in allen erbenden Klassen\n(ohne)       im gleichen Paket (Default-Sichtbarkeit)\nprivate      ausschließlich in der eigenen Klasse" },
    "Die Default-Sichtbarkeit (Modifizierer weggelassen) gilt für jede Klasse im selben Verzeichnis. Dafür gibt es selten einen guten Grund – in der Praxis kommt sie kaum vor. `protected` wird in VRB wichtig.",
    "**Faustregel:** Attribute `private`, Methoden, die andere benutzen sollen, `public`. Das ist **Datenkapselung**: Niemand von außen kann den Zustand eines Objekts unkontrolliert ändern. Ein Kontostand lässt sich nicht einfach auf eine Million setzen – nur über Methoden wie `einzahlen`, die prüfen, ob der Betrag sinnvoll ist.",
    { code: "// in einer anderen Klasse:\nKonto k = new Konto();\nk.kontostand = 1000000;    // Compilerfehler: kontostand has private access\nk.einzahlen(50);           // erlaubt – und die Methode kann prüfen" },
    "Weiterer Vorteil: Die interne Darstellung kann sich später ändern (z. B. Kontostand in Cent als `long`), ohne dass Code außerhalb der Klasse angepasst werden muss – solange die öffentlichen Methoden gleich bleiben."
  ],
  pit: ["private gilt pro Klasse, nicht pro Objekt: Ein Konto-Objekt darf auf private Attribute eines anderen Konto-Objekts zugreifen.", "Ohne Modifizierer ≠ public."],
  fill: { kind: "text", t: "Ergänze die Sichtbarkeiten.", text: "private: nur in der [[0]] Klasse · ohne Modifizierer: im gleichen [[1]] · protected: im gleichen Paket und in allen [[2]] Klassen · public: [[3]]",
    gaps: [["eigenen"], ["Paket"], ["erbenden", "abgeleiteten"], ["überall", "überall im Programm"]] }
};
READ["KLA-2"] = {
  read: [
    "Private Attribute allein nützen wenig – man braucht Methoden, die sie lesen und schreiben. **Getter** liefern den Wert eines Attributs zurück: kein Parameter, Rückgabetyp = Typ des Attributs, Name `get` + Attributname (bei boolean auch `is…`).",
    "**Setter** schreiben einen neuen Wert: ein Parameter, Rückgabetyp `void`, Name `set` + Attributname. Ihr großer Vorteil: Sie können den Wert **prüfen**, bevor sie ihn übernehmen.",
    { code: "public String getInhaber() {\n    return this.inhaber;\n}\n\npublic void setInhaber(String inhaber) {\n    boolean inOrdnung = inhaber != null && !inhaber.equals(\"\");\n    if (inOrdnung) {\n        this.inhaber = inhaber;     // nur gültige Werte übernehmen\n    }\n}" },
    "**this** ist eine Referenz auf das aktuelle Objekt – das, auf dem die Methode gerade aufgerufen wurde. Heißt der Parameter wie das Attribut, unterscheidet `this.inhaber` (Attribut) von `inhaber` (Parameter). Ohne `this.` würdest du den Parameter sich selbst zuweisen – das Attribut bliebe unverändert.",
    "**Weitere Instanzmethoden** bilden die Operationen der realen Welt ab: `einzahlen(double betrag)`, `abheben(double betrag)`. Sie arbeiten über `this.attribut` mit den Daten des Objekts.",
    "**toString:** Alle Klassen erben von `Object` – auch deine. Damit haben sie automatisch eine Methode `toString()`, die eine Textdarstellung liefert, standardmäßig aber nur so etwas wie `Konto@1b6d3586`. Überschreibst du sie, liefert sie lesbaren Text mit den Attributwerten. `System.out.println(k)` ruft automatisch `k.toString()` auf, ebenso `\"Text\" + k`.",
    { code: "@Override\npublic String toString() {\n    return \"Konto \" + kontonummer + \" von \" + inhaber + \": \" + kontostand + \" Euro\";\n}" },
    "`@Override` zeigt dem Compiler an, dass du eine geerbte Methode überschreibst – vertippst du dich (`tostring`), meldet er einen Fehler."
  ],
  pit: ["`inhaber = inhaber;` im Setter ändert nichts – `this.inhaber = inhaber;`.", "toString gibt zurück (return), nicht aus (println).", "Getter mit void → kann nichts zurückgeben."],
  fill: { kind: "java", wrap: "class", t: "Ergänze Getter, Setter, einzahlen und toString. Ausgabe: „unbekannt: 50.0 Euro“ und „Otto“.",
    code: "public class Konto {\n    private String inhaber = \"unbekannt\";\n    private double kontostand;\n\n    public String getInhaber() {\n        [[0]] this.inhaber;\n    }\n\n    public void setInhaber(String inhaber) {\n        if (inhaber != null && !inhaber.equals(\"\")) {\n            [[1]].inhaber = inhaber;\n        }\n    }\n\n    public void einzahlen(double betrag) {\n        if (betrag > 0) {\n            this.kontostand [[2]] betrag;\n        }\n    }\n\n    @Override\n    public String [[3]]() {\n        return inhaber + \": \" + kontostand + \" Euro\";\n    }\n}",
    run: "Konto k = new Konto();\nk.setInhaber(\"\");      // ungültig, wird ignoriert\nk.einzahlen(50);\nk.einzahlen(-20);       // ungültig, wird ignoriert\nSystem.out.println(k);\nk.setInhaber(\"Otto\");\nSystem.out.println(k.getInhaber());",
    gaps: [["return"], ["this"], ["+="], ["toString"]] }
};
READ["KLA-3"] = {
  read: [
    "Konstruktoren haben zwei Aufgaben: **Speicher bereitstellen** (das macht die Laufzeitumgebung automatisch) und **alle Attribute mit sinnvollen Werten** belegen (das ist dein Job). Der implizite Defaultkonstruktor schafft das nicht – Kontonummer 0 und Inhaber null sind nicht sinnvoll.",
    "Ein Konstruktor **heißt exakt wie die Klasse** und hat **keinen Rückgabetyp** – auch nicht `void`. Er kann Parameter haben:",
    { code: "/**\n * Erstellt ein Konto für den angegebenen Inhaber mit Stand 0.\n * @param inhaber Name des Inhabers\n */\npublic Konto(String inhaber) {\n    this.inhaber = inhaber;\n    this.kontostand = 0.0;\n    this.kontonummer = Konto.holeNeueNummer();\n}" },
    "**Wichtig:** Sobald du selbst **irgendeinen** Konstruktor schreibst, gibt es den impliziten Defaultkonstruktor **nicht mehr**. Willst du `new Konto()` weiterhin erlauben, musst du einen parameterlosen Konstruktor selbst schreiben.",
    "**Überladen:** Wie Methoden kann es mehrere Konstruktoren mit verschiedenen Parameterlisten geben. Damit kein Code doppelt dasteht (Copy & Paste vermeiden!), ruft ein Konstruktor einen anderen mit **this(…)** auf. Das muss die **erste Anweisung** sein:",
    { code: "public Konto(String inhaber, double anfangsstand) {\n    // die eigentliche Arbeit steht nur hier\n}\n\npublic Konto(String inhaber) {\n    this(inhaber, 0.0);      // erste Anweisung!\n}\n\npublic Konto() {\n    this(\"unbekannt\");\n}" },
    "**Finale Attribute:** Eine Kontonummer ändert sich nie. Mit `private final long kontonummer;` bildest du das ab: Einem `final`-Attribut darf **genau einmal** ein Wert zugewiesen werden – entweder direkt bei der Deklaration oder im Konstruktor. Jeder Konstruktor muss es setzen, sonst meldet der Compiler einen Fehler. Und natürlich bekommt es keinen Setter."
  ],
  pit: ["`public void Konto()` ist kein Konstruktor, sondern eine Methode, die zufällig so heißt.", "Eigener Konstruktor → impliziter Defaultkonstruktor entfällt.", "`this(...)` nicht als erste Anweisung → Compilerfehler."],
  fill: { kind: "java", wrap: "class", t: "Ergänze das finale Attribut und den zweiten Konstruktor, der den ersten aufruft. Ausgabe: „1001 Hans 50.5“ und „1002 Otto 0.0“.",
    code: "public class Konto {\n    private [[0]] long kontonummer;\n    private String inhaber;\n    private double kontostand;\n\n    public Konto(long kontonummer, String inhaber, double kontostand) {\n        this.kontonummer = kontonummer;\n        this.inhaber = inhaber;\n        this.kontostand = kontostand;\n    }\n\n    public [[1]](long kontonummer, String inhaber) {\n        [[2]](kontonummer, inhaber, 0.0);\n    }\n\n    @Override\n    public String toString() {\n        return kontonummer + \" \" + inhaber + \" \" + kontostand;\n    }\n}",
    run: "System.out.println(new Konto(1001, \"Hans\", 50.5));\nSystem.out.println(new Konto(1002, \"Otto\"));",
    gaps: [["final"], ["Konto"], ["this"]] }
};
READ["KLA-4"] = {
  read: [
    "Woher bekommt jedes neue Konto eine **neue Kontonummer**? Man muss sich merken, welche Nummer zuletzt vergeben wurde – und zwar **nicht pro Konto**, sondern **einmal für das ganze Programm**.",
    "Genau dafür gibt es **statische Attribute** (Klassenvariablen): `private static long letzteNummer = 1000;` Ein statisches Attribut gehört zur **Klasse**, nicht zu einem Objekt. Es existiert genau einmal, egal wie viele Objekte es gibt – alle teilen sich diesen einen Wert.",
    "Eine **statische Methode** arbeitet mit diesem Wert:",
    { code: "private static long letzteNummer = 1000;\nprivate final long kontonummer;\n\nprivate static long holeNeueNummer() {\n    letzteNummer++;\n    return letzteNummer;\n}\n\npublic Konto() {\n    this.kontonummer = Konto.holeNeueNummer();   // 1001, 1002, 1003, …\n}" },
    "Statische Methoden haben **kein `this`** – sie laufen ohne Bezug zu einem bestimmten Objekt. Deshalb dürfen sie nicht direkt auf Instanzattribute oder Instanzmethoden zugreifen. Umgekehrt dürfen Instanzmethoden und Konstruktoren problemlos statische Attribute und Methoden benutzen.",
    "Aufruf von außen über den Klassennamen: `Konto.getAnzahl()`. Eine statische Methode kann `private` sein, wenn sie nur intern gebraucht wird – wie `holeNeueNummer` hier.",
    "Vergleiche: **Instanzattribut** = jedes Objekt hat sein eigenes (jedes Konto seinen Kontostand). **Statisches Attribut** = einmal für alle (die zuletzt vergebene Nummer)."
  ],
  pit: ["Statische Methode greift auf `this.kontostand` zu → Compilerfehler.", "Zähler als Instanzattribut → jedes Objekt zählt für sich, alle bekommen dieselbe Nummer."],
  fill: { kind: "java", wrap: "class", t: "Ergänze den Klassenzähler. Ausgabe: „1001 1002 1002“.",
    code: "public class Konto {\n    private [[0]] long letzteNummer = 1000;\n    private final long kontonummer;\n\n    public Konto() {\n        this.kontonummer = Konto.holeNeueNummer();\n    }\n\n    private static long holeNeueNummer() {\n        letzteNummer[[1]];\n        return letzteNummer;\n    }\n\n    public long getKontonummer() {\n        return kontonummer;\n    }\n\n    public [[2]] long getLetzteNummer() {\n        return letzteNummer;\n    }\n}",
    run: "Konto a = new Konto();\nKonto b = new Konto();\nSystem.out.println(a.getKontonummer() + \" \" + b.getKontonummer() + \" \" + Konto.getLetzteNummer());",
    gaps: [["static"], ["++", "+= 1"], ["static"]] }
};
READ["KLA-5"] = {
  read: [
    "Von `Konto` kann es beliebig viele Objekte geben. Manche Dinge haben aber eine **feste, abgeschlossene Menge** von Möglichkeiten: Es gibt genau zwölf Monate, ein dreizehnter ergibt keinen Sinn. Dafür gibt es **Enums**: spezielle Klassen mit einer abgeschlossenen Sammlung **konstanter Objekte**.",
    "Die Standardbibliothek hat z. B. `java.time.Month` mit `JANUARY` bis `DECEMBER`. Benutzt werden die Konstanten über den Enum-Namen: `Month m = Month.MARCH;`",
    "**Eigene Enum:** Sinnvoll, wenn es eine nicht allzu große Sammlung fester Objekte gibt, die sich voraussichtlich nicht ändert – im Kurs die fünf Währungen mit festem Euro-Wechselkurs. Ganz vorne steht die **Konstantenliste**, durch Kommas getrennt, abgeschlossen mit **Semikolon**. Erst **danach** dürfen Attribute, Konstruktoren und Methoden folgen:",
    { code: "public enum Waehrung {\n    KAP_VERDE_ESCUDO(0.00907), DOBRA(0.0408), CFA_FRANC(0.00152);  // Kurse gerundet\n\n    private final double wechselkurs;\n\n    Waehrung(double wechselkurs) {       // Konstruktor – immer private\n        this.wechselkurs = wechselkurs;\n    }\n\n    public double inEuroUmrechnen(double betrag) {\n        return Math.round(betrag * this.wechselkurs * 100.0) / 100.0;\n    }\n}" },
    "Der Konstruktor einer Enum ist immer **private** (auch ohne Angabe) – niemand außer der Enum selbst kann neue Konstanten erzeugen. Die Werte in Klammern hinter den Konstanten sind die Konstruktor-Argumente. Attribute einer Enum sind meist `final`.",
    "**Automatisch vorhandene Methoden:** `name()` (Name der Konstante als String), `toString()` (standardmäßig ebenfalls der Name), `ordinal()` (Position ab 0) und die statischen Methoden `values()` (Array aller Konstanten) und `valueOf(String)` (Konstante zum Namen – wirft eine `IllegalArgumentException`, wenn der Name nicht exakt passt, auch bei falscher Groß-/Kleinschreibung).",
    "Enums arbeiten gut mit anderen Klassen zusammen: Eine überladene Methode `abheben(double betrag, Waehrung w)` im Konto kann die Umrechnung an die Währung delegieren. Jede Klasse kümmert sich um ihre eigene Aufgabe."
  ],
  pit: ["Semikolon nach der Konstantenliste vergessen, wenn danach noch etwas kommt.", "`valueOf(\"dobra\")` → IllegalArgumentException (Groß-/Kleinschreibung!).", "`new Waehrung(...)` ist verboten."],
  fill: { kind: "java", wrap: "class", t: "Ergänze die Enum und die Nutzung. Ausgabe: „DOBRA 1 40.8“ und „2“.",
    code: "public enum Waehrung {\n    KAP_VERDE_ESCUDO(0.00907), DOBRA(0.0408)[[0]]\n\n    private final double wechselkurs;\n\n    [[1]](double wechselkurs) {\n        this.wechselkurs = wechselkurs;\n    }\n\n    public double inEuroUmrechnen(double betrag) {\n        return Math.round(betrag * this.wechselkurs * 100.0) / 100.0;\n    }\n}",
    run: "Waehrung w = Waehrung.[[2]](\"DOBRA\");\nSystem.out.println(w + \" \" + w.ordinal() + \" \" + w.inEuroUmrechnen(1000));\nSystem.out.println(Waehrung.[[3]]().length);",
    gaps: [[";"], ["Waehrung", "private Waehrung"], ["valueOf"], ["values"]] }
};
