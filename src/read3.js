// nibble – Lesetexte, Stolperfallen und Lückencode, Teil 3 (VER, ITR, VRB, EXC, ARR, ZKT)
var READ = READ || {};

// ====================== VER – Einfach- und Mehrfachverzweigungen ======================
READ["VER-0"] = {
  read: [
    "Bisher liefen deine Programme **linear**: Anweisung für Anweisung von oben nach unten. Das heißt **Sequenz**: Zu jedem Zeitpunkt läuft genau eine Anweisung, jede genau einmal, in der aufgeschriebenen Reihenfolge. Ein Methodenaufruf zählt dabei als eine Anweisung.",
    "Oft soll etwas aber nur **unter einer Bedingung** passieren – abheben nur, wenn genug Geld da ist. Dafür gibt es **Kontrollstrukturen**: Sequenz, **Selektion** (Verzweigung) und **Iteration** (Schleife). Java kennt zwei Verzweigungen: `if` und `switch`.",
    "Das Kursbeispiel ist ein **Blumenladen**: Der Kunde gibt die Anzahl Blumen ein (2,50 € pro Stück), das Programm berechnet den Gesamtbetrag – aber nur bei einer positiven Anzahl.",
    { code: "if (anzahl > 0) {\n    double gesamt = umDieEcke.gesamtbetrag(anzahl);\n    System.out.println(\"Die Blumen kosten \" + gesamt + \" Euro\");\n} else {\n    System.out.println(\"Bitte eine positive Anzahl eingeben\");\n}" },
    "**Unvollständige Alternative:** nur `if` – ist die Bedingung falsch, passiert nichts. **Vollständige Alternative:** `if` + `else` (ansonsten) – genau einer der beiden Blöcke läuft.",
    "Die **Bedingung** in den runden Klammern muss vom Typ `boolean` sein: ein Vergleich, eine boolesche Variable oder ein Methodenaufruf, der boolean liefert (`if (konto.kannAbheben(50))`). Statt `if (inOrdnung == true)` reicht `if (inOrdnung)`.",
    "Besteht ein Block aus nur **einer** Anweisung, dürfen die geschweiften Klammern entfallen. Besser trotzdem setzen – sonst passiert schnell das hier:",
    { code: "if (anzahl > 0)\n    System.out.println(\"ok\");\n    gesamt = anzahl * 2.5;   // gehört NICHT mehr zum if – läuft immer!" }
  ],
  pit: ["`if (x = 5)` – Zuweisung statt Vergleich.", "Semikolon direkt nach `if (...)` beendet das if: `if (x > 0);` macht nichts.", "Einrückung bestimmt nicht, was zum Block gehört – nur die Klammern."],
  fill: { kind: "java", wrap: "main", t: "Ergänze Bedingung und Alternative. Ausgabe: „Die Blumen kosten 32.5 Euro“.",
    code: "int anzahl = 13;\ndouble preis = 2.5;\nif ([[0]]) {\n    System.out.println(\"Die Blumen kosten \" + anzahl * preis + \" Euro\");\n} [[1]] {\n    System.out.println(\"Bitte eine positive Anzahl eingeben\");\n}",
    gaps: [["anzahl > 0", "anzahl >= 1", "0 < anzahl"], ["else"]] }
};
READ["VER-1"] = {
  read: [
    "**Mehrere Bedingungen** verknüpfst du mit den logischen Operatoren aus VAR. Im Blumenladen sollen nicht zu viele Blumen auf einmal verkauft werden: `if (anzahl > 0 && anzahl < 100)`.",
    "**Verschachtelung:** In den Blöcken hinter `if` und `else` darf jede Anweisung stehen – auch weitere `if`s. Der abergläubische Blumenhändler schenkt bei genau 13 Blumen eine 14. dazu – aber nur, wenn die Anzahl überhaupt gültig ist:",
    { code: "if (anzahl > 0 && anzahl < 100) {\n    if (anzahl == 13) {\n        anzahl = 14;      // eine Blume gratis\n    }\n    gesamt = umDieEcke.gesamtbetrag(anzahl);\n}" },
    "Ein `else` gehört immer zum **nächstgelegenen vorangehenden** `if`, das noch kein `else` hat – egal wie eingerückt ist. Mit geschweiften Klammern bist du auf der sicheren Seite.",
    "**if – else if – else:** Für mehrere sich ausschließende Fälle. Die Bedingungen werden **von oben nach unten** geprüft, der **erste** zutreffende Zweig läuft, alle anderen werden übersprungen. Rabatte im Blumenladen: bis 10 Blumen 0 %, bis 20 Blumen 2 %, bis 50 Blumen 3 %, sonst 5 %.",
    "**Der klassische Denkfehler** aus dem Kurs: mehrere *unabhängige* `if`s statt einer Kette. Dann werden bei 5 Blumen alle Bedingungen nacheinander geprüft – und die letzte zutreffende überschreibt die vorherigen:",
    { code: "// FALSCH – bei anzahl = 5 ist rabatt am Ende 0.03\nif (anzahl <= 10) { rabatt = 0; }\nif (anzahl <= 20) { rabatt = 0.02; }\nif (anzahl <= 50) { rabatt = 0.03; } else { rabatt = 0.05; }\n\n// RICHTIG\nif (anzahl <= 10) {\n    rabatt = 0;\n} else if (anzahl <= 20) {\n    rabatt = 0.02;\n} else if (anzahl <= 50) {\n    rabatt = 0.03;\n} else {\n    rabatt = 0.05;\n}" },
    "Weil in der Kette die vorherigen Bedingungen schon falsch waren, musst du sie nicht wiederholen: Im Zweig `anzahl <= 20` ist bereits klar, dass `anzahl > 10` gilt."
  ],
  pit: ["Mehrere unabhängige ifs statt else-if-Kette → die letzte gewinnt.", "Reihenfolge der Kette: von der engsten zur weitesten Bedingung (bei <=) bzw. umgekehrt bei >=.", "Grenzen genau lesen: „bis 10“ heißt <= 10."],
  fill: { kind: "java", wrap: "main", t: "Ergänze die Rabatt-Kette. Ausgabe: „0.0 0.02 0.03 0.05“.",
    pre: "static double rabatt(int anzahl) {\n    double rabatt;\n    if (anzahl <= 10) {\n        rabatt = 0;\n    } [[0]] (anzahl <= 20) {\n        rabatt = 0.02;\n    } else if (anzahl [[1]] 50) {\n        rabatt = 0.03;\n    } [[2]] {\n        rabatt = 0.05;\n    }\n    return rabatt;\n}\n",
    code: "System.out.println(rabatt(5) + \" \" + rabatt(15) + \" \" + rabatt(50) + \" \" + rabatt(80));",
    gaps: [["else if"], ["<="], ["else"]] }
};
READ["VER-2"] = {
  read: [
    "Die **Mehrfachverzweigung** `switch` wählt wie eine if-else-if-Kette einen von mehreren Zweigen aus. Der Unterschied: Es wird **keine komplexe Bedingung** ausgewertet, sondern nur der **Wert eines einzelnen Ausdrucks** mit festen Werten verglichen. Das macht den Code oft übersichtlicher.",
    "**Pfeil-Syntax** (seit Java 14):",
    { code: "switch (waehrung) {\n    case \"DKK\" -> kurs = 7.4604;\n    case \"CHF\", \"CHW\" -> {          // mehrere Werte mit Komma\n        kurs = berechneKurs(waehrung);\n        System.out.println(\"Kurs berechnet\");\n    }\n    default -> kurs = 1.0;            // kein Treffer\n}" },
    "Regeln: Der Ausdruck darf vom Typ `byte`, `short`, `int`, `char` (und deren Wrapper-Klassen), `String` oder eine **Enum** sein. Die Werte hinter `case` müssen **Konstanten** sein – keine Variablen oder Berechnungen – und dürfen nicht doppelt vorkommen. Mehrere Anweisungen kommen in einen Block `{ }`. `default` ist optional und greift, wenn kein case passt. Mit der Pfeil-Syntax läuft **nur** der passende Zweig.",
    "**Doppelpunkt-Syntax** (die ältere Form, in Klausuren beliebt): Hier springt die Ausführung zum passenden `case` und läuft dann **weiter in alle folgenden Fälle** (*fall-through*), bis ein `break` kommt oder der switch endet:",
    { code: "switch (x) {\n    case 1: System.out.print(\"A\");\n    case 2: System.out.print(\"B\"); break;\n    default: System.out.print(\"D\");\n}\n// x = 1 → AB    x = 2 → B    x = 7 → D" },
    "**switch als Ausdruck:** Mit Pfeil-Syntax kann ein switch auch direkt einen Wert liefern: `String name = switch (tag) { case 1 -> \"Montag\"; … default -> \"?\"; };` – Semikolon am Ende nicht vergessen.",
    "Wann was? `switch`, wenn eine Variable mit mehreren festen Werten verglichen wird (Menüauswahl, Währungscode, Wochentag). `if`, wenn Bereiche (`anzahl <= 20`) oder verknüpfte Bedingungen gebraucht werden."
  ],
  pit: ["Doppelpunkt-Syntax ohne break → fall-through in die nächsten Fälle.", "`long` ist im switch nicht erlaubt (mit Java 17 und 21 geprüft) – auch wenn es manchmal anders zu lesen ist.", "`case x:` mit einer Variablen x → Compilerfehler, nur Konstanten."],
  fill: { kind: "java", wrap: "main", t: "Ergänze beide switch-Varianten. Ausgabe: „SSH Web unbekannt“ und „AB B D“.",
    pre: "static String dienst(int port) {\n    String name;\n    [[0]] (port) {\n        case 22 -> name = \"SSH\";\n        case 80, 443 -> name = \"Web\";\n        [[1]] -> name = \"unbekannt\";\n    }\n    return name;\n}\n\nstatic String alt(int x) {\n    String s = \"\";\n    switch (x) {\n        case 1: s += \"A\";\n        case 2: s += \"B\"; [[2]];\n        default: s += \"D\";\n    }\n    return s;\n}\n",
    code: "System.out.println(dienst(22) + \" \" + dienst(443) + \" \" + dienst(3389));\nSystem.out.println(alt(1) + \" \" + alt(2) + \" \" + alt(3));",
    gaps: [["switch"], ["default"], ["break"]] }
};

// ====================== ITR – Iteration ======================
READ["ITR-0"] = {
  read: [
    "Mit **Schleifen** (Iterationen) werden Anweisungen kontrolliert wiederholt. Jede Schleife hat eine **Bedingung** und einen **Rumpf**: Solange die Bedingung wahr ist, läuft der Rumpf erneut. Java hat drei Arten: die **kopfgesteuerte** (`while`), die **fußgesteuerte** (`do-while`) und die **Zählschleife** (`for`).",
    "Die `while`-Schleife prüft die Bedingung **vor** jedem Durchlauf. Ist sie gleich zu Beginn falsch, läuft der Rumpf **kein einziges Mal** – man nennt sie deshalb auch **abweisend**.",
    "Kursbeispiel **Quersumme**: Die Summe aller Ziffern einer Zahl (65432 → 2 + 3 + 4 + 5 + 6 = 20). Wie viele Additionen nötig sind, hängt von der Zahl ab – das geht nur mit einer Schleife: *Solange noch eine Ziffer übrig ist, addiere sie.*",
    { code: "int n = 65432;\nint summe = 0;\nwhile (n > 0) {\n    summe += n % 10;   // letzte Ziffer addieren\n    n = n / 10;        // letzte Ziffer abschneiden\n}\n// summe = 20" },
    "Spiel den Ablauf auf Papier durch – genau das wird in der Klausur verlangt. Eine **Wertetabelle** hilft: pro Durchlauf eine Zeile mit allen Variablen.",
    { code: "Durchlauf   n       n % 10   summe\nvorher      65432            0\n1           6543    2        2\n2           654     3        5\n3           65      4        9\n4           6       5        14\n5           0       6        20   → n > 0 falsch, Ende" },
    "**Endlosschleife:** Wird die Bedingung durch einen Fehler nie falsch, läuft der Rumpf ewig – das Programm „hängt“. Typische Ursache: Die Variable aus der Bedingung wird im Rumpf nicht verändert, oder ein Semikolon direkt hinter `while (…)` macht eine leere Schleife daraus. Abbrechen mit Strg+C im Terminal."
  ],
  pit: ["`while (n > 0);` – das Semikolon ist der (leere) Rumpf → Endlosschleife.", "Ohne Klammern gehört nur die erste Anweisung zur Schleife.", "Summenvariable vor der Schleife auf 0 setzen."],
  fill: { kind: "java", wrap: "main", t: "Berechne die Quersumme von 65432. Ausgabe: „20“.",
    code: "int n = 65432;\nint summe = 0;\n[[0]] (n > 0) {\n    summe [[1]] n % 10;\n    n = n [[2]] 10;\n}\nSystem.out.println(summe);",
    gaps: [["while"], ["+="], ["/"]] }
};
READ["ITR-1"] = {
  read: [
    "Soll der Rumpf **mindestens einmal** laufen, kommt die Prüfung ans Ende: die **fußgesteuerte** (nachprüfende, nicht abweisende) Schleife.",
    { code: "do {\n    // zu wiederholende Anweisungen\n} while (Bedingung);     // Semikolon nicht vergessen!" },
    "Wann `while`, wann `do-while`? Manchmal ist es egal (die Zahlen 1 bis 10 ausgeben). Meistens entscheidet die Frage: **Muss der Rumpf mindestens einmal laufen?**",
    "Der typische Fall ist eine **Eingabe**: Erst muss gefragt werden, dann kann man prüfen, ob die Antwort gültig ist. Ebenso das Wiederholen eines ganzen Programms, gesteuert durch eine Benutzerantwort – dann musst du es nicht jedes Mal neu starten:",
    { code: "Scanner tastatur = new Scanner(System.in);\nint zahl;\ndo {\n    System.out.print(\"Positive Zahl: \");\n    zahl = tastatur.nextInt();\n} while (zahl <= 0);\n\nchar antwort;\ndo {\n    // ... Programm ...\n    System.out.print(\"Nochmal (j/n)? \");\n    antwort = tastatur.next().charAt(0);\n} while (antwort == 'j' || antwort == 'J');" },
    "**Schleifen und Verzweigungen kombinieren:** Im Rumpf einer Schleife dürfen Verzweigungen stehen und umgekehrt. Wichtig ist nur, dass jede Kontrollstruktur **komplett** innerhalb des umschließenden Blocks steht. Und: **Einrücken!** Anweisungen im Rumpf stehen weiter rechts als die umgebende Ebene. Je komplexer der Code, desto wichtiger – auch auf Papier.",
    "Jede Schleifenart lässt sich durch die anderen ersetzen – manchmal braucht man dafür aber zusätzliche Verzweigungen."
  ],
  pit: ["Semikolon nach `while (...)` bei do-while ist Pflicht.", "Eine Variable, die in der Bedingung steht, muss außerhalb des do-Blocks deklariert sein.", "Fortsetzen bei 'j' oder 'J': `||`, nicht `&&`."],
  fill: { kind: "java", wrap: "main", imports: ["java.util.Scanner"], t: "Lies so lange, bis eine positive Zahl kommt. (Der Scanner liest hier aus einem Text.) Ausgabe: drei Zeilen „gelesen: …“, dann „gültig: 42“.",
    code: "Scanner sc = new Scanner(\"-5 0 42\");\nint zahl;\n[[0]] {\n    zahl = sc.nextInt();\n    System.out.println(\"gelesen: \" + zahl);\n} while (zahl [[1]] 0)[[2]]\nSystem.out.println(\"gültig: \" + zahl);",
    gaps: [["do"], ["<="], [";"]] }
};
READ["ITR-2"] = {
  read: [
    "Viele Algorithmen haben einen **Zähler**: eine Variable, die sich bei jedem Durchlauf gleich verändert, meist um 1. Dafür ist die **Zählschleife** `for` gemacht – besonders geeignet, wenn die **Anzahl der Wiederholungen feststeht**.",
    { code: "for (int i = 1; i <= 10; i++) {\n    System.out.println(i);\n}" },
    "Der Kopf hat drei Teile, durch Semikolons getrennt:\n- **Initialisierung** (`int i = 1`) – läuft genau einmal zu Beginn\n- **Bedingung** (`i <= 10`) – wird **vor** jedem Durchlauf geprüft (die for-Schleife ist also vorprüfend)\n- **Aktualisierung** (`i++`) – läuft **nach** jedem Durchlauf",
    "**Äquivalenz zur while-Schleife:** Jede for-Schleife lässt sich direkt als while-Schleife schreiben. Einziger echter Unterschied: Eine im Kopf deklarierte Variable existiert nur innerhalb der Schleife.",
    { code: "int i = 1;                 // Initialisierung\nwhile (i <= 10) {          // Bedingung\n    System.out.println(i);\n    i++;                   // Aktualisierung\n}" },
    "**Verschachtelte Schleifen:** Für ein Quadrat aus n · n Sternchen läuft eine äußere Schleife über die Zeilen, eine innere über die Spalten. Die innere Schleife läuft **pro Durchlauf der äußeren komplett durch**. Hängt die Grenze der inneren von der äußeren ab (`spalte <= zeile`), entsteht ein Dreieck.",
    "**Optional:** Initialisierung und Aktualisierung dürfen mehrere Anweisungen enthalten, durch Komma getrennt: `for (int i = 1, potenz = 2; i <= 10; i++, potenz *= 2)` gibt die Zweierpotenzen bis 1024 aus."
  ],
  pit: ["Zählt man von 0 bis `< n` oder von 1 bis `<= n`? Beides n Durchläufe – nicht mischen.", "`for (int i = 0; i < 10; i++);` – Semikolon = leerer Rumpf.", "Im Kopf stehen Semikolons, keine Kommas zwischen den drei Teilen."],
  fill: { kind: "java", wrap: "main", t: "Zeichne ein Quadrat aus 3 · 3 Sternchen. Ausgabe: dreimal „***“.",
    pre: "static void quadrat(int n) {\n    for (int zeile = 1; zeile [[0]] n; zeile[[1]]) {\n        for (int spalte = 1; spalte <= n; spalte++) {\n            System.out.print(\"*\");\n        }\n        System.out.[[2]]();\n    }\n}\n",
    code: "quadrat(3);",
    gaps: [["<="], ["++", "+= 1"], ["println"]] }
};
READ["ITR-3"] = {
  read: [
    "Zwei einfache Anweisungen steuern Schleifen von innen:\n- `break` **beendet die umgebende Schleife vollständig** und springt hinter ihr Ende.\n- `continue` **beendet nur den aktuellen Durchlauf** – es springt zur schließenden Klammer des Rumpfs. Danach geht es normal weiter: Bei `for` läuft die Aktualisierung, dann wird die Bedingung erneut geprüft.",
    "Beide beziehen sich immer auf die **innerste** umgebende Schleife und stehen in der Regel in einer `if`-Anweisung.",
    "Kursbeispiel **Wurfparabel**: Die Höhe eines Wurfs wird für immer größere Weiten x berechnet. Rechnerisch würde die Formel irgendwann negative Höhen liefern – real ist der Ball dann am Boden. Also: Sobald h < 0, Schleife abbrechen.",
    { code: "for (double x = 0; x <= 100; x += 0.5) {\n    double h = berechneHoehe(x);\n    if (h < 0) {\n        break;               // Ball ist gelandet\n    }\n    zeichnePunkt(x, h);\n}" },
    "`continue` überspringt Fälle, die nicht verarbeitet werden sollen – zum Beispiel leere Zeilen beim Auswerten eines Logs:",
    { code: "for (int i = 1; i <= 10; i++) {\n    if (i % 3 == 0) {\n        continue;   // 3, 6, 9 überspringen\n    }\n    System.out.print(i + \" \");\n}\n// 1 2 4 5 7 8 10" },
    "Setze beide sparsam ein. Oft lässt sich die Schleifenbedingung so formulieren, dass man sie nicht braucht – das ist meist besser lesbar."
  ],
  pit: ["break in einer inneren Schleife beendet nur die innere.", "continue in einer while-Schleife: Aktualisierung vor dem continue erledigen, sonst Endlosschleife.", "break außerhalb einer Schleife oder eines switch → Compilerfehler."],
  fill: { kind: "java", wrap: "main", t: "Durch 3 teilbare Zahlen überspringen, ab 8 abbrechen. Ausgabe: „1 2 4 5 7 “.",
    code: "for (int i = 1; i <= 10; i++) {\n    if (i % 3 == 0) {\n        [[0]];\n    }\n    if (i > 7) {\n        [[1]];\n    }\n    System.out.print(i + \" \");\n}",
    gaps: [["continue"], ["break"]] }
};

// ====================== VRB – Vererbung und Polymorphie ======================
READ["VRB-0"] = {
  read: [
    "Programmierer wollen möglichst wenig doppelt schreiben. Die OOP bietet dafür **Vererbung** (*inheritance*): Eine Klasse A übernimmt **alle Attribute und Methoden** einer bestehenden Klasse B. Objekte von A dürfen dann überall stehen, wo ein B erwartet wird – eine **ist-ein-Beziehung**: Ein Girokonto *ist ein* Konto.",
    "Die vererbende Klasse heißt **Superklasse** (Oberklasse), die erbende **Subklasse** (Unterklasse). Zeichnet man die erbenden Klassen unter die vererbenden, entsteht eine **Klassenhierarchie**. Eine Klasse kann dabei gleichzeitig Sub- und Superklasse sein.",
    "Es gibt **Einfachvererbung** (eine direkte Superklasse) und **Mehrfachvererbung** (mehrere). Der Kurs nennt den studentischen Mitarbeiter, der eigentlich Student *und* Angestellter ist. **Java erlaubt nur Einfachvererbung** – jede Klasse hat genau eine direkte Superklasse.",
    "Die Syntax ist kurz: `extends` im Klassenkopf.",
    { code: "public class Girokonto extends Konto {\n    private double dispobetrag;          // zusätzliches Attribut\n\n    public double getDispobetrag() {     // zusätzliche Methode\n        return dispobetrag;\n    }\n}" },
    "Ein `Girokonto`-Objekt hat jetzt Kontonummer, Kontostand, `einzahlen()`, `abheben()` … aus `Konto` **plus** den Dispo. Zusätzliche Attribute und Methoden schreibst du ganz normal – die Syntax ändert sich nicht.",
    "**Object ist die Wurzel:** Schreibst du kein `extends`, ergänzt der Compiler intern `extends Object`. Jede Java-Klasse erbt also direkt oder indirekt von `java.lang.Object` – daher kommen Methoden wie `toString()` und `equals()`, die jedes Objekt hat.",
    "Vererbt werden die **nicht-statischen** Attribute und Methoden. `private` Attribute sind zwar im Objekt vorhanden, aber die Subklasse kann **nicht direkt** darauf zugreifen – nur über Getter/Setter (oder `protected`, siehe nächster Abschnitt)."
  ],
  pit: ["`class A extends B, C` → Compilerfehler, nur eine Superklasse.", "Richtung beachten: Ein Girokonto ist ein Konto – nicht umgekehrt.", "Private Attribute der Superklasse sind in der Subklasse nicht direkt sichtbar."],
  fill: { kind: "java", wrap: "class", t: "Lass Girokonto von Konto erben. Ausgabe: „150.0 / 500.0“.",
    pre: "class Konto {\n    private double kontostand;\n    public void einzahlen(double betrag) { kontostand += betrag; }\n    public double getKontostand() { return kontostand; }\n}\n",
    code: "class Girokonto [[0]] [[1]] {\n    private double dispobetrag = 500;\n    public double getDispobetrag() { return dispobetrag; }\n}\n",
    run: "Girokonto g = new Girokonto();\ng.einzahlen(150);\nSystem.out.println(g.getKontostand() + \" / \" + g.getDispobetrag());",
    gaps: [["extends"], ["Konto"]] }
};
READ["VRB-1"] = {
  read: [
    "Das neue Attribut `dispobetrag` braucht einen Startwert – dafür sind **Konstruktoren** da. Aber: **Konstruktoren werden in Java nicht vererbt.** Jede Klasse schreibt ihre eigenen und kümmert sich dabei vor allem um ihre **eigenen** Attribute.",
    "Die geerbten Attribute initialisiert weiterhin die Superklasse. Ihren Konstruktor rufst du mit `super(...)` auf – und zwar als **allererste Anweisung**:",
    { code: "public Girokonto(String inhaber, double dispo) {\n    super(inhaber);              // Konstruktor von Konto\n    this.dispobetrag = dispo;    // eigenes Attribut\n}" },
    "Fehlt der `super`-Aufruf, fügt der Compiler automatisch `super()` **ohne Parameter** ein. Hat die Superklasse keinen parameterlosen Konstruktor, gibt es dann einen Compilerfehler.",
    "Zur Erinnerung aus KLA: `this(...)` ruft einen **anderen Konstruktor derselben Klasse** auf – ebenfalls nur als erste Anweisung. `super(...)` und `this(...)` zusammen in einem Konstruktor geht deshalb nicht.",
    "**protected:** Für `ueberweisen()` möchte Girokonto direkt auf `kontostand` zugreifen – das ist aber `private` in Konto. Die Lösung ist der Sichtbarkeitsmodifizierer `protected`: Das Element ist dann **in Subklassen** (und im selben Paket) sichtbar, für alle anderen Klassen aber weiter verborgen.",
    { code: "Sichtbarkeit   eigene Klasse   Paket   Subklasse   überall\nprivate        ja              nein    nein        nein\n(ohne)         ja              ja      nein*       nein\nprotected      ja              ja      ja          nein\npublic         ja              ja      ja          ja\n* außer die Subklasse liegt im selben Paket" },
    "Oft ist ein **protected Setter** eleganter als ein protected Attribut: Die Superklasse behält die Kontrolle darüber, wie der Wert geändert wird."
  ],
  pit: ["`super(...)` nicht als erste Anweisung → Compilerfehler.", "Superklasse ohne Standardkonstruktor und kein expliziter super-Aufruf → Compilerfehler.", "protected ist mehr als „nur Subklasse“: Das ganze Paket sieht es auch."],
  fill: { kind: "java", wrap: "class", t: "Ergänze den Konstruktor-Aufruf der Superklasse und die Sichtbarkeit. Ausgabe: „Alex 500.0 -200.0“.",
    pre: "class Konto {\n    private String inhaber;\n    [[0]] double kontostand;\n    public Konto(String inhaber) { this.inhaber = inhaber; }\n    public String getInhaber() { return inhaber; }\n}\n",
    code: "class Girokonto extends Konto {\n    private double dispobetrag;\n    public Girokonto(String inhaber, double dispo) {\n        [[1]](inhaber);\n        this.dispobetrag = dispo;\n    }\n    public void belasten(double betrag) {\n        this.kontostand -= betrag;   // direkter Zugriff\n    }\n    public double getDispobetrag() { return dispobetrag; }\n}\n",
    run: "Girokonto g = new Girokonto(\"Alex\", 500);\ng.belasten(200);\nSystem.out.println(g.getInhaber() + \" \" + g.getDispobetrag() + \" \" + g.kontostand);",
    gaps: [["protected"], ["super"]] }
};
READ["VRB-2"] = {
  read: [
    "Ein Girokonto darf überzogen werden – das geerbte `abheben()` passt also nicht. Lösung: Die Methode in der Subklasse **überschreiben** (*override*), also mit **gleicher Signatur** neu schreiben. Die Annotation `@Override` lässt den Compiler prüfen, dass es wirklich eine geerbte Methode gibt – ein Tippfehler im Namen fällt sofort auf.",
    { code: "public class Girokonto extends Konto {\n    @Override\n    public boolean abheben(double betrag) {\n        boolean gedeckt = getKontostand() + dispobetrag >= betrag;\n        if (betrag > 0 && gedeckt) {\n            setKontostand(getKontostand() - betrag);\n            return true;\n        }\n        return false;\n    }\n}" },
    "**Überschreiben ≠ Überladen:** Überladen = gleicher Name, **andere Parameterliste**, beide Methoden existieren nebeneinander. Überschreiben = **gleiche Signatur** in der Subklasse, die alte Implementierung wird für Objekte der Subklasse **ersetzt**. Die Sichtbarkeit darf beim Überschreiben nicht eingeschränkt werden (aus public wird nicht private).",
    "Mit `super.methode()` kannst du in der überschreibenden Methode die Version der Superklasse trotzdem aufrufen – praktisch, wenn du sie nur ergänzen willst, z. B. bei `toString()`.",
    "**Zuweisungskompatibilität:** Weil ein Girokonto ein Konto ist, darf eine Variable vom Typ `Konto` ein `Girokonto`-Objekt speichern: `Konto k = new Girokonto(\"Alex\", 500);`",
    "**Polymorphie** (Vielgestaltigkeit): Wird jetzt `k.abheben(100)` aufgerufen, entscheidet **das Objekt** zur Laufzeit, welche Implementierung läuft – nicht der Typ der Variablen. Ein Girokonto-Objekt führt die Girokonto-Version aus, ein Sparbuch die Sparbuch-Version. Das gilt auch für Aufrufe **innerhalb** der Klasse über `this`: Ruft `toString()` in Konto `this.getBezeichnung()` auf, läuft bei einem Girokonto dessen überschriebene `getBezeichnung()`.",
    "Merkregel für die Klausur: **Der Variablentyp bestimmt, *welche* Methoden aufrufbar sind (Compiler). Das Objekt bestimmt, *welche Implementierung* läuft (Laufzeit).**"
  ],
  pit: ["Andere Parameterliste = Überladen, nicht Überschreiben – @Override meldet dann einen Fehler.", "Variable vom Typ Konto mit Girokonto-Objekt → trotzdem läuft die Girokonto-Methode.", "static-Methoden werden nicht polymorph aufgerufen."],
  fill: { kind: "java", wrap: "class", t: "Überschreibe getBezeichnung. Ausgabe: „Allgemeines Konto“ und „Girokonto“.",
    pre: "class Konto {\n    public String getBezeichnung() { return \"Allgemeines Konto\"; }\n    @Override\n    public String toString() { return this.getBezeichnung(); }\n}\n",
    code: "class Girokonto extends Konto {\n    [[0]]\n    public String [[1]]() {\n        return \"Girokonto\";\n    }\n}\n",
    run: "Konto a = new Konto();\n[[2]] b = new Girokonto();   // Variablentyp: Superklasse\nSystem.out.println(a);\nSystem.out.println(b);",
    gaps: [["@Override"], ["getBezeichnung"], ["Konto", "Object"]] }
};
READ["VRB-3"] = {
  read: [
    "Steht ein Girokonto in einer Variablen vom Typ `Konto`, kann man abheben, einzahlen, den Kontostand abfragen – aber **nicht überweisen**. Der Compiler verweigert `einKonto.ueberweisen(…)`, denn er kennt nur den **Variablentyp** `Konto`, und der hat keine solche Methode. Was zur Laufzeit wirklich drinsteht, weiß er nicht.",
    "Die Lösung ist ein **expliziter Cast** (Typumwandlung) in die Subklasse – wie bei primitiven Typen mit dem Zieltyp in Klammern:",
    { code: "Girokonto giro = (Girokonto) einKonto;\ngiro.ueberweisen(50, ziel);\n\n// oder direkt – Klammern beachten:\n((Girokonto) einKonto).ueberweisen(50, ziel);" },
    "Ein Cast ändert **nicht das Objekt**, sondern nur, als was der Compiler es betrachtet. Steckt in der Variablen in Wahrheit ein `Sparbuch`, schlägt der Cast zur Laufzeit fehl: **ClassCastException**.",
    "Deshalb vorher mit `instanceof` prüfen. Der Operator liefert `true`, wenn das Objekt zur angegebenen Klasse **oder einer ihrer Subklassen** gehört:",
    { code: "if (einKonto instanceof Girokonto) {\n    Girokonto giro = (Girokonto) einKonto;\n    giro.ueberweisen(50, ziel);\n} else {\n    System.out.println(\"Überweisen nur mit Girokonto\");\n}" },
    "Die umgekehrte Richtung – Subklasse in eine Superklassen-Variable – braucht **keinen** Cast (impliziter Upcast), siehe Zuweisungskompatibilität.",
    "Hinweis: Seit Java 16 gibt es die Kurzform `if (einKonto instanceof Girokonto giro)`, die Prüfen und Casten verbindet. Die ausführliche Form oben funktioniert überall und ist auf Papier eindeutiger."
  ],
  pit: ["`(Girokonto) k.ueberweisen(...)` castet das Ergebnis, nicht k – Klammern setzen!", "instanceof ist auch für Subklassen true (ein Girokonto ist instanceof Konto).", "Cast ohne Prüfung → ClassCastException zur Laufzeit, nicht beim Compilieren."],
  fill: { kind: "java", wrap: "class", t: "Prüfe den Typ und caste. Ausgabe: „Dispo 500.0“ und „kein Girokonto“.",
    pre: "class Konto { }\nclass Sparbuch extends Konto { }\nclass Girokonto extends Konto {\n    public double getDispo() { return 500; }\n}\n",
    code: "class Bank {\n    static void zeigeDispo(Konto k) {\n        if (k [[0]] Girokonto) {\n            Girokonto g = ([[1]]) k;\n            System.out.println(\"Dispo \" + g.getDispo());\n        } else {\n            System.out.println(\"kein Girokonto\");\n        }\n    }\n}\n",
    run: "Bank.zeigeDispo(new Girokonto());\nBank.zeigeDispo(new Sparbuch());",
    gaps: [["instanceof"], ["Girokonto"]] }
};
READ["VRB-4"] = {
  read: [
    "Je weiter oben in der Hierarchie, desto allgemeiner werden die Klassen. Ein „allgemeines Konto“ gibt es in der Realität eigentlich nicht – bei der Bank musst du dich für eine **Kontoart** entscheiden. Im Programm soll `new Konto()` also gar nicht möglich sein.",
    "Dafür kennzeichnest du die Klasse mit `abstract`. Von einer **abstrakten Klasse** lassen sich **keine Objekte** erzeugen; sie ist zum Erben da. Variablen vom Typ `Konto` sind aber weiterhin erlaubt – sie speichern eben Objekte der Subklassen.",
    "Eine **abstrakte Methode** hat **keinen Rumpf** – nur den Kopf mit Semikolon. Jede **konkrete** (nicht abstrakte) Subklasse **muss** sie überschreiben. Enthält eine Klasse mindestens eine abstrakte Methode, muss die Klasse selbst abstrakt sein.",
    { code: "public abstract class Konto {\n    // normale Attribute, Konstruktoren und Methoden sind erlaubt\n    public abstract String getBezeichnung();   // kein Rumpf!\n}\n\npublic class Sparbuch extends Konto {\n    @Override\n    public String getBezeichnung() {\n        return \"Sparbuch\";\n    }\n}" },
    "So erzwingt die Superklasse, dass jede Kontoart eine Bezeichnung liefert – und `toString()` in Konto kann sie schon aufrufen, obwohl Konto selbst keine Implementierung hat (Polymorphie).",
    "**final** ist das Gegenstück: Eine `final`-**Klasse** kann **nicht beerbt** werden – Beispiele aus der API: `String`, `Math`, `System`, `Integer`, `Double`. So kann niemand ihr Verhalten durch Überschreiben verändern. Eine `final`-**Methode** kann nicht überschrieben werden, die Klasse selbst darf aber Subklassen haben.",
    "Zur Erinnerung: Ein `final`-**Attribut** oder eine `final`-**Variable** ist eine Konstante – nur einmal zuweisbar. Dasselbe Schlüsselwort, drei Bedeutungen.",
    "`abstract` und `final` zusammen an einer Klasse oder Methode ergeben keinen Sinn und sind verboten."
  ],
  pit: ["`new Konto()` bei abstrakter Klasse → Compilerfehler.", "Abstrakte Methode mit `{ }` → Compilerfehler, sie endet mit `;`.", "Konkrete Subklasse vergisst eine abstrakte Methode → Compilerfehler."],
  fill: { kind: "java", wrap: "class", t: "Mach Konto abstrakt, deklariere die abstrakte Methode und verhindere, dass jemand von Sparbuch erbt. Ausgabe: „Sparbuch: 100.0“.",
    pre: "[[0]] class Konto {\n    protected double kontostand = 100;\n    public [[1]] String getBezeichnung()[[2]]\n    @Override\n    public String toString() { return getBezeichnung() + \": \" + kontostand; }\n}\n",
    code: "[[3]] class Sparbuch extends Konto {\n    @Override\n    public String getBezeichnung() { return \"Sparbuch\"; }\n}\n",
    run: "Konto k = new Sparbuch();\nSystem.out.println(k);",
    gaps: [["abstract"], ["abstract"], [";"], ["final"]] }
};

// ====================== EXC – Ausnahmebehandlung ======================
READ["EXC-0"] = {
  read: [
    "Eine **Exception** (Ausnahme) ist ein abnormales Ereignis, das die normale Ausführung eines Programms unterbricht. Ursachen gibt es viele: Buchstaben statt einer Zahl eingegeben, Division durch 0 bei ganzen Zahlen, eine Datei existiert nicht, ein Cast schlägt fehl, ein Parameter hat einen unsinnigen Wert. Was genau als Ausnahme gilt, legt der Programmierer einer Methode fest.",
    "Tritt eine Ausnahme auf, wird ein **Exception-Objekt** erzeugt, das Informationen über den Fehler enthält, und **geworfen**. Die laufende Methode bricht **sofort** ab.",
    "**Der Aufruf-Stack:** Jede aufgerufene Methode wird oben auf einen Stapel gelegt; ist sie fertig, wird sie wieder entfernt. `main` liegt ganz unten. Wird eine Exception geworfen und nicht behandelt, wandert sie den Stack **hinunter zum Aufrufer**, dann zu dessen Aufrufer … bis zu `main`. Fängt sie auch dort niemand, bricht das Programm mit einem **Stacktrace** ab:",
    { code: "Exception in thread \"main\" java.util.InputMismatchException\n    at java.base/java.util.Scanner.nextInt(Scanner.java:2217)\n    at EinAusgabe.eingabeGanzeZahl(EinAusgabe.java:85)\n    at Summe.main(Summe.java:15)" },
    "Lies den Stacktrace **von oben nach unten**: Oben steht die Exception-Klasse, darunter die Methode, in der sie entstand, ganz unten `main`. Die erste Zeile mit **deiner eigenen Klasse** ist meist die interessante.",
    "**Behandeln mit try-catch:** Code, der eine Exception werfen kann, kommt in den `try`-Block. Tritt die Exception auf, springt die Ausführung **sofort** in den passenden `catch`-Block; der Rest des try-Blocks wird übersprungen. Danach läuft das Programm **hinter** try-catch normal weiter.",
    { code: "try {\n    int zahl = Integer.parseInt(eingabe);\n    System.out.println(\"Doppelt: \" + 2 * zahl);\n} catch (NumberFormatException e) {\n    System.out.println(\"Keine Zahl: \" + e.getMessage());\n}" },
    "Mehrere Exception-Arten fängst du mit mehreren catch-Blöcken oder mit `|` in einem: `catch (NumberFormatException | ArithmeticException e)`. Den Namen (`e`, `ex`) wählst du frei.",
    "**finally** (optional): Ein dritter Block, der **in jedem Fall** läuft – ob eine Exception auftrat oder nicht, sogar wenn im try ein `return` steht. Typisch zum Aufräumen, etwa zum Schließen einer Datei."
  ],
  pit: ["Nach dem catch geht es hinter try-catch weiter – nicht zurück in den try-Block.", "Ein catch für eine Superklasse (Exception) vor einem für eine Subklasse → Compilerfehler (unerreichbar).", "Leerer catch-Block verschluckt Fehler unsichtbar."],
  fill: { kind: "java", wrap: "main", t: "Fange die fehlerhafte Umwandlung ab. Ausgabe: „21“, „Keine Zahl: abc“, „fertig“.",
    code: "String[] eingaben = {\"21\", \"abc\"};\nfor (String s : eingaben) {\n    [[0]] {\n        int zahl = Integer.parseInt(s);\n        System.out.println(zahl);\n    } [[1]] (NumberFormatException e) {\n        System.out.println(\"Keine Zahl: \" + s);\n    }\n}\nSystem.out.println(\"fertig\");",
    gaps: [["try"], ["catch"]] }
};
READ["EXC-1"] = {
  read: [
    "Nicht jede Methode kann einen Fehler sinnvoll behandeln. Dann gibt sie die Exception an ihren Aufrufer weiter – das passiert ohnehin automatisch. Um es deutlich zu machen, nennt man die Exception mit **throws** im Methodenkopf und beschreibt sie mit **@throws** im javadoc:",
    { code: "/**\n * rechnet x hoch y aus\n * @param x Basis\n * @param y Exponent, nicht negativ\n * @return x hoch y\n * @throws IllegalArgumentException wenn y negativ ist\n */\npublic static double positivPotenzieren(double x, int y)\n        throws IllegalArgumentException {\n    if (y < 0) {\n        throw new IllegalArgumentException(\"Exponent negativ: \" + y);\n    }\n    double ergebnis = 1;\n    for (int i = 1; i <= y; i++) {\n        ergebnis = ergebnis * x;\n    }\n    return ergebnis;\n}" },
    "Mehrere Exceptions hinter `throws` werden durch **Komma** getrennt, im javadoc steht dann pro Exception ein `@throws`.",
    "**Selbst auslösen mit throw:** Wenn du eine Methode entwirfst, gibt es oft Situationen, in denen sie ihre Aufgabe nicht korrekt erfüllen kann – etwa ein negativer Exponent. Dann erzeugst du ein Exception-Objekt mit `new` und wirfst es mit `throw`. Die Methode endet sofort, `return` wird nicht erreicht.",
    "Für **logisch falsche Parameterwerte** ist die `IllegalArgumentException` gedacht. Gib im Konstruktor eine aussagekräftige Meldung mit – sie ist später über `getMessage()` abrufbar.",
    "**Achtung Verwechslungsgefahr:** `throws` (mit s) steht im **Methodenkopf** und kündigt an. `throw` (ohne s) steht im **Rumpf** und wirft tatsächlich.",
    "**Behandeln oder weitergeben?** Eine grobe Faustregel aus dem Kurs: Exceptions **möglichst früh** behandeln – also dort, wo eine sinnvolle Reaktion möglich ist (z. B. die Eingabe wiederholen). Und: Entweder behandeln **oder** weitergeben. Fängst du einen Exception-Typ mit try-catch, gehört er **nicht** zusätzlich in `throws` und `@throws`."
  ],
  pit: ["`throw IllegalArgumentException(...)` ohne `new` → Compilerfehler.", "throws/throw verwechselt.", "Exception fangen und gleichzeitig mit throws ankündigen – im Kurs nicht vorgesehen."],
  fill: { kind: "java", wrap: "main", t: "Wirf bei negativem Exponenten eine Exception. Ausgabe: „8.0“ und „Fehler: Exponent negativ“.",
    pre: "static double potenz(double x, int y) [[0]] IllegalArgumentException {\n    if (y < 0) {\n        [[1]] [[2]] IllegalArgumentException(\"Exponent negativ\");\n    }\n    double ergebnis = 1;\n    for (int i = 1; i <= y; i++) {\n        ergebnis *= x;\n    }\n    return ergebnis;\n}\n",
    code: "System.out.println(potenz(2, 3));\ntry {\n    System.out.println(potenz(2, -1));\n} catch (IllegalArgumentException e) {\n    System.out.println(\"Fehler: \" + e.[[3]]());\n}",
    gaps: [["throws"], ["throw"], ["new"], ["getMessage"]] }
};
READ["EXC-2"] = {
  read: [
    "Exceptions sind Objekte – und ihre Klassen bilden eine **Hierarchie** (Vererbung!). Ein Ausschnitt:",
    { code: "Object\n └─ Throwable                  alles, was geworfen werden kann\n     ├─ Error                   schwere JVM-Fehler (z. B. OutOfMemoryError)\n     └─ Exception               behandelbare Ausnahmen\n         ├─ IOException         (checked)\n         │   └─ FileNotFoundException\n         └─ RuntimeException    (unchecked)\n             ├─ ArithmeticException\n             ├─ NullPointerException\n             ├─ ClassCastException\n             ├─ IllegalArgumentException\n             │   └─ NumberFormatException\n             └─ IndexOutOfBoundsException\n                 └─ ArrayIndexOutOfBoundsException" },
    "`Throwable` ist die Oberklasse aller Ausnahme- und Fehlerobjekte; nur deren Instanzen kann die JVM werfen. `Error` steht für schwere Probleme, auf die ein Programm normalerweise nicht reagieren kann.",
    "**Checked Exceptions** erben von `Exception`, aber **nicht** von `RuntimeException` (z. B. `IOException`). Für sie gilt die **catch-or-specify-Regel**: Der Compiler **zwingt** dich, sie mit try-catch zu behandeln **oder** mit `throws` weiterzugeben. Sonst compiliert das Programm nicht.",
    "**Unchecked Exceptions** erben von `RuntimeException`. Sie entstehen meist durch Programmierfehler (null-Referenz, falscher Index, Division durch 0) und könnten fast überall auftreten. Der Compiler **stellt frei**, ob du sie behandelst – `throws` darf entfallen.",
    "Weil ein catch-Block auch **alle Subklassen** fängt, ist die **Reihenfolge** mehrerer catch-Blöcke wichtig: erst die speziellen, dann die allgemeinen. `catch (Exception e)` als erster Block würde alle folgenden unerreichbar machen – Compilerfehler.",
    "Für die Klausur: Kannst du zu einer Exception sagen, ob sie checked oder unchecked ist? Faustregel – steht `RuntimeException` in der Ahnenreihe, ist sie unchecked."
  ],
  pit: ["NumberFormatException ist unchecked (sie erbt über IllegalArgumentException von RuntimeException).", "Checked Exception weder gefangen noch mit throws deklariert → Compilerfehler „unreported exception“.", "catch(Exception) vor catch(IOException) → unerreichbarer Code."],
  fill: { kind: "java", wrap: "main", t: "Eine checked Exception muss angekündigt werden. Ordne außerdem die catch-Blöcke. Ausgabe: „speziell: x ist 0“ und „Ende“.",
    pre: "static void pruefe(int x) [[0]] Exception {\n    if (x == 0) {\n        throw new Exception(\"x ist 0\");\n    }\n}\n",
    code: "try {\n    pruefe(0);\n} catch ([[1]] e) {\n    System.out.println(\"speziell: \" + e.getMessage());\n} catch ([[2]] e) {\n    System.out.println(\"allgemein\");\n}\nSystem.out.println(\"Ende\");",
    gaps: [["throws"], ["Exception"], ["Throwable"]] }
};
READ["EXC-3"] = {
  read: [
    "Manchmal passt keine Exception der Standardbibliothek. Der Kurs nennt die Berechnung von 0⁰, die mathematisch nicht definiert ist. Eine `IllegalArgumentException` wäre unpassend, denn nicht **ein** Parameter ist falsch, sondern die **Kombination** zweier Werte. Also schreibt man eine **eigene Exception-Klasse**.",
    "Das ist überraschend einfach: Eine Klasse, die von `Exception` (checked) oder `RuntimeException` (unchecked) **erbt**. Wichtig ist vor allem ein **aussagekräftiger Name**, der auf **…Exception** endet. Einen Konstruktor mit Meldung reichst du per `super` weiter:",
    { code: "public class NullHochNullException extends Exception {\n    public NullHochNullException() {\n        super(\"0 hoch 0 ist nicht definiert\");\n    }\n}\n\n// Verwendung\nif (x == 0 && y == 0) {\n    throw new NullHochNullException();\n}" },
    "So kann der Aufrufer auf verschiedene Fehler **unterschiedlich reagieren**, obwohl sie aus demselben Methodenaufruf kommen – mit einem catch-Block pro Exception-Klasse.",
    "**Exceptions von vornherein vermeiden:** Viele Ausnahmen lassen sich mit einer einfachen Prüfung vorher verhindern – das ist meist besser lesbar als try-catch:\n- Divisor auf 0 prüfen, bevor geteilt wird\n- `if (objekt != null)` vor einem Methodenaufruf\n- Index gegen `array.length` prüfen\n- `instanceof` vor einem Cast",
    "**Eingabewiederholung:** Die typische Kombination ist eine Schleife um try-catch: Solange die Eingabe nicht gültig ist, erneut fragen. Erst wenn keine Exception kam, wird die Schleife verlassen.",
    { code: "boolean gueltig = false;\ndouble zahl = 0;\nwhile (!gueltig) {\n    try {\n        System.out.print(\"Zahl: \");\n        zahl = Double.parseDouble(tastatur.nextLine());\n        gueltig = true;\n    } catch (NumberFormatException e) {\n        System.out.println(\"Bitte eine Zahl eingeben.\");\n    }\n}" },
    "Mögliche Fehlerbehandlungen reichen vom bewussten Ignorieren über einen Standardwert (im javadoc dokumentieren!) bis zur Wiederholung – was richtig ist, entscheidest du im Einzelfall."
  ],
  pit: ["Eigene Exception, die von RuntimeException erbt, ist unchecked – der Compiler erzwingt dann nichts.", "Name ohne „Exception“-Endung ist erlaubt, aber schlechter Stil.", "Bei der Eingabewiederholung die Variable vor der Schleife deklarieren."],
  fill: { kind: "java", wrap: "class", t: "Schreibe die eigene Exception-Klasse. Ausgabe: „0 hoch 0 ist nicht definiert“.",
    pre: "class NullHochNullException [[0]] Exception {\n    public NullHochNullException() {\n        [[1]](\"0 hoch 0 ist nicht definiert\");\n    }\n}\n",
    code: "class Mathe {\n    static double potenz(double x, int y) throws NullHochNullException {\n        if (x == 0 && y == 0) {\n            throw [[2]] NullHochNullException();\n        }\n        return Math.pow(x, y);\n    }\n}\n",
    run: "try {\n    Mathe.potenz(0, 0);\n} catch ([[3]] e) {\n    System.out.println(e.getMessage());\n}",
    gaps: [["extends"], ["super"], ["new"], ["NullHochNullException", "Exception"]] }
};

// ====================== ARR – Arrays ======================
READ["ARR-0"] = {
  read: [
    "Oft müssen **mehrere gleichartige, zusammengehörige Werte** gespeichert werden – im Kurs die Temperaturen einer Wetterstation, eine Messung pro Tag. Sieben einzelne Variablen `temp1` bis `temp7` wären unhandlich, und bei 365 Messungen unmöglich. Die Lösung ist ein **Array** (deutsch: Feld, Reihung).",
    "Ein Array speichert Werte **eines Typs** unter **einem gemeinsamen Namen** in einer festen Reihenfolge. Auf die einzelnen **Arrayelemente** greifst du über einen numerischen **Index** zu.",
    "**Arrays sind Objekte** (Referenztyp, Unterklasse von Object) – haben aber keine eigene Klasse mit Namen. Deshalb eine eigene Syntax für die **Deklaration**: Datentyp der Elemente, dann eckige Klammern.",
    { code: "double[] temperaturen;      // Deklaration – noch kein Array-Objekt!\ntemperaturen = new double[7];   // Erzeugung mit new[]: 7 Elemente\n\nint[] ports = {22, 80, 443};    // Erzeugung durch Initialisierung" },
    "**Mit new[]** gibst du die Anzahl der Elemente an. Alle Elemente bekommen automatisch einen **Standardwert**: 0 bei Zahlen, `0.0` bei double, `false` bei boolean, `'\\u0000'` bei char und `null` bei Referenztypen.",
    "**Durch Initialisierung** listest du die Werte in geschweiften Klammern auf; die Länge ergibt sich aus der Anzahl. Diese Kurzform geht nur direkt bei der Deklaration. Später brauchst du `ports = new int[] {22, 80};`.",
    "Die **Länge** eines Arrays ist nach dem Erzeugen **fest** und steht im Attribut `length` – **ohne Klammern**, anders als `length()` bei Strings. Ein „größeres“ Array bedeutet immer: ein neues Array erzeugen und die Werte umkopieren.",
    "Die Klammern dürfen auch hinter dem Namen stehen (`int ports[]`), üblich und empfohlen ist aber `int[] ports` – der Typ ist „int-Array“."
  ],
  pit: ["`array.length()` → Compilerfehler, bei Arrays ist length ein Attribut.", "`int[] a; a[0] = 5;` → a ist noch nicht erzeugt.", "`a = {1, 2};` nach der Deklaration geht nicht – nur mit `new int[] {1, 2}`."],
  fill: { kind: "java", wrap: "main", t: "Deklariere und erzeuge die Arrays. Ausgabe: „7 0.0“ und „3 443“.",
    code: "double[] temperaturen = [[0]] double[[[1]]];\nSystem.out.println(temperaturen.[[2]] + \" \" + temperaturen[0]);\nint[] ports = [[3]]22, 80, 443};\nSystem.out.println(ports.length + \" \" + ports[2]);",
    gaps: [["new"], ["7"], ["length"], ["{"]] }
};
READ["ARR-1"] = {
  read: [
    "Zugriff auf ein Element: Arrayname und Index in eckigen Klammern. Der **Index beginnt bei 0**, der höchste ist also **length − 1**. Ein Array mit 7 Elementen hat die Indizes 0 bis 6.",
    { code: "temperaturen[0] = 12.5;        // erstes Element\ntemperaturen[6] = 14.0;        // letztes Element (bei length 7)\ndouble d = temperaturen[3];\ntemperaturen[7] = 1.0;         // ArrayIndexOutOfBoundsException!" },
    "Ein ungültiger Index fällt nicht dem Compiler auf, sondern erst **zur Laufzeit**: `ArrayIndexOutOfBoundsException`.",
    "`System.out.println(temperaturen)` gibt **nicht** die Werte aus, sondern etwas wie `[D@1b6d3586` – den Typ und eine Kennung der Referenz. Für die Inhalte brauchst du eine Schleife (oder `Arrays.toString`, nächster Abschnitt).",
    "Ihre Stärke zeigen Arrays erst mit **Schleifen**. Die `for`-Schleife liefert die Zählvariable als Index:",
    { code: "// Alle Werte von Celsius nach Fahrenheit umrechnen\nfor (int i = 0; i < temperaturen.length; i++) {\n    temperaturen[i] = temperaturen[i] * 1.8 + 32;\n}" },
    "Schreibe die Grenze immer mit `i < array.length` statt einer festen Zahl – dann funktioniert der Code für jede Länge.",
    "**Erweiterte for-Schleife (foreach):** Wenn du nur **lesen** willst, geht es ohne Index:",
    { code: "double summe = 0;\nfor (double t : temperaturen) {   // „für jedes t in temperaturen“\n    summe += t;\n}\ndouble mittel = summe / temperaturen.length;" },
    "foreach erlaubt **nur lesenden Zugriff**: Eine Zuweisung an `t` ändert nur die Schleifenvariable, nicht das Array. Zum Verändern und wenn du den Index brauchst (z. B. „an welcher Stelle?“), nimm die normale for-Schleife.",
    "Typische Aufgabe: Maximum suchen. Starte mit dem **ersten Element** (nicht mit 0 – alle Werte könnten negativ sein) und vergleiche ab Index 1."
  ],
  pit: ["`i <= a.length` → ein Durchlauf zu viel, Exception am Ende.", "foreach ändert das Array nicht.", "Maximum mit 0 initialisiert → falsch bei nur negativen Werten."],
  fill: { kind: "java", wrap: "main", t: "Finde das Maximum und bilde die Summe. Ausgabe: „max 31 summe 52“.",
    code: "int[] werte = {-4, 17, 31, 8};\nint max = werte[[[0]]];\nfor (int i = 1; i < werte.[[1]]; i++) {\n    if (werte[i] > max) {\n        max = werte[[[2]]];\n    }\n}\nint summe = 0;\nfor (int w [[3]] werte) {\n    summe += w;\n}\nSystem.out.println(\"max \" + max + \" summe \" + summe);",
    gaps: [["0"], ["length"], ["i"], [":"]] }
};
READ["ARR-2"] = {
  read: [
    "Manche Aufgaben tauchen bei Arrays immer wieder auf: ausgeben, sortieren, vergleichen, kopieren. Die Klasse **Arrays** aus `java.util` bietet dafür fertige **statische** Methoden. Import nicht vergessen: `import java.util.Arrays;`",
    { code: "int[] z = {5, 3, 9, 1};\nSystem.out.println(Arrays.toString(z));   // [5, 3, 9, 1]\nArrays.sort(z);                            // sortiert z selbst (aufsteigend)\nSystem.out.println(Arrays.toString(z));   // [1, 3, 5, 9]\nint[] g = Arrays.copyOf(z, 6);             // neues Array, Länge 6\nSystem.out.println(Arrays.toString(g));   // [1, 3, 5, 9, 0, 0]\nArrays.fill(g, 7);                         // alle Elemente = 7" },
    "- `Arrays.toString(a)` – lesbare Darstellung mit eckigen Klammern und Kommas\n- `Arrays.sort(a)` – sortiert **das übergebene Array** (kein Rückgabewert!)\n- `Arrays.copyOf(a, n)` – **neues** Array der Länge n; fehlende Stellen bekommen den Standardwert, überzählige werden abgeschnitten. Damit „vergrößert“ man ein Array.\n- `Arrays.equals(a, b)` – gleiche Länge und gleiche Elemente an gleicher Stelle?\n- `Arrays.fill(a, wert)` – alle Elemente auf einen Wert setzen",
    "**Warum nicht `a == b`?** Weil Arrays Objekte sind, vergleicht `==` nur die **Referenzen** – also ob beide Variablen auf **dasselbe** Array-Objekt zeigen. Zwei verschiedene Arrays mit gleichem Inhalt sind damit nicht gleich. Für den Inhalt: `Arrays.equals`.",
    "Aus demselben Grund kopiert `int[] b = a;` **kein** Array: Danach zeigen a und b auf dasselbe Objekt, eine Änderung über b ist auch über a sichtbar. Eine echte Kopie liefert `Arrays.copyOf(a, a.length)`.",
    "Das gilt auch für Methoden: Übergibst du ein Array als Parameter, bekommt die Methode die **Referenz** – sie kann die Elemente des Originals ändern."
  ],
  pit: ["`z = Arrays.sort(z);` → Compilerfehler, sort liefert void.", "`a == b` vergleicht Referenzen, nicht Inhalte.", "`int[] b = a;` ist keine Kopie."],
  fill: { kind: "java", wrap: "main", imports: ["java.util.Arrays"], t: "Sortiere, kopiere, vergleiche. Ausgabe: „[1, 3, 5, 9]“, „false true“, „[1, 3, 5, 9, 0]“.",
    code: "int[] z = {5, 3, 9, 1};\nArrays.[[0]](z);\nSystem.out.println(Arrays.[[1]](z));\nint[] k = Arrays.copyOf(z, z.length);\nSystem.out.println((k == z) + \" \" + Arrays.[[2]](k, z));\nint[] g = Arrays.copyOf(z, [[3]]);\nSystem.out.println(Arrays.toString(g));",
    gaps: [["sort"], ["toString"], ["equals"], ["5", "z.length + 1"]] }
};
READ["ARR-3"] = {
  read: [
    "Arrays können auch **Referenztypen** speichern. Das Kursbeispiel ist eine **Autovermietung**, die ihre Autos in einem Array verwaltet. Weil es Autos und Cabrios gibt (Cabrio erbt von Auto), wählt man den **Superklassen-Typ**: `Auto[] autos` kann dank Zuweisungskompatibilität beide speichern.",
    { code: "Auto[] autos = new Auto[10];        // 10 Plätze – noch KEIN Auto!\nautos[0] = new Auto(\"BRB-TH 1\");\nautos[1] = new Cabrio(\"BRB-TH 2\");" },
    "**Wichtig:** `new Auto[10]` erzeugt nur das Array mit 10 Referenzen, die alle `null` sind – wie 10 leere Garagen. Die Auto-Objekte musst du einzeln mit `new` erzeugen. Rufst du eine Methode auf einem leeren Platz auf, gibt es eine `NullPointerException`. Deshalb vor dem Zugriff prüfen:",
    { code: "for (Auto a : autos) {\n    if (a != null && !a.istVermietet()) {\n        a.mieten();\n        break;           // erstes freies Auto gefunden\n    }\n}" },
    "**Akkumulieren:** Eine Variable vor der Schleife anlegen, in der Schleife Wert für Wert aufsammeln – Summe (`gesamt += a.getKilometerstand()`), Zähler (`if (…) anzahl++`) oder Maximum. Das Muster kommt in Klausuren ständig vor.",
    "**Neues Element aufnehmen:** Ist das Array voll, musst du ein **größeres** erzeugen und die alten Referenzen umkopieren (z. B. mit `Arrays.copyOf`) – dann ist am Ende ein Platz frei. Die Objekte selbst werden dabei nicht kopiert, nur die Referenzen.",
    "**Kommandozeilenparameter:** Ein Array von Objekten kennst du schon lange: `String[] args` in `main`. Startest du ein Programm mit `java Rechner 3 4`, steht in `args[0]` der String \"3\" und in `args[1]` \"4\". Es sind immer **Strings** – Zahlen musst du umwandeln, z. B. mit `Integer.parseInt(args[0])`. Ohne Parameter ist `args.length` gleich 0."
  ],
  pit: ["`new Auto[10]` erzeugt keine Autos, nur 10 × null.", "Methode auf null-Element → NullPointerException.", "args-Werte sind Strings: `args[0] + args[1]` ergibt \"34\", nicht 7."],
  fill: { kind: "java", wrap: "class", t: "Zähle Kilometer nur für belegte Plätze. Ausgabe: „3 Plätze, 2 Autos, 15000 km“.",
    pre: "class Auto {\n    private int km;\n    public Auto(int km) { this.km = km; }\n    public int getKilometerstand() { return km; }\n}\n",
    code: "class Vermietung {\n    static String statistik(Auto[] autos) {\n        int anzahl = 0;\n        int gesamt = 0;\n        for (Auto a : autos) {\n            if (a [[0]] null) {\n                anzahl[[1]];\n                gesamt [[2]] a.getKilometerstand();\n            }\n        }\n        return autos.length + \" Plätze, \" + anzahl + \" Autos, \" + gesamt + \" km\";\n    }\n}\n",
    run: "Auto[] autos = new [[3]][3];\nautos[0] = new Auto(12000);\nautos[2] = new Auto(3000);\nSystem.out.println(Vermietung.statistik(autos));",
    gaps: [["!="], ["++", "+= 1"], ["+="], ["Auto"]] }
};
READ["ARR-4"] = {
  read: [
    "Array-Elemente können beliebige Referenztypen sein – also auch **wieder Arrays**. Dann spricht man von einem **zweidimensionalen** (mehrdimensionalen) Array. Am besten stellst du es dir als **Tabelle** vor. Der Kurs zeigt die Quartalsgewinne dreier Abteilungen:",
    { code: "            Q I    Q II   Q III  Q IV\nAbt. 1      17.2   16.9   14.3   15.8\nAbt. 2      10.1   10.1   10.1   10.1\nAbt. 3      28.7   29.2   28.9   29.0" },
    { code: "double[][] gewinn = new double[3][4];   // 3 Zeilen, 4 Spalten\n\ndouble[][] g2 = {\n    {17.2, 16.9, 14.3, 15.8},\n    {10.1, 10.1, 10.1, 10.1},\n    {28.7, 29.2, 28.9, 29.0}\n};" },
    "Der **erste Index** wählt die Zeile (eines der inneren Arrays), der **zweite** das Element darin, also die Spalte: `gewinn[1][3]` ist Zeile 1, Spalte 3 → 10.1 (Abteilung 2, Quartal IV – Index beginnt bei 0!). Die linke obere Ecke ist `[0][0]`.",
    "`gewinn.length` ist die Anzahl der **Zeilen** (3). `gewinn[0].length` ist die Anzahl der **Spalten** in Zeile 0 (4).",
    "Durchlaufen mit **verschachtelten Schleifen**: außen die Zeilen, innen die Spalten.",
    { code: "for (int z = 0; z < gewinn.length; z++) {\n    double summe = 0;\n    for (int s = 0; s < gewinn[z].length; s++) {\n        summe += gewinn[z][s];\n    }\n    System.out.println(\"Abteilung \" + (z + 1) + \": \" + summe);\n}" },
    "Weil jede Zeile ein eigenes Array ist, dürfen die Zeilen sogar **unterschiedlich lang** sein. Darum in der inneren Schleife immer `gewinn[z].length` statt einer festen Zahl."
  ],
  pit: ["`new char[3][2]` = 3 Zeilen, 2 Spalten – nicht umgekehrt.", "`a.length` sind die Zeilen, `a[0].length` die Spalten.", "Innere und äußere Zählvariable verwechselt → falsche Elemente oder Exception."],
  fill: { kind: "java", wrap: "main", t: "Summiere jede Zeile. Ausgabe: „Zeile 0: 6“ und „Zeile 1: 15“.",
    code: "int[][] t = { {1, 2, 3}, {4, 5, 6} };\nfor (int z = 0; z < t.[[0]]; z++) {\n    int summe = 0;\n    for (int s = 0; s < t[[[1]]].length; s++) {\n        summe += t[[[2]]][[[3]]];\n    }\n    System.out.println(\"Zeile \" + z + \": \" + summe);\n}",
    gaps: [["length"], ["z", "0"], ["z"], ["s"]] }
};

// ====================== ZKT – Zeichenketten ======================
READ["ZKT-0"] = {
  read: [
    "Eine **Zeichenkette** (*string*) ist eine Folge von **Unicode-Zeichen**. Das erinnert an ein char-Array – und intern wird sie tatsächlich so gespeichert, nur gut in Klassen verpackt. Wie bei Arrays haben die Zeichen einen **Index ab 0**.",
    "Java bietet mehrere Klassen für Zeichenketten. Die wichtigsten für dich: **String** (unveränderlich) und **StringBuilder** (veränderbar). `StringBuffer` ist praktisch gleich wie StringBuilder, aber für Programme mit mehreren Threads gedacht – im Kurs nimmst du StringBuilder.",
    "Strings sind **Referenztypen**: Die Variable speichert eine Referenz auf ein String-Objekt. Weil Strings so häufig sind, gibt es eine Abkürzung: Ein **Literal** in Anführungszeichen erzeugt das Objekt, ohne `new`.",
    { code: "String wort;                       // Deklaration\nwort = \"Firewall\";                 // Literal erzeugt das Objekt\nString leer = \"\";                  // leerer String (Länge 0) – nicht null!\nString auchMoeglich = new String(\"Firewall\");   // geht, ist aber unüblich" },
    "`String` liegt in `java.lang` – kein Import nötig. Die Klasse ist außerdem `final`, kann also nicht beerbt werden.",
    "**Unveränderlich (immutable):** Ein String-Objekt ändert sich nach dem Erzeugen **nie** wieder. Methoden wie `toUpperCase()` liefern einen **neuen** String; das Original bleibt gleich. Das Ergebnis musst du also auffangen:",
    { code: "String s = \"alert\";\ns.toUpperCase();          // Ergebnis verpufft, s ist weiter \"alert\"\ns = s.toUpperCase();      // jetzt zeigt s auf den neuen String \"ALERT\"" },
    "Zwei Grundmethoden:\n- `length()` – Anzahl der Zeichen (**mit** Klammern, anders als beim Array!)\n- `charAt(i)` – das Zeichen an Index i als `char`; gültig sind 0 bis `length() - 1`, sonst `StringIndexOutOfBoundsException`",
    "Mit einer for-Schleife und `charAt` gehst du Zeichen für Zeichen durch einen String – das Grundmuster für Zählen, Prüfen und Umbauen."
  ],
  pit: ["`s.toUpperCase();` ohne Zuweisung ändert nichts.", "String: `length()`, Array: `length` – in der Klausur gern vertauscht.", "`charAt` liefert char ('a'), nicht String (\"a\")."],
  fill: { kind: "java", wrap: "main", t: "Zähle die Ziffern in einem Log-Eintrag. Ausgabe: „ALERT 10.0.0.1 → 5 Ziffern“.",
    code: "String log = \"alert 10.0.0.1\";\nlog = log.[[0]]();\nint ziffern = 0;\nfor (int i = 0; i < log.[[1]]; i++) {\n    char c = log.[[2]](i);\n    if (c >= '0' && c <= '9') {\n        ziffern++;\n    }\n}\nSystem.out.println(log + \" → \" + ziffern + \" Ziffern\");",
    gaps: [["toUpperCase"], ["length()"], ["charAt"]] }
};
READ["ZKT-1"] = {
  read: [
    "Die Klasse String hat sehr viele Methoden – die vollständige Liste steht in der Java-API-Dokumentation. Der Kurs erklärt sie an einem Beispiel: Prüfen, ob eine Zeichenkette als deutsches **Autokennzeichen** taugt (Ort, Buchstaben, Zahl). Die wichtigsten Gruppen:",
    "**Suchen:**\n- `indexOf(\"x\")` – Index des ersten Vorkommens, **−1**, wenn nicht enthalten; `lastIndexOf` sucht von hinten\n- `contains(\"x\")`, `startsWith(\"x\")`, `endsWith(\"x\")` – liefern boolean",
    "**Herausschneiden:**\n- `substring(von)` – ab Index von bis zum Ende\n- `substring(von, bis)` – von **einschließlich** bis **ausschließlich**. Die Länge des Ergebnisses ist bis − von.",
    { code: "String ip = \"192.168.10.5\";\nint p = ip.indexOf(\".\");             // 3\nString erstes = ip.substring(0, p);   // \"192\"\nString rest = ip.substring(p + 1);    // \"168.10.5\"" },
    "**Umwandeln und Aufräumen:**\n- `toUpperCase()`, `toLowerCase()`\n- `trim()` – entfernt Leerzeichen (und Steuerzeichen) am Anfang und Ende; `strip()` ist die Unicode-bewusste Variante\n- `replace(\"alt\", \"neu\")` – ersetzt alle Vorkommen\n- `isEmpty()` – Länge 0?",
    "**Zerlegen:** `split(trenner)` liefert ein **String-Array** der Teile. Achtung: Der Trenner ist ein **regulärer Ausdruck**, in dem der Punkt „beliebiges Zeichen“ bedeutet. Für einen echten Punkt also `split(\"\\\\.\")` – im Java-Code stehen zwei Backslashes.",
    { code: "String[] teile = \"192.168.10.5\".split(\"\\\\.\");   // {\"192\", \"168\", \"10\", \"5\"}\nString[] woerter = \"ssh login failed\".split(\" \");  // {\"ssh\", \"login\", \"failed\"}" },
    "**Umwandeln in Zahlen** und zurück: `Integer.parseInt(\"443\")`, `Double.parseDouble(\"2.5\")` – bei ungültigem Text `NumberFormatException`. In die andere Richtung `String.valueOf(443)` oder einfach `\"\" + 443`.",
    "Denk dran: Keine dieser Methoden ändert den Original-String – alle liefern neue Werte."
  ],
  pit: ["`substring(2, 5)` liefert 3 Zeichen (Index 2, 3, 4).", "`split(\".\")` liefert ein leeres Array – der Punkt ist ein Regex-Joker.", "indexOf liefert −1 statt Exception, wenn nichts gefunden wird."],
  fill: { kind: "java", wrap: "main", t: "Zerlege die IP-Adresse. Ausgabe: „4 Teile, erster: 192, Netz: 192.168“.",
    code: "String ip = \"192.168.10.5\";\nString[] teile = ip.[[0]](\"\\\\.\");\nint p = ip.[[1]](\".\", 4);          // zweiter Punkt ab Index 4\nString netz = ip.[[2]](0, p);\nSystem.out.println(teile.length + \" Teile, erster: \" + teile[0] + \", Netz: \" + netz);",
    gaps: [["split"], ["indexOf"], ["substring"]] }
};
READ["ZKT-2"] = {
  read: [
    "Ein Klassiker aus dem Kurs: die Passwortprüfung mit `if (passwort == \"123456\")`. Sie liefert oft **falsch**, obwohl du 123456 eingegeben hast. Warum?",
    "Weil `==` bei Referenztypen nur die **Referenzen** vergleicht – also ob beide Variablen auf **dasselbe Objekt** zeigen. Ein eingelesener String ist ein **neues** Objekt, auch wenn er dieselben Zeichen enthält. (Zwei gleiche Literale im Code teilen sich dagegen manchmal ein Objekt – deshalb scheint `==` gelegentlich zu klappen. Verlass dich nie darauf.)",
    "Für den **Inhalt**:\n- `a.equals(b)` – gleiche Zeichen, Groß/Klein zählt\n- `a.equalsIgnoreCase(b)` – Groß/Klein egal\n- `a.compareTo(b)` – lexikografische Reihenfolge (Unicode): **negativ**, wenn a vor b kommt, **0** bei Gleichheit, **positiv**, wenn a nach b kommt. Großbuchstaben kommen vor Kleinbuchstaben.",
    { code: "String eingabe = new String(\"admin\");   // wie eine Eingabe: neues Objekt\nSystem.out.println(eingabe == \"admin\");           // false\nSystem.out.println(eingabe.equals(\"admin\"));      // true\nSystem.out.println(\"Admin\".equalsIgnoreCase(\"admin\"));  // true\nSystem.out.println(\"apfel\".compareTo(\"birne\") < 0);    // true" },
    "Tipp: Ist eine Variable vielleicht `null`, schreib das Literal nach vorne: `\"admin\".equals(eingabe)` – das wirft keine NullPointerException.",
    "**Konkatenation** (Verknüpfung) mit `+`: Die Zeichenketten werden aneinandergehängt, es entsteht ein **neuer** String. Ist **ein** Operand ein String, wird der andere automatisch in einen String umgewandelt (bei Objekten über `toString()`).",
    "Ausgewertet wird **von links nach rechts** – das führt zu typischen Klausurfallen:",
    { code: "System.out.println(\"Port \" + 4 + 4);     // Port 44   (String + 4 → String, + 4 → String)\nSystem.out.println(4 + 4 + \" Ports\");     // 8 Ports   (erst 4 + 4 = 8, dann String)\nSystem.out.println(\"Port \" + (4 + 4));   // Port 8    (Klammern zuerst)\nSystem.out.println('a' + 1);             // 98        (char + int = int!)\nSystem.out.println(\"\" + 'a' + 1);        // a1" },
    "`+=` funktioniert auch: `s += \"!\";` hängt an – erzeugt dabei aber jedes Mal ein **neues** String-Objekt. In Schleifen ist das ineffizient; dafür gibt es StringBuilder."
  ],
  pit: ["Strings nie mit == vergleichen.", "`\"Port \" + 4 + 4` → \"Port 44\".", "`'a' + 1` ist eine Zahl (98), kein Text."],
  fill: { kind: "java", wrap: "main", t: "Vergleiche richtig und achte auf die Auswertungsreihenfolge. Ausgabe: „true true“ und „Port 8 / 44 Ports“.",
    code: "String eingabe = new String(\"Admin\");\nboolean genau = eingabe.[[0]](\"Admin\");\nboolean egal = eingabe.[[1]](\"ADMIN\");\nSystem.out.println(genau + \" \" + egal);\nSystem.out.println(\"Port \" + [[2]] + \" / \" + 4 + 4 + \" Ports\");",
    gaps: [["equals"], ["equalsIgnoreCase"], ["(4 + 4)", "(4+4)", "8"]] }
};
READ["ZKT-3"] = {
  read: [
    "Mit **StringBuilder** stellt Java eine Klasse bereit, deren Objekte ihre **Länge und ihren Inhalt zur Laufzeit ändern** können. Sie hat Methoden zum Anhängen, Einfügen, Löschen und Ersetzen von Zeichen.",
    { code: "StringBuilder leer = new StringBuilder();           // leer\nStringBuilder sb = new StringBuilder(\"am Anfang\");  // mit Startinhalt" },
    "Für StringBuilder gibt es **keine Literal-Kurzform** – das Objekt wird immer mit `new` erzeugt.",
    "**Der entscheidende Unterschied:** Die StringBuilder-Methoden verändern **das Original-Objekt selbst**. Du musst das Ergebnis nicht auffangen (sie geben das Objekt aber zusätzlich zurück, deshalb kann man Aufrufe verketten).",
    "- `append(x)` – hängt x hinten an (jeder Typ)\n- `insert(pos, x)` – fügt x an Index pos ein\n- `delete(von, bis)` – löscht von einschließlich bis ausschließlich; `deleteCharAt(i)` löscht ein Zeichen\n- `replace(von, bis, text)` – ersetzt einen Bereich\n- `setCharAt(i, c)` – ändert ein Zeichen\n- `reverse()` – kehrt die Reihenfolge um\n- `length()`, `charAt(i)`, `indexOf(…)` – wie bei String\n- `toString()` – liefert den Inhalt als neuen String",
    { code: "StringBuilder sb = new StringBuilder(\"Port\");\nsb.append(\" \").append(443);     // \"Port 443\"\nsb.insert(0, \"TCP-\");           // \"TCP-Port 443\"\nsb.delete(0, 4);                // \"Port 443\"\nsb.reverse();                   // \"344 troP\"\nString fertig = sb.toString();" },
    "**Wann was?** String für Werte, die sich nicht ändern, und für Vergleiche. StringBuilder, wenn ein Text **schrittweise zusammengebaut** wird, vor allem in Schleifen – das spart das ständige Erzeugen neuer String-Objekte.",
    "Achtung beim Vergleichen: `StringBuilder` hat **kein** inhaltliches `equals`. Erst mit `toString()` in einen String umwandeln und dann `equals` benutzen – etwa beim Palindrom-Test."
  ],
  pit: ["`StringBuilder sb = \"abc\";` → Compilerfehler, nur mit new.", "sb1.equals(sb2) vergleicht Referenzen – vorher toString().", "Die Methoden ändern das Original – anders als bei String."],
  fill: { kind: "java", wrap: "main", t: "Baue den Text zusammen und prüfe auf Palindrom. Ausgabe: „1-2-3“ und „true“.",
    code: "StringBuilder sb = [[0]] StringBuilder();\nfor (int i = 1; i <= 3; i++) {\n    sb.[[1]](i);\n    if (i < 3) {\n        sb.append(\"-\");\n    }\n}\nSystem.out.println(sb);\nString wort = \"rentner\";\nString rueckwaerts = new StringBuilder(wort).[[2]]().[[3]]();\nSystem.out.println(wort.equals(rueckwaerts));",
    gaps: [["new"], ["append"], ["reverse"], ["toString"]] }
};
READ["ZKT-4"] = {
  read: [
    "Intern sind 5, 5.0, 5,00 und 05 für den Rechner gleichwertig – der Mensch erwartet aber je nach Zusammenhang ein bestimmtes Format: Geldbeträge mit zwei Nachkommastellen, große Zahlen mit Tausendertrennzeichen.",
    "**String.format und printf:** Sollen mehrere Werte in einem Text ausgegeben werden, bieten sich `String.format(…)` (liefert einen String) und `System.out.printf(…)` (gibt direkt aus) an. Im Formatstring stehen **Platzhalter**, die der Reihe nach durch die folgenden Werte ersetzt werden:",
    "- `%d` – ganze Zahl\n- `%f` – Kommazahl, `%.2f` mit 2 Nachkommastellen (gerundet)\n- `%s` – String (oder beliebiges Objekt über toString)\n- `%n` – Zeilenumbruch\n- Eine Zahl davor gibt die **Mindestbreite** an: `%5d` rechtsbündig in 5 Stellen, `%-10s` linksbündig in 10",
    { code: "System.out.printf(\"%-6s|%5d%n\", \"SSH\", 22);   // \"SSH   |   22\"\nString s = String.format(\"%d Treffer\", 3);       // \"3 Treffer\"" },
    "**Länderspezifisch:** Deutschland schreibt 123.456.789,00, England 123,456,789.00. Welches Format benutzt wird, bestimmt ein **Locale**-Objekt (Sprache/Land). `printf` mit `%.2f` richtet sich nach der Systemeinstellung – auf einem deutschen Rechner erscheint also ein **Komma**.",
    "**NumberFormat** (`java.text`): Ein Formatierungsobjekt holst du mit einer statischen Methode, dann formatierst du mit `format(zahl)`:",
    { code: "NumberFormat nf = NumberFormat.getInstance(Locale.GERMANY);\nnf.setMaximumFractionDigits(1);\nSystem.out.println(nf.format(12345.25));        // 12.345,2 (gerundet)\n\nNumberFormat geld = NumberFormat.getCurrencyInstance(Locale.GERMANY);\nNumberFormat proz = NumberFormat.getPercentInstance(Locale.GERMANY);" },
    "`getInstance()` ohne Parameter nimmt das Locale des Systems. Weitere Einstellungen: `setMinimumFractionDigits`, `setMinimumIntegerDigits` (führende Nullen), `setGroupingUsed(false)` (ohne Tausenderpunkte). Währung und Prozent setzen das Symbol automatisch an die landesübliche Stelle.",
    "**Datum:** Genauso aufgebaut – ein Objekt für das Datum (`LocalDate` aus `java.time`) und ein Formatierungsobjekt (`DateTimeFormatter` aus `java.time.format`):",
    { code: "LocalDate klausur = LocalDate.of(2027, 1, 28);\nDateTimeFormatter f = DateTimeFormatter.ofPattern(\"dd.MM.yyyy\");\nSystem.out.println(klausur.format(f));          // 28.01.2027" },
    "Im Muster: `dd` Tag, `MM` Monat (großes M – kleines `mm` sind Minuten!), `yyyy` Jahr."
  ],
  pit: ["Anzahl und Typ der Werte müssen zu den Platzhaltern passen: `%d` mit 2.5 → Exception zur Laufzeit.", "`mm` im Datumsmuster sind Minuten, `MM` Monate.", "printf hängt keinen Zeilenumbruch an – `%n` nicht vergessen."],
  fill: { kind: "java", wrap: "main", imports: ["java.text.NumberFormat", "java.util.Locale", "java.time.LocalDate", "java.time.format.DateTimeFormatter"], t: "Formatiere Zahl, Tabelle und Datum. Ausgabe: „12.345,3“, „SSH   |   22“, „28.01.2027“.",
    code: "NumberFormat nf = NumberFormat.getInstance(Locale.GERMANY);\nnf.setMaximumFractionDigits(1);\nSystem.out.println(nf.[[0]](12345.26));\nSystem.out.printf(\"%-6s|%5[[1]]%n\", \"SSH\", 22);\nDateTimeFormatter f = DateTimeFormatter.ofPattern(\"dd.[[2]].yyyy\");\nSystem.out.println(LocalDate.of(2027, 1, 28).format(f));",
    gaps: [["format"], ["d"], ["MM"]] }
};
