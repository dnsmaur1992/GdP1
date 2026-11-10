// nibble – Lerninhalte GP1, Teil 3 (Kontrollstrukturen bis Zeichenketten)
var CONTENT = CONTENT || [];
CONTENT.push(
{
  id: "VER", title: "Einfach- und Mehrfachverzweigungen", color: "#F5A524",
  nibbles: [
    {
      t: "Sequenz und if-Anweisung",
      learn: [
        "Kontrollstrukturen: **Sequenz**, **Selektion** (Verzweigung), **Iteration** (Schleife).",
        "Unvollständige Alternative: nur `if`. Vollständige Alternative: `if` + `else`.",
        "Die Bedingung muss vom Typ **boolean** sein.",
        "Bei nur einer abhängigen Anweisung dürfen die `{}` fehlen – besser trotzdem setzen."
      ],
      code: "if (fehlversuche >= 3) {\n    sperren(user);\n} else {\n    System.out.println(\"Login erneut versuchen\");\n}",
      quiz: [
        { q: "Welche Verzweigung ist syntaktisch korrekt?", a: ["if x > 0 { }", "if (x > 0) { }", "if (x = 0) { }", "if (x > 0) then { }"], c: 1, why: "Bedingung in runden Klammern, boolean-Ausdruck. x = 0 wäre eine int-Zuweisung." },
        { q: "x = 0, y = 1. Wann wird z = 1?", a: ["if (x > y) z = 1;", "if (x == y) z = 1;", "if (x < y) z = 1;", "if (x != 0) z = 1;"], c: 2, why: "0 < 1 ist true." }
      ]
    },
    {
      t: "Mehrere Bedingungen & Schachtelung",
      learn: [
        "Bedingungen verknüpft man mit `&&`, `||` und `!`.",
        "if-Anweisungen lassen sich **schachteln**.",
        "Ein `else` gehört immer zum **unmittelbar davor liegenden if** (dangling else) – Klammern klären das.",
        "Ketten mit `if – else if – else` prüfen Fälle nacheinander."
      ],
      code: "if (score >= 9) {\n    stufe = \"kritisch\";\n} else if (score >= 7) {\n    stufe = \"hoch\";\n} else if (score >= 4) {\n    stufe = \"mittel\";\n} else {\n    stufe = \"niedrig\";\n}",
      quiz: [
        { q: "Wie prüft man, dass x NICHT negativ ist?", a: ["if (x > 0)", "if (x >= 0)", "if (!x)", "if (x != -1)"], c: 1, why: "Nicht negativ schließt die 0 ein." },
        { q: "Bei `if (a) if (b) x(); else y();` gehört else zu …", a: ["if (a)", "if (b)", "keinem", "beiden"], c: 1, why: "else bindet an das nächstgelegene vorangehende if." }
      ],
      task: "Programmiere eine CVSS-Einstufung: Eingabe einer Zahl 0.0–10.0, Ausgabe Keine/Niedrig/Mittel/Hoch/Kritisch (0 / 0.1–3.9 / 4.0–6.9 / 7.0–8.9 / 9.0–10.0)."
    },
    {
      t: "switch-case",
      learn: [
        "Für Mehrfachverzweigungen über **einen Ausdruck** gibt es `switch`.",
        "Erlaubte Typen u. a.: `char`, `byte`, `short`, `int`, `String`, Enums.",
        "Moderne Pfeil-Syntax `case X ->` hat **kein Durchfallen**; mehrere Werte mit Komma: `case 1, 2 ->`.",
        "Alte Doppelpunkt-Syntax `case X:` fällt ohne `break` in die nächsten Fälle durch.",
        "`default` ist optional und greift, wenn kein case passt."
      ],
      code: "switch (port) {\n    case 22 -> System.out.println(\"SSH\");\n    case 80, 443 -> System.out.println(\"Web\");\n    case 3389 -> System.out.println(\"RDP\");\n    default -> System.out.println(\"unbekannt\");\n}",
      quiz: [
        { q: "Eingabe 1 bei `case 1: print(\"a\"); case 2: print(\"b\"); case 3: print(\"c\");` – Ausgabe?", a: ["a", "abc", "c", "nichts"], c: 1, why: "Ohne break fällt die alte Syntax durch alle folgenden Fälle." },
        { q: "Dasselbe mit `case 1 -> ...` – Ausgabe?", a: ["a", "abc", "ab", "Compilerfehler"], c: 0, why: "Die Pfeil-Syntax führt nur den passenden Fall aus." }
      ]
    }
  ]
},
{
  id: "ITR", title: "Iteration", color: "#F5A524",
  nibbles: [
    {
      t: "while – die kopfgesteuerte Schleife",
      learn: [
        "Prüft die Bedingung **vor** jedem Durchlauf – der Rumpf läuft evtl. **nie** (abweisend).",
        "In jedem Durchlauf muss sich eine Variable der Bedingung ändern, sonst droht eine **Endlosschleife**.",
        "Kombinierte Operatoren (`+=`, `++`) bauen Ergebnisse schrittweise auf."
      ],
      code: "int i = 7;\nwhile (i > 0)\n    System.out.println(i);\n    i = i - 1;   // gehört NICHT zur Schleife!",
      quiz: [
        { q: "Was passiert im Codebeispiel oben?", a: ["Ausgabe 7 bis 1", "Endlosschleife, es wird immer 7 ausgegeben", "Compilerfehler", "Nichts"], c: 1, why: "Ohne Klammern gehört nur println zur Schleife, i ändert sich nie." },
        { q: "`while (false) {...}` – wie oft läuft der Rumpf?", a: ["0-mal", "1-mal", "unendlich", "Compilerfehler"], c: 3, why: "Fiese Sonderregel: Java meldet unerreichbaren Code als Fehler. Mit einer Variablen statt false wäre es 0-mal." }
      ]
    },
    {
      t: "do-while – die fußgesteuerte Schleife",
      learn: [
        "Prüft die Bedingung **nach** dem Durchlauf: der Rumpf läuft **mindestens einmal**.",
        "Ideal für **Eingabewiederholung**: erst fragen, dann prüfen.",
        "Semikolon nach `while (...)` nicht vergessen!"
      ],
      code: "int port;\ndo {\n    System.out.print(\"Port (1-65535): \");\n    port = sc.nextInt();\n} while (port < 1 || port > 65535);",
      quiz: [
        { q: "Was ist der Unterschied zwischen while und do-while?", a: ["Keiner", "do-while läuft mindestens einmal", "while läuft mindestens einmal", "do-while kann nicht enden"], c: 1, why: "Bei do-while wird erst nach dem Rumpf geprüft." }
      ]
    },
    {
      t: "for – die Zählschleife",
      learn: [
        "Aufbau: `for (Initialisierung; Bedingung; Aktualisierung)`.",
        "Ideal, wenn die **Anzahl der Durchläufe** bekannt ist.",
        "Jede for-Schleife lässt sich als while-Schleife schreiben (und umgekehrt).",
        "Alle drei Teile sind optional, `for(;;)` ist eine Endlosschleife.",
        "Schleifen lassen sich **verschachteln**, z. B. für Tabellen."
      ],
      code: "for (int i = 1; i <= 5; i++) {\n    System.out.println(\"Scan \" + i);\n}\n// gleichwertig:\nint i = 1;\nwhile (i <= 5) { System.out.println(\"Scan \" + i); i++; }",
      quiz: [
        { q: "Wie oft läuft `for (int i = 0; i < 10; i += 3)`?", a: ["3", "4", "10", "unendlich"], c: 1, why: "i = 0, 3, 6, 9 – dann ist 12 nicht mehr < 10." },
        { q: "Ist `for (int i = 10; i > 0; i--)` gültig?", a: ["Ja, zählt rückwärts", "Nein, i-- ist verboten", "Nein, Start muss 0 sein", "Nur mit break"], c: 0, why: "Die Aktualisierung darf beliebig sein, auch dekrementierend." }
      ],
      task: "Gib alle Ports von 20 bis 25 aus und markiere 22 mit \"<- SSH\"."
    },
    {
      t: "break und continue",
      learn: [
        "`break` **verlässt** die Schleife sofort.",
        "`continue` **überspringt** den Rest des aktuellen Durchlaufs.",
        "Sparsam einsetzen – oft lässt sich die Bedingung klarer formulieren."
      ],
      code: "for (String zeile : log) {\n    if (zeile.isBlank()) continue;     // leere Zeilen überspringen\n    if (zeile.contains(\"FATAL\")) break; // Analyse abbrechen\n    analysiere(zeile);\n}",
      quiz: [
        { q: "Was macht `continue`?", a: ["Beendet das Programm", "Beendet die Schleife", "Springt zum nächsten Durchlauf", "Wiederholt den Durchlauf"], c: 2, why: "Der Rest des Rumpfs wird übersprungen, die Schleife läuft weiter." }
      ]
    }
  ]
},
{
  id: "VRB", title: "Vererbung und Polymorphie", color: "#F5A524",
  nibbles: [
    {
      t: "Grundidee: extends",
      learn: [
        "Mit `extends` erbt eine **Subklasse** die nicht-statischen Attribute und Methoden einer **Superklasse**.",
        "So entsteht eine **Klassenhierarchie** (ist-ein-Beziehung).",
        "Java erlaubt nur **Einfachvererbung**: eine direkte Superklasse.",
        "Wurzel aller Klassen ist **Object**."
      ],
      code: "public class Geraet {\n    protected String ip;\n    public void ping() { ... }\n}\npublic class Firewall extends Geraet {\n    private int regelAnzahl;\n    public void regelHinzufuegen(String r) { ... }\n}",
      quiz: [
        { q: "Wie viele direkte Superklassen kann eine Java-Klasse haben?", a: ["Keine", "Genau eine", "Beliebig viele", "Zwei"], c: 1, why: "Java kennt nur Einfachvererbung (Object ist Standard)." },
        { q: "Welche Klasse hat keine Superklasse?", a: ["String", "Object", "Math", "Exception"], c: 1, why: "Object ist die Wurzel der Hierarchie." }
      ]
    },
    {
      t: "Konstruktoren, super und protected",
      learn: [
        "**Konstruktoren werden nicht vererbt.**",
        "Mit `super(...)` ruft man den Konstruktor der Superklasse auf – als **erste Anweisung**.",
        "`this(...)` ruft einen Konstruktor derselben Klasse auf.",
        "`protected`: sichtbar in Subklassen (und im Paket)."
      ],
      code: "public Firewall(String ip, int regeln) {\n    super(ip);              // Geraet(String ip)\n    this.regelAnzahl = regeln;\n}",
      quiz: [
        { q: "Wo muss `super(...)` im Konstruktor stehen?", a: ["Am Ende", "Als erste Anweisung", "Beliebig", "In einer eigenen Methode"], c: 1, why: "Erst wird der Superklassen-Teil aufgebaut." }
      ]
    },
    {
      t: "Überschreiben & Polymorphie",
      learn: [
        "Eine Subklasse kann geerbte Methoden **überschreiben** – gleiche Signatur, mit `@Override` kennzeichnen.",
        "**Polymorphie**: Welche Methode läuft, entscheidet das **Objekt**, nicht der Variablentyp.",
        "Ein Subklassen-Objekt ist **zuweisungskompatibel** zur Superklasse."
      ],
      code: "Geraet g = new Firewall(\"10.0.0.1\", 50);\ng.ping();   // ruft ggf. Firewall.ping() auf\n\nGeraet[] netz = { new Firewall(...), new Router(...) };\nfor (Geraet x : netz) x.ping();  // jeweils passende Variante",
      quiz: [
        { q: "`Geraet g = new Firewall(...); g.ping();` – welche ping-Version läuft, wenn Firewall sie überschreibt?", a: ["Geraet.ping()", "Firewall.ping()", "Keine", "Compilerfehler"], c: 1, why: "Zur Laufzeit zählt der tatsächliche Objekttyp." },
        { q: "Wozu dient `@Override`?", a: ["Pflicht für jede Methode", "Der Compiler prüft, ob wirklich überschrieben wird", "Macht Methoden schneller", "Verhindert Vererbung"], c: 1, why: "Tippfehler in der Signatur fallen so sofort auf." }
      ]
    },
    {
      t: "Casts und instanceof",
      learn: [
        "Über eine Superklassen-Variable sind nur die **dort bekannten Methoden** aufrufbar.",
        "Mit einem **expliziten Cast** erreicht man Subklassen-Methoden: `((Firewall) g).regelHinzufuegen(...)`.",
        "Vorher mit **instanceof** prüfen, sonst droht eine `ClassCastException`."
      ],
      code: "if (g instanceof Firewall) {\n    Firewall fw = (Firewall) g;\n    fw.regelHinzufuegen(\"deny 23\");\n}",
      quiz: [
        { q: "Was passiert bei einem falschen Cast zur Laufzeit?", a: ["Nichts", "ClassCastException", "NullPointerException", "Der Cast wird ignoriert"], c: 1, why: "Das Objekt ist nicht vom erwarteten Typ." }
      ]
    },
    {
      t: "abstract und final",
      learn: [
        "Von einer **abstract**-Klasse lassen sich **keine Objekte** erzeugen – sie ist zum Erben da.",
        "**abstract**-Methoden haben keinen Rumpf und **müssen** in konkreten Subklassen überschrieben werden.",
        "Eine **final**-Klasse kann nicht beerbt werden (z. B. String).",
        "Eine **final**-Methode kann nicht überschrieben werden."
      ],
      code: "public abstract class Sensor {\n    public abstract boolean pruefe(String ereignis);\n}\npublic class PortScanSensor extends Sensor {\n    @Override\n    public boolean pruefe(String e) { return e.contains(\"SYN\"); }\n}",
      quiz: [
        { q: "`new Sensor()` bei abstrakter Klasse Sensor …", a: ["funktioniert", "ist ein Compilerfehler", "erzeugt null", "ruft die Subklasse auf"], c: 1, why: "Abstrakte Klassen sind nicht instanziierbar." },
        { q: "Kann man von String erben?", a: ["Ja", "Nein, String ist final", "Nur im selben Paket", "Nur mit super"], c: 1, why: "String ist eine finale Klasse." }
      ]
    }
  ]
},
{
  id: "EXC", title: "Ausnahmebehandlung", color: "#FF6B6B",
  nibbles: [
    {
      t: "try-catch und der Aufruf-Stack",
      learn: [
        "Tritt eine Ausnahme auf, wird ein **Exception-Objekt** erzeugt und **geworfen**.",
        "Die Methode bricht ab; gesucht wird ein **passender catch-Block** – erst lokal, dann den **Aufruf-Stack** hinauf.",
        "Fängt niemand die Ausnahme, bricht das Programm mit **Stacktrace** ab.",
        "Schlüsselwörter: `try`, `catch`, `throw`, `throws` (und selten `finally`)."
      ],
      code: "try {\n    int port = Integer.parseInt(eingabe);\n    verbinde(port);\n} catch (NumberFormatException e) {\n    System.out.println(\"Keine gültige Zahl: \" + eingabe);\n}",
      quiz: [
        { q: "Was passiert, wenn eine Exception nirgends gefangen wird?", a: ["Sie wird ignoriert", "Programmabbruch mit Stacktrace", "Die Methode wird wiederholt", "Der Compiler meldet sie"], c: 1, why: "Die JVM beendet das Programm und gibt den Aufruf-Stack aus." }
      ]
    },
    {
      t: "throws und throw",
      learn: [
        "Kann eine Methode eine Ausnahme nicht sinnvoll behandeln, gibt sie sie mit **throws** im Kopf weiter.",
        "Dokumentieren mit `@throws` im javadoc.",
        "Mit **throw** löst man selbst eine Ausnahme aus.",
        "Typisch: ungültige Argumente mit `IllegalArgumentException` abweisen."
      ],
      code: "/** @throws IllegalArgumentException bei ungültigem Port */\npublic static void setPort(int p) {\n    if (p < 0 || p > 65535) {\n        throw new IllegalArgumentException(\"Port: \" + p);\n    }\n    ...\n}",
      quiz: [
        { q: "Welches Schlüsselwort steht im Methodenkopf?", a: ["throw", "throws", "catch", "try"], c: 1, why: "throws deklariert, throw wirft." }
      ]
    },
    {
      t: "checked vs. unchecked",
      learn: [
        "Alle Ausnahmen erben von **Throwable**; behandelbare von **Exception**.",
        "**Checked Exceptions** (von Exception, z. B. IOException) **müssen** behandelt oder mit throws weitergegeben werden.",
        "**Unchecked Exceptions** (von RuntimeException, z. B. NullPointerException) stellt der Compiler frei.",
        "Mehrere catch-Blöcke: **spezifische Typen zuerst**, allgemeine danach."
      ],
      code: "try {\n    leseLog(datei);\n} catch (FileNotFoundException e) {\n    System.out.println(\"Datei fehlt\");\n} catch (IOException e) {\n    System.out.println(\"Lesefehler\");\n}",
      quiz: [
        { q: "Welche Exception ist unchecked?", a: ["IOException", "FileNotFoundException", "ArrayIndexOutOfBoundsException", "Exception"], c: 2, why: "Sie erbt von RuntimeException." },
        { q: "Warum muss catch (IOException) NACH catch (FileNotFoundException) stehen?", a: ["Alphabetisch", "FileNotFoundException ist eine Unterklasse und wäre sonst unerreichbar", "Egal", "Wegen finally"], c: 1, why: "Der allgemeinere Block würde den spezielleren immer abfangen." }
      ]
    },
    {
      t: "Eigene Exceptions & Vermeidung",
      learn: [
        "Eigene Exceptions erben von **Exception** oder **RuntimeException**.",
        "Wichtig ist ein **aussagekräftiger Name**, der auf **…Exception** endet.",
        "Viele Ausnahmen lassen sich **von vornherein vermeiden**: Eingaben prüfen, null testen, Indexgrenzen beachten.",
        "Eingabewiederholung: Schleife um try-catch, bis die Eingabe gültig ist."
      ],
      code: "public class UngueltigeIPException extends Exception {\n    public UngueltigeIPException(String msg) {\n        super(msg);\n    }\n}",
      quiz: [
        { q: "Was ist der wichtigste Bestandteil einer eigenen Exception-Klasse?", a: ["Viele Attribute", "Ein aussagekräftiger Name", "Eine main-Methode", "Ein statischer Zähler"], c: 1, why: "Der Name beschreibt die Fehlersituation." }
      ],
      task: "Lies so lange eine Zahl ein, bis sie gültig ist: fange NumberFormatException ab und wiederhole die Eingabe in einer do-while-Schleife."
    }
  ]
},
{
  id: "ARR", title: "Arrays", color: "#B48CFF",
  nibbles: [
    {
      t: "Arrays deklarieren und erzeugen",
      learn: [
        "Ein Array speichert **mehrere Werte gleichen Typs**; Arrays sind **Objekte**.",
        "Deklaration: `int[] ports;` – Erzeugung: `ports = new int[5];`",
        "Oder direkt initialisieren: `int[] ports = {22, 80, 443};`",
        "Die Länge ist danach **fest**; `ports.length` (Attribut, ohne Klammern!) liefert sie.",
        "Neue Arrays sind mit Standardwerten gefüllt (0, false, null)."
      ],
      code: "int[] ports = {22, 80, 443};\nString[] user = new String[3];   // {null, null, null}\nSystem.out.println(ports.length); // 3",
      quiz: [
        { q: "Welche Vereinbarung ist korrekt?", a: ["int a[] = new int();", "int[] a = new int[4];", "int[4] a;", "int[] a = {1;2;3};"], c: 1, why: "Größe beim new in eckigen Klammern; Initialisierungsliste mit Kommas." },
        { q: "Wie ermittelt man die Länge eines Arrays a?", a: ["a.length()", "a.size()", "a.length", "length(a)"], c: 2, why: "Bei Arrays ist length ein Attribut, bei Strings eine Methode." }
      ]
    },
    {
      t: "Zugriff, Index und Schleifen",
      learn: [
        "Index beginnt bei **0**, höchster Index ist **length - 1**.",
        "Ungültiger Index → **ArrayIndexOutOfBoundsException**.",
        "`for`-Schleife, wenn Elemente **verändert** werden sollen.",
        "**foreach** `for (int p : ports)`, wenn nur **gelesen** wird."
      ],
      code: "int[] feld = {3, 6, 9, 12, 15};\nSystem.out.println(feld[2]);  // 9\nfor (int i = 0; i < feld.length; i++) feld[i] *= 2;\nfor (int x : feld) System.out.print(x + \" \");",
      quiz: [
        { q: "`int[] feld = {3,6,9,12,15}; feld[2]` ergibt …", a: ["6", "9", "12", "3"], c: 1, why: "Index 0 → 3, 1 → 6, 2 → 9." },
        { q: "Was passiert bei `feld[5]` im selben Array?", a: ["15", "0", "ArrayIndexOutOfBoundsException", "null"], c: 2, why: "Gültige Indizes sind 0 bis 4." }
      ]
    },
    {
      t: "Die Klasse Arrays",
      learn: [
        "`System.out.println(array)` gibt nur eine **Referenz** wie `[I@1b6d3586` aus.",
        "`Arrays.toString(array)` liefert `[1, 2, 3]`.",
        "Weitere Helfer: `Arrays.sort`, `Arrays.copyOf`, `Arrays.equals`, `Arrays.fill`.",
        "Import: `java.util.Arrays`."
      ],
      code: "import java.util.Arrays;\nint[] a = {5, 1, 4};\nArrays.sort(a);\nSystem.out.println(Arrays.toString(a)); // [1, 4, 5]\nint[] groesser = Arrays.copyOf(a, 5);   // [1, 4, 5, 0, 0]",
      quiz: [
        { q: "Was gibt `System.out.println(new int[]{1,2,3})` aus?", a: ["[1, 2, 3]", "123", "Etwas wie [I@1b6d3586", "Compilerfehler"], c: 2, why: "Arrays überschreiben toString nicht – man sieht Typ und Hashcode." }
      ],
      task: "Speichere die Antwortzeiten (ms) von 6 Pings in einem Array und gib Minimum, Maximum und Durchschnitt aus."
    },
    {
      t: "Arrays von Objekten & Kommandozeile",
      learn: [
        "Arrays können **Referenzen** speichern: `Alarm[] alarme = new Alarm[10];` – anfangs alles **null**.",
        "Vor dem Methodenaufruf auf ein Element prüfen, ob es nicht null ist.",
        "**Akkumulieren**: Summe/Zähler in einer Schleife aufbauen.",
        "Kommandozeilenargumente kommen als `String[] args` in main an."
      ],
      code: "int offen = 0;\nfor (Alarm a : alarme) {\n    if (a != null && !a.isBearbeitet()) offen++;\n}\n// java Scanner 10.0.0.1  ->  args[0] = \"10.0.0.1\"",
      quiz: [
        { q: "Was steht nach `new Alarm[3]` in den Elementen?", a: ["Drei neue Alarm-Objekte", "null", "0", "Leere Strings"], c: 1, why: "Es werden nur die Plätze für Referenzen angelegt." }
      ]
    },
    {
      t: "Zweidimensionale Arrays",
      learn: [
        "Ein 2D-Array ist ein **Array von Arrays** – wie eine Tabelle.",
        "`char[][] a = new char[3][2];` → **3 Zeilen, 2 Spalten**.",
        "Zugriff mit zwei Indizes: `a[zeile][spalte]`.",
        "Durchlaufen mit **verschachtelten Schleifen**; `a.length` = Zeilen, `a[0].length` = Spalten."
      ],
      code: "int[][] matrix = new int[3][4];\nfor (int z = 0; z < matrix.length; z++) {\n    for (int s = 0; s < matrix[z].length; s++) {\n        matrix[z][s] = z * s;\n    }\n}",
      quiz: [
        { q: "Wie erzeugt man ein char-Array mit 3 Zeilen und 2 Spalten?", a: ["new char[2][3]", "new char[3][2]", "new char[3,2]", "new char[6]"], c: 1, why: "Erst Zeilen, dann Spalten." }
      ]
    }
  ]
},
{
  id: "ZKT", title: "Zeichenketten", color: "#B48CFF",
  nibbles: [
    {
      t: "String-Grundlagen",
      learn: [
        "Ein String ist eine Folge von **Unicode-Zeichen** und ein **Referenztyp**.",
        "Meist per **Literal** erzeugt: `String s = \"alert\";`",
        "Strings sind **unveränderlich** (immutable): Methoden liefern einen **neuen** String.",
        "`length()` liefert die Länge, `charAt(i)` ein Zeichen (Index ab 0)."
      ],
      code: "String s = \"Firewall\";\ns.length();        // 8\ns.charAt(0);       // 'F'\ns.toUpperCase();   // \"FIREWALL\" – s selbst bleibt unverändert!",
      quiz: [
        { q: "Was steht nach `s.toUpperCase();` (ohne Zuweisung) in s?", a: ["Großbuchstaben", "Der Originalwert", "null", "Leerstring"], c: 1, why: "Strings sind unveränderlich, das Ergebnis wurde verworfen." }
      ]
    },
    {
      t: "Wichtige String-Methoden",
      learn: [
        "Suchen: `indexOf`, `contains`, `startsWith`, `endsWith`.",
        "Herausschneiden: `substring(von, bis)` – **bis ist exklusiv**.",
        "Aufräumen: `trim()`, `strip()`, `toLowerCase()`.",
        "Zerlegen: `split(\"\\\\.\")` – Achtung, Regex!"
      ],
      code: "String ip = \"192.168.1.20\";\nip.indexOf('.');           // 3\nip.substring(0, 3);        // \"192\"\nString[] teile = ip.split(\"\\\\.\"); // {\"192\",\"168\",\"1\",\"20\"}\n\"  root \".trim();          // \"root\"",
      quiz: [
        { q: "`\"Logfile\".substring(0, 3)` ergibt …", a: ["\"Log\"", "\"Logf\"", "\"ogf\"", "\"Lo\""], c: 0, why: "Index 0 bis ausschließlich 3." },
        { q: "Was liefert `\"abc\".indexOf('z')`?", a: ["0", "null", "-1", "Exception"], c: 2, why: "-1 bedeutet: nicht gefunden." }
      ],
      task: "Zerlege eine IP-Adresse mit split in ihre Oktette und prüfe, ob jedes zwischen 0 und 255 liegt (Integer.parseInt)."
    },
    {
      t: "Vergleichen und Verknüpfen",
      learn: [
        "**Niemals** Strings mit `==` vergleichen – das prüft nur die Referenz.",
        "Inhalt: `equals`, ohne Groß/Klein: `equalsIgnoreCase`, Reihenfolge: `compareTo`.",
        "Verknüpfen (**Konkatenation**) mit `+`; andere Typen werden dabei automatisch zu String.",
        "Vorsicht: `\"Port \" + 4 + 4` ergibt `Port 44`, `4 + 4 + \" Ports\"` ergibt `8 Ports`."
      ],
      code: "if (eingabe.equalsIgnoreCase(\"ja\")) { ... }\n\"a\".compareTo(\"b\");   // negativ\nSystem.out.println(\"P\" + 1 + 2);  // P12\nSystem.out.println(1 + 2 + \"P\");  // 3P",
      quiz: [
        { q: "Was gibt `System.out.println(1 + 2 + \"3\" + 4)` aus?", a: ["1234", "334", "10", "37"], c: 1, why: "1 + 2 = 3, dann String: \"3\" + \"3\" + \"4\" = \"334\"." }
      ]
    },
    {
      t: "StringBuilder",
      learn: [
        "**StringBuilder** ist **veränderbar** – Methoden ändern das Objekt selbst.",
        "`append`, `insert`, `delete`, `reverse`, `setCharAt`.",
        "Ideal zum Zusammenbauen von Texten in **Schleifen** (effizienter als `+`).",
        "Mit `toString()` erhält man wieder einen String."
      ],
      code: "StringBuilder sb = new StringBuilder();\nfor (int p : offenePorts) {\n    sb.append(p).append(\", \");\n}\nsb.setLength(sb.length() - 2); // letztes \", \" weg\nString bericht = sb.toString();",
      quiz: [
        { q: "Was ist der Kernunterschied zwischen String und StringBuilder?", a: ["Keiner", "StringBuilder ist veränderbar", "String ist schneller beim Anhängen", "StringBuilder kann kein Unicode"], c: 1, why: "StringBuilder ändert sich selbst, String erzeugt neue Objekte." }
      ]
    },
    {
      t: "Formatierte Ausgabe",
      learn: [
        "`String.format` und `System.out.printf` mit Platzhaltern: `%d` (Ganzzahl), `%.2f` (2 Nachkommastellen), `%s` (String), `%n` (Zeilenumbruch).",
        "`NumberFormat` (java.text) für **Währungen** und **Prozent** je nach Locale.",
        "`DateTimeFormatter` (java.time.format) für **Datumsformate**."
      ],
      code: "System.out.printf(\"%-15s %5d%n\", \"10.0.0.1\", 443);\nString p = String.format(\"%.1f %%\", 87.456); // \"87,5 %\" (deutsche Locale)\n\nDateTimeFormatter f = DateTimeFormatter.ofPattern(\"dd.MM.yyyy HH:mm\");\nSystem.out.println(LocalDateTime.now().format(f));",
      quiz: [
        { q: "Welcher Platzhalter gibt eine Kommazahl mit 2 Nachkommastellen aus?", a: ["%d", "%2f", "%.2f", "%s2"], c: 2, why: "%.2f = Fließkomma, 2 Stellen nach dem Komma." }
      ]
    }
  ]
}
);
