// nibble – Probeklausur-Generator
// Baut eine komplette Klausur im Aufbau der Probeaufgaben (A1–A5) – jedes Mal mit
// anderen Klassen, Namen, Zahlen und Codes. Das Konzept jeder Teilaufgabe bleibt gleich.
// Alle Java-Anteile werden von tools/verify_mock.js mit javac/java geprüft.
var MOCK = (function () {
  function rng(seed) {
    var a = seed >>> 0;
    function next() { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
    var r = {
      int: function (lo, hi) { return lo + Math.floor(next() * (hi - lo + 1)); },
      pick: function (arr) { return arr[Math.floor(next() * arr.length)]; },
      chance: function (p) { return next() < p; },
      shuffle: function (arr) { var b = arr.slice(); for (var i = b.length - 1; i > 0; i--) { var j = Math.floor(next() * (i + 1)); var t = b[i]; b[i] = b[j]; b[j] = t; } return b; }
    };
    return r;
  }
  function jd(x) { return Number.isInteger(x) ? x.toFixed(1) : String(x); }
  function q(s) { return JSON.stringify(s); }

  // ==================================================================
  //  A1: Korrekt oder nicht? – Vorlagen mit Zufallswerten
  //  java.code wird in main eingesetzt. check: "compile" (Wahrheit = kompiliert)
  //  oder "value" (kompiliert und print-Ausdruck ergibt claim → Wahrheit = Gleichheit)
  // ==================================================================
  var TF = [];
  function tf(rel, f) { TF.push({ rel: rel, f: f }); }

  tf("VAR-3", function (r) {
    var a = r.int(1, 9), b = r.int(1, 9), d = r.pick([2, 4, 8]), c = r.int(1, 3 * d); if (c % d === 0) c++;
    var right = a + b - c / d, wrong = a + b - Math.trunc(c / d), ok = r.chance(0.5), v = ok ? right : wrong;
    var code = "double x = " + a + " + " + b + " - " + c + " / " + d + ".0;";
    return { s: "`" + code + "` setzt x auf " + jd(v) + ".", ok: ok,
      why: ok ? c + " / " + d + ".0 ist eine Kommadivision (" + jd(c / d) + "), x wird " + jd(right) + "." : "Wegen " + d + ".0 wird mit Kommazahlen gerechnet: " + c + " / " + d + ".0 = " + jd(c / d) + ". x wird " + jd(right) + ", nicht " + jd(wrong) + ".",
      java: { code: code, print: "x", claim: jd(v) } };
  });
  tf("VAR-3", function (r) {
    var a = r.int(2, 20), b = r.int(1, 9), c = r.int(1, 9), ok = r.chance(0.4);
    var code = ok ? "int y = (int) (" + a + " + " + b + "." + c + ");" : "int y = " + a + " + " + b + "." + c + ";";
    return { s: "`" + code + "`", ok: ok, why: ok ? "Der explizite Cast schneidet die Nachkommastellen ab, y wird " + (a + b) + "." : a + " + " + b + "." + c + " ist vom Typ double. Ohne expliziten Cast `(int)` darf das nicht an int zugewiesen werden.", java: { code: code, check: "compile" } };
  });
  tf("VAR-1", function (r) {
    var n = r.int(3, 9) * 1000000000 + r.int(0, 999) * 1000, ok = r.chance(0.4), code = "long z = " + n + (ok ? "L" : "") + ";";
    return { s: "`" + code + "`", ok: ok, why: ok ? "Mit L ist das Literal vom Typ long, der Wert passt hinein." : "Ganzzahl-Literale sind ohne Suffix vom Typ int. " + n + " ist zu groß für int – es fehlt das L: `" + n + "L`.", java: { code: code, check: "compile" } };
  });
  tf("VAR-1", function (r) {
    var ch = r.pick(["A", "x", "Z", "q", "7"]), ok = r.chance(0.4), code = ok ? "char c = '" + ch + "';" : "char c = \"" + ch + "\";";
    return { s: "`" + code + "`", ok: ok, why: ok ? "Ein char-Literal steht in einfachen Hochkommas." : "\"" + ch + "\" ist ein String. Ein char-Literal steht in einfachen Hochkommas: `'" + ch + "'`.", java: { code: code, check: "compile" } };
  });
  tf("VAR-0", function (r) {
    var w = r.pick(["Hallo Welt!", "Guten Morgen", "Hallo SOC", "Alles klar"]), v = r.pick(["hallo", "gruss", "text", "meldung"]), ok = r.chance(0.35);
    var code = "String " + v + " = " + (ok ? q(w) : w) + ";";
    return { s: "`" + code + "`", ok: ok, why: ok ? "Ein String-Literal in doppelten Anführungszeichen darf Leer- und Satzzeichen enthalten." : "Die Anführungszeichen fehlen. So hält der Compiler die Wörter für Bezeichner (bzw. Operatoren).", java: { code: code, check: "compile" } };
  });
  tf("VAR-0", function (r) {
    var c = r.pick([
      ["int 3 = z;", false, "Links vom = muss eine Variable stehen. 3 ist ein Literal, kein gültiger Bezeichner.", "int z = 1;"],
      ["int 2te = 5;", false, "Bezeichner dürfen nicht mit einer Ziffer beginnen."],
      ["int meine-zahl = 5;", false, "Der Bindestrich ist im Bezeichner nicht erlaubt (er wäre ein Minus)."],
      ["int class = 5;", false, "class ist ein Schlüsselwort und darf kein Bezeichner sein."],
      ["int zahl2 = 5;", true, "Ziffern sind im Bezeichner erlaubt, nur nicht am Anfang."],
      ["int _wert = 5;", true, "Ein Bezeichner darf mit einem Unterstrich beginnen."],
      ["int anzahlLogins = 5;", true, "Gültiger Bezeichner in camelCase."]]);
    return { s: "`" + c[0] + "`", ok: c[1], why: c[2], java: { code: (c[3] || "") + c[0], check: "compile" } };
  });
  tf("VAR-4", function (r) {
    var a = r.int(1, 5), b = r.int(8, 20), v = r.pick(["x", "wert", "n"]), op = r.pick(["&&", "||"]), ok = r.chance(0.4);
    var code = "boolean test = (" + v + " > " + a + " " + op + " " + (ok ? v + " " : "") + "< " + b + ");";
    return { s: "`" + code + "` (" + v + " ist eine int-Variable)", ok: ok, why: ok ? "Beide Seiten von " + op + " sind vollständige Vergleiche." : "Der rechte Operand von " + op + " ist unvollständig. Richtig: `" + v + " < " + b + "`.", java: { code: "int " + v + " = 7;\n" + code, check: "compile" } };
  });
  tf("VAR-3", function (r) {
    var a = r.int(11, 60), b = r.int(3, 9); if (a % b === 0) a++;
    var right = a % b, ok = r.chance(0.5), v = ok ? right : r.pick([Math.trunc(a / b), right + 1].filter(function (x) { return x !== right; }));
    var code = "int r = " + a + " % " + b + ";";
    return { s: "`" + code + "` setzt r auf " + v + ".", ok: ok, why: a + " = " + Math.trunc(a / b) + " · " + b + " + " + right + ", der Rest ist " + right + ".", java: { code: code, print: "r", claim: String(v) } };
  });
  tf("VAR-3", function (r) {
    var b = r.pick([2, 4, 5]), a = r.int(3, 30); if (a % b === 0) a++;
    var ok = r.chance(0.4), v = ok ? String(Math.trunc(a / b)) : String(a / b);
    var code = "int i = " + a + " / " + b + ";";
    return { s: "`" + code + "` setzt i auf " + v + ".", ok: ok, why: "Ganzzahldivision: " + a + " / " + b + " ergibt " + Math.trunc(a / b) + ", der Rest wird abgeschnitten.", java: { code: code, print: "i", claim: v } };
  });
  tf("VAR-3", function (r) {
    var b = r.pick([2, 4, 8]), a = r.int(3, 30); if (a % b === 0) a++;
    var ok = r.chance(0.4), claim = jd(a / b);
    var code = ok ? "double d = " + a + " / (double) " + b + ";" : "double d = " + a + " / " + b + ";";
    return { s: "`" + code + "` setzt d auf " + claim + ".", ok: ok, why: ok ? "Durch den Cast wird mit double gerechnet: " + claim + "." : "Beide Operanden sind int, also Ganzzahldivision (" + Math.trunc(a / b) + "). Erst danach wird nach double umgewandelt: d wird " + jd(Math.trunc(a / b)) + ".", java: { code: code, print: "d", claim: claim } };
  });
  tf("VAR-1", function (r) {
    var v = r.pick(["2.5", "0.1", "3.75"]), ok = r.chance(0.4), code = "float f = " + v + (ok ? "f" : "") + ";";
    return { s: "`" + code + "`", ok: ok, why: ok ? "Mit dem Suffix f ist das Literal vom Typ float." : v + " ist ein double-Literal. Für float braucht man `" + v + "f` oder einen Cast.", java: { code: code, check: "compile" } };
  });
  tf("VAR-1", function (r) {
    var ok = r.chance(0.5);
    return ok ? { s: "Eine Variable des Typs boolean kann zwei verschiedene Werte annehmen.", ok: true, why: "true und false." }
      : { s: "Eine Variable des Typs boolean kann drei Werte annehmen: true, false und null.", ok: false, why: "Der primitive Typ boolean kennt nur true und false. null gibt es nur bei Referenztypen." };
  });
  tf("ARR-1", function (r) {
    var k = r.int(1, 6), nm = r.pick(["meinArray", "werte", "ports", "messungen"]), ok = r.chance(0.5);
    return { s: "`" + nm + "[" + k + "]` ist das " + (ok ? k + 1 : k) + ". Element des Arrays " + nm + ".", ok: ok, why: "Der Index beginnt bei 0, also ist " + nm + "[" + k + "] das " + (k + 1) + ". Element." };
  });
  tf("ARR-1", function (r) {
    var n = r.int(4, 12), ok = r.chance(0.5);
    return { s: "Ein Array der Länge " + n + " hat den höchsten Index " + (ok ? n - 1 : n) + ".", ok: ok, why: "Die Indizes laufen von 0 bis length - 1, also bis " + (n - 1) + "." };
  });
  tf("ARR-2", function (r) {
    var nm = r.pick(["meinArray", "werte", "ports"]), ok = r.chance(0.35);
    return ok ? { s: "`System.out.println(Arrays.toString(" + nm + "));` gibt die Elemente des int-Arrays " + nm + " aus.", ok: true, why: "Arrays.toString liefert z. B. [1, 2, 3]." }
      : { s: "`System.out.println(" + nm + ");` gibt das Array " + nm + " aus.", ok: false, why: "Ausgegeben wird nur eine Referenz wie `[I@1b6d3586`. Für die Elemente: `Arrays.toString(" + nm + ")` oder eine Schleife." };
  });
  tf("ARR-0", function (r) {
    var ok = r.chance(0.5);
    return ok ? { s: "Die Größe eines Arrays kann nach seiner Erzeugung nicht mehr geändert werden.", ok: true, why: "Die Länge ist fest. Für mehr Platz erzeugt man ein neues Array und kopiert um." }
      : { s: "Ein Array kann nach seiner Erzeugung mit einer add-Methode vergrößert werden.", ok: false, why: "Arrays haben eine feste Länge und keine add-Methode. Man erzeugt ein neues, größeres Array (z. B. mit Arrays.copyOf)." };
  });
  tf("ARR-0", function (r) {
    var ok = r.chance(0.4);
    return ok ? { s: "Alle Elemente eines Arrays haben denselben Datentyp.", ok: true, why: "Bei der Deklaration wird ein Elementtyp festgelegt, z. B. int[]." }
      : { s: "Ein Array eignet sich gut, um mehrere Werte verschiedener Datentypen zu speichern.", ok: false, why: "Ein Array speichert Werte eines einzigen Datentyps." };
  });
  tf("VAR-3", function (r) {
    var a = r.int(2, 9), b = r.int(5, 9), ok = r.chance(0.5), code = "int x = (int) " + a + "." + b + ";";
    return { s: "`" + code + "` setzt x auf " + (ok ? a : a + 1) + ".", ok: ok, why: "Der Cast nach int schneidet die Nachkommastellen ab – er rundet nicht. x wird " + a + ".", java: { code: code, print: "x", claim: String(ok ? a : a + 1) } };
  });
  tf("ZKT-2", function (r) {
    var a = r.int(1, 9), b = r.int(1, 9), w = r.pick(["a", "Port ", "x"]), front = r.chance(0.5), ok = r.chance(0.5);
    var expr = front ? q(w) + " + " + a + " + " + b : a + " + " + b + " + " + q(w);
    var right = front ? w + a + b : (a + b) + w, wrong = front ? w + (a + b) : String(a) + b + w;
    return { s: "`String s = " + expr + ";` ergibt " + q(ok ? right : wrong) + ".", ok: ok,
      why: front ? "Von links nach rechts: String + " + a + " ergibt einen String, daran wird " + b + " angehängt: " + q(right) + "." : "Von links nach rechts: zuerst " + a + " + " + b + " = " + (a + b) + " (Zahlen), dann wird der String angehängt: " + q(right) + ".",
      java: { code: "String s = " + expr + ";", print: "s", claim: ok ? right : wrong } };
  });
  tf("VAR-3", function (r) {
    var a = r.int(2, 9), ok = r.chance(0.5), code = ok ? "int x = " + a + "; x += 1.5;" : "int x = " + a + "; x = x + 1.5;";
    return { s: "`" + code + "`", ok: ok, why: ok ? "Zusammengesetzte Zuweisungen wie += enthalten einen impliziten Cast. x wird " + Math.trunc(a + 1.5) + "." : "x + 1.5 ist double und darf ohne Cast nicht an int zugewiesen werden.", java: { code: code, check: "compile" } };
  });
  tf("VAR-5", function (r) {
    var n = r.pick(["MAX", "GRENZE", "PORT"]), a = r.int(5, 50), ok = r.chance(0.3);
    var code = ok ? "final int " + n + "; " + n + " = " + a + ";" : "final int " + n + " = " + a + "; " + n + " = " + (a + 10) + ";";
    return { s: "`" + code + "`", ok: ok, why: ok ? "Eine final-Variable darf genau einmal zugewiesen werden – das muss nicht bei der Deklaration sein." : "Eine final-Variable ist eine Konstante und kann nach der ersten Zuweisung nicht mehr geändert werden.", java: { code: code, check: "compile" } };
  });
  tf("VAR-1", function (r) {
    var ok = r.chance(0.5), n = ok ? r.int(1, 127) : r.int(128, 250), code = "byte b = " + n + ";";
    return { s: "`" + code + "`", ok: ok, why: ok ? "byte reicht von -128 bis 127, " + n + " passt hinein." : "byte reicht nur von -128 bis 127. " + n + " passt nicht.", java: { code: code, check: "compile" } };
  });
  tf("VAR-0", function (r) {
    var v = r.pick(["x", "zaehler", "summe"]), ok = r.chance(0.4);
    var code = ok ? "int " + v + " = 0; System.out.println(" + v + ");" : "int " + v + "; System.out.println(" + v + ");";
    return { s: "`" + code + "` (lokale Variable in main)", ok: ok, why: ok ? "Die Variable ist initialisiert und kann gelesen werden." : "Lokale Variablen haben keinen Standardwert. Lesen vor der ersten Zuweisung ist ein Compilerfehler.", java: { code: code, check: "compile" } };
  });
  tf("VAR-3", function (r) {
    var a = r.int(2, 9), post = r.chance(0.5), ok = r.chance(0.5), right = post ? a : a + 1, v = ok ? right : (post ? a + 1 : a);
    var code = "int i = " + a + "; int j = " + (post ? "i++" : "++i") + ";";
    return { s: "`" + code + "` setzt j auf " + v + ".", ok: ok, why: post ? "Bei i++ wird erst der alte Wert verwendet, dann erhöht: j = " + a + ", i = " + (a + 1) + "." : "Bei ++i wird erst erhöht, dann verwendet: j = " + (a + 1) + ".", java: { code: code, print: "j", claim: String(v) } };
  });

  // ==================================================================
  //  A2/A3: Klasse und Unterklasse aus einer gemeinsamen Welt
  // ==================================================================
  var DOM = [
    { cls: "Stadt", art: "Diese Stadt heißt", names: ["Brandenburg an der Havel", "Cottbus", "Eberswalde", "Neuruppin", "Wildau"],
      sub: "Landeshauptstadt", a1: "land", a1d: "den Namen des Bundeslandes", a2: "landEinwohner", a2d: "die Einwohnerzahl des Bundeslandes",
      pairs: [["Potsdam", "Brandenburg"], ["Dresden", "Sachsen"], ["Schwerin", "Mecklenburg-Vorpommern"], ["Erfurt", "Thüringen"], ["Kiel", "Schleswig-Holstein"]],
      fmt: function (n, a, x) { return n + " (" + a + ", " + x + " Einwohner)"; }, fmtJ: '" (" + land + ", " + landEinwohner + " Einwohner)"',
      msg: "Negative Einwohnerzahl ungültig!", what: "eine Einwohnerzahl", rand: function (r) { return r.int(1000, 4000) * 1000 + r.int(0, 999); }, rel1: "KLA-2", rel2: "VRB-1" },
    { cls: "Server", art: "Dieser Server heißt", names: ["web01", "mail02", "dns01", "backup03", "proxy01"],
      sub: "Webserver", a1: "protokoll", a1d: "das Protokoll", a2: "verbindungen", a2d: "die Anzahl offener Verbindungen",
      pairs: [["web02", "HTTPS"], ["shop01", "HTTPS"], ["intranet", "HTTP"], ["cdn04", "HTTP/2"]],
      fmt: function (n, a, x) { return n + " (" + a + ", " + x + " Verbindungen)"; }, fmtJ: '" (" + protokoll + ", " + verbindungen + " Verbindungen)"',
      msg: "Negative Verbindungszahl ungültig!", what: "eine Verbindungszahl", rand: function (r) { return r.int(1, 900); }, rel1: "KLA-2", rel2: "VRB-1" },
    { cls: "Buch", art: "Dieses Buch heißt", names: ["Java ist auch eine Insel", "Clean Code", "Netzwerktechnik kompakt", "Kryptografie für Einsteiger"],
      sub: "Fachbuch", a1: "fachgebiet", a1d: "das Fachgebiet", a2: "seiten", a2d: "die Seitenzahl",
      pairs: [["Algorithmen", "Informatik"], ["Firewalls im Einsatz", "IT-Sicherheit"], ["Lineare Algebra", "Mathematik"], ["Betriebssysteme", "Informatik"]],
      fmt: function (n, a, x) { return n + " (" + a + ", " + x + " Seiten)"; }, fmtJ: '" (" + fachgebiet + ", " + seiten + " Seiten)"',
      msg: "Negative Seitenzahl ungültig!", what: "eine Seitenzahl", rand: function (r) { return r.int(80, 1200); }, rel1: "KLA-2", rel2: "VRB-1" },
    { cls: "Fluss", art: "Dieser Fluss heißt", names: ["Havel", "Spree", "Oder", "Elbe", "Neiße"],
      sub: "Nebenfluss", a1: "muendetIn", a1d: "den Namen des Flusses, in den er mündet", a2: "laengeKm", a2d: "die Länge in Kilometern",
      pairs: [["Havel", "Elbe"], ["Spree", "Havel"], ["Neiße", "Oder"], ["Saale", "Elbe"], ["Dahme", "Spree"]],
      fmt: function (n, a, x) { return n + " (mündet in " + a + ", " + x + " km)"; }, fmtJ: '" (mündet in " + muendetIn + ", " + laengeKm + " km)"',
      msg: "Negative Länge ungültig!", what: "eine Länge in Kilometern", rand: function (r) { return r.int(20, 500); }, rel1: "KLA-2", rel2: "VRB-1" },
    { cls: "Netzwerk", art: "Dieses Netzwerk heißt", names: ["Büro", "Labor", "Gäste-WLAN", "DMZ", "Verwaltung"],
      sub: "Subnetz", a1: "gateway", a1d: "die Gateway-Adresse", a2: "hosts", a2d: "die Anzahl der Hosts",
      pairs: [["Server-LAN", "10.0.1.1"], ["VoIP", "10.0.20.1"], ["Kameras", "192.168.50.1"], ["Drucker", "192.168.10.1"]],
      fmt: function (n, a, x) { return n + " (Gateway " + a + ", " + x + " Hosts)"; }, fmtJ: '" (Gateway " + gateway + ", " + hosts + " Hosts)"',
      msg: "Negative Hostanzahl ungültig!", what: "eine Hostanzahl", rand: function (r) { return r.int(2, 250); }, rel1: "KLA-2", rel2: "VRB-1" }
  ];
  function baseSource(D) {
    return "public class " + D.cls + " {\n    private String name;\n\n    public " + D.cls + "(String name) {\n        this.name = name;\n    }\n\n" +
      "    public String getName() {\n        return name;\n    }\n\n    public void setName(String name) {\n        this.name = name;\n    }\n\n" +
      "    @Override\n    public String toString() {\n        return \"" + D.art + " \" + name;\n    }\n}\n";
  }
  function subSource(D) {
    return "public class " + D.sub + " extends " + D.cls + " {\n    private String " + D.a1 + ";\n    private int " + D.a2 + ";\n\n" +
      "    public " + D.sub + "(String name, String " + D.a1 + ", int " + D.a2 + ") {\n        super(name);\n" +
      "        if (" + D.a2 + " < 0) {\n            throw new IllegalArgumentException(\"" + D.msg + "\");\n        }\n" +
      "        this." + D.a1 + " = " + D.a1 + ";\n        this." + D.a2 + " = " + D.a2 + ";\n    }\n\n" +
      "    @Override\n    public String toString() {\n        return getName() + " + D.fmtJ + ";\n    }\n}\n";
  }
  var v2 = function (D) { return D.cls.charAt(0).toLowerCase() + D.cls.slice(1) + "2"; };

  // ==================================================================
  //  Erläuterungen: allgemeine Fragen (aus dem Klausurtraining) + weitere
  // ==================================================================
  var EXTRA = [
    { sec: "A2", rel: "KLA-3", q: "Wozu dient das Schlüsselwort `this`? Nennen Sie zwei Verwendungen.",
      sol: "this verweist auf das aktuelle Objekt. 1. Es unterscheidet ein Attribut von einem gleichnamigen Parameter: `this.name = name;`. 2. Mit `this(...)` ruft ein Konstruktor einen anderen Konstruktor derselben Klasse auf (nur als erste Anweisung).",
      check: ["this = Referenz auf das aktuelle Objekt", "this.attribut bei gleichnamigem Parameter", "this(...) ruft einen anderen Konstruktor derselben Klasse auf"] },
    { sec: "A4", rel: "ITR-3", q: "Erläutern Sie den Unterschied zwischen `break` und `continue` in einer Schleife.",
      sol: "break beendet die umgebende Schleife vollständig, es geht hinter der Schleife weiter. continue beendet nur den aktuellen Durchlauf; danach geht es mit dem nächsten Durchlauf weiter (bei for zuerst die Aktualisierung, dann die Bedingung).",
      check: ["break: Schleife ganz beenden", "continue: nur den aktuellen Durchlauf beenden", "Beide wirken auf die innerste Schleife"] },
    { sec: "A4", rel: "STA-2", q: "Was versteht man unter dem Überladen von Methoden? Geben Sie ein Beispiel an.",
      sol: "Mehrere Methoden in einer Klasse haben denselben Namen, aber unterschiedliche Parameterlisten (Anzahl, Typen oder Reihenfolge der Typen). Der Compiler wählt anhand der Argumente die passende aus. Ein anderer Rückgabetyp allein reicht nicht.",
      code: "public static int max(int a, int b) { ... }\npublic static double max(double a, double b) { ... }\npublic static int max(int a, int b, int c) { ... }",
      check: ["Gleicher Name, unterschiedliche Parameterliste", "Auswahl anhand der Argumente beim Aufruf", "Rückgabetyp allein unterscheidet nicht", "Passendes Beispiel"] },
    { sec: "A5", rel: "ZKT-2", q: "Warum sollte man Strings nicht mit `==` vergleichen? Wie vergleicht man sie richtig?",
      sol: "Strings sind Objekte. == vergleicht nur die Referenzen, also ob es dasselbe Objekt ist. Zwei Strings mit gleichem Inhalt können verschiedene Objekte sein (z. B. nach einer Eingabe), dann liefert == false. Den Inhalt vergleicht man mit equals (oder equalsIgnoreCase ohne Groß/Klein).",
      check: ["String ist ein Referenztyp", "== prüft Identität (Referenz)", "Inhaltsvergleich mit equals / equalsIgnoreCase"] },
    { sec: "A5", rel: "ZKT-0", q: "Was bedeutet es, dass String-Objekte unveränderlich sind? Was bewirkt `s.toUpperCase();` ohne Zuweisung?",
      sol: "Ein String-Objekt kann nach seiner Erzeugung nicht mehr verändert werden. Methoden wie toUpperCase liefern einen neuen String zurück. Ohne Zuweisung (`s = s.toUpperCase();`) geht das Ergebnis verloren, s bleibt unverändert.",
      check: ["Inhalt eines String-Objekts ist nach dem Erzeugen fest", "Methoden liefern einen neuen String", "Ohne Zuweisung bleibt s unverändert"] },
    { sec: "A5", rel: "ARR-4", q: "Wie ist ein zweidimensionales Array in Java aufgebaut? Was liefern `m.length` und `m[0].length`?",
      sol: "Ein 2D-Array ist ein Array von Arrays: Jedes Element des äußeren Arrays ist ein (Zeilen-)Array. m.length ist die Anzahl der Zeilen, m[0].length die Anzahl der Elemente in Zeile 0, also die Spaltenzahl dieser Zeile. Zugriff mit m[zeile][spalte].",
      check: ["Array von Arrays", "m.length = Anzahl Zeilen", "m[0].length = Spalten der Zeile 0", "Zugriff m[zeile][spalte]"] }
  ];
  function explainPool(sec, exam) {
    var p = (exam || []).filter(function (e) { return e.type === "explain" && e.sec === sec && !/Server|Webserver/.test(e.q); })
      .map(function (e) { return { rel: e.rel, q: e.q, sol: e.sol, code: e.code, check: e.check }; });
    return p.concat(EXTRA.filter(function (e) { return e.sec === sec; }));
  }

  // ==================================================================
  //  Klausur zusammensetzen
  // ==================================================================
  function make(seed, deps) {
    var r = rng(seed), G = deps.GEN, EX = deps.EXAM, parts = [];
    function P(o) { parts.push(o); return o; }

    // ---- A1 ----
    var tfs = r.shuffle(TF).slice(0, 10).map(function (t) { var it = t.f(r); it.rel = t.rel; return it; });
    tfs.forEach(function (it, i) { P({ sec: "A1", no: "1." + (i + 1), type: "tf", pts: 1, rel: it.rel, s: it.s, ok: it.ok, why: it.why, java: it.java }); });

    // ---- A2 ----
    var D = r.pick(DOM), n1 = r.pick(D.names), pr = r.pick(D.pairs), n2 = r.pick(D.names.filter(function (x) { return x !== n1; })), vr = v2(D);
    var base = baseSource(D), sub = subSource(D);
    P({ sec: "A2", no: "1", type: "write", pts: 6, rel: D.rel1,
      task: "Schreiben Sie eine vollständige Klasse `" + D.cls + "` mit einem Attribut für den Namen, einem Konstruktor mit einem sinnvollen Parameter, passenden get- und set-Methoden und überschreiben Sie die Methode `toString()`, sodass sie zurückgibt: „" + D.art + " [name]“, wobei [name] für den Namen steht.",
      sol: base, check: ["Attribut `private String name`", "Konstruktor `public " + D.cls + "(String name)` setzt `this.name`", "`getName()` mit Rückgabetyp String, `setName(String name)` mit void", "`@Override public String toString()`", "Rückgabe exakt „" + D.art + " “ + name"] });
    var mine = "mein" + (D.art.indexOf("Diese ") === 0 ? "e" : "") + D.cls;
    P({ sec: "A2", no: "2", type: "write", pts: 2, rel: "OBJ-1",
      task: "Ergänzen Sie die Anweisungen, sodass „" + D.art + " " + n1 + "“ ausgegeben wird:\n`" + D.cls + " " + mine + " = new ______;`\n`System.out.println(______);`",
      sol: D.cls + " " + mine + " = new " + D.cls + "(" + q(n1) + ");\nSystem.out.println(" + mine + ");\n// gleichwertig: System.out.println(" + mine + ".toString());",
      check: ["Konstruktoraufruf `new " + D.cls + "(" + q(n1) + ")` mit Anführungszeichen", "println erhält das Objekt (toString wird automatisch aufgerufen)"],
      java: { kind: "a2", D: D, n1: n1, mine: mine } });
    var ex2 = r.shuffle(explainPool("A2", EX)).slice(0, 2);
    ex2.forEach(function (e, i) { P({ sec: "A2", no: String(3 + i), type: "explain", pts: 2, rel: e.rel, q: e.q, sol: e.sol, code: e.code, check: e.check }); });
    P({ sec: "A2", no: "5", type: "explain", pts: 4, rel: "OBJ-3",
      q: "Der folgende Code führt zur Ausgabe `false`. Erläutern Sie, warum. Erläutern Sie außerdem, wie man zwei Objekte auf Basis ihrer Attributwerte vergleichen kann und wie man die Klasse " + D.cls + " dafür erweitern müsste.\n`" + D.cls + " a = new " + D.cls + "(" + q(n2) + ");`\n`" + D.cls + " b = new " + D.cls + "(" + q(n2) + ");`\n`System.out.println(a == b);`",
      sol: "a und b verweisen auf zwei verschiedene Objekte (zweimal new). == vergleicht bei Objekten die Referenzen, also die Identität, nicht den Inhalt – daher false. Für einen inhaltlichen Vergleich nutzt man equals(). Dafür muss " + D.cls + " die von Object geerbte Methode `public boolean equals(Object o)` überschreiben und darin die Namen mit equals vergleichen.",
      code: "@Override\npublic boolean equals(Object o) {\n    if (this == o) return true;\n    if (!(o instanceof " + D.cls + ")) return false;\n    " + D.cls + " andere = (" + D.cls + ") o;\n    return name.equals(andere.name);\n}",
      check: ["Zwei new → zwei verschiedene Objekte", "== vergleicht Referenzen (Identität), nicht den Inhalt", "Inhaltlicher Vergleich mit equals()", "equals(Object) in " + D.cls + " überschreiben und das Attribut name vergleichen"],
      java: { kind: "eq", D: D, n: n2 } });

    // ---- A3 ----
    P({ sec: "A3", no: "1", type: "write", pts: 8, rel: D.rel2,
      task: "Die Klasse `" + D.sub + "` erbt von `" + D.cls + "` (Aufgabe 2). Sie hat zwei weitere Attribute für " + D.a1d + " (String) und " + D.a2d + " (int), einen entsprechenden Konstruktor für alle Attribute und überschreibt ebenfalls `toString()`, sodass z. B. „" + D.fmt(pr[0], pr[1], 123) + "“ zurückgegeben wird. Der Konstruktor erzeugt eine `IllegalArgumentException` mit der Nachricht „" + D.msg + "“, wenn " + D.what.replace(/^eine /, "eine negative ") + " übergeben wird.",
      sol: sub, check: ["`extends " + D.cls + "`", "Zwei private Attribute (String, int)", "Konstruktor mit drei Parametern, `super(name)` als erste Anweisung", "Prüfung `" + D.a2 + " < 0` → `throw new IllegalArgumentException(\"" + D.msg + "\")`", "toString mit `@Override`, Name über `getName()` (Attribut ist private)"] });
    var pos = r.chance(0.2) ? 0 : D.rand(r), neg = -r.int(1, 500), bad = r.pick(["Hallo", "zwölf", "3.5", "abc"]);
    var cases = r.shuffle([{ k: "pos", v: pos }, { k: "neg", v: neg }, { k: "bad", v: bad }]);
    var outPos = D.fmt(pr[0], pr[1], pos);
    var code3 = "Scanner sc = new Scanner(System.in);\nint " + D.a2 + " = sc.nextInt();   // Eingabe des Benutzers\ntry {\n    " + D.cls + " " + vr + " = new " + D.sub + "(" + q(pr[0]) + ", " + q(pr[1]) + ", " + D.a2 + ");\n    System.out.println(" + vr + ".toString());\n} catch (IllegalArgumentException e) {\n    System.out.println(e.getMessage());\n}";
    var ans = cases.map(function (c, i) {
      var head = (i + 1) + ". Eingabe " + (c.k === "bad" ? "„" + c.v + "“" : c.v) + ": ";
      if (c.k === "pos") return head + "Das Objekt wird erzeugt, ausgegeben wird „" + outPos + "“." + (c.v === 0 ? " 0 ist nicht negativ, also gültig." : "") + " Es läuft die überschriebene toString-Methode von " + D.sub + ".";
      if (c.k === "neg") return head + "Der Konstruktor wirft die IllegalArgumentException, das Objekt entsteht nicht und println im try-Block wird übersprungen. Der catch-Block gibt „" + D.msg + "“ aus, danach läuft das Programm normal weiter.";
      return head + "Schon nextInt() wirft eine InputMismatchException – vor dem try-Block. Sie wird nicht gefangen (der catch-Block fängt außerdem nur IllegalArgumentException). Das Programm bricht mit einer Fehlermeldung (Stacktrace) ab.";
    });
    P({ sec: "A3", no: "2a", type: "explain", pts: 6, rel: "EXC-0",
      q: "Betrachten Sie folgenden Code:\n```\n" + code3 + "\n```\nBeschreiben Sie, was in jedem der folgenden drei Fälle passiert:\n" + cases.map(function (c, i) { return (i + 1) + ". Der Benutzer gibt " + (c.k === "bad" ? "„" + c.v + "“" : c.v) + " ein."; }).join("\n"),
      sol: ans.join("\n"), check: ["Gültige Eingabe: genaue Ausgabe „" + outPos + "“", "Negative Zahl: Exception im Konstruktor, catch gibt „" + D.msg + "“ aus", "Keine Zahl: InputMismatchException bei nextInt, außerhalb von try → Programmabbruch"],
      java: { kind: "cases", D: D, pr: pr, pos: pos, neg: neg, outPos: outPos } });
    P({ sec: "A3", no: "2b", type: "explain", pts: 3, rel: "VRB-2",
      q: "Erläutern Sie am Beispiel der beiden Anweisungen im try-Block das Konzept der Polymorphie.",
      sol: "Die Variable " + vr + " hat den Typ " + D.cls + ", verweist aber auf ein " + D.sub + "-Objekt. Das ist erlaubt, weil ein " + D.sub + " ein " + D.cls + " ist (Zuweisungskompatibilität). Beim Aufruf " + vr + ".toString() entscheidet zur Laufzeit das tatsächliche Objekt, welche Implementierung läuft: die überschriebene toString-Methode von " + D.sub + ", nicht die von " + D.cls + ".",
      check: ["Variablentyp " + D.cls + ", Objekt vom Typ " + D.sub, "Zuweisung erlaubt: Subklasse ist-ein " + D.cls, "Zur Laufzeit läuft toString() von " + D.sub + " (dynamisches Binden)"] });

    // ---- A4 ----
    var tr = G.make("trace", seed + 101, "t-forswitch");
    P({ sec: "A4", no: "1", type: "trace", pts: 6, rel: tr.rel, code: tr.code, out: tr.out, why: tr.why });
    var su = G.make("method", seed + 202, "w-summe");
    P({ sec: "A4", no: "2", type: "write", pts: 5, rel: su.rel, task: su.task, sol: su.solFiles[0].content, check: su.check });
    var e4 = r.pick(explainPool("A4", EX));
    P({ sec: "A4", no: "3", type: "explain", pts: 2, rel: e4.rel, q: e4.q, sol: e4.sol, code: e4.code, check: e4.check });

    // ---- A5 ----
    var e5 = r.shuffle(explainPool("A5", EX)).slice(0, 2);
    e5.forEach(function (e, i) { P({ sec: "A5", no: String(1 + i), type: "explain", pts: 2, rel: e.rel, q: e.q, sol: e.sol, code: e.code, check: e.check }); });
    function pickGen(id, ok, s0) { for (var k = 0; k < 200; k++) { var t = G.make("method", s0 + k * 7919, id); if (ok.indexOf(t.title) >= 0) return t; } return G.make("method", s0, id); }
    var ar = pickGen("w-array", ["ersetzeNegative", "kappen"], seed + 303);
    P({ sec: "A5", no: "3", type: "write", pts: 5, rel: ar.rel, task: ar.task, sol: ar.solFiles[0].content, check: ar.check });
    var m2 = pickGen("w-2d", ["istObereDreiecksmatrix", "istUntereDreiecksmatrix", "istDiagonalmatrix"], seed + 404);
    P({ sec: "A5", no: "4", type: "write", pts: 7, rel: m2.rel, task: m2.task, sol: m2.solFiles[0].content, check: m2.check });

    var total = parts.reduce(function (s, p) { return s + p.pts; }, 0);
    return { seed: seed, parts: parts, total: total, D: D, base: base, sub: sub };
  }

  var SECS = [
    { id: "A1", title: "Variablen, Datentypen, Operatoren", intro: "Geben Sie jeweils an, ob die Anweisung oder Aussage korrekt ist, und falls nicht, warum nicht." },
    { id: "A2", title: "Klassen und Objekte" },
    { id: "A3", title: "Vererbung und Ausnahmen" },
    { id: "A4", title: "Kontrollstrukturen und statische Methoden" },
    { id: "A5", title: "Arrays und Zeichenketten" }
  ];
  return { make: make, SECS: SECS, TF: TF, DOM: DOM, baseSource: baseSource, subSource: subSource };
})();
if (typeof module !== "undefined") module.exports = MOCK;
