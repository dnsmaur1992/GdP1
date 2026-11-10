// nibble – Klausurtraining GP1, Aufbau wie die Probeklausur
// Eigene Parallelaufgaben; alle Ausgaben und Lösungen mit javac/java geprüft.
var R = String.raw;
var SECTIONS = [
  { id: "A1", title: "Variablen, Datentypen, Operatoren" },
  { id: "A2", title: "Klassen und Objekte" },
  { id: "A3", title: "Vererbung und Ausnahmen" },
  { id: "A4", title: "Kontrollstrukturen und statische Methoden" },
  { id: "A5", title: "Arrays und Zeichenketten" }
];

var EXAM = [
// ---------- A1: korrekt oder nicht? ----------
{ sec: "A1", type: "tf", s: "`double x = 1 + 2 - 3 / 4.0;`", ok: true, why: "3 / 4.0 ist eine double-Division (0.75), x wird 2.25." },
{ sec: "A1", type: "tf", s: "`int y = 10 + 3.9;`", ok: false, why: "10 + 3.9 ist double. Eine Zuweisung an int braucht einen expliziten Cast: `(int)(10 + 3.9)`." },
{ sec: "A1", type: "tf", s: "`long z = 5000000000;`", ok: false, why: "Das Literal ist ein int und zu groß dafür. Es fehlt das `L`: `5000000000L`." },
{ sec: "A1", type: "tf", s: "`char c = \"A\";`", ok: false, why: "\"A\" ist ein String. Ein char-Literal steht in einfachen Hochkommas: `'A'`." },
{ sec: "A1", type: "tf", s: "`String gruss = Guten Morgen;`", ok: false, why: "Die Anführungszeichen fehlen. So hält der Compiler Guten und Morgen für Bezeichner." },
{ sec: "A1", type: "tf", s: "`int 2te = 5;`", ok: false, why: "Bezeichner dürfen nicht mit einer Ziffer beginnen." },
{ sec: "A1", type: "tf", s: "`boolean b = (x > 1 || < 10);`", ok: false, why: "Der rechte Operand von `||` ist unvollständig. Richtig: `(x > 1 || x < 10)`." },
{ sec: "A1", type: "tf", s: "`boolean b = !(3 == 3);`", ok: true, why: "3 == 3 ist true, die Negation ergibt false. Syntaktisch einwandfrei." },
{ sec: "A1", type: "tf", s: "`int r = 17 % 5;` setzt r auf 2.", ok: true, why: "17 = 3 · 5 + 2, der Rest ist 2." },
{ sec: "A1", type: "tf", s: "`float f = 2.5;`", ok: false, why: "2.5 ist ein double-Literal. Für float braucht man `2.5F` oder einen Cast." },
{ sec: "A1", type: "tf", s: "`int i = 7 / 2;` setzt i auf 3.5.", ok: false, why: "Ganzzahldivision: das Ergebnis ist 3, der Rest wird abgeschnitten." },
{ sec: "A1", type: "tf", s: "Eine Variable des Typs boolean kann drei Werte annehmen: true, false und null.", ok: false, why: "Der primitive Typ boolean kennt nur true und false. null gibt es nur bei Referenztypen." },
{ sec: "A1", type: "tf", s: "`werte[0]` ist das erste Element des Arrays werte.", ok: true, why: "Die Indizierung beginnt bei 0." },
{ sec: "A1", type: "tf", s: "Ein Array der Länge 5 hat den höchsten Index 5.", ok: false, why: "Der höchste Index ist length - 1, also 4." },
{ sec: "A1", type: "tf", s: "`System.out.println(werte);` gibt die Elemente des int-Arrays werte aus.", ok: false, why: "Ausgegeben wird nur eine Referenz wie `[I@1b6d3586`. Für die Elemente: `Arrays.toString(werte)` oder eine Schleife." },
{ sec: "A1", type: "tf", s: "Die Größe eines Arrays kann nach seiner Erzeugung nicht mehr geändert werden.", ok: true, why: "length ist final. Für eine andere Größe muss ein neues Array erzeugt werden." },
{ sec: "A1", type: "tf", s: "Ein Array eignet sich gut, um Werte verschiedener Datentypen zu speichern.", ok: false, why: "Alle Elemente eines Arrays haben denselben Datentyp." },
{ sec: "A1", type: "tf", s: "Nach `int[] a = new int[3];` enthält a drei Nullen.", ok: true, why: "Neue int-Arrays werden mit dem Standardwert 0 gefüllt." },
{ sec: "A1", type: "tf", s: "`s1 == s2` vergleicht bei zwei Strings den Inhalt.", ok: false, why: "== vergleicht die Referenzen. Für den Inhalt: `s1.equals(s2)`." },
{ sec: "A1", type: "tf", s: "Einer mit `final` deklarierten Variablen kann man später keinen neuen Wert zuweisen.", ok: true, why: "final erlaubt genau eine Zuweisung." },
{ sec: "A1", type: "tf", s: "Ein Konstruktor hat den Rückgabetyp void.", ok: false, why: "Konstruktoren haben überhaupt keinen Rückgabetyp, auch nicht void." },

// ---------- A2: Klassen und Objekte ----------
{ sec: "A2", type: "write",
  task: "Schreiben Sie eine vollständige Klasse `Server` mit einem Attribut für den Hostnamen, einem Konstruktor mit sinnvollem Parameter, passenden get- und set-Methoden. Überschreiben Sie `toString()`, sodass „Dieser Server heißt [hostname]“ zurückgegeben wird.",
  sol: R`public class Server {
    private String hostname;

    public Server(String hostname) {
        this.hostname = hostname;
    }

    public String getHostname() {
        return hostname;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    @Override
    public String toString() {
        return "Dieser Server heißt " + hostname;
    }
}`,
  check: ["Attribut ist `private`", "Konstruktor heißt `Server`, ohne Rückgabetyp, setzt `this.hostname`", "Getter mit Rückgabetyp String und `return`", "Setter mit Parameter und Rückgabetyp void", "`@Override` und `public String toString()` mit `return`"] },
{ sec: "A2", type: "write",
  task: "Ergänzen Sie die Anweisungen, sodass „Dieser Server heißt web01“ ausgegeben wird:\n`Server meinServer = new ______;`\n`System.out.println(______);`",
  sol: R`Server meinServer = new Server("web01");
System.out.println(meinServer);
// gleichwertig: System.out.println(meinServer.toString());`,
  check: ["Konstruktoraufruf mit String-Argument in Anführungszeichen", "println erhält das Objekt (toString wird automatisch aufgerufen)"] },
{ sec: "A2", type: "explain", q: "Nennen Sie zwei Merkmale, an denen man einen Konstruktor eindeutig erkennt.",
  sol: "Ein Konstruktor heißt genau wie die Klasse und hat keinen Rückgabetyp, auch nicht void.",
  check: ["Name = Klassenname", "Kein Rückgabetyp (auch kein void)"] },
{ sec: "A2", type: "explain", q: "Erläutern Sie die Methodenannotation `@Override`.",
  sol: "@Override kennzeichnet eine Methode, die eine geerbte Methode (z. B. toString aus Object) überschreibt. Der Compiler prüft dann, ob es in der Oberklasse wirklich eine Methode mit dieser Signatur gibt. Tippfehler im Namen oder falsche Parameter fallen so als Compilerfehler auf, statt unbemerkt eine neue Methode anzulegen.",
  check: ["Kennzeichnet das Überschreiben einer geerbten Methode", "Compiler prüft die Signatur", "Nutzen: Fehler (z. B. Tippfehler) werden früh erkannt"] },
{ sec: "A2", type: "explain", q: "Folgender Code gibt `false` aus. Erläutern Sie warum, wie man zwei Objekte anhand ihrer Attributwerte vergleicht und wie man die Klasse Server dafür erweitert.\n`Server a = new Server(\"web01\");`\n`Server b = new Server(\"web01\");`\n`System.out.println(a == b);`",
  sol: "a und b enthalten Referenzen auf zwei verschiedene Objekte. == vergleicht bei Objekten die Referenzen (Identität), nicht den Inhalt, daher false. Für einen inhaltlichen Vergleich nutzt man equals(). Dafür muss Server die von Object geerbte Methode `public boolean equals(Object o)` überschreiben und darin die Hostnamen mit equals vergleichen.",
  code: R`@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Server)) return false;
    Server s = (Server) o;
    return hostname.equals(s.hostname);
}`,
  check: ["Zwei verschiedene Objekte → verschiedene Referenzen", "== prüft Identität, nicht Inhalt", "Vergleich per equals()", "equals(Object) in Server überschreiben und Attribute vergleichen"] },
{ sec: "A2", type: "explain", q: "Erläutern Sie den Unterschied zwischen Klasse und Objekt.",
  sol: "Eine Klasse ist der Bauplan bzw. Datentyp: Sie legt fest, welche Attribute und Methoden es gibt. Ein Objekt (Instanz) ist ein konkretes Exemplar dieser Klasse mit eigenen Attributwerten, erzeugt mit new und einem Konstruktor. Von einer Klasse kann es viele Objekte geben.",
  check: ["Klasse = Bauplan/Datentyp", "Objekt = konkrete Instanz mit eigenem Zustand", "Erzeugung mit new"] },
{ sec: "A2", type: "explain", q: "Warum deklariert man Attribute meist als `private` und bietet Getter und Setter an?",
  sol: "Das ist Datenkapselung: Von außen kann niemand den Zustand direkt verändern. Zugriff läuft nur über Methoden, die z. B. ungültige Werte abweisen können. Die interne Darstellung lässt sich später ändern, ohne dass anderer Code angepasst werden muss.",
  check: ["Begriff Datenkapselung", "Kontrollierter Zugriff / Validierung im Setter", "Interne Änderungen bleiben nach außen unsichtbar"] },

// ---------- A3: Vererbung und Ausnahmen ----------
{ sec: "A3", type: "write",
  task: "Die Klasse `Webserver` erbt von `Server` (A2). Sie hat zwei weitere Attribute für Port und maximale Verbindungszahl, einen Konstruktor für alle Attribute und überschreibt `toString()`, sodass Hostname, Port und Verbindungszahl ausgegeben werden. Bei negativer Verbindungszahl wirft der Konstruktor eine `IllegalArgumentException` mit der Nachricht „Negative Verbindungszahl ungültig!“.",
  sol: R`public class Webserver extends Server {
    private int port;
    private int maxVerbindungen;

    public Webserver(String hostname, int port, int maxVerbindungen) {
        super(hostname);
        if (maxVerbindungen < 0) {
            throw new IllegalArgumentException("Negative Verbindungszahl ungültig!");
        }
        this.port = port;
        this.maxVerbindungen = maxVerbindungen;
    }

    @Override
    public String toString() {
        return super.toString() + ", Port " + port
             + ", max. " + maxVerbindungen + " Verbindungen";
    }
}`,
  check: ["`extends Server`", "`super(hostname)` als erste Anweisung", "`throw new IllegalArgumentException(\"...\")` bei Wert < 0", "Neue Attribute private und im Konstruktor gesetzt", "toString mit @Override; Hostname über super.toString() oder getHostname()"] },
{ sec: "A3", type: "explain", q: "Gegeben ist:\n`int verbindungen = sc.nextInt();  // Scanner-Eingabe`\n`try {`\n`  Server s = new Webserver(\"web02\", 443, verbindungen);`\n`  System.out.println(s.toString());`\n`} catch (IllegalArgumentException e) {`\n`  System.out.println(e.getMessage());`\n`}`\nWas passiert, wenn der Benutzer 1. eine positive Zahl, 2. eine negative Zahl, 3. „Hallo“ eingibt?",
  sol: "1. Das Objekt wird erzeugt, toString() liefert Hostname, Port und Verbindungszahl, das wird ausgegeben; der catch-Block wird übersprungen.\n2. Der Konstruktor wirft die IllegalArgumentException, der try-Block bricht vor der Ausgabe ab. Der catch-Block fängt sie und gibt „Negative Verbindungszahl ungültig!“ aus.\n3. Schon nextInt() wirft eine InputMismatchException – und zwar vor dem try-Block. Sie wird nicht gefangen (und wäre auch keine IllegalArgumentException), also bricht das Programm mit Stacktrace ab.",
  check: ["Fall 1: normale Ausgabe, catch übersprungen", "Fall 2: Exception im Konstruktor, catch gibt die Nachricht aus", "Fall 3: Fehler beim Einlesen außerhalb von try / falscher Typ → Programmabbruch"] },
{ sec: "A3", type: "explain", q: "Erläutern Sie am Beispiel `Server s = new Webserver(...); s.toString();` das Konzept der Polymorphie.",
  sol: "Die Variable s hat den Typ Server, enthält aber ein Webserver-Objekt. Das ist erlaubt, weil Webserver zuweisungskompatibel zu seiner Oberklasse ist. Beim Aufruf s.toString() entscheidet das tatsächliche Objekt zur Laufzeit, welche Methode läuft: Ausgeführt wird die überschriebene toString() von Webserver, nicht die von Server.",
  check: ["Variablentyp Server, Objekttyp Webserver", "Zuweisungskompatibilität Unterklasse → Oberklasse", "Zur Laufzeit läuft die überschriebene Methode des Objekts"] },
{ sec: "A3", type: "trace",
  code: R`class Tier {
    String laut() { return "..."; }
    String info() { return "Tier sagt " + laut(); }
}
class Hund extends Tier {
    @Override String laut() { return "Wuff"; }
}
class Katze extends Tier {
    @Override String laut() { return "Miau"; }
}
// in main:
Tier[] zoo = { new Hund(), new Katze(), new Tier() };
for (Tier z : zoo) System.out.println(z.info());`,
  out: "Tier sagt Wuff\nTier sagt Miau\nTier sagt ...",
  why: "info() ist nur in Tier definiert, ruft aber laut() polymorph auf: Es läuft jeweils die Version des tatsächlichen Objekts." },
{ sec: "A3", type: "explain", q: "Was ist der Unterschied zwischen checked und unchecked Exceptions?",
  sol: "Checked Exceptions erben von Exception (aber nicht von RuntimeException), z. B. IOException. Der Compiler verlangt, dass man sie mit try-catch behandelt oder mit throws weitergibt. Unchecked Exceptions erben von RuntimeException, z. B. IllegalArgumentException oder NullPointerException; ihre Behandlung ist freiwillig.",
  check: ["checked: von Exception, Behandlung oder throws Pflicht", "unchecked: von RuntimeException, Behandlung freiwillig", "Je ein Beispiel"] },
{ sec: "A3", type: "explain", q: "Was ist eine abstrakte Klasse und wozu dient sie?",
  sol: "Eine mit abstract gekennzeichnete Klasse kann nicht instanziiert werden. Sie dient als gemeinsame Oberklasse und kann abstrakte Methoden ohne Rumpf enthalten, die jede konkrete Unterklasse überschreiben muss. So erzwingt man eine einheitliche Schnittstelle.",
  check: ["Keine Objekte mit new möglich", "Abstrakte Methoden ohne Rumpf", "Unterklassen müssen sie implementieren"] },

// ---------- A4: Kontrollstrukturen und statische Methoden ----------
{ sec: "A4", type: "trace",
  code: R`String sep = "**";
for (int i = 1; i <= 12; i += 2) {
    if (i % 3 == 0) {
        System.out.print(i + " ");
    } else {
        System.out.print("- ");
    }
    switch (i) {
        case 5 -> {
            System.out.println();
            System.out.println(sep);
            sep = sep + "#";
        }
        case 9 -> {
            System.out.println();
            System.out.println(sep);
        }
    }
}`,
  out: "- 3 - \n**\n- 9 \n**#\n- ",
  why: "i läuft 1, 3, 5, 7, 9, 11. Nur 3 und 9 sind durch 3 teilbar. Bei i = 5 und i = 9 folgt ein Zeilenumbruch und der Trenner; nach i = 5 wird sep zu \"**#\". Pfeil-Syntax: kein Durchfallen." },
{ sec: "A4", type: "trace",
  code: R`int s = 0;
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) continue;
    if (i > 7) break;
    s += i;
    System.out.print(s + " ");
}`,
  out: "1 4 9 16 ",
  why: "Gerade i werden übersprungen. Summiert werden 1, 3, 5, 7. Bei i = 9 greift break." },
{ sec: "A4", type: "trace",
  code: R`int x = 2;
switch (x) {
    case 1: System.out.print("A");
    case 2: System.out.print("B");
    case 3: System.out.print("C"); break;
    default: System.out.print("D");
}`,
  out: "BC",
  why: "Alte Syntax ohne break: ab case 2 fällt die Ausführung durch bis zum break nach C." },
{ sec: "A4", type: "trace",
  code: R`for (int z = 1; z <= 3; z++) {
    for (int sp = 1; sp <= z; sp++) {
        System.out.print(z * sp + " ");
    }
    System.out.println();
}`,
  out: "1 \n2 4 \n3 6 9 ",
  why: "Die innere Schleife läuft z-mal. Nach jeder Zeile folgt ein Umbruch." },
{ sec: "A4", type: "trace",
  code: R`int k = 10;
int n = 0;
while (k > 1) {
    k = k / 2;
    n++;
}
System.out.println(k + " " + n);`,
  out: "1 3",
  why: "10 → 5 → 2 → 1 (Ganzzahldivision), also drei Durchläufe." },
{ sec: "A4", type: "write",
  task: "Schreiben Sie eine statische Methode `produkt`, die zwei int-Zahlen a und b erhält und das Produkt aller Zahlen von a bis b zurückgibt. Beispiel: `produkt(2, 4)` liefert 24 (2 · 3 · 4). Es gilt a < b.",
  sol: R`public static int produkt(int a, int b) {
    int p = 1;
    for (int i = a; i <= b; i++) {
        p *= i;
    }
    return p;
}`,
  check: ["Kopf: `public static int produkt(int a, int b)`", "Startwert 1 (nicht 0!)", "Schleife von a bis einschließlich b (`<=`)", "`return` am Ende"] },
{ sec: "A4", type: "write",
  task: "Schreiben Sie eine statische Methode `summeGerade`, die die Summe aller geraden Zahlen von a bis b zurückgibt. Beispiel: `summeGerade(3, 8)` liefert 18 (4 + 6 + 8).",
  sol: R`public static int summeGerade(int a, int b) {
    int s = 0;
    for (int i = a; i <= b; i++) {
        if (i % 2 == 0) {
            s += i;
        }
    }
    return s;
}`,
  check: ["Rückgabetyp int, zwei int-Parameter", "Prüfung `i % 2 == 0`", "Grenze b eingeschlossen", "Summe zurückgeben"] },
{ sec: "A4", type: "explain", q: "Beschreiben Sie, wie sich der Aufruf einer statischen Methode syntaktisch vom Aufruf einer Instanzmethode unterscheidet.",
  sol: "Eine statische Methode ruft man über den Klassennamen auf: `Math.sqrt(16)`. Eine Instanzmethode ruft man über eine Variable auf, die ein Objekt referenziert: `text.length()`. Innerhalb derselben Klasse darf der Klassenname bei statischen Methoden entfallen.",
  check: ["statisch: `Klassenname.methode(...)`", "Instanz: `objekt.methode(...)`", "Je ein Beispiel"] },
{ sec: "A4", type: "explain", q: "Wann verwendet man eine while-, wann eine do-while- und wann eine for-Schleife?",
  sol: "for, wenn die Anzahl der Durchläufe vorab feststeht (Zählschleife). while, wenn eine Bedingung vor jedem Durchlauf geprüft werden soll und der Rumpf eventuell gar nicht laufen muss. do-while, wenn der Rumpf mindestens einmal laufen soll, z. B. bei einer Eingabewiederholung.",
  check: ["for: bekannte Anzahl", "while: kopfgesteuert, evtl. 0 Durchläufe", "do-while: mindestens 1 Durchlauf"] },

// ---------- A5: Arrays und Zeichenketten ----------
{ sec: "A5", type: "explain", q: "Beschreiben und begründen Sie den Zusammenhang zwischen Länge und größtem Index eines Arrays.",
  sol: "Der größte Index ist length - 1. Begründung: Die Indizierung beginnt bei 0, ein Array mit n Elementen hat also die Indizes 0 bis n - 1. Ein Zugriff auf Index length führt zur ArrayIndexOutOfBoundsException.",
  check: ["größter Index = length - 1", "Begründung: Zählung ab 0", "Folge bei Überschreitung: ArrayIndexOutOfBoundsException"] },
{ sec: "A5", type: "explain", q: "Erläutern Sie den grundsätzlichen Unterschied zwischen String- und StringBuilder-Objekten.",
  sol: "String-Objekte sind unveränderlich: Methoden wie toUpperCase() liefern ein neues Objekt, das Original bleibt gleich. StringBuilder-Objekte sind veränderbar: append, insert oder reverse ändern das Objekt selbst. Darum eignet sich StringBuilder zum schrittweisen Aufbauen von Text, z. B. in Schleifen.",
  check: ["String: unveränderlich, Methoden liefern neuen String", "StringBuilder: veränderbar, Methoden ändern das Objekt", "Einsatz: Text in Schleifen zusammenbauen"] },
{ sec: "A5", type: "write",
  task: "Ein Sensor schreibt Lastwerte in ein Array. Werte über einem Grenzwert sind Messfehler. Schreiben Sie eine statische Methode `kappen`, die ein double-Array `werte` und einen double-Wert `max` erhält und im Array alle Einträge größer als max durch max ersetzt.",
  sol: R`public static void kappen(double[] werte, double max) {
    for (int i = 0; i < werte.length; i++) {
        if (werte[i] > max) {
            werte[i] = max;
        }
    }
}`,
  check: ["Rückgabetyp void (das Array wird direkt verändert)", "Parameter `double[] werte, double max`", "for-Schleife mit Index (foreach könnte nicht schreiben)", "Grenze `i < werte.length`"] },
{ sec: "A5", type: "write",
  task: "Schreiben Sie eine statische Methode `grossbuchstaben`, die einen String erhält und zurückgibt, wie viele Großbuchstaben er enthält. Verwenden Sie `Character.isUpperCase(char)`. Beispiel: `grossbuchstaben(\"Grundlagen der Programmierung\")` liefert 2.",
  sol: R`public static int grossbuchstaben(String text) {
    int n = 0;
    for (int i = 0; i < text.length(); i++) {
        if (Character.isUpperCase(text.charAt(i))) {
            n++;
        }
    }
    return n;
}`,
  check: ["`text.length()` mit Klammern (Methode!)", "`charAt(i)` liefert ein char", "Statische Methode der Klasse Character: `Character.isUpperCase(...)`", "Zähler zurückgeben"] },
{ sec: "A5", type: "write",
  task: "Eine quadratische Matrix ist in **unterer Dreiecksform**, wenn alle Einträge **oberhalb** der Hauptdiagonalen 0 sind. Schreiben Sie eine statische Methode, die ein zweidimensionales double-Array erhält und true oder false zurückgibt.",
  sol: R`public static boolean istUntereDreiecksmatrix(double[][] m) {
    for (int z = 0; z < m.length; z++) {
        for (int s = z + 1; s < m[z].length; s++) {
            if (m[z][s] != 0) {
                return false;
            }
        }
    }
    return true;
}`,
  check: ["Parameter `double[][]`, Rückgabe boolean", "Oberhalb der Diagonalen heißt Spalte > Zeile (s startet bei z + 1)", "Früh `return false`, am Ende `return true`"] },
{ sec: "A5", type: "write",
  task: "Schreiben Sie eine statische Methode `zeilensummen`, die ein zweidimensionales double-Array erhält und ein Array mit der Summe jeder Zeile zurückgibt.",
  sol: R`public static double[] zeilensummen(double[][] m) {
    double[] erg = new double[m.length];
    for (int z = 0; z < m.length; z++) {
        for (int s = 0; s < m[z].length; s++) {
            erg[z] += m[z][s];
        }
    }
    return erg;
}`,
  check: ["Ergebnisarray mit Länge `m.length` (Anzahl Zeilen)", "Verschachtelte Schleifen", "Innere Grenze `m[z].length`"] },
{ sec: "A5", type: "trace",
  code: R`StringBuilder sb = new StringBuilder("GdP");
String t = "GdP";
t.toLowerCase();
sb.append(1).reverse();
System.out.println(t + " " + sb);`,
  out: "GdP 1PdG",
  why: "Der String bleibt unverändert, weil das Ergebnis von toLowerCase() verworfen wird. Der StringBuilder wird selbst verändert: \"GdP1\" und dann umgedreht." },
{ sec: "A5", type: "trace",
  code: R`int[] f = {4, 7, 1, 9};
int m = f[0];
for (int i = 1; i < f.length; i++) {
    if (f[i] > m) m = f[i];
}
f[f.length - 1] = m * 2;
System.out.println(m + " " + f[3] + " " + f.length);`,
  out: "9 18 4",
  why: "m wird zum Maximum 9. Das letzte Element (Index 3) wird 18. Die Länge bleibt 4." }
];
var EXAM_REL = ["VAR-2", "VAR-3", "VAR-1", "VAR-1", "VAR-5", "VAR-0", "VAR-4", "VAR-4", "VAR-2", "VAR-1", "VAR-2", "VAR-4", "ARR-1", "ARR-1", "ARR-2", "ARR-0", "ARR-0", "ARR-0", "ZKT-2", "VAR-5", "KLA-3", "KLA-2", "OBJ-0", "KLA-3", "VRB-2", "OBJ-3", "PJA-1", "KLA-1", "VRB-1", "EXC-0", "VRB-2", "VRB-2", "EXC-2", "VRB-4", "VER-2", "ITR-3", "VER-2", "ITR-2", "ITR-0", "STA-1", "STA-1", "OBJ-1", "ITR-1", "ARR-1", "ZKT-3", "ARR-1", "ZKT-1", "ARR-4", "ARR-4", "ZKT-3", "ARR-1"];
EXAM.forEach(function(e, i){ e.id = e.sec + "-" + i; e.rel = EXAM_REL[i]; });

// Musterlösungen für die Mini-Aufgaben in den Lern-Häppchen
var SOLS = {
  "EJP-1": R`public class Begruessung {
    public static void main(String[] args) {
        System.out.println("Dein Name");
        System.out.println("Bachelor IT-Sicherheit");
    }
}
// javac Begruessung.java
// java Begruessung`,
  "VAR-2": R`int sekunden = 3725;
int h = sekunden / 3600;
int m = (sekunden % 3600) / 60;
int s = sekunden % 60;
System.out.println(h + "h " + m + "m " + s + "s");  // 1h 2m 5s`,
  "STA-1": R`public static boolean istPrivateIP(int a) {
    return a == 10;
}

public static void main(String[] args) {
    System.out.println(istPrivateIP(10));   // true
    System.out.println(istPrivateIP(192));  // false
}`,
  "KLA-3": R`public class Benutzer {
    private final String name;
    private int fehlversuche;

    public Benutzer(String name) {
        this.name = name;
        this.fehlversuche = 0;
    }
    public String getName() { return name; }
    public int getFehlversuche() { return fehlversuche; }

    public void fehlversuch() {
        fehlversuche++;
    }
    public boolean istGesperrt() {
        return fehlversuche >= 3;
    }
}`,
  "VER-1": R`double score = sc.nextDouble();
String stufe;
if (score == 0.0) {
    stufe = "Keine";
} else if (score < 4.0) {
    stufe = "Niedrig";
} else if (score < 7.0) {
    stufe = "Mittel";
} else if (score < 9.0) {
    stufe = "Hoch";
} else {
    stufe = "Kritisch";
}
System.out.println(stufe);`,
  "ITR-2": R`for (int port = 20; port <= 25; port++) {
    if (port == 22) {
        System.out.println(port + " <- SSH");
    } else {
        System.out.println(port);
    }
}`,
  "EXC-3": R`Scanner sc = new Scanner(System.in);
int zahl = 0;
boolean ok;
do {
    System.out.print("Zahl: ");
    String eingabe = sc.nextLine();
    try {
        zahl = Integer.parseInt(eingabe);
        ok = true;
    } catch (NumberFormatException e) {
        System.out.println("Keine gültige Zahl, bitte nochmal.");
        ok = false;
    }
} while (!ok);`,
  "ARR-2": R`int[] ms = {23, 41, 19, 87, 30, 25};
int min = ms[0], max = ms[0], summe = 0;
for (int x : ms) {
    if (x < min) min = x;
    if (x > max) max = x;
    summe += x;
}
double schnitt = (double) summe / ms.length;   // Cast, sonst Ganzzahldivision!
System.out.println(min + " " + max + " " + schnitt);  // 19 87 37.5`,
  "ZKT-1": R`public static boolean ipGueltig(String ip) {
    String[] teile = ip.split("\\.");
    if (teile.length != 4) {
        return false;
    }
    for (String t : teile) {
        int wert = Integer.parseInt(t);
        if (wert < 0 || wert > 255) {
            return false;
        }
    }
    return true;
}`
};
