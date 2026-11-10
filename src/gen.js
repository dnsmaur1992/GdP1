// nibble – Aufgabengeneratoren für den Modus „Programmieren“
// Jede Aufgabe wird mit Zufallswerten erzeugt. Erwartete Ausgaben werden hier
// berechnet und wurden mit javac/java über Hunderte Varianten gegengeprüft (verify.js).
var GEN = (function () {

  // ---------- Zufall (mit Seed, damit Varianten reproduzierbar sind) ----------
  function rng(seed) {
    var a = seed >>> 0;
    function next() { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
    var r = {
      f: next,
      int: function (lo, hi) { return lo + Math.floor(next() * (hi - lo + 1)); },
      pick: function (arr) { return arr[Math.floor(next() * arr.length)]; },
      chance: function (p) { return next() < p; },
      shuffle: function (arr) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(next() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; },
      arr: function (n, lo, hi) { var a = []; for (var i = 0; i < n; i++) a.push(r.int(lo, hi)); return a; }
    };
    return r;
  }

  // ---------- Java-Formatierung ----------
  var idiv = function (a, b) { return Math.trunc(a / b); };          // int-Division wie Java
  function jd(x) {                                                   // Double.toString für "harmlose" Werte
    if (Number.isInteger(x)) return x.toFixed(1);
    return String(x);
  }
  function lit(x, type) {                                            // Java-Literal
    if (type === "double") return Number.isInteger(x) ? x.toFixed(1) : String(x);
    if (type === "String") return JSON.stringify(x);
    if (type === "char") return "'" + x + "'";
    if (type === "long") return x + "L";
    return String(x);
  }
  function arrLit(a, type) { return "new " + type + "[]{" + a.map(function (x) { return lit(x, type); }).join(", ") + "}"; }
  function arrInit(a, type) { return "{" + a.map(function (x) { return lit(x, type); }).join(", ") + "}"; }
  function arr2Lit(m, type) { return "new " + type + "[][]{" + m.map(function (r) { return arrInit(r, type); }).join(", ") + "}"; }
  function show(x, type) {                                           // Anzeige in der App
    if (type === "double") return jd(x);
    if (type === "String") return JSON.stringify(x);
    if (type === "char") return "'" + x + "'";
    if (Array.isArray(x)) return "[" + x.map(function (v) { return show(v, type.replace("[]", "")); }).join(", ") + "]";
    return String(x);
  }
  function showArr(a, type) { return "{" + a.map(function (x) { return lit(x, type); }).join(", ") + "}"; }

  // ======================================================================
  //  A) Ausgabe vorhersagen
  // ======================================================================
  var TRACE = [];

  // T1: for + if/else + switch (Aufbau wie Probeklausur A4.1)
  TRACE.push({ id: "t-forswitch", rel: "VER-2", title: "for, if und switch", gen: function (r) {
    var start = r.pick([0, 1, 2]), step = r.pick([2, 3]), k = r.int(5, 8), end = start + step * k;
    var d = r.pick([3, 4, 5].filter(function (x) { return x !== step; }));
    var visited = []; for (var i = start; i <= end; i += step) visited.push(i);
    var cand = visited.slice(1, -1), ca = r.pick(cand), cb = r.pick(cand.filter(function (x) { return x !== ca; }));
    if (ca > cb) { var t = ca; ca = cb; cb = t; }
    var delim = r.pick(["--", "**", "=="]), app = r.pick(["//", "#", "+"]), mark = r.pick(["x", "-", "o"]);
    var code = 'String delim = "' + delim + '";\n' +
      'for (int i = ' + start + '; i <= ' + end + '; i += ' + step + ') {\n' +
      '    if (i % ' + d + ' == 0) {\n        System.out.print(i + " ");\n    } else {\n        System.out.print("' + mark + ' ");\n    }\n' +
      '    switch (i) {\n' +
      '        case ' + ca + ' -> {\n            System.out.println();\n            System.out.println(delim);\n            delim = delim + "' + app + '";\n        }\n' +
      '        case ' + cb + ' -> {\n            System.out.println();\n            System.out.println(delim);\n        }\n' +
      '    }\n}';
    var out = "", dl = delim;
    visited.forEach(function (i) {
      out += (i % d === 0) ? i + " " : mark + " ";
      if (i === ca) { out += "\n" + dl + "\n"; dl += app; }
      else if (i === cb) { out += "\n" + dl + "\n"; }
    });
    return { code: code, out: out, why: "i läuft " + visited.join(", ") + ". Durch " + d + " teilbar: " + (visited.filter(function (x) { return x % d === 0; }).join(", ") || "keine") + ". Bei " + ca + " und " + cb + " folgen Zeilenumbruch und Trenner; nach " + ca + " wird delim verlängert. Pfeil-Syntax: kein Durchfallen." };
  }});

  // T2: Schleifen mit int-Arithmetik
  TRACE.push({ id: "t-while", rel: "ITR-0", title: "while-Schleife", gen: function (r) {
    var v = r.int(0, 3), code, out, why;
    if (v === 0) {
      var k = r.int(20, 200), d = r.pick([2, 3]), n = 0, kk = k;
      while (kk > 1) { kk = idiv(kk, d); n++; }
      code = "int k = " + k + ";\nint n = 0;\nwhile (k > 1) {\n    k = k / " + d + ";\n    n++;\n}\nSystem.out.println(k + \" \" + n);";
      out = kk + " " + n; why = "Ganzzahldivision schneidet ab. k wird " + n + "-mal durch " + d + " geteilt, bis k ≤ 1 ist.";
    } else if (v === 1) {
      var z = r.int(100, 99999), s = 0, zz = z;
      while (zz > 0) { s += zz % 10; zz = idiv(zz, 10); }
      code = "int n = " + z + ";\nint s = 0;\nwhile (n > 0) {\n    s += n % 10;\n    n = n / 10;\n}\nSystem.out.println(s);";
      out = String(s); why = "Quersumme: n % 10 liefert die letzte Ziffer, n / 10 entfernt sie.";
    } else if (v === 2) {
      var x = r.int(-2, 12), st = r.int(3, 5), o = "", xx = x;
      do { o += xx + " "; xx = xx - st; } while (xx > 0);
      code = "int x = " + x + ";\ndo {\n    System.out.print(x + \" \");\n    x = x - " + st + ";\n} while (x > 0);\nSystem.out.println(\"| \" + x);";
      out = o + "| " + xx; why = "do-while läuft mindestens einmal und prüft erst danach die Bedingung.";
    } else {
      var N = r.int(8, 12), m = r.pick([2, 3]), rr = r.int(0, m - 1), lim = r.int(4, N - 2), sum = 0, o2 = "";
      for (var i = 0; i < N; i++) { if (i % m === rr) continue; if (i > lim) break; sum += i; o2 += sum + " "; }
      code = "int s = 0;\nfor (int i = 0; i < " + N + "; i++) {\n    if (i % " + m + " == " + rr + ") continue;\n    if (i > " + lim + ") break;\n    s += i;\n    System.out.print(s + \" \");\n}";
      out = o2; why = "continue überspringt Werte mit i % " + m + " == " + rr + ", break beendet die Schleife sobald i > " + lim + ".";
    }
    return { code: code, out: out, why: why };
  }});

  // T3: Ausdrücke, Division, Cast, ++, String-Verkettung
  TRACE.push({ id: "t-expr", rel: "VAR-2", title: "Ausdrücke und Operatoren", gen: function (r) {
    var a = r.int(7, 40), b = r.pick([2, 4, 5, 8]);
    var lines = [
      ["System.out.println(a / b);", String(idiv(a, b))],
      ["System.out.println(a % b);", String(a % b)],
      ["System.out.println((double) a / b);", jd(a / b)],
      ["System.out.println(a / b * b);", String(idiv(a, b) * b)],
      ["System.out.println(a + b + \"\" + a);", String(a + b) + String(a)],
      ["System.out.println(\"\" + a + b);", "" + a + b],
      ["double d = a / b;\nSystem.out.println(d);", jd(idiv(a, b))],
      ["System.out.println((int) (a / (double) b));", String(Math.trunc(a / b))]
    ];
    var pick = r.shuffle(lines).slice(0, 3);
    var code = "int a = " + a + ";\nint b = " + b + ";\n" + pick.map(function (l) { return l[0]; }).join("\n");
    var out = pick.map(function (l) { return l[1]; }).join("\n");
    if (r.chance(0.6)) {
      var i0 = r.int(2, 9), pre = r.chance(0.5);
      if (pre) { code += "\nint i = " + i0 + ";\nint j = ++i * 2;\nSystem.out.println(i + \" \" + j);"; out += "\n" + (i0 + 1) + " " + ((i0 + 1) * 2); }
      else { code += "\nint i = " + i0 + ";\nint j = i++ * 2;\nSystem.out.println(i + \" \" + j);"; out += "\n" + (i0 + 1) + " " + (i0 * 2); }
    }
    return { code: code, out: out, why: "int / int schneidet ab, (double) vor der Division rechnet mit Komma. Bei String-Verkettung wird von links ausgewertet: Zahlen vor dem ersten String werden addiert. ++i erhöht vor, i++ nach der Verwendung." };
  }});

  // T4: Arrays
  TRACE.push({ id: "t-array", rel: "ARR-1", title: "Arrays durchlaufen", imports: ["java.util.Arrays"], gen: function (r) {
    var n = r.int(5, 7), f = r.arr(n, -9, 20), v = r.int(0, 5), code, out, why;
    var decl = "int[] f = " + arrInit(f, "int") + ";\n";
    if (v === 0) {
      var s = 0; for (var i = 0; i < n; i += 2) s += f[i];
      code = decl + "int s = 0;\nfor (int i = 0; i < f.length; i += 2) {\n    s += f[i];\n}\nSystem.out.println(s);"; out = String(s); why = "Summiert werden die Elemente an den Indizes 0, 2, 4 …";
    } else if (v === 1) {
      var g = r.int(0, 10), c = f.filter(function (x) { return x > g; }).length;
      code = decl + "int n = 0;\nfor (int x : f) {\n    if (x > " + g + ") n++;\n}\nSystem.out.println(n);"; out = String(c); why = "Gezählt werden alle Elemente größer als " + g + " (nicht gleich!).";
    } else if (v === 2) {
      var m = 0; for (var i2 = 1; i2 < n; i2++) if (f[i2] > f[m]) m = i2;
      code = decl + "int m = 0;\nfor (int i = 1; i < f.length; i++) {\n    if (f[i] > f[m]) m = i;\n}\nSystem.out.println(m + \" \" + f[m]);"; out = m + " " + f[m]; why = "m merkt sich den Index des größten Elements (bei Gleichstand das erste).";
    } else if (v === 3) {
      var g2 = f.slice(); for (var i3 = 0; i3 < n - 1; i3++) g2[i3] = g2[i3 + 1];
      code = decl + "for (int i = 0; i < f.length - 1; i++) {\n    f[i] = f[i + 1];\n}\nSystem.out.println(Arrays.toString(f));"; out = "[" + g2.join(", ") + "]"; why = "Alle Elemente rücken eins nach links, das letzte bleibt stehen (es wird doppelt).";
    } else if (v === 4) {
      var o = ""; for (var i4 = n - 1; i4 >= 0; i4 -= 2) o += f[i4] + " ";
      code = decl + "for (int i = f.length - 1; i >= 0; i -= 2) {\n    System.out.print(f[i] + \" \");\n}"; out = o; why = "Rückwärts ab dem letzten Index (length - 1 = " + (n - 1) + "), jeweils zwei Schritte.";
    } else {
      var h = f.slice(); h[n - 1] = h[0] * 2;
      code = decl + "f[f.length - 1] = f[0] * 2;\nSystem.out.println(f[2] + \" \" + f.length + \" \" + f[f.length - 1]);"; out = h[2] + " " + n + " " + h[n - 1]; why = "Index 2 ist das dritte Element. length bleibt " + n + ". Der letzte Index ist length - 1.";
    }
    return { code: code, out: out, why: why };
  }});

  // T5: Zeichenketten
  var WORDS = ["Programmierung", "Brandenburg", "Datentypen", "Schleife", "Polymorphie", "Variable", "Konstruktor", "Exception", "Zeichenkette", "Methode", "Informatik", "Sicherheit", "Vererbung", "Referenz"];
  TRACE.push({ id: "t-string", rel: "ZKT-1", title: "String-Methoden", gen: function (r) {
    var s = r.pick(WORDS), L = s.length;
    var k = r.int(0, L - 1), a = r.int(0, L - 4), b = r.int(a + 1, Math.min(L, a + 6));
    var ch = r.chance(0.7) ? s.charAt(r.int(1, L - 1)).toLowerCase() : r.pick(["z", "q", "x"]);
    var ops = [
      ["s.length()", String(L)],
      ["s.charAt(" + k + ")", s.charAt(k)],
      ["s.indexOf('" + ch + "')", String(s.indexOf(ch))],
      ["s.substring(" + a + ", " + b + ")", s.substring(a, b)],
      ["s.substring(" + (L - 3) + ")", s.substring(L - 3)],
      ["s.toUpperCase().charAt(" + k + ")", s.toUpperCase().charAt(k)],
      ["new StringBuilder(s).reverse().toString().substring(0, 3)", s.split("").reverse().join("").substring(0, 3)],
      ["s.charAt(0) + s.length()", String(s.charCodeAt(0) + L)],
      ["\"\" + s.charAt(0) + s.length()", s.charAt(0) + L]
    ];
    var pick = r.shuffle(ops).slice(0, 3);
    var code = "String s = \"" + s + "\";\n" + pick.map(function (o) { return "System.out.println(" + o[0] + ");"; }).join("\n");
    var out = pick.map(function (o) { return o[1]; }).join("\n");
    if (r.chance(0.5)) { code += "\nString t = s;\nt.toUpperCase();\nSystem.out.println(t);"; out += "\n" + s; }
    return { code: code, out: out, why: "Index zählt ab 0, substring(a, b) endet vor b. indexOf liefert -1, wenn nichts gefunden wird. char + int ist Zahlen-Addition (Unicode-Wert!), \"\" + char ist Text. Strings sind unveränderlich." };
  }});

  // T6: verschachtelte Schleifen
  TRACE.push({ id: "t-nested", rel: "ITR-2", title: "Verschachtelte Schleifen", gen: function (r) {
    var R = r.int(3, 5), v = r.int(0, 3), code, out = "";
    if (v === 0) { code = "for (int z = 1; z <= " + R + "; z++) {\n    for (int s = 1; s <= z; s++) {\n        System.out.print(\"*\");\n    }\n    System.out.println();\n}"; for (var z = 1; z <= R; z++) out += "*".repeat(z) + "\n"; }
    else if (v === 1) { code = "for (int z = " + R + "; z >= 1; z--) {\n    for (int s = 1; s <= z; s++) {\n        System.out.print(\"#\");\n    }\n    System.out.println();\n}"; for (var z1 = R; z1 >= 1; z1--) out += "#".repeat(z1) + "\n"; }
    else if (v === 2) { code = "for (int z = 1; z <= " + R + "; z++) {\n    for (int s = 1; s <= z; s++) {\n        System.out.print(z * s + \" \");\n    }\n    System.out.println();\n}"; for (var z2 = 1; z2 <= R; z2++) { for (var s2 = 1; s2 <= z2; s2++) out += (z2 * s2) + " "; out += "\n"; } }
    else { code = "for (int z = 1; z <= " + R + "; z++) {\n    for (int s = z; s <= " + R + "; s++) {\n        System.out.print(s + \" \");\n    }\n    System.out.println();\n}"; for (var z3 = 1; z3 <= R; z3++) { for (var s3 = z3; s3 <= R; s3++) out += s3 + " "; out += "\n"; } }
    return { code: code, out: out, why: "Die innere Schleife läuft pro Zeile komplett durch, ihre Grenze hängt hier von z ab. println() beendet die Zeile." };
  }});

  // T7: Polymorphie
  var POLY = [
    { b: "Tier", s1: "Hund", s2: "Katze", m: "laut", v: ["...", "Wuff", "Miau"], p: "sagt" },
    { b: "Konto", s1: "Girokonto", s2: "Sparbuch", m: "art", v: ["Konto", "Giro", "Spar"], p: "ist" },
    { b: "Fahrzeug", s1: "Auto", s2: "Fahrrad", m: "geraeusch", v: ["rollt", "brummt", "klingelt"], p: "macht" }
  ];
  TRACE.push({ id: "t-poly", rel: "VRB-2", title: "Polymorphie", gen: function (r) {
    var P = r.pick(POLY), s2info = r.chance(0.5);
    var helpers = "class " + P.b + " {\n    String " + P.m + "() { return \"" + P.v[0] + "\"; }\n    String info() { return \"" + P.b + " " + P.p + " \" + " + P.m + "(); }\n}\n" +
      "class " + P.s1 + " extends " + P.b + " {\n    @Override String " + P.m + "() { return \"" + P.v[1] + "\"; }\n}\n" +
      "class " + P.s2 + " extends " + P.b + " {\n" + (s2info ?
        "    @Override String info() { return super.info() + \"!\"; }\n" :
        "    @Override String " + P.m + "() { return \"" + P.v[2] + "\"; }\n") + "}";
    var order = r.shuffle([P.b, P.s1, P.s2]);
    function info(c) {
      if (c === P.b) return P.b + " " + P.p + " " + P.v[0];
      if (c === P.s1) return P.b + " " + P.p + " " + P.v[1];
      return s2info ? P.b + " " + P.p + " " + P.v[0] + "!" : P.b + " " + P.p + " " + P.v[2];
    }
    var body = P.b + "[] liste = { " + order.map(function (c) { return "new " + c + "()"; }).join(", ") + " };\nfor (" + P.b + " x : liste) {\n    System.out.println(x.info());\n}";
    return { code: helpers + "\n// in main:\n" + body, helpers: helpers, body: body, out: order.map(info).join("\n"),
      why: "info() steht nur in " + P.b + ", ruft aber " + P.m + "() auf. Welche Version läuft, entscheidet das tatsächliche Objekt (dynamische Bindung)." + (s2info ? " " + P.s2 + " überschreibt info() und hängt an super.info() etwas an." : "") };
  }});

  // T8: switch alt vs. neu
  TRACE.push({ id: "t-switch", rel: "VER-2", title: "switch mit und ohne break", gen: function (r) {
    var x = r.int(1, 4), brk = r.int(1, 3), arrow = r.chance(0.35), L = ["A", "B", "C"];
    var code, out = "";
    if (arrow) {
      code = "int x = " + x + ";\nswitch (x) {\n    case 1 -> System.out.print(\"A\");\n    case 2 -> System.out.print(\"B\");\n    case 3 -> System.out.print(\"C\");\n    default -> System.out.print(\"D\");\n}\nSystem.out.println(\"|\");";
      out = (x <= 3 ? L[x - 1] : "D") + "|";
    } else {
      code = "int x = " + x + ";\nswitch (x) {\n";
      for (var c = 1; c <= 3; c++) code += "    case " + c + ": System.out.print(\"" + L[c - 1] + "\");" + (c === brk ? " break;" : "") + "\n";
      code += "    default: System.out.print(\"D\");\n}\nSystem.out.println(\"|\");";
      if (x > 3) out = "D";
      else { for (var c2 = x; c2 <= 4; c2++) { out += c2 <= 3 ? L[c2 - 1] : "D"; if (c2 === brk) break; } }
      out += "|";
    }
    return { code: code, out: out, why: arrow ? "Pfeil-Syntax: Nur der passende Fall läuft, kein Durchfallen." : "Doppelpunkt-Syntax: Ab dem passenden case fällt die Ausführung durch, bis ein break kommt (hier nach case " + brk + ")." };
  }});

  // ======================================================================
  //  B) Code schreiben (statische Methoden)
  //  Jede Aufgabe: Text, Signatur, Tests (Java-Ausdrücke), Musterlösung
  // ======================================================================
  var WRITE = [];
  // Test: {label, call (Java-Ausdruck), exp (Java-Ausdruck), show (Anzeige), kind: eq|dbl|arr, setup}
  function T(label, call, exp, show, kind, setup) { return { label: label, call: call, exp: exp, show: show, kind: kind || "eq", setup: setup || "" }; }

  function methodTask(o) { // o: rel, title, task, sig, body, tests, check, mins, imports
    o.cls = "Aufgabe";
    o.starter = (o.imports ? o.imports.map(function (i) { return "import " + i + ";\n"; }).join("") + "\n" : "") +
      "public class Aufgabe {\n\n    " + o.sig + " {\n        // TODO: hier programmieren\n        " + o.dummy + "\n    }\n}\n";
    o.sol = (o.imports ? o.imports.map(function (i) { return "import " + i + ";\n"; }).join("") + "\n" : "") +
      "public class Aufgabe {\n\n    " + o.sig + " {\n" + o.body.split("\n").map(function (l) { return "        " + l; }).join("\n") + "\n    }\n}\n";
    return o;
  }

  // W1: Summen über Zahlenbereiche
  WRITE.push({ id: "w-summe", rel: "STA-1", title: "Summe über einen Bereich", gen: function (r) {
    var v = r.pick(["alle", "gerade", "ungerade", "teilbar"]), k = r.pick([3, 4, 5, 7]);
    var name = { alle: "summe", gerade: "summeGerade", ungerade: "summeUngerade", teilbar: "summeTeilbar" }[v];
    var cond = { alle: null, gerade: "i % 2 == 0", ungerade: "i % 2 != 0", teilbar: "i % k == 0" }[v];
    var desc = { alle: "aller Zahlen", gerade: "aller geraden Zahlen", ungerade: "aller ungeraden Zahlen", teilbar: "aller durch k teilbaren Zahlen" }[v];
    var params = "int a, int b" + (v === "teilbar" ? ", int k" : "");
    function f(a, b) { var s = 0; for (var i = a; i <= b; i++) { if (v === "alle" || (v === "gerade" && i % 2 === 0) || (v === "ungerade" && i % 2 !== 0) || (v === "teilbar" && i % k === 0)) s += i; } return s; }
    var pairs = [[r.int(1, 5), r.int(8, 15)], [r.int(0, 3), r.int(4, 7)], [r.int(10, 20), r.int(25, 40)]], same = r.int(2, 9); pairs.push([same, same]);
    var tests = pairs.map(function (p) { var args = p[0] + ", " + p[1] + (v === "teilbar" ? ", " + k : ""); var res = f(p[0], p[1]); return T(name + "(" + args + ")", "Aufgabe." + name + "(" + args + ")", String(res), String(res)); });
    var ex = pairs[0], exArgs = ex[0] + ", " + ex[1] + (v === "teilbar" ? ", " + k : "");
    return methodTask({ rel: "STA-1", title: "Summe " + desc.replace("aller ", "").replace("Zahlen", "Zahlen"),
      task: "Schreiben Sie eine statische Methode `" + name + "`, die " + (v === "teilbar" ? "drei int-Zahlen a, b und k" : "zwei int-Zahlen a und b") + " erhält und die Summe " + desc + " von a bis einschließlich b zurückgibt. Beispiel: `" + name + "(" + exArgs + ")` liefert " + f(ex[0], ex[1]) + ". Es gilt a ≤ b.",
      sig: "public static int " + name + "(" + params + ")", dummy: "return 0;",
      body: "int s = 0;\nfor (int i = a; i <= b; i++) {\n" + (cond ? "    if (" + cond + ") {\n        s += i;\n    }\n" : "    s += i;\n") + "}\nreturn s;",
      tests: tests, mins: 6,
      check: ["Kopf: `public static int " + name + "(" + params + ")`", "Summenvariable vor der Schleife mit 0 initialisiert", "Schleife bis einschließlich b (`<=`)", cond ? "Bedingung `" + cond + "`" : "Jede Zahl wird addiert", "`return` nach der Schleife"] });
  }});

  // W2: Schleifen-Algorithmen mit int
  WRITE.push({ id: "w-zahl", rel: "ITR-0", title: "Zahlen-Algorithmus", gen: function (r) {
    var v = r.pick(["quersumme", "anzahlStellen", "teilerAnzahl", "istPrimzahl", "ggT", "fakultaet"]);
    var o = {
      quersumme: { sig: "public static int quersumme(int n)", t: "die Quersumme einer nicht-negativen Zahl n zurückgibt (Summe ihrer Ziffern)", body: "int s = 0;\nwhile (n > 0) {\n    s += n % 10;\n    n = n / 10;\n}\nreturn s;", f: function (n) { var s = 0; while (n > 0) { s += n % 10; n = idiv(n, 10); } return s; }, args: function () { return [r.int(100, 99999), r.int(10, 99), 0, r.int(1000, 9999)]; }, dummy: "return 0;", ck: ["Letzte Ziffer mit `n % 10`", "Ziffer abschneiden mit `n / 10`", "Schleife läuft solange n > 0"], rel: "ITR-0" },
      anzahlStellen: { sig: "public static int anzahlStellen(int n)", t: "die Anzahl der Ziffern einer nicht-negativen Zahl n zurückgibt. Die 0 hat eine Stelle", body: "int anzahl = 0;\ndo {\n    anzahl++;\n    n = n / 10;\n} while (n > 0);\nreturn anzahl;", f: function (n) { var a = 0; do { a++; n = idiv(n, 10); } while (n > 0); return a; }, args: function () { return [0, r.int(1, 9), r.int(100, 999), r.int(10000, 999999)]; }, dummy: "return 0;", ck: ["Sonderfall 0 → 1 Stelle (do-while oder eigene Prüfung)", "Zähler pro abgeschnittener Ziffer erhöhen"], rel: "ITR-1" },
      teilerAnzahl: { sig: "public static int teilerAnzahl(int n)", t: "zurückgibt, wie viele positive Teiler die Zahl n (n ≥ 1) hat. Beispiel: 6 hat die Teiler 1, 2, 3, 6", body: "int anzahl = 0;\nfor (int i = 1; i <= n; i++) {\n    if (n % i == 0) {\n        anzahl++;\n    }\n}\nreturn anzahl;", f: function (n) { var a = 0; for (var i = 1; i <= n; i++) if (n % i === 0) a++; return a; }, args: function () { return [1, r.int(2, 30), r.int(31, 100), r.pick([12, 24, 36, 60])]; }, dummy: "return 0;", ck: ["Schleife von 1 bis einschließlich n", "Teilbarkeit mit `n % i == 0`"], rel: "ITR-2" },
      istPrimzahl: { sig: "public static boolean istPrimzahl(int n)", t: "true zurückgibt, wenn n eine Primzahl ist, sonst false. Zahlen kleiner als 2 sind keine Primzahlen", body: "if (n < 2) {\n    return false;\n}\nfor (int i = 2; i < n; i++) {\n    if (n % i == 0) {\n        return false;\n    }\n}\nreturn true;", f: function (n) { if (n < 2) return false; for (var i = 2; i < n; i++) if (n % i === 0) return false; return true; }, args: function () { return [1, 2, r.pick([13, 17, 19, 23, 29, 31]), r.pick([15, 21, 25, 27, 33, 49])]; }, dummy: "return false;", ck: ["Sonderfall n < 2", "Früh `return false`, sobald ein Teiler gefunden ist", "`return true` erst nach der Schleife"], rel: "ITR-2" },
      ggT: { sig: "public static int ggT(int a, int b)", t: "den größten gemeinsamen Teiler zweier positiver Zahlen a und b zurückgibt. Tipp: Probieren Sie von der kleineren Zahl abwärts", body: "int t = Math.min(a, b);\nwhile (a % t != 0 || b % t != 0) {\n    t--;\n}\nreturn t;", f: function (a, b) { var t = Math.min(a, b); while (a % t !== 0 || b % t !== 0) t--; return t; }, two: true, args: function () { return [[12, 18], [r.int(2, 9) * 6, r.int(2, 9) * 4], [7, 13], [r.int(5, 20), r.int(5, 20)]]; }, dummy: "return 0;", ck: ["Gemeinsamer Teiler: beide Reste sind 0", "Von min(a, b) abwärts suchen oder Euklid"], rel: "ITR-0" },
      fakultaet: { sig: "public static long fakultaet(int n)", t: "n! = 1 · 2 · … · n zurückgibt (n ≥ 0, 0! = 1). Verwenden Sie long als Rückgabetyp", body: "long f = 1;\nfor (int i = 2; i <= n; i++) {\n    f *= i;\n}\nreturn f;", f: function (n) { var f = 1; for (var i = 2; i <= n; i++) f *= i; return f; }, args: function () { return [0, 1, r.int(4, 8), r.int(12, 15)]; }, dummy: "return 0;", ck: ["Startwert 1 (nicht 0!)", "Rückgabetyp long", "0! = 1 ergibt sich automatisch"], long: true, rel: "ITR-2" }
    }[v];
    var tests = o.args().map(function (a) {
      var args = o.two ? a.join(", ") : String(a), res = o.two ? o.f(a[0], a[1]) : o.f(a);
      return T(v + "(" + args + ")", "Aufgabe." + v + "(" + args + ")", o.long ? res + "L" : String(res), String(res));
    });
    return methodTask({ rel: o.rel, title: v, task: "Schreiben Sie eine statische Methode `" + v + "`, die " + o.t + ".", sig: o.sig, dummy: o.dummy, body: o.body, tests: tests, mins: 7, check: ["Kopf: `" + o.sig + "`"].concat(o.ck) });
  }});

  // W3: Verzweigungen (Stufen/Tarife)
  WRITE.push({ id: "w-if", rel: "VER-1", title: "Verzweigung mit Stufen", gen: function (r) {
    var t1 = r.pick([10, 12, 15]), t2 = r.pick([20, 25, 30]), t3 = r.pick([50, 60]), p1 = r.pick([6, 8, 10]), p2 = p1 + r.pick([2, 4]), p3 = p2 + r.pick([2, 4, 6]);
    var v = r.pick(["eintritt", "versand"]);
    var body, desc, f, name, sig, tests = [], vals;
    if (v === "eintritt") {
      name = "eintritt"; sig = "public static int eintritt(int alter)";
      desc = "den Eintrittspreis in Euro für ein Alter zurückgibt: unter " + t1 + " Jahren " + p1 + " €, unter " + t2 + " Jahren " + p2 + " €, ab " + t2 + " Jahren " + p3 + " €. Bei negativem Alter wird -1 zurückgegeben";
      f = function (a) { if (a < 0) return -1; if (a < t1) return p1; if (a < t2) return p2; return p3; };
      body = "if (alter < 0) {\n    return -1;\n} else if (alter < " + t1 + ") {\n    return " + p1 + ";\n} else if (alter < " + t2 + ") {\n    return " + p2 + ";\n} else {\n    return " + p3 + ";\n}";
      vals = [-1, 0, t1 - 1, t1, t2 - 1, t2, t3];
    } else {
      name = "versand"; sig = "public static double versand(double bestellwert)";
      var g1 = r.pick([20, 25, 30]), g2 = g1 + r.pick([20, 30, 50]), k1 = r.pick([4.95, 5.5, 6.9]), k2 = r.pick([2.5, 2.95, 3.5]);
      desc = "die Versandkosten zurückgibt: Bestellwert unter " + g1 + " € kostet " + jd(k1) + " €, unter " + g2 + " € kostet " + jd(k2) + " €, ab " + g2 + " € ist der Versand kostenlos (0.0). Bei Bestellwert ≤ 0 wird ebenfalls 0.0 zurückgegeben";
      f = function (w) { if (w <= 0) return 0; if (w < g1) return k1; if (w < g2) return k2; return 0; };
      body = "if (bestellwert <= 0) {\n    return 0.0;\n} else if (bestellwert < " + g1 + ") {\n    return " + jd(k1) + ";\n} else if (bestellwert < " + g2 + ") {\n    return " + jd(k2) + ";\n} else {\n    return 0.0;\n}";
      vals = [0, g1 - 0.5, g1, g2 - 0.01, g2, g2 + 100];
    }
    vals.forEach(function (x) {
      var arg = v === "versand" ? lit(x, "double") : String(x), res = f(x);
      tests.push(T(name + "(" + arg + ")", "Aufgabe." + name + "(" + arg + ")", v === "versand" ? lit(res, "double") : String(res), v === "versand" ? jd(res) : String(res), v === "versand" ? "dbl" : "eq"));
    });
    return methodTask({ rel: "VER-1", title: v === "eintritt" ? "Eintrittspreise" : "Versandkosten", task: "Schreiben Sie eine statische Methode `" + name + "`, die " + desc + ".", sig: sig, dummy: v === "versand" ? "return 0.0;" : "return 0;", body: body, tests: tests, mins: 6,
      check: ["Ungültige Eingabe zuerst prüfen", "if – else if – else statt mehrerer unabhängiger if", "Grenzen genau: `<` vs. `<=` laut Aufgabentext", "Jeder Pfad endet mit `return`"] });
  }});

  // W4: eindimensionale Arrays
  WRITE.push({ id: "w-array", rel: "ARR-1", title: "Array-Algorithmus", gen: function (r) {
    var v = r.pick(["zaehleGroesser", "maximum", "indexDesMinimums", "enthaelt", "summe", "durchschnitt", "ersetzeNegative", "kappen", "zaehleGerade"]);
    var A = function () { return r.arr(r.int(4, 7), -5, 30); }, D = function () { return r.arr(r.int(3, 6), -8, 40).map(function (x) { return x + r.pick([0, 0.5, 0.25]); }); };
    var o, tests = [];
    if (v === "zaehleGroesser") { var g = r.int(5, 15); o = { sig: "public static int zaehleGroesser(int[] werte, int grenze)", t: "zurückgibt, wie viele Elemente des Arrays größer als grenze sind", body: "int n = 0;\nfor (int x : werte) {\n    if (x > grenze) {\n        n++;\n    }\n}\nreturn n;", dummy: "return 0;", ck: ["Zähler mit 0 starten", "Vergleich `> grenze` (nicht `>=`)", "foreach reicht, da nur gelesen wird"] };
      [A().concat([g]), A(), []].forEach(function (a) { var res = a.filter(function (x) { return x > g; }).length; tests.push(T("zaehleGroesser(" + showArr(a, "int") + ", " + g + ")", "Aufgabe.zaehleGroesser(" + arrLit(a, "int") + ", " + g + ")", String(res), String(res))); }); }
    else if (v === "zaehleGerade") { o = { sig: "public static int zaehleGerade(int[] werte)", t: "zurückgibt, wie viele gerade Zahlen im Array stehen", body: "int n = 0;\nfor (int x : werte) {\n    if (x % 2 == 0) {\n        n++;\n    }\n}\nreturn n;", dummy: "return 0;", ck: ["Gerade: `x % 2 == 0` (funktioniert auch für negative Zahlen)", "Zähler zurückgeben"] };
      [A(), A(), []].forEach(function (a) { var res = a.filter(function (x) { return x % 2 === 0; }).length; tests.push(T("zaehleGerade(" + showArr(a, "int") + ")", "Aufgabe.zaehleGerade(" + arrLit(a, "int") + ")", String(res), String(res))); }); }
    else if (v === "maximum") { o = { sig: "public static int maximum(int[] werte)", t: "das größte Element eines nicht-leeren Arrays zurückgibt", body: "int max = werte[0];\nfor (int i = 1; i < werte.length; i++) {\n    if (werte[i] > max) {\n        max = werte[i];\n    }\n}\nreturn max;", dummy: "return 0;", ck: ["Startwert ist `werte[0]`, nicht 0 (Array kann nur negative Werte enthalten!)", "Vergleich mit dem bisherigen Maximum"] };
      [A(), A().map(function (x) { return -Math.abs(x) - 1; }), [r.int(-5, 5)]].forEach(function (a) { var res = Math.max.apply(null, a); tests.push(T("maximum(" + showArr(a, "int") + ")", "Aufgabe.maximum(" + arrLit(a, "int") + ")", String(res), String(res))); }); }
    else if (v === "indexDesMinimums") { o = { sig: "public static int indexDesMinimums(int[] werte)", t: "den Index des kleinsten Elements eines nicht-leeren Arrays zurückgibt. Kommt das Minimum mehrfach vor, zählt das erste", body: "int idx = 0;\nfor (int i = 1; i < werte.length; i++) {\n    if (werte[i] < werte[idx]) {\n        idx = i;\n    }\n}\nreturn idx;", dummy: "return 0;", ck: ["Index merken, nicht den Wert", "Strikt `<`, damit das erste Minimum gewinnt"] };
      var dup = A(); dup.push(Math.min.apply(null, dup));
      [A(), dup, [7]].forEach(function (a) { var idx = 0; for (var i = 1; i < a.length; i++) if (a[i] < a[idx]) idx = i; tests.push(T("indexDesMinimums(" + showArr(a, "int") + ")", "Aufgabe.indexDesMinimums(" + arrLit(a, "int") + ")", String(idx), String(idx))); }); }
    else if (v === "enthaelt") { o = { sig: "public static boolean enthaelt(int[] werte, int gesucht)", t: "per linearer Suche true zurückgibt, wenn gesucht im Array vorkommt, sonst false", body: "for (int x : werte) {\n    if (x == gesucht) {\n        return true;\n    }\n}\nreturn false;", dummy: "return false;", ck: ["`return true` sofort beim Fund", "`return false` erst nach der Schleife", "Leeres Array → false"] };
      var a1 = A(), a2 = A(); [[a1, a1[r.int(0, a1.length - 1)]], [a2, 99], [[], 3]].forEach(function (p) { var res = p[0].indexOf(p[1]) >= 0; tests.push(T("enthaelt(" + showArr(p[0], "int") + ", " + p[1] + ")", "Aufgabe.enthaelt(" + arrLit(p[0], "int") + ", " + p[1] + ")", String(res), String(res))); }); }
    else if (v === "summe") { o = { sig: "public static int summe(int[] werte)", t: "die Summe aller Elemente zurückgibt (Akkumulation)", body: "int s = 0;\nfor (int x : werte) {\n    s += x;\n}\nreturn s;", dummy: "return 0;", ck: ["Summe mit 0 starten", "Leeres Array → 0"] };
      [A(), A(), []].forEach(function (a) { var res = a.reduce(function (s, x) { return s + x; }, 0); tests.push(T("summe(" + showArr(a, "int") + ")", "Aufgabe.summe(" + arrLit(a, "int") + ")", String(res), String(res))); }); }
    else if (v === "durchschnitt") { o = { sig: "public static double durchschnitt(double[] werte)", t: "den Durchschnitt aller Werte eines nicht-leeren Arrays zurückgibt", body: "double s = 0;\nfor (double x : werte) {\n    s += x;\n}\nreturn s / werte.length;", dummy: "return 0.0;", ck: ["Summe als double", "Durch `werte.length` (ohne Klammern!) teilen"] };
      [D(), D(), [r.int(1, 9) + 0.5]].forEach(function (a) { var s = 0; a.forEach(function (x) { s += x; }); var res = s / a.length; tests.push(T("durchschnitt(" + showArr(a, "double") + ")", "Aufgabe.durchschnitt(" + arrLit(a, "double") + ")", lit(res, "double"), String(Math.round(res * 1000) / 1000), "dbl")); }); }
    else if (v === "ersetzeNegative" || v === "kappen") {
      var neg = v === "ersetzeNegative", par = neg ? r.pick([0, 20, 18.5]) : r.pick([25, 30, 35.5]);
      o = neg ? { sig: "public static void ersetzeNegative(double[] messungen, double standard)", t: "alle negativen Einträge im Array durch standard ersetzt (angelehnt an die Temperaturmessung). Die Methode gibt nichts zurück, sie verändert das Array", body: "for (int i = 0; i < messungen.length; i++) {\n    if (messungen[i] < 0) {\n        messungen[i] = standard;\n    }\n}", dummy: "", ck: ["Rückgabetyp void", "for mit Index – mit foreach kann man nicht ins Array schreiben", "`< 0` (0 ist nicht negativ)"] }
        : { sig: "public static void kappen(double[] werte, double max)", t: "alle Einträge, die größer als max sind, durch max ersetzt. Die Methode gibt nichts zurück, sie verändert das Array", body: "for (int i = 0; i < werte.length; i++) {\n    if (werte[i] > max) {\n        werte[i] = max;\n    }\n}", dummy: "", ck: ["Rückgabetyp void", "for mit Index statt foreach", "Vergleich `> max`"] };
      [D(), D(), []].forEach(function (a, n) {
        var res = a.map(function (x) { return neg ? (x < 0 ? par : x) : (x > par ? par : x); });
        var nm = "a" + n;
        tests.push(T(v + "(" + showArr(a, "double") + ", " + jd(par) + ")", "Arrays.toString(" + nm + ")", "Arrays.toString(" + arrLit(res, "double") + ")", "{" + res.map(jd).join(", ") + "}", "eq", "double[] " + nm + " = " + arrLit(a, "double") + ";\nAufgabe." + v + "(" + nm + ", " + lit(par, "double") + ");"));
      });
    }
    var task = methodTask({ rel: "ARR-1", title: v, task: "Schreiben Sie eine statische Methode `" + v + "`, die " + o.t + ".", sig: o.sig, dummy: o.dummy, body: o.body, tests: tests, mins: 7, check: ["Kopf: `" + o.sig + "`", "Schleifengrenze `i < werte.length` bzw. foreach"].concat(o.ck) });
    task.testImports = ["java.util.Arrays"];
    return task;
  }});

  // W5: Zeichenketten
  WRITE.push({ id: "w-string", rel: "ZKT-1", title: "String-Algorithmus", gen: function (r) {
    var v = r.pick(["zaehleWorte", "anfangsbuchstaben", "umkehren", "istPalindrom", "ersetzeZeichen"]);
    var words = r.shuffle(WORDS.concat(["Anna", "Rentner", "Otto", "Lagerregal", "Java", "Klausur"]));
    var o, tests = [];
    var SAETZE = ["Grundlagen der Programmierung", "Technische Hochschule Brandenburg", "Java ist auch eine Insel", "Security Operations Center", "Hallo", "Lernen in kleinen Happen"];
    if (v === "zaehleWorte") { o = { sig: "public static int zaehleWorte(String text)", t: "die Anzahl der Wörter zurückgibt. Wörter sind durch genau ein Leerzeichen getrennt, am Anfang und Ende stehen keine Leerzeichen. Ein leerer String hat 0 Wörter", body: "if (text.isEmpty()) {\n    return 0;\n}\nint woerter = 1;\nfor (int i = 0; i < text.length(); i++) {\n    if (text.charAt(i) == ' ') {\n        woerter++;\n    }\n}\nreturn woerter;", dummy: "return 0;", ck: ["Sonderfall leerer String", "Leerzeichen zählen: Wörter = Leerzeichen + 1", "`charAt(i) == ' '` mit einfachen Hochkommas"] };
      r.shuffle(SAETZE).slice(0, 3).concat([""]).forEach(function (w) { var res = w === "" ? 0 : w.split(" ").length; tests.push(T("zaehleWorte(" + JSON.stringify(w) + ")", "Aufgabe.zaehleWorte(" + JSON.stringify(w) + ")", String(res), String(res))); }); }
    else if (v === "anfangsbuchstaben") { o = { sig: "public static String anfangsbuchstaben(String text)", t: "die Anfangsbuchstaben aller Wörter als String zurückgibt, z. B. \"Grundlagen der Programmierung\" → \"GdP\". Wörter sind durch genau ein Leerzeichen getrennt. Leerer String → \"\"", body: "String erg = \"\";\nfor (int i = 0; i < text.length(); i++) {\n    if (i == 0 || text.charAt(i - 1) == ' ') {\n        erg += text.charAt(i);\n    }\n}\nreturn erg;", dummy: "return \"\";", ck: ["Ein Zeichen ist Anfangsbuchstabe, wenn es an Position 0 steht oder davor ein Leerzeichen kommt", "Bei `i - 1` aufpassen: erst `i == 0` prüfen (Kurzschluss mit ||)", "Ergebnis-String mit \"\" starten"] };
      r.shuffle(SAETZE).slice(0, 3).concat([""]).forEach(function (w) { var res = w.split(" ").filter(function (x) { return x; }).map(function (x) { return x.charAt(0); }).join(""); tests.push(T("anfangsbuchstaben(" + JSON.stringify(w) + ")", "Aufgabe.anfangsbuchstaben(" + JSON.stringify(w) + ")", JSON.stringify(res), JSON.stringify(res))); }); }
    else if (v === "umkehren") { o = { sig: "public static String umkehren(String text)", t: "text rückwärts zurückgibt – mit einer Schleife, ohne StringBuilder.reverse()", body: "String erg = \"\";\nfor (int i = text.length() - 1; i >= 0; i--) {\n    erg = erg + text.charAt(i);\n}\nreturn erg;", dummy: "return \"\";", ck: ["Start bei `text.length() - 1`", "Bedingung `i >= 0`", "Ergebnis-String mit \"\" initialisieren"] };
      words.slice(0, 3).concat([""]).forEach(function (w) { var res = w.split("").reverse().join(""); tests.push(T("umkehren(" + JSON.stringify(w) + ")", "Aufgabe.umkehren(" + JSON.stringify(w) + ")", JSON.stringify(res), JSON.stringify(res))); }); }
    else if (v === "istPalindrom") { o = { sig: "public static boolean istPalindrom(String text)", t: "true zurückgibt, wenn text vorwärts und rückwärts gleich gelesen wird (Groß-/Kleinschreibung zählt). Ein leerer String ist ein Palindrom", body: "for (int i = 0; i < text.length() / 2; i++) {\n    if (text.charAt(i) != text.charAt(text.length() - 1 - i)) {\n        return false;\n    }\n}\nreturn true;", dummy: "return false;", ck: ["Vergleich von vorne `i` mit hinten `length() - 1 - i`", "Bis zur Mitte reicht", "Oder: umgedrehten String mit `equals` vergleichen – nie mit `==`"] };
      ["otto", "lagerregal", r.pick(WORDS).toLowerCase(), "Anna", ""].forEach(function (w) { var res = w === w.split("").reverse().join(""); tests.push(T("istPalindrom(" + JSON.stringify(w) + ")", "Aufgabe.istPalindrom(" + JSON.stringify(w) + ")", String(res), String(res))); }); }
    else { var a = r.pick(["e", "a", "i"]), b = r.pick(["3", "4", "1"]); o = { sig: "public static String ersetzeZeichen(String text, char alt, char neu)", t: "einen neuen String zurückgibt, in dem jedes Vorkommen von alt durch neu ersetzt ist – mit einer Schleife, ohne replace()", body: "StringBuilder sb = new StringBuilder();\nfor (int i = 0; i < text.length(); i++) {\n    char c = text.charAt(i);\n    if (c == alt) {\n        sb.append(neu);\n    } else {\n        sb.append(c);\n    }\n}\nreturn sb.toString();", dummy: "return text;", ck: ["Zeichen für Zeichen durchlaufen", "StringBuilder zum Zusammenbauen (oder String +)", "`toString()` am Ende"] };
      words.slice(0, 3).concat([""]).forEach(function (w) { var res = w.split(a).join(b); tests.push(T("ersetzeZeichen(" + JSON.stringify(w) + ", '" + a + "', '" + b + "')", "Aufgabe.ersetzeZeichen(" + JSON.stringify(w) + ", '" + a + "', '" + b + "')", JSON.stringify(res), JSON.stringify(res))); }); }
    return methodTask({ rel: v === "umkehren" || v === "ersetzeZeichen" ? "ZKT-3" : "ZKT-1", title: v, task: "Schreiben Sie eine statische Methode `" + v + "`, die " + o.t + ".", sig: o.sig, dummy: o.dummy, body: o.body, tests: tests, mins: 7, check: ["Kopf: `" + o.sig + "`"].concat(o.ck) });
  }});

  // W6: zweidimensionale Arrays
  WRITE.push({ id: "w-2d", rel: "ARR-4", title: "2D-Array-Algorithmus", gen: function (r) {
    var v = r.pick(["summeAlle", "zeilensumme", "spaltensumme", "spur", "istObereDreiecksmatrix", "istUntereDreiecksmatrix", "istDiagonalmatrix"]);
    function M(n, form) { var m = []; for (var z = 0; z < n; z++) { m.push([]); for (var s = 0; s < n; s++) { var x = r.int(-3, 9); if (form === "o" && s < z) x = 0; if (form === "u" && s > z) x = 0; if (form === "d" && s !== z) x = 0; if ((form === "u" || form === "o" || form === "d") && s === z && x === 0) x = 1; m[z].push(x); } } return m; }
    var o, tests = [];
    var showM = function (m, t) { return "{" + m.map(function (row) { return showArr(row, t); }).join(", ") + "}"; };
    if (v === "summeAlle" || v === "spur") {
      o = v === "summeAlle" ? { sig: "public static int summeAlle(int[][] m)", t: "die Summe aller Elemente eines zweidimensionalen Arrays zurückgibt", body: "int s = 0;\nfor (int z = 0; z < m.length; z++) {\n    for (int sp = 0; sp < m[z].length; sp++) {\n        s += m[z][sp];\n    }\n}\nreturn s;", ck: ["Zwei verschachtelte Schleifen", "Innere Grenze `m[z].length`"], f: function (m) { var s = 0; m.forEach(function (row) { row.forEach(function (x) { s += x; }); }); return s; } }
        : { sig: "public static int spur(int[][] m)", t: "die Summe der Elemente auf der Hauptdiagonalen einer quadratischen Matrix zurückgibt", body: "int s = 0;\nfor (int i = 0; i < m.length; i++) {\n    s += m[i][i];\n}\nreturn s;", ck: ["Hauptdiagonale: Zeile == Spalte, also `m[i][i]`", "Eine Schleife genügt"], f: function (m) { var s = 0; for (var i = 0; i < m.length; i++) s += m[i][i]; return s; } };
      [M(r.int(2, 4)), M(r.int(2, 4)), M(1)].forEach(function (m) { var res = o.f(m); tests.push(T(v + "(" + showM(m, "int") + ")", "Aufgabe." + v + "(" + arr2Lit(m, "int") + ")", String(res), String(res))); });
    } else if (v === "zeilensumme" || v === "spaltensumme") {
      var zei = v === "zeilensumme";
      o = { sig: "public static int " + v + "(int[][] m, int " + (zei ? "zeile" : "spalte") + ")", t: "die Summe der Elemente in der angegebenen " + (zei ? "Zeile" : "Spalte") + " zurückgibt", body: zei ? "int s = 0;\nfor (int sp = 0; sp < m[zeile].length; sp++) {\n    s += m[zeile][sp];\n}\nreturn s;" : "int s = 0;\nfor (int z = 0; z < m.length; z++) {\n    s += m[z][spalte];\n}\nreturn s;", ck: [zei ? "Zeilenindex fest, Spaltenindex läuft" : "Spaltenindex fest, Zeilenindex läuft", "Erster Index = Zeile, zweiter = Spalte"] };
      [M(3), M(4), M(2)].forEach(function (m) { var k = r.int(0, m.length - 1), res = 0; for (var i = 0; i < m.length; i++) res += zei ? m[k][i] : m[i][k]; tests.push(T(v + "(" + showM(m, "int") + ", " + k + ")", "Aufgabe." + v + "(" + arr2Lit(m, "int") + ", " + k + ")", String(res), String(res))); });
    } else {
      var form = { istObereDreiecksmatrix: "o", istUntereDreiecksmatrix: "u", istDiagonalmatrix: "d" }[v];
      var cond = { o: "s < z", u: "s > z", d: "s != z" }[form];
      var desc = { o: "eine obere Dreiecksmatrix ist, also alle Einträge unterhalb der Hauptdiagonalen 0 sind", u: "eine untere Dreiecksmatrix ist, also alle Einträge oberhalb der Hauptdiagonalen 0 sind", d: "eine Diagonalmatrix ist, also alle Einträge außerhalb der Hauptdiagonalen 0 sind" }[form];
      o = { sig: "public static boolean " + v + "(double[][] m)", t: "für eine quadratische Matrix true zurückgibt, wenn sie " + desc, body: "for (int z = 0; z < m.length; z++) {\n    for (int s = 0; s < m[z].length; s++) {\n        if (" + cond + " && m[z][s] != 0) {\n            return false;\n        }\n    }\n}\nreturn true;", ck: ["Betroffene Positionen: `" + cond + "` (z = Zeile, s = Spalte)", "Früh `return false`, am Ende `return true`", "Parameter `double[][]`"] };
      var yes = M(r.int(2, 4), form), no = M(r.int(3, 4), form), n = no.length;
      var pos = { o: [n - 1, 0], u: [0, n - 1], d: [0, 1] }[form]; no[pos[0]][pos[1]] = r.int(1, 9);
      var no2 = M(r.int(3, 4), form), n2 = no2.length, pos2 = { o: [1, 0], u: [n2 - 2, n2 - 1], d: [n2 - 1, 0] }[form]; no2[pos2[0]][pos2[1]] = r.int(1, 9);
      var no3 = M(r.int(3, 4), form), n3 = no3.length, pos3 = { o: [n3 - 1, n3 - 2], u: [0, 1], d: [n3 - 2, n3 - 1] }[form]; no3[pos3[0]][pos3[1]] = r.int(1, 9);
      [yes, no, no2, no3, M(r.int(2, 3), "d")].forEach(function (m) {
        var ok = true; for (var z = 0; z < m.length; z++) for (var s = 0; s < m.length; s++) { var hit = form === "o" ? s < z : form === "u" ? s > z : s !== z; if (hit && m[z][s] !== 0) ok = false; }
        var md = m.map(function (row) { return row.map(function (x) { return x; }); });
        tests.push(T(v + "(" + showM(md, "double") + ")", "Aufgabe." + v + "(" + arr2Lit(md, "double") + ")", String(ok), String(ok)));
      });
    }
    return methodTask({ rel: "ARR-4", title: v, task: "Schreiben Sie eine statische Methode `" + v + "`, die " + o.t + ".", sig: o.sig, dummy: o.sig.indexOf("boolean") >= 0 ? "return false;" : "return 0;", body: o.body, tests: tests, mins: 8, check: ["Kopf: `" + o.sig + "`"].concat(o.ck) });
  }});

  // ======================================================================
  //  C) Klassen schreiben
  // ======================================================================
  var DOMAINS = [
    { cls: "Konto", a1: "inhaber", t1: "String", a2: "kontostand", t2: "double", ok: "nicht negativ", cond: "%s >= 0", v1: ["Anna", "Otto", "Hans", "Lena"], v2: function (r) { return r.pick([120.5, 1000.0, 75.25, 0.0]); }, bad: -10.0, fmt: function (a, b) { return 'Konto von " + ' + a + ' + ": " + ' + b + ' + " Euro'; } },
    { cls: "Stadt", a1: "name", t1: "String", a2: "einwohner", t2: "int", ok: "nicht negativ", cond: "%s >= 0", v1: ["Potsdam", "Cottbus", "Brandenburg an der Havel", "Frankfurt (Oder)"], v2: function (r) { return r.int(20000, 200000); }, bad: -5, fmt: function (a, b) { return 'Diese Stadt heißt " + ' + a + ' + " und hat " + ' + b + ' + " Einwohner'; } },
    { cls: "Fahrzeug", a1: "kennzeichen", t1: "String", a2: "kmStand", t2: "int", ok: "nicht negativ", cond: "%s >= 0", v1: ["BRB-AB 123", "P-XY 42", "CB-K 7", "HVL-T 99"], v2: function (r) { return r.int(1000, 150000); }, bad: -1, fmt: function (a, b) { return 'Fahrzeug " + ' + a + ' + " mit " + ' + b + ' + " km'; } },
    { cls: "Blume", a1: "sorte", t1: "String", a2: "preis", t2: "double", ok: "größer als 0", cond: "%s > 0", v1: ["Rose", "Tulpe", "Nelke", "Lilie"], v2: function (r) { return r.pick([2.5, 1.75, 3.0, 4.25]); }, bad: 0.0, fmt: function (a, b) { return 'Blume " + ' + a + ' + " kostet " + ' + b + ' + " Euro'; } },
    { cls: "Student", a1: "name", t1: "String", a2: "matrikelnummer", t2: "int", ok: "größer als 0", cond: "%s > 0", v1: ["Mira", "Jonas", "Elif", "Paul"], v2: function (r) { return r.int(20000, 29999); }, bad: 0, fmt: function (a, b) { return 'Student " + ' + a + ' + " (" + ' + b + ' + ")'; } },
    { cls: "Messung", a1: "ort", t1: "String", a2: "temperatur", t2: "double", ok: "nicht kleiner als -90", cond: "%s >= -90", v1: ["Halle 1", "Werk Nord", "Labor", "Lager"], v2: function (r) { return r.pick([21.5, -3.25, 37.0, 18.75]); }, bad: -100.0, fmt: function (a, b) { return 'Messung " + ' + a + ' + ": " + ' + b + ' + " Grad'; } }
  ];
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function toStrJava(D, a, b) { return '"' + D.fmt(a, b) + '"'; }
  function toStrShow(D, x, y) { var s = D.fmt("§A§", "§B§"); return s.replace(/" \+ §A§ \+ "/, x).replace(/" \+ §B§ \+ "/, D.t2 === "double" ? jd(y) : String(y)); }

  function classSource(D, opt) { // opt: valid ("ignore"|"throw"), equals
    var c2 = D.cond.replace("%s", D.a2), c2n = D.cond.replace("%s", "neu");
    var s = "public class " + D.cls + " {\n" +
      "    private " + D.t1 + " " + D.a1 + ";\n    private " + D.t2 + " " + D.a2 + ";\n\n" +
      "    public " + D.cls + "(" + D.t1 + " " + D.a1 + ", " + D.t2 + " " + D.a2 + ") {\n" +
      "        this." + D.a1 + " = " + D.a1 + ";\n" +
      (opt.valid === "throw" ? "        if (!(" + c2 + ")) {\n            throw new IllegalArgumentException(\"Ungültiger Wert: \" + " + D.a2 + ");\n        }\n" : "") +
      (opt.valid === "throw" ? "        this." + D.a2 + " = " + D.a2 + ";\n" : "        if (" + c2 + ") {\n            this." + D.a2 + " = " + D.a2 + ";\n        }\n") +
      "    }\n\n" +
      "    public " + D.t1 + " get" + cap(D.a1) + "() {\n        return " + D.a1 + ";\n    }\n\n" +
      "    public " + D.t2 + " get" + cap(D.a2) + "() {\n        return " + D.a2 + ";\n    }\n\n" +
      "    public void set" + cap(D.a2) + "(" + D.t2 + " neu) {\n" +
      (opt.valid === "throw" ? "        if (!(" + c2n + ")) {\n            throw new IllegalArgumentException(\"Ungültiger Wert: \" + neu);\n        }\n        this." + D.a2 + " = neu;\n" : "        if (" + c2n + ") {\n            this." + D.a2 + " = neu;\n        }\n") +
      "    }\n\n" +
      "    @Override\n    public String toString() {\n        return " + toStrJava(D, D.a1, D.a2) + ";\n    }\n";
    if (opt.equals) s += "\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) {\n            return true;\n        }\n        if (!(o instanceof " + D.cls + ")) {\n            return false;\n        }\n        " + D.cls + " other = (" + D.cls + ") o;\n        return " + D.a1 + ".equals(other." + D.a1 + ");\n    }\n";
    return s + "}\n";
  }

  WRITE.push({ id: "w-klasse", rel: "KLA-2", title: "Eigene Klasse", gen: function (r) {
    var D = r.pick(DOMAINS), valid = r.pick(["ignore", "throw"]), eq = r.chance(0.5);
    var n1 = r.pick(D.v1), n2 = r.pick(D.v1.filter(function (x) { return x !== n1; })), w1 = D.v2(r), w2 = D.v2(r);
    var L = function (x) { return lit(x, D.t2); }, S = function (x) { return D.t2 === "double" ? jd(x) : String(x); };
    var cons = "new " + D.cls + "(" + JSON.stringify(n1) + ", " + L(w1) + ")";
    var tests = [
      T("get" + cap(D.a1) + "()", "x.get" + cap(D.a1) + "()", JSON.stringify(n1), JSON.stringify(n1), "eq", D.cls + " x = " + cons + ";"),
      T("get" + cap(D.a2) + "()", "x.get" + cap(D.a2) + "()", L(w1), S(w1), D.t2 === "double" ? "dbl" : "eq"),
      T("set" + cap(D.a2) + "(" + S(w2) + ")", "x.get" + cap(D.a2) + "()", L(w2), S(w2), D.t2 === "double" ? "dbl" : "eq", "x.set" + cap(D.a2) + "(" + L(w2) + ");")
    ];
    var zero = D.t2 === "double" ? "0.0" : "0";
    if (valid === "ignore") tests.push(T("Konstruktor ignoriert ungültigen Wert " + S(D.bad), "new " + D.cls + "(" + JSON.stringify(n2) + ", " + L(D.bad) + ").get" + cap(D.a2) + "()", zero, zero, D.t2 === "double" ? "dbl" : "eq"));
    else tests.push(T("Konstruktor wirft bei " + S(D.bad), "Test.wirft(() -> new " + D.cls + "(" + JSON.stringify(n2) + ", " + L(D.bad) + "))", "true", "true"));
    if (valid === "ignore") tests.push(T("set" + cap(D.a2) + "(" + S(D.bad) + ") wird ignoriert", "x.get" + cap(D.a2) + "()", L(w2), S(w2), D.t2 === "double" ? "dbl" : "eq", "x.set" + cap(D.a2) + "(" + L(D.bad) + ");"));
    else tests.push(T("set" + cap(D.a2) + "(" + S(D.bad) + ") wirft IllegalArgumentException", "Test.wirft(() -> x.set" + cap(D.a2) + "(" + L(D.bad) + "))", "true", "true"));
    tests.push(T("toString()", "x.toString()", JSON.stringify(toStrShow(D, n1, w2)), JSON.stringify(toStrShow(D, n1, w2))));
    if (eq) {
      tests.push(T("equals bei gleichem " + D.a1, "x.equals(new " + D.cls + "(" + JSON.stringify(n1) + ", " + L(w1) + "))", "true", "true"));
      tests.push(T("equals bei anderem " + D.a1, "x.equals(new " + D.cls + "(" + JSON.stringify(n2) + ", " + L(w1) + "))", "false", "false"));
      tests.push(T("== bei zwei Objekten", "x == new " + D.cls + "(" + JSON.stringify(n1) + ", " + L(w1) + ")", "false", "false"));
    }
    var task = "Schreiben Sie eine vollständige Klasse `" + D.cls + "` mit\n" +
      "- den privaten Attributen `" + D.a1 + "` (" + D.t1 + ") und `" + D.a2 + "` (" + D.t2 + "),\n" +
      "- einem Konstruktor, der beide Werte übernimmt,\n" +
      "- Gettern für beide Attribute und einem Setter `set" + cap(D.a2) + "`,\n" +
      (valid === "ignore" ? "- Prüfung im Konstruktor und Setter: Der Wert für " + D.a2 + " muss " + D.ok + " sein, sonst wird er nicht übernommen,\n" : "- Prüfung im Konstruktor und Setter: Ist der Wert für " + D.a2 + " nicht " + D.ok + ", wird eine `IllegalArgumentException` geworfen,\n") +
      "- einer überschriebenen Methode `toString()`, die z. B. „" + toStrShow(D, n1, w1) + "“ liefert" + (eq ? ",\n- einer überschriebenen Methode `equals`, die zwei Objekte als gleich ansieht, wenn `" + D.a1 + "` übereinstimmt." : ".");
    var starter = "public class " + D.cls + " {\n\n    // TODO: Attribute\n\n    // TODO: Konstruktor\n\n    // TODO: Getter und Setter\n\n    // TODO: toString" + (eq ? "\n\n    // TODO: equals" : "") + "\n}\n";
    return { rel: eq ? "OBJ-3" : "KLA-2", title: "Klasse " + D.cls, task: task, cls: D.cls, starterFiles: [{ name: D.cls + ".java", content: starter }], solFiles: [{ name: D.cls + ".java", content: classSource(D, { valid: valid, equals: eq }) }],
      tests: tests, mins: eq ? 15 : 12, stubOnly: true,
      check: ["Attribute `private`", "Konstruktor heißt `" + D.cls + "`, ohne Rückgabetyp, setzt beide Attribute mit `this.`", "Getter mit passendem Rückgabetyp, Setter mit `void`",
        valid === "ignore" ? "Prüfung `" + D.cond.replace("%s", D.a2) + "` vor dem Zuweisen" : "`throw new IllegalArgumentException(...)` bei ungültigem Wert",
        "`@Override public String toString()` liefert exakt den Text"].concat(eq ? ["`@Override public boolean equals(Object o)` mit `instanceof`, Cast und `equals` für den String"] : []) };
  }});

  // D) Vererbung
  var INH = [
    { base: "Konto", sub: "Girokonto", extra: "dispo", et: "double", ev: function (r) { return r.pick([500.0, 1000.0, 250.0]); }, bad: -100.0,
      method: "kannAbheben", mdesc: "kannAbheben(double betrag)", baseM: "public boolean kannAbheben(double betrag) {\n        return betrag <= getKontostand();\n    }", subM: "return betrag <= getKontostand() + dispo;",
      mtext: "Ein Girokonto kann abheben, solange der Betrag höchstens Kontostand + Dispo ist", f: function (stand, extra, arg) { return arg <= stand + extra; }, args: function (stand, extra) { return [stand + extra, stand + extra + 0.5, stand]; } },
    { base: "Konto", sub: "Sparbuch", extra: "limit", et: "double", ev: function (r) { return r.pick([2000.0, 500.0, 1500.0]); }, bad: -1.0,
      method: "kannAbheben", mdesc: "kannAbheben(double betrag)", baseM: "public boolean kannAbheben(double betrag) {\n        return betrag <= getKontostand();\n    }", subM: "return betrag <= getKontostand() && betrag <= limit;",
      mtext: "Ein Sparbuch kann nur abheben, wenn der Betrag höchstens dem Kontostand UND höchstens dem Limit entspricht", f: function (stand, extra, arg) { return arg <= stand && arg <= extra; }, args: function (stand, extra) { return [Math.min(stand, extra), Math.min(stand, extra) + 0.5, extra, stand, stand + 1]; } },
    { base: "Stadt", sub: "Landeshauptstadt", extra: "landEinwohner", et: "int", ev: function (r) { return r.int(1000000, 4000000); }, bad: -1,
      method: "anteil", mdesc: "anteil()", baseM: "public double anteil() {\n        return 0.0;\n    }", subM: "return (double) getEinwohner() / landEinwohner * 100;",
      mtext: "Eine Landeshauptstadt gibt zurück, wie viel Prozent der Landeseinwohner in ihr leben (Einwohner / landEinwohner · 100, Kommadivision!)", f: function (stand, extra) { return stand / extra * 100; }, noArg: true },
    { base: "Fahrzeug", sub: "Elektroauto", extra: "akkuKwh", et: "int", ev: function (r) { return r.pick([40, 58, 77, 100]); }, bad: 0,
      method: "reichweite", mdesc: "reichweite()", baseM: "public int reichweite() {\n        return 0;\n    }", subM: "return akkuKwh * 6;",
      mtext: "Ein Elektroauto gibt als Reichweite akkuKwh · 6 Kilometer zurück", f: function (stand, extra) { return extra * 6; }, noArg: true }
  ];
  WRITE.push({ id: "w-erben", rel: "VRB-1", title: "Vererbung", gen: function (r) {
    var I = r.pick(INH), D = DOMAINS.filter(function (d) { return d.cls === I.base; })[0];
    var n1 = r.pick(D.v1), w1 = D.v2(r), ex = I.ev(r), cond = I.et === "int" && I.bad === 0 ? "> 0" : ">= 0";
    if (D.cls === "Konto" && w1 === 0) w1 = 200.0;
    var L1 = lit(w1, D.t2), LE = lit(ex, I.et), SE = I.et === "double" ? jd(ex) : String(ex);
    var baseSrc = classSource(D, { valid: "ignore", equals: false }).replace(/\n}\n$/, "\n\n    " + I.baseM + "\n}\n");
    var subSrc = "public class " + I.sub + " extends " + I.base + " {\n" +
      "    private " + I.et + " " + I.extra + ";\n\n" +
      "    public " + I.sub + "(" + D.t1 + " " + D.a1 + ", " + D.t2 + " " + D.a2 + ", " + I.et + " " + I.extra + ") {\n" +
      "        super(" + D.a1 + ", " + D.a2 + ");\n" +
      "        if (!(" + I.extra + " " + cond + ")) {\n            throw new IllegalArgumentException(\"Ungültiger Wert: \" + " + I.extra + ");\n        }\n" +
      "        this." + I.extra + " = " + I.extra + ";\n    }\n\n" +
      "    public " + I.et + " get" + cap(I.extra) + "() {\n        return " + I.extra + ";\n    }\n\n" +
      "    @Override\n    " + I.baseM.split("{")[0].trim() + " {\n        " + I.subM + "\n    }\n\n" +
      "    @Override\n    public String toString() {\n        return super.toString() + \", " + I.extra + ": \" + " + I.extra + ";\n    }\n}\n";
    var cons = "new " + I.sub + "(" + JSON.stringify(n1) + ", " + L1 + ", " + LE + ")";
    var tests = [
      T("get" + cap(I.extra) + "()", "x.get" + cap(I.extra) + "()", LE, SE, I.et === "double" ? "dbl" : "eq", I.base + " basis = " + cons + ";\n" + I.sub + " x = (" + I.sub + ") basis;"),
      T("geerbter Getter get" + cap(D.a1) + "()", "x.get" + cap(D.a1) + "()", JSON.stringify(n1), JSON.stringify(n1)),
      T("toString() nutzt super.toString()", "x.toString()", JSON.stringify(toStrShow(D, n1, w1) + ", " + I.extra + ": " + SE), JSON.stringify(toStrShow(D, n1, w1) + ", " + I.extra + ": " + SE)),
      T("Konstruktor wirft bei " + I.extra + " = " + (I.et === "double" ? jd(I.bad) : I.bad), "Test.wirft(() -> new " + I.sub + "(" + JSON.stringify(n1) + ", " + L1 + ", " + lit(I.bad, I.et) + "))", "true", "true")
    ];
    if (I.noArg) {
      var res = I.f(w1, ex);
      tests.push(T("polymorph: basis." + I.method + "()", "basis." + I.method + "()", I.method === "anteil" ? lit(res, "double") : String(res), I.method === "anteil" ? String(Math.round(res * 1000) / 1000) : String(res), I.method === "anteil" ? "dbl" : "eq"));
    } else {
      I.args(w1, ex).forEach(function (a) { var res = I.f(w1, ex, a); tests.push(T("polymorph: basis." + I.method + "(" + jd(a) + ")", "basis." + I.method + "(" + lit(a, "double") + ")", String(res), String(res))); });
    }
    var task = "Gegeben ist die Klasse `" + I.base + "` (siehe Datei " + I.base + ".java). Schreiben Sie die Klasse `" + I.sub + "`, die von `" + I.base + "` erbt, mit\n" +
      "- einem zusätzlichen privaten Attribut `" + I.extra + "` (" + I.et + ") und Getter,\n" +
      "- einem Konstruktor für alle drei Werte, der den Konstruktor der Oberklasse aufruft und eine `IllegalArgumentException` wirft, wenn " + I.extra + (cond === ">= 0" ? " negativ ist" : " nicht größer als 0 ist") + ",\n" +
      "- einer überschriebenen Methode `" + I.mdesc + "`: " + I.mtext + ",\n" +
      "- einer überschriebenen Methode `toString()`, die an den Text der Oberklasse „, " + I.extra + ": <Wert>“ anhängt.";
    return { rel: "VRB-1", title: I.sub + " extends " + I.base, task: task, cls: I.sub,
      givenFiles: [{ name: I.base + ".java", content: baseSrc }],
      starterFiles: [{ name: I.sub + ".java", content: "public class " + I.sub + " extends " + I.base + " {\n\n    // TODO: Attribut\n\n    // TODO: Konstruktor (super(...) als erste Anweisung)\n\n    // TODO: Getter\n\n    // TODO: " + I.method + " überschreiben\n\n    // TODO: toString überschreiben\n}\n" }],
      solFiles: [{ name: I.sub + ".java", content: subSrc }], tests: tests, mins: 15, stubOnly: true,
      check: ["`extends " + I.base + "`", "`super(" + D.a1 + ", " + D.a2 + ")` als erste Anweisung im Konstruktor", "Prüfung und `throw new IllegalArgumentException(...)`", "Zugriff auf private Oberklassen-Attribute nur über Getter (z. B. `get" + cap(D.a2) + "()`)", "`@Override` vor " + I.method + " und toString", "`super.toString()` wiederverwenden"] };
  }});

  // ======================================================================
  //  E) Kursprojekte (angelehnt an die Übungen der Lerneinheiten)
  // ======================================================================
  var PROJECTS = [];
  function proj(o) { PROJECTS.push(o); }
  proj({ id: "p-note", rel: "VER-1", ref: "VER-14 / VER-16", title: "Notenermittlung", mins: 10,
    task: "Angelehnt an die Notenermittlung: Schreiben Sie zwei statische Methoden.\n1. `note(int punkte)` gibt die Note nach dieser Tabelle zurück: ab 98 Punkten → 1, 80–97 → 2, 60–79 → 3, 40–59 → 4, unter 40 → 5.\n2. `noteAlsText(int note)` gibt mit switch den Text zurück: 1 „sehr gut“, 2 „gut“, 3 „befriedigend“, 4 „ausreichend“, 5 „mangelhaft“, sonst „ungültig“.",
    sigs: ["public static int note(int punkte)", "public static String noteAlsText(int note)"], dummies: ["return 0;", "return \"\";"],
    bodies: ["if (punkte >= 98) {\n    return 1;\n} else if (punkte >= 80) {\n    return 2;\n} else if (punkte >= 60) {\n    return 3;\n} else if (punkte >= 40) {\n    return 4;\n} else {\n    return 5;\n}",
      "return switch (note) {\n    case 1 -> \"sehr gut\";\n    case 2 -> \"gut\";\n    case 3 -> \"befriedigend\";\n    case 4 -> \"ausreichend\";\n    case 5 -> \"mangelhaft\";\n    default -> \"ungültig\";\n};"],
    tests: [[100, 1], [98, 1], [97, 2], [80, 2], [79, 3], [60, 3], [59, 4], [40, 4], [39, 5], [0, 5]].map(function (p) { return T("note(" + p[0] + ")", "Aufgabe.note(" + p[0] + ")", String(p[1]), String(p[1])); })
      .concat([[1, "sehr gut"], [3, "befriedigend"], [5, "mangelhaft"], [7, "ungültig"]].map(function (p) { return T("noteAlsText(" + p[0] + ")", "Aufgabe.noteAlsText(" + p[0] + ")", JSON.stringify(p[1]), JSON.stringify(p[1])); })),
    check: ["Bedingungen von oben nach unten mit else if", "Grenzen exakt (98, 80, 60, 40)", "switch mit allen fünf Fällen und default", "Strings exakt wie vorgegeben"] });
  proj({ id: "p-blume", rel: "VER-1", ref: "VER-12", title: "Blumenladen mit Rabatt", mins: 10,
    task: "Angelehnt an den Blumenladen: Schreiben Sie eine statische Methode `gesamtbetrag(int anzahl, double preis)`. Bei anzahl ≤ 0 oder ≥ 100 wird 0 zurückgegeben. Sonst gilt: bis 10 Blumen kein Rabatt, bis 20 Blumen 2 %, bis 50 Blumen 3 %, darüber 5 %. Zurückgegeben wird anzahl · preis · (1 − rabatt).\nAchtung: Genau hier passiert oft der Denkfehler, mehrere unabhängige if-Anweisungen zu schreiben – dann gewinnt immer die letzte.",
    sigs: ["public static double gesamtbetrag(int anzahl, double preis)"], dummies: ["return 0.0;"],
    bodies: ["if (anzahl <= 0 || anzahl >= 100) {\n    return 0;\n}\ndouble rabatt;\nif (anzahl <= 10) {\n    rabatt = 0;\n} else if (anzahl <= 20) {\n    rabatt = 0.02;\n} else if (anzahl <= 50) {\n    rabatt = 0.03;\n} else {\n    rabatt = 0.05;\n}\nreturn anzahl * preis * (1 - rabatt);"],
    tests: [[0, 0], [5, 12.5], [10, 25], [11, 26.95], [20, 49], [21, 50.925], [50, 121.25], [51, 121.125], [99, 235.125], [100, 0]].map(function (p) { return T("gesamtbetrag(" + p[0] + ", 2.5)", "Aufgabe.gesamtbetrag(" + p[0] + ", 2.5)", lit(p[1], "double"), jd(p[1]), "dbl"); }),
    check: ["Ungültige Anzahl zuerst abfangen", "Rabattstufen mit else if verketten", "Prozent als Dezimalzahl (2 % = 0.02)", "Formel anzahl * preis * (1 - rabatt)"] });
  proj({ id: "p-ssp", rel: "VER-1", ref: "VER-E4", title: "Stein-Schere-Papier", mins: 10,
    task: "Angelehnt an Stein-Schere-Papier: Stein = 1, Schere = 2, Papier = 3. Schreiben Sie `gewinner(int spieler, int computer)`: Rückgabe 0 bei Unentschieden, 1 wenn der Spieler gewinnt, 2 wenn der Computer gewinnt. Stein schlägt Schere, Schere schlägt Papier, Papier schlägt Stein.",
    sigs: ["public static int gewinner(int spieler, int computer)"], dummies: ["return -1;"],
    bodies: ["if (spieler == computer) {\n    return 0;\n}\nif ((spieler == 1 && computer == 2)\n        || (spieler == 2 && computer == 3)\n        || (spieler == 3 && computer == 1)) {\n    return 1;\n}\nreturn 2;"],
    tests: (function () { var t = []; for (var s = 1; s <= 3; s++) for (var c = 1; c <= 3; c++) { var res = s === c ? 0 : ((s === 1 && c === 2) || (s === 2 && c === 3) || (s === 3 && c === 1)) ? 1 : 2; t.push(T("gewinner(" + s + ", " + c + ")", "Aufgabe.gewinner(" + s + ", " + c + ")", String(res), String(res))); } return t; })(),
    check: ["Unentschieden zuerst prüfen", "Alle drei Gewinnfälle des Spielers mit || verknüpft", "Restfall: Computer gewinnt"] });
  proj({ id: "p-quersumme", rel: "ITR-1", ref: "ITR-06 / ITR-07", title: "Quersumme mit Wiederholungsfrage", mins: 10,
    task: "Angelehnt an das Quersumme-Programm: 1. `quersumme(int n)` berechnet die Quersumme von n ≥ 0. 2. `antwortAuswerten(char c)` gibt 1 zurück bei 'j' oder 'J', 0 bei 'n' oder 'N' und -1 bei jedem anderen Zeichen (damit kann main eine Eingabe in einer do-while-Schleife wiederholen, bis 0 oder 1 kommt).",
    sigs: ["public static int quersumme(int n)", "public static int antwortAuswerten(char c)"], dummies: ["return 0;", "return -1;"],
    bodies: ["int s = 0;\nwhile (n > 0) {\n    s += n % 10;\n    n /= 10;\n}\nreturn s;", "if (c == 'j' || c == 'J') {\n    return 1;\n} else if (c == 'n' || c == 'N') {\n    return 0;\n} else {\n    return -1;\n}"],
    tests: [[12345, 15], [0, 0], [9, 9], [1001, 2]].map(function (p) { return T("quersumme(" + p[0] + ")", "Aufgabe.quersumme(" + p[0] + ")", String(p[1]), String(p[1])); })
      .concat([["j", 1], ["J", 1], ["n", 0], ["N", 0], ["x", -1]].map(function (p) { return T("antwortAuswerten('" + p[0] + "')", "Aufgabe.antwortAuswerten('" + p[0] + "')", String(p[1]), String(p[1])); })),
    check: ["`% 10` und `/ 10` in einer while-Schleife", "char-Vergleich mit == und einfachen Hochkommas", "Alle drei Rückgabefälle"] });
  proj({ id: "p-dreieck", rel: "ITR-2", ref: "ITR-12", title: "Dreieck aus Sternchen", mins: 8,
    task: "Angelehnt an die Geometrie-Übung: Schreiben Sie `dreieck(int n)`, die ein Dreieck aus n Zeilen als String zurückgibt. Zeile 1 hat einen Stern, Zeile 2 zwei usw. Jede Zeile endet mit \"\\n\". Beispiel n = 3: \"*\\n**\\n***\\n\". (Auf Papier dürfen Sie stattdessen mit print/println ausgeben.)",
    sigs: ["public static String dreieck(int n)"], dummies: ["return \"\";"],
    bodies: ["String erg = \"\";\nfor (int z = 1; z <= n; z++) {\n    for (int s = 1; s <= z; s++) {\n        erg += \"*\";\n    }\n    erg += \"\\n\";\n}\nreturn erg;"],
    tests: [1, 3, 5, 0].map(function (n) { var s = ""; for (var z = 1; z <= n; z++) s += "*".repeat(z) + "\n"; return T("dreieck(" + n + ")", "Aufgabe.dreieck(" + n + ")", JSON.stringify(s), JSON.stringify(s)); }),
    check: ["Äußere Schleife über Zeilen, innere über Sterne", "Innere Grenze hängt von der Zeilennummer ab", "Zeilenumbruch nach jeder Zeile"] });
  proj({ id: "p-temp", rel: "ARR-1", ref: "ARR-07 / ARR-10", title: "Temperaturmessung", mins: 12,
    task: "Angelehnt an die Temperaturmessung: Schreiben Sie drei statische Methoden für ein nicht-leeres double-Array: `maximum(double[] werte)`, `minimum(double[] werte)` und `durchschnitt(double[] werte)`.",
    sigs: ["public static double maximum(double[] werte)", "public static double minimum(double[] werte)", "public static double durchschnitt(double[] werte)"], dummies: ["return 0.0;", "return 0.0;", "return 0.0;"],
    bodies: ["double max = werte[0];\nfor (double w : werte) {\n    if (w > max) {\n        max = w;\n    }\n}\nreturn max;", "double min = werte[0];\nfor (double w : werte) {\n    if (w < min) {\n        min = w;\n    }\n}\nreturn min;", "double summe = 0;\nfor (double w : werte) {\n    summe += w;\n}\nreturn summe / werte.length;"],
    tests: (function () { var arrs = [[21.5, 19.0, 23.25, 18.5], [-3.5, -1.0, -7.25], [12.0]]; var t = []; arrs.forEach(function (a) { var s = 0; a.forEach(function (x) { s += x; }); t.push(T("maximum(" + showArr(a, "double") + ")", "Aufgabe.maximum(" + arrLit(a, "double") + ")", lit(Math.max.apply(null, a), "double"), jd(Math.max.apply(null, a)), "dbl")); t.push(T("minimum(" + showArr(a, "double") + ")", "Aufgabe.minimum(" + arrLit(a, "double") + ")", lit(Math.min.apply(null, a), "double"), jd(Math.min.apply(null, a)), "dbl")); t.push(T("durchschnitt(" + showArr(a, "double") + ")", "Aufgabe.durchschnitt(" + arrLit(a, "double") + ")", lit(s / a.length, "double"), String(Math.round(s / a.length * 1000) / 1000), "dbl")); }); return t; })(),
    check: ["Startwert `werte[0]` – nicht 0 (nur negative Temperaturen!)", "Minimum: fast identisch zum Maximum, nur `<`", "Durchschnitt: Summe / `werte.length`"] });
  proj({ id: "p-auto", rel: "ARR-3", ref: "ARR-19", title: "Autovermietung", mins: 12,
    task: "Angelehnt an die Autovermietung: Die Klasse `Auto` ist gegeben (Methode `isVermietet()`). Schreiben Sie in `Aufgabe` die statische Methode `anzahlFreieAutos(Auto[] autos)`, die zählt, wie viele Autos nicht vermietet sind. Leere Plätze im Array (null) werden übersprungen.",
    given: [{ name: "Auto.java", content: "public class Auto {\n    private String kennzeichen;\n    private boolean vermietet;\n\n    public Auto(String kennzeichen, boolean vermietet) {\n        this.kennzeichen = kennzeichen;\n        this.vermietet = vermietet;\n    }\n\n    public String getKennzeichen() {\n        return kennzeichen;\n    }\n\n    public boolean isVermietet() {\n        return vermietet;\n    }\n}\n" }],
    sigs: ["public static int anzahlFreieAutos(Auto[] autos)"], dummies: ["return 0;"],
    bodies: ["int frei = 0;\nfor (Auto a : autos) {\n    if (a != null && !a.isVermietet()) {\n        frei++;\n    }\n}\nreturn frei;"],
    tests: [
      T("drei Autos, eins frei", "Aufgabe.anzahlFreieAutos(new Auto[]{new Auto(\"P-A 1\", true), new Auto(\"P-A 2\", false), new Auto(\"P-A 3\", true)})", "1", "1"),
      T("mit leeren Plätzen (null)", "Aufgabe.anzahlFreieAutos(new Auto[]{new Auto(\"P-A 1\", false), null, new Auto(\"P-A 2\", false), null})", "2", "2"),
      T("leerer Fuhrpark", "Aufgabe.anzahlFreieAutos(new Auto[0])", "0", "0")],
    check: ["null-Prüfung vor dem Methodenaufruf (sonst NullPointerException)", "`!a.isVermietet()` – der Nicht-Operator", "Zähler erhöhen und zurückgeben"] });
  proj({ id: "p-dispo", rel: "VRB-0", ref: "VRB-03", title: "Dispo gehaltsabhängig", mins: 8,
    task: "Angelehnt an das Girokonto: Schreiben Sie `dispoFuerGehalt(double monatsgehalt)`. Unter 1000 € → 0, von 1000 € bis einschließlich 2000 € → 500, über 2000 € → 1000.",
    sigs: ["public static double dispoFuerGehalt(double monatsgehalt)"], dummies: ["return -1.0;"],
    bodies: ["if (monatsgehalt < 1000) {\n    return 0;\n} else if (monatsgehalt <= 2000) {\n    return 500;\n} else {\n    return 1000;\n}"],
    tests: [[0, 0], [999.99, 0], [1000, 500], [1500, 500], [2000, 500], [2000.01, 1000], [4500, 1000]].map(function (p) { return T("dispoFuerGehalt(" + jd(p[0]) + ")", "Aufgabe.dispoFuerGehalt(" + lit(p[0], "double") + ")", lit(p[1], "double"), jd(p[1]), "dbl"); }),
    check: ["Grenzen genau: `< 1000`, `<= 2000`", "else if-Kette", "int-Literale werden automatisch zu double"] });
  proj({ id: "p-potenz", rel: "EXC-1", ref: "EXC-13 / EXC-15", title: "Potenzieren mit Ausnahmen", mins: 12,
    task: "Angelehnt an das Potenz-Beispiel: Schreiben Sie `potenzieren(double x, int y)` mit einer Schleife (ohne Math.pow). Negative Exponenten: Ergebnis ist 1 / x^|y|. Ist x == 0 und y < 0, wird eine `ArithmeticException` geworfen. x^0 ist 1.",
    sigs: ["public static double potenzieren(double x, int y)"], dummies: ["return 0.0;"],
    bodies: ["if (x == 0 && y < 0) {\n    throw new ArithmeticException(\"Division durch 0\");\n}\nint n = Math.abs(y);\ndouble ergebnis = 1;\nfor (int i = 0; i < n; i++) {\n    ergebnis *= x;\n}\nif (y < 0) {\n    ergebnis = 1 / ergebnis;\n}\nreturn ergebnis;"],
    tests: [T("potenzieren(2.0, 10)", "Aufgabe.potenzieren(2.0, 10)", "1024.0", "1024.0", "dbl"), T("potenzieren(2.0, -2)", "Aufgabe.potenzieren(2.0, -2)", "0.25", "0.25", "dbl"), T("potenzieren(5.0, 0)", "Aufgabe.potenzieren(5.0, 0)", "1.0", "1.0", "dbl"), T("potenzieren(0.0, 0)", "Aufgabe.potenzieren(0.0, 0)", "1.0", "1.0", "dbl"), T("potenzieren(-3.0, 3)", "Aufgabe.potenzieren(-3.0, 3)", "-27.0", "-27.0", "dbl"),
      T("potenzieren(0.0, -1) wirft ArithmeticException", "Test.wirft(() -> Aufgabe.potenzieren(0.0, -1))", "true", "true")],
    check: ["Fehlerfall zuerst: `throw new ArithmeticException(...)`", "Schleife mit Betrag des Exponenten", "Kehrwert bei negativem Exponenten", "Startwert 1"] });
  proj({ id: "p-zinsen", rel: "KLA-2", ref: "KLA-07 / KLA-13", title: "Konto mit Zinsen", mins: 15,
    task: "Angelehnt an das Bankprogramm: Schreiben Sie die Klasse `Konto` mit privaten Attributen `inhaber` (String) und `kontostand` (double), einem Konstruktor `Konto(String inhaber, double anfangsstand)` (negativer Anfangsstand wird nicht übernommen, der Stand bleibt 0), Gettern und den Methoden\n- `einzahlen(double betrag)`: nur positive Beträge werden gutgeschrieben,\n- `abheben(double betrag)`: gibt true zurück und bucht ab, wenn 0 < betrag ≤ kontostand, sonst false,\n- `zinsen(double zinssatzInProzent)`: bei Zinssatz zwischen 0 und 100 (einschließlich) werden die Zinsen berechnet, gutgeschrieben und zurückgegeben, sonst 0.",
    cls: "Konto",
    starter: [{ name: "Konto.java", content: "public class Konto {\n\n    // TODO: Attribute, Konstruktor, Getter\n\n    // TODO: einzahlen, abheben, zinsen\n}\n" }],
    sol: [{ name: "Konto.java", content: "public class Konto {\n    private String inhaber;\n    private double kontostand;\n\n    public Konto(String inhaber, double anfangsstand) {\n        this.inhaber = inhaber;\n        if (anfangsstand >= 0) {\n            this.kontostand = anfangsstand;\n        }\n    }\n\n    public String getInhaber() {\n        return inhaber;\n    }\n\n    public double getKontostand() {\n        return kontostand;\n    }\n\n    public void einzahlen(double betrag) {\n        if (betrag > 0) {\n            kontostand += betrag;\n        }\n    }\n\n    public boolean abheben(double betrag) {\n        if (betrag > 0 && betrag <= kontostand) {\n            kontostand -= betrag;\n            return true;\n        }\n        return false;\n    }\n\n    public double zinsen(double zinssatzInProzent) {\n        if (zinssatzInProzent < 0 || zinssatzInProzent > 100) {\n            return 0;\n        }\n        double z = kontostand * zinssatzInProzent / 100;\n        kontostand += z;\n        return z;\n    }\n}\n" }],
    tests: [T("Anfangsstand 1000", "k.getKontostand()", "1000.0", "1000.0", "dbl", "Konto k = new Konto(\"Otto\", 1000);"), T("negativer Anfangsstand → 0", "new Konto(\"Hans\", -50).getKontostand()", "0.0", "0.0", "dbl"),
      T("einzahlen(250) und einzahlen(-5)", "k.getKontostand()", "1250.0", "1250.0", "dbl", "k.einzahlen(250);\nk.einzahlen(-5);"), T("abheben(2000) klappt nicht", "k.abheben(2000)", "false", "false"), T("abheben(250) klappt", "k.abheben(250)", "true", "true"),
      T("Stand nach Abhebung", "k.getKontostand()", "1000.0", "1000.0", "dbl"), T("zinsen(2) liefert 20", "k.zinsen(2)", "20.0", "20.0", "dbl"), T("Stand nach Zinsen", "k.getKontostand()", "1020.0", "1020.0", "dbl"), T("zinsen(150) → 0", "k.zinsen(150)", "0.0", "0.0", "dbl"),
      T("zinsen(100) verdoppelt", "k.zinsen(100)", "1020.0", "1020.0", "dbl"), T("kompletten Stand abheben klappt", "k.abheben(2040)", "true", "true"), T("Stand danach 0", "k.getKontostand()", "0.0", "0.0", "dbl")],
    check: ["Attribute private, Zugriff mit this.", "Bedingungen vor jeder Buchung", "abheben gibt in jedem Pfad einen boolean zurück", "Zinsen: stand * satz / 100"] });

  function projTask(P) {
    if (P.cls) return { rel: P.rel, ref: P.ref, title: P.title, task: P.task, cls: P.cls, starterFiles: P.starter, solFiles: P.sol, givenFiles: P.given, tests: P.tests, mins: P.mins, check: P.check, stubOnly: true };
    var imp = "";
    var stub = "public class Aufgabe {\n" + P.sigs.map(function (s, i) { return "\n    " + s + " {\n        // TODO\n        " + P.dummies[i] + "\n    }\n"; }).join("") + "}\n";
    var sol = "public class Aufgabe {\n" + P.sigs.map(function (s, i) { return "\n" + (P.doc ? "    " + P.doc[i] + "\n" : "") + "    " + s + " {\n" + P.bodies[i].split("\n").map(function (l) { return "        " + l; }).join("\n") + "\n    }\n"; }).join("") + "}\n";
    return { rel: P.rel, ref: P.ref, title: P.title, task: P.task, cls: "Aufgabe", starterFiles: [{ name: "Aufgabe.java", content: imp + stub }], solFiles: [{ name: "Aufgabe.java", content: imp + sol }], givenFiles: P.given, tests: P.tests, mins: P.mins, check: ["Methodenköpfe exakt: " + P.sigs.map(function (s) { return "`" + s + "`"; }).join(", ")].concat(P.check) };
  }


  // ======================================================================
  //  F) Weitere Generatoren – abgestimmt auf die Fähigkeiten der Einsendeaufgaben
  // ======================================================================

  // T9: LocalDate (OBJ) – Objekte der Standardbibliothek benutzen
  function ymd(y, m, d) { return new Date(Date.UTC(y, m - 1, d)); }
  function iso(dt) { return dt.toISOString().slice(0, 10); }
  function isLeap(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
  function monthLen(y, m) { return [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1]; }
  var DOW = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  TRACE.push({ id: "t-date", rel: "OBJ-1", title: "Objekte: LocalDate", imports: ["java.time.LocalDate"], gen: function (r) {
    var y = r.pick([2023, 2024, 2025, 2026, 2028, 2100]), m = r.int(1, 12), d = r.int(1, monthLen(y, m)), w = r.int(1, 6);
    var y2 = r.pick([2024, 2025, 2026, 2027]), m2 = r.int(1, 12), d2 = r.int(1, 28);
    var dt = ymd(y, m, d), dt2 = ymd(y2, m2, d2), plus = new Date(dt.getTime() + w * 7 * 86400000);
    var ops = r.shuffle([
      ["datum.isLeapYear()", String(isLeap(y))],
      ["datum.lengthOfMonth()", String(monthLen(y, m))],
      ["datum.plusWeeks(" + w + ")", iso(plus)],
      ["datum.getYear() + 1", String(y + 1)],
      ["datum.isAfter(anderes)", String(dt.getTime() > dt2.getTime())],
      ["datum.getDayOfWeek()", DOW[dt.getUTCDay()]],
      ["datum.getMonthValue()", String(m)]
    ]).slice(0, 4);
    var code = "LocalDate datum = LocalDate.of(" + y + ", " + m + ", " + d + ");\nLocalDate anderes = LocalDate.of(" + y2 + ", " + m2 + ", " + d2 + ");\nSystem.out.println(datum);\n" +
      ops.map(function (o) { return "System.out.println(" + o[0] + ");"; }).join("\n");
    var out = iso(dt) + "\n" + ops.map(function (o) { return o[1]; }).join("\n");
    return { code: code, out: out, why: "LocalDate.of erzeugt ein Objekt, Instanzmethoden ruft man darauf auf. toString() liefert das Format JJJJ-MM-TT. plusWeeks liefert ein NEUES Objekt, datum selbst bleibt unverändert. Schaltjahr: durch 4 teilbar, außer Jahrhunderte, die nicht durch 400 teilbar sind." };
  }});

  // T10: Referenzen und Vergleiche (OBJ)
  TRACE.push({ id: "t-ref", rel: "OBJ-2", title: "Referenzen und ==", gen: function (r) {
    var w = r.pick(["Log", "SOC", "Java", "GdP"]), x = r.pick(["1", "2", "-A", "!"]);
    var code = "StringBuilder a = new StringBuilder(\"" + w + "\");\nStringBuilder b = a;\nStringBuilder c = new StringBuilder(\"" + w + "\");\nb.append(\"" + x + "\");\n" +
      "System.out.println(a);\nSystem.out.println(c);\nSystem.out.println(a == b);\nSystem.out.println(a == c);\n" +
      "String s = new String(\"" + w + "\");\nString t = new String(\"" + w + "\");\nSystem.out.println(s == t);\nSystem.out.println(s.equals(t));";
    var out = [w + x, w, "true", "false", "false", "true"].join("\n");
    return { code: code, out: out, why: "b = a kopiert nur die Referenz: a und b zeigen auf dasselbe Objekt, die Änderung über b sieht man über a. c ist ein eigenes Objekt. == vergleicht Referenzen (Identität), equals den Inhalt." };
  }});

  // T11: Ausnahmen – Ablauf verfolgen (EXC)
  TRACE.push({ id: "t-exc", rel: "EXC-0", title: "Ablauf mit Exceptions", gen: function (r) {
    var input = r.pick(["42", "-7", "abc", "0", "13"]), grenze = r.pick([0, 10, 20]);
    var code = "static int pruefen(String eingabe) {\n    int zahl = Integer.parseInt(eingabe);\n    if (zahl < " + grenze + ") {\n        throw new IllegalArgumentException(\"zu klein: \" + zahl);\n    }\n    return zahl * 2;\n}\n// in main:\ntry {\n    System.out.println(\"A\");\n    int erg = pruefen(\"" + input + "\");\n    System.out.println(\"B \" + erg);\n} catch (NumberFormatException e) {\n    System.out.println(\"C keine Zahl\");\n} catch (IllegalArgumentException e) {\n    System.out.println(\"D \" + e.getMessage());\n}\nSystem.out.println(\"E\");";
    var n = parseInt(input, 10), out;
    if (isNaN(n)) out = "A\nC keine Zahl\nE";
    else if (n < grenze) out = "A\nD zu klein: " + n + "\nE";
    else out = "A\nB " + (n * 2) + "\nE";
    var helpers = "", body = code.split("// in main:\n")[1];
    return { code: code, body: body, staticHelper: code.split("\n// in main:")[0], out: out,
      why: "Wird eine Exception geworfen, bricht der try-Block sofort ab, B wird übersprungen. NumberFormatException ist eine Unterklasse von IllegalArgumentException – darum muss ihr catch zuerst stehen. Nach try-catch geht es normal weiter." };
  }});

  // W7: Formel-Methoden ohne Schleifen (STA): Math, Konstanten, Überladen, Runden
  WRITE.push({ id: "w-formel", rel: "STA-1", title: "Statische Methoden mit Formeln", gen: function (r) {
    var v = r.pick(["kugel", "mittelwert", "brutto", "runden", "wertverlust", "rechtwinklig"]), o;
    function dbl(name, args, val) { return T(name + "(" + args.map(function (a) { return typeof a === "number" ? jd(a) : a; }).join(", ") + ")", "Aufgabe." + name + "(" + args.map(function (a) { return typeof a === "number" ? lit(a, "double") : a; }).join(", ") + ")", lit(val, "double"), String(Math.round(val * 1e6) / 1e6), "dbl"); }
    if (v === "kugel") {
      o = { title: "Kugel mit Math.PI", t: "Schreiben Sie zwei statische Methoden: `kugelVolumen(double r)` liefert 4/3 · π · r³ und `kugelOberflaeche(double r)` liefert 4 · π · r². Verwenden Sie Math.PI und Math.pow. Achtung bei 4/3!",
        sigs: ["public static double kugelVolumen(double r)", "public static double kugelOberflaeche(double r)"], bodies: ["return 4.0 / 3 * Math.PI * Math.pow(r, 3);", "return 4 * Math.PI * r * r;"],
        tests: [1, 2.5, r.int(3, 9)].map(function (x) { return dbl("kugelVolumen", [x], 4.0 / 3 * Math.PI * Math.pow(x, 3)); }).concat([1, r.int(2, 9)].map(function (x) { return dbl("kugelOberflaeche", [x], 4 * Math.PI * x * x); })),
        ck: ["`4.0 / 3` statt `4 / 3` – sonst Ganzzahldivision (= 1)!", "`Math.PI` und `Math.pow(r, 3)`", "Rückgabetyp double"], rel: "STA-0" };
    } else if (v === "mittelwert") {
      var a = r.int(1, 20), b = r.int(1, 20), c = r.int(1, 20);
      o = { title: "Überladen: mittelwert", t: "Schreiben Sie die Methode `mittelwert` zweimal (Überladen): einmal mit zwei, einmal mit drei int-Parametern. Beide geben den Durchschnitt als double zurück. Die Variante mit drei Parametern soll die mit zwei nicht verwenden müssen.",
        sigs: ["public static double mittelwert(int a, int b)", "public static double mittelwert(int a, int b, int c)"], bodies: ["return (a + b) / 2.0;", "return (a + b + c) / 3.0;"],
        tests: [T("mittelwert(" + a + ", " + b + ")", "Aufgabe.mittelwert(" + a + ", " + b + ")", lit((a + b) / 2, "double"), jd((a + b) / 2), "dbl"), T("mittelwert(3, 4)", "Aufgabe.mittelwert(3, 4)", "3.5", "3.5", "dbl"),
          T("mittelwert(" + a + ", " + b + ", " + c + ")", "Aufgabe.mittelwert(" + a + ", " + b + ", " + c + ")", lit((a + b + c) / 3, "double"), String(Math.round((a + b + c) / 3 * 1e6) / 1e6), "dbl"), T("mittelwert(1, 2, 2)", "Aufgabe.mittelwert(1, 2, 2)", lit(5 / 3, "double"), "1.666667", "dbl")],
        ck: ["Gleicher Name, unterschiedliche Parameterlisten", "`/ 2.0` bzw. `/ 3.0` – sonst wird abgeschnitten", "Rückgabetyp double"], rel: "STA-2" };
    } else if (v === "brutto") {
      var mw = r.pick([19, 7]);
      o = { title: "Konstante MWST", t: "Legen Sie in der Klasse eine statische Konstante `MWST` mit dem Wert " + mw + " (Prozent) an. Schreiben Sie `brutto(double netto)`, das den Bruttobetrag zurückgibt, und `steuer(double netto)`, das nur den Steueranteil liefert. Beide verwenden die Konstante.",
        extra: "    public static final double MWST = " + mw + ";\n", sigs: ["public static double brutto(double netto)", "public static double steuer(double netto)"], bodies: ["return netto + steuer(netto);", "return netto * MWST / 100;"],
        tests: [100, 50, r.int(1, 400)].map(function (x) { return dbl("brutto", [x], x + x * mw / 100); }).concat([dbl("steuer", [200], 200 * mw / 100)]).concat([T("Konstante MWST", "Aufgabe.MWST", lit(mw, "double"), jd(mw), "dbl")]),
        ck: ["`public static final double MWST = " + mw + ";`", "Konstante in GROSSBUCHSTABEN", "Prozent: `* MWST / 100`", "brutto darf steuer() wiederverwenden"], rel: "STA-3" };
    } else if (v === "runden") {
      var x = r.int(1000, 99999) / 1000 + 0.0004, st = r.pick([1, 2, 3]);
      o = { title: "Runden auf Stellen", t: "Schreiben Sie `runden(double wert, int stellen)`, die wert auf die angegebene Anzahl Nachkommastellen rundet. Tipp: mit 10^stellen multiplizieren, Math.round, wieder teilen.",
        sigs: ["public static double runden(double wert, int stellen)"], bodies: ["double faktor = Math.pow(10, stellen);\nreturn Math.round(wert * faktor) / faktor;"],
        tests: [[3.14159, 2], [2.71828, 3], [x, st], [7.5, 0]].map(function (p) { var f = Math.pow(10, p[1]), res = Math.round(p[0] * f) / f; return T("runden(" + jd(p[0]) + ", " + p[1] + ")", "Aufgabe.runden(" + lit(p[0], "double") + ", " + p[1] + ")", lit(res, "double"), jd(res), "dbl"); }),
        ck: ["`Math.pow(10, stellen)`", "`Math.round(...)` liefert long – danach durch einen double teilen", "Nicht `(int)` – das schneidet ab statt zu runden"], rel: "STA-1" };
    } else if (v === "wertverlust") {
      o = { title: "Wertverlust mit Math.pow", t: "Ein Gerät verliert jedes Jahr p Prozent seines Werts. Schreiben Sie `restwert(double preis, double prozent, int jahre)`, die preis · (1 − prozent/100)^jahre zurückgibt, und eine überladene Variante `restwert(double preis, double prozent)` für genau ein Jahr, die die erste aufruft.",
        sigs: ["public static double restwert(double preis, double prozent, int jahre)", "public static double restwert(double preis, double prozent)"], bodies: ["return preis * Math.pow(1 - prozent / 100, jahre);", "return restwert(preis, prozent, 1);"],
        tests: [[1000, 20, 2], [1500, 10, 3], [800, 25, 0]].map(function (p) { return T("restwert(" + p.join(", ") + ")", "Aufgabe.restwert(" + lit(p[0], "double") + ", " + lit(p[1], "double") + ", " + p[2] + ")", lit(p[0] * Math.pow(1 - p[1] / 100, p[2]), "double"), String(Math.round(p[0] * Math.pow(1 - p[1] / 100, p[2]) * 1e6) / 1e6), "dbl"); })
          .concat([T("restwert(1000, 20)", "Aufgabe.restwert(1000.0, 20.0)", "800.0", "800.0", "dbl")]),
        ck: ["`Math.pow(basis, exponent)`", "`prozent / 100` mit double rechnen", "Überladene Variante ruft die allgemeine auf"], rel: "STA-2" };
    } else {
      o = { title: "Rechtwinkliges Dreieck prüfen", t: "Schreiben Sie `istRechtwinklig(int a, int b, int c)`: true, wenn a² + b² = c² gilt (c ist die längste Seite). Und `hypotenuse(double a, double b)` mit Math.sqrt.",
        sigs: ["public static boolean istRechtwinklig(int a, int b, int c)", "public static double hypotenuse(double a, double b)"], bodies: ["return a * a + b * b == c * c;", "return Math.sqrt(a * a + b * b);"],
        tests: [[3, 4, 5], [5, 12, 13], [4, 5, 6], [6, 8, 10], [2, 2, 3]].map(function (p) { var res = p[0] * p[0] + p[1] * p[1] === p[2] * p[2]; return T("istRechtwinklig(" + p.join(", ") + ")", "Aufgabe.istRechtwinklig(" + p.join(", ") + ")", String(res), String(res)); })
          .concat([[3, 4], [1, 1]].map(function (p) { return dbl("hypotenuse", p, Math.sqrt(p[0] * p[0] + p[1] * p[1])); })),
        ck: ["boolean-Ausdruck direkt zurückgeben (`return ... == ...;`)", "Bei int: `==` ist sicher; bei double nie mit == vergleichen", "`Math.sqrt`"], rel: "STA-1" };
    }
    var stub = "public class Aufgabe {\n" + (o.extra ? "\n    // TODO: Konstante\n" : "") + o.sigs.map(function (s) { return "\n    " + s + " {\n        // TODO\n        " + (s.indexOf("boolean") >= 0 ? "return false;" : "return 0;") + "\n    }\n"; }).join("") + "}\n";
    var sol = "public class Aufgabe {\n" + (o.extra ? "\n" + o.extra : "") + o.sigs.map(function (s, i) { return "\n    " + s + " {\n" + o.bodies[i].split("\n").map(function (l) { return "        " + l; }).join("\n") + "\n    }\n"; }).join("") + "}\n";
    return { rel: o.rel, title: o.title, task: o.t, starterFiles: [{ name: "Aufgabe.java", content: stub }], solFiles: [{ name: "Aufgabe.java", content: sol }], tests: o.tests, mins: 8, stubOnly: !!o.extra,
      check: o.sigs.map(function (s) { return "Kopf: `" + s + "`"; }).concat(o.ck) };
  }});

  // W8: switch in Methoden (VER)
  WRITE.push({ id: "w-switch", rel: "VER-2", title: "switch in Methoden", gen: function (r) {
    var v = r.pick(["einheit", "tage", "wochentag"]), o;
    if (v === "einheit") {
      var E = { km: 1000, m: 1, cm: 0.01, mm: 0.001 };
      o = { sig: "public static double inMeter(double wert, String einheit)", t: "rechnet wert in Meter um. Erlaubte Einheiten: \"km\", \"m\", \"cm\", \"mm\". Bei jeder anderen Einheit wird -1 zurückgegeben. Verwenden Sie switch mit Strings",
        body: "switch (einheit) {\n    case \"km\" -> {\n        return wert * 1000;\n    }\n    case \"m\" -> {\n        return wert;\n    }\n    case \"cm\" -> {\n        return wert / 100;\n    }\n    case \"mm\" -> {\n        return wert / 1000;\n    }\n    default -> {\n        return -1;\n    }\n}",
        tests: [[2.5, "km"], [r.int(1, 99), "m"], [250, "cm"], [r.int(1, 9) * 100, "mm"], [3, "zoll"]].map(function (p) { var res = p[1] === "km" ? p[0] * 1000 : p[1] === "m" ? p[0] : p[1] === "cm" ? p[0] / 100 : p[1] === "mm" ? p[0] / 1000 : -1; return T("inMeter(" + jd(p[0]) + ", \"" + p[1] + "\")", "Aufgabe.inMeter(" + lit(p[0], "double") + ", \"" + p[1] + "\")", lit(res, "double"), jd(res), "dbl"); }),
        ck: ["switch über einen String", "default-Fall für ungültige Einheiten", "cm: durch 100, mm: durch 1000"], dummy: "return 0;" };
    } else if (v === "tage") {
      o = { sig: "public static int quartal(int monat)", t: "für einen Monat (1–12) das Quartal 1–4 zurückgibt, bei ungültigem Monat -1. Nutzen Sie case mit mehreren Werten (z. B. `case 1, 2, 3 ->`)",
        body: "switch (monat) {\n    case 1, 2, 3 -> {\n        return 1;\n    }\n    case 4, 5, 6 -> {\n        return 2;\n    }\n    case 7, 8, 9 -> {\n        return 3;\n    }\n    case 10, 11, 12 -> {\n        return 4;\n    }\n    default -> {\n        return -1;\n    }\n}",
        tests: [1, 3, 4, r.int(5, 6), 7, 9, 10, 12, 0, 13].map(function (m) { var res = m >= 1 && m <= 12 ? Math.floor((m - 1) / 3) + 1 : -1; return T("quartal(" + m + ")", "Aufgabe.quartal(" + m + ")", String(res), String(res)); }),
        ck: ["Mehrere Werte pro case mit Komma", "default für ungültige Monate", "Alternative ohne switch: (monat - 1) / 3 + 1 – aber hier ist switch gefragt"], dummy: "return 0;" };
    } else {
      o = { sig: "public static String wochentag(int tag)", t: "für 1 bis 7 den Namen des Wochentags zurückgibt (1 = \"Montag\" … 7 = \"Sonntag\"), sonst \"ungültig\". Nutzen Sie einen switch-Ausdruck mit `return switch`",
        body: "return switch (tag) {\n    case 1 -> \"Montag\";\n    case 2 -> \"Dienstag\";\n    case 3 -> \"Mittwoch\";\n    case 4 -> \"Donnerstag\";\n    case 5 -> \"Freitag\";\n    case 6 -> \"Samstag\";\n    case 7 -> \"Sonntag\";\n    default -> \"ungültig\";\n};",
        tests: [1, r.int(2, 6), 7, 0, 8].map(function (d) { var N = ["ungültig", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"], res = d >= 1 && d <= 7 ? N[d] : "ungültig"; return T("wochentag(" + d + ")", "Aufgabe.wochentag(" + d + ")", JSON.stringify(res), JSON.stringify(res)); }),
        ck: ["`return switch (tag) { ... };` – Semikolon am Ende!", "Alle sieben Fälle plus default", "Strings exakt"], dummy: "return \"\";" };
    }
    return methodTask({ rel: "VER-2", title: v === "einheit" ? "Einheiten umrechnen" : v === "tage" ? "Quartal bestimmen" : "Wochentage", task: "Schreiben Sie eine statische Methode `" + o.sig.match(/ (\w+)\(/)[1] + "`, die " + o.t + ".", sig: o.sig, dummy: o.dummy, body: o.body, tests: o.tests, mins: 7, check: ["Kopf: `" + o.sig + "`"].concat(o.ck) });
  }});

  // W9: Zähler-Arrays für Zeichen (ZKT/ARR)
  WRITE.push({ id: "w-zaehler", rel: "ZKT-1", title: "Zählen mit einem Array", gen: function (r) {
    var v = r.pick(["ziffern", "grossKlein"]), texts = [r.pick(["Raum 101 und 207", "Tel. 0331 5550", "Port 8080, Port 443", "2026-11-10"]), r.pick(["Java 21", "BRB-AB 123", "abc"]), "9 Leben, 19 Uhr, Rang 99", "Ende", ""];
    var o, tests;
    if (v === "ziffern") {
      o = { sig: "public static int[] ziffernZaehlen(String text)", t: "ein int-Array der Länge 10 zurückgibt: An Index d steht, wie oft die Ziffer d im text vorkommt. Tipp: `c - '0'` liefert für eine Ziffer c ihren Zahlenwert",
        body: "int[] anzahl = new int[10];\nfor (int i = 0; i < text.length(); i++) {\n    char c = text.charAt(i);\n    if (c >= '0' && c <= '9') {\n        anzahl[c - '0']++;\n    }\n}\nreturn anzahl;",
        f: function (s) { var a = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; s.split("").forEach(function (c) { if (c >= "0" && c <= "9") a[+c]++; }); return a; }, ck: ["Array mit `new int[10]` anlegen", "Ziffer prüfen: `c >= '0' && c <= '9'`", "Index berechnen: `c - '0'`"] };
    } else {
      o = { sig: "public static int[] grossKlein(String text)", t: "ein int-Array der Länge 2 zurückgibt: an Index 0 die Anzahl der Großbuchstaben, an Index 1 die Anzahl der Kleinbuchstaben. Nutzen Sie `Character.isUpperCase(c)` und `Character.isLowerCase(c)`",
        body: "int[] anzahl = new int[2];\nfor (int i = 0; i < text.length(); i++) {\n    char c = text.charAt(i);\n    if (Character.isUpperCase(c)) {\n        anzahl[0]++;\n    } else if (Character.isLowerCase(c)) {\n        anzahl[1]++;\n    }\n}\nreturn anzahl;",
        f: function (s) { var a = [0, 0]; s.split("").forEach(function (c) { if (/[A-ZÄÖÜ]/.test(c)) a[0]++; else if (/[a-zäöüß]/.test(c)) a[1]++; }); return a; }, ck: ["Ergebnis-Array der Länge 2", "Ziffern und Leerzeichen zählen nicht mit", "Array zurückgeben"] };
    }
    tests = texts.map(function (s) { var res = o.f(s); return T(o.sig.match(/ (\w+)\(/)[1] + "(" + JSON.stringify(s) + ")", "Arrays.toString(Aufgabe." + o.sig.match(/ (\w+)\(/)[1] + "(" + JSON.stringify(s) + "))", JSON.stringify("[" + res.join(", ") + "]"), "[" + res.join(", ") + "]"); });
    var task = methodTask({ rel: "ZKT-1", title: v === "ziffern" ? "Ziffern zählen" : "Groß- und Kleinbuchstaben", task: "Schreiben Sie eine statische Methode `" + o.sig.match(/ (\w+)\(/)[1] + "`, die " + o.t + ".", sig: o.sig, dummy: "return new int[0];", body: o.body, tests: tests, mins: 9, check: ["Kopf: `" + o.sig + "`"].concat(o.ck) });
    task.testImports = ["java.util.Arrays"];
    return task;
  }});

  // W10: Klassen mit zweitem Konstruktor (this(...)) und Methoden, die neue Objekte liefern (KLA)
  var OBJS = [
    { cls: "Punkt", a: "x", b: "y", one: "Punkt(int x) – y wird 0", mname: "verschieben", mparams: "int dx, int dy", mdesc: "liefert einen NEUEN Punkt, der um dx und dy verschoben ist", mbody: "return new Punkt(x + dx, y + dy);", fmt: "(x|y)", dname: "abstand", ddesc: "liefert den Abstand zum Ursprung √(x² + y²) als double", dbody: "return Math.sqrt(x * x + y * y);", f: function (x, y, p) { return [x + p[0], y + p[1]]; }, df: function (x, y) { return Math.sqrt(x * x + y * y); } },
    { cls: "Rechteck", a: "breite", b: "hoehe", one: "Rechteck(int seite) – ein Quadrat, beide Seiten gleich", same: true, mname: "skalieren", mparams: "int faktor", mdesc: "liefert ein NEUES Rechteck mit beiden Seiten mal faktor", mbody: "return new Rechteck(breite * faktor, hoehe * faktor);", fmt: "breitexhoehe", dname: "seitenverhaeltnis", ddesc: "liefert breite / hoehe als double (Achtung: int-Division!)", dbody: "return (double) breite / hoehe;", f: function (x, y, p) { return [x * p[0], y * p[0]]; }, df: function (x, y) { return x / y; } },
    { cls: "Zeitdauer", a: "stunden", b: "minuten", one: "Zeitdauer(int stunden) – minuten wird 0", mname: "plus", mparams: "Zeitdauer andere", mdesc: "liefert eine NEUE Zeitdauer mit der Summe beider Dauern; die Minuten werden dabei normalisiert (z. B. 1h 50min + 0h 20min = 2h 10min)", mbody: "int gesamt = (stunden + andere.stunden) * 60 + minuten + andere.minuten;\nreturn new Zeitdauer(gesamt / 60, gesamt % 60);", fmt: "a:b h", dname: "inStunden", ddesc: "liefert die Dauer als Kommazahl in Stunden (z. B. 1h 30min → 1.5)", dbody: "return stunden + minuten / 60.0;", f: function (x, y, p) { var g = (x + p[0]) * 60 + y + p[1]; return [Math.trunc(g / 60), g % 60]; }, df: function (x, y) { return x + y / 60; }, objArg: true }
  ];
  WRITE.push({ id: "w-objekt", rel: "KLA-3", title: "Klasse mit Objekt-Methoden", gen: function (r) {
    var O = r.pick(OBJS), x = r.int(1, 9), y = O.same ? r.int(1, 9) : r.int(0, 59), p = O.objArg ? [r.int(0, 3), r.int(10, 59)] : O.same ? [r.int(2, 4)] : [r.int(-5, 5), r.int(-5, 5)];
    if (O.cls === "Punkt") y = r.int(-9, 9);
    var fmt = function (a, b) { return O.fmt === "(x|y)" ? "(" + a + "|" + b + ")" : O.fmt === "breitexhoehe" ? a + "x" + b : a + ":" + (b < 10 ? "0" + b : b) + " h"; };
    var toStr = O.fmt === "(x|y)" ? "\"(\" + x + \"|\" + y + \")\"" : O.fmt === "breitexhoehe" ? "breite + \"x\" + hoehe" : "stunden + \":\" + (minuten < 10 ? \"0\" : \"\") + minuten + \" h\"";
    var sol = "public class " + O.cls + " {\n    private int " + O.a + ";\n    private int " + O.b + ";\n\n" +
      "    public " + O.cls + "(int " + O.a + ", int " + O.b + ") {\n        this." + O.a + " = " + O.a + ";\n        this." + O.b + " = " + O.b + ";\n    }\n\n" +
      "    public " + O.cls + "(int " + (O.same ? "seite" : O.a) + ") {\n        this(" + (O.same ? "seite, seite" : O.a + ", 0") + ");\n    }\n\n" +
      "    public int get" + cap(O.a) + "() {\n        return " + O.a + ";\n    }\n\n    public int get" + cap(O.b) + "() {\n        return " + O.b + ";\n    }\n\n" +
      "    public " + O.cls + " " + O.mname + "(" + O.mparams + ") {\n" + O.mbody.split("\n").map(function (l) { return "        " + l; }).join("\n") + "\n    }\n\n" +
      "    public double " + O.dname + "() {\n        " + O.dbody + "\n    }\n\n" +
      "    @Override\n    public String toString() {\n        return " + toStr + ";\n    }\n}\n";
    var mres = O.f(x, y, p), args = O.objArg ? "new " + O.cls + "(" + p[0] + ", " + p[1] + ")" : p.join(", ");
    var tests = [
      T("toString()", "o.toString()", JSON.stringify(fmt(x, y)), JSON.stringify(fmt(x, y)), "eq", O.cls + " o = new " + O.cls + "(" + x + ", " + y + ");"),
      T("Konstruktor mit einem Parameter", "new " + O.cls + "(" + x + ").toString()", JSON.stringify(O.same ? fmt(x, x) : fmt(x, 0)), JSON.stringify(O.same ? fmt(x, x) : fmt(x, 0))),
      T(O.mname + "(" + (O.objArg ? fmt(p[0], p[1]) : p.join(", ")) + ")", "o." + O.mname + "(" + args + ").toString()", JSON.stringify(fmt(mres[0], mres[1])), JSON.stringify(fmt(mres[0], mres[1]))),
      T("toString mit " + O.b + " = 10", "new " + O.cls + "(" + x + ", 10).toString()", JSON.stringify(fmt(x, 10)), JSON.stringify(fmt(x, 10))),
      T("toString mit " + O.b + " = 5", "new " + O.cls + "(" + x + ", 5).toString()", JSON.stringify(fmt(x, 5)), JSON.stringify(fmt(x, 5))),
      T(O.mname + " verändert o nicht", "o.toString()", JSON.stringify(fmt(x, y)), JSON.stringify(fmt(x, y))),
      T(O.mname + " liefert ein neues Objekt", "o." + O.mname + "(" + args + ") != o", "true", "true"),
      T(O.dname + "()", "o." + O.dname + "()", lit(O.df(x, y), "double"), String(Math.round(O.df(x, y) * 1e6) / 1e6), "dbl")
    ];
    var task = "Schreiben Sie die Klasse `" + O.cls + "` mit\n- zwei privaten int-Attributen `" + O.a + "` und `" + O.b + "` und Gettern,\n- einem Konstruktor für beide Werte und einem zweiten Konstruktor `" + O.one + "`, der den ersten mit `this(...)` aufruft,\n" +
      "- einer Methode `" + O.mname + "(" + O.mparams + ")`, die " + O.mdesc + " (das Objekt selbst bleibt unverändert),\n- einer Methode `" + O.dname + "()`, die " + O.ddesc + ",\n- `toString()` im Format „" + fmt(x, y) + "“.";
    return { rel: "KLA-3", title: "Klasse " + O.cls, task: task, starterFiles: [{ name: O.cls + ".java", content: "public class " + O.cls + " {\n\n    // TODO: Attribute, zwei Konstruktoren, Getter\n\n    // TODO: " + O.mname + ", " + O.dname + ", toString\n}\n" }],
      solFiles: [{ name: O.cls + ".java", content: sol }], tests: tests, mins: 15, stubOnly: true,
      check: ["Zweiter Konstruktor ruft `this(...)` als erste Anweisung auf", "Methode gibt `new " + O.cls + "(...)` zurück und ändert keine Attribute", "Kommadivision: `(double)` oder `60.0`", "toString exakt im vorgegebenen Format"] };
  }});

  // W11: lineare Programme (VAR) – ganzes Programm mit main, Ausgabe vergleichen
  WRITE.push({ id: "w-linear", rel: "VAR-5", title: "Lineares Programm", gen: function (r) {
    var v = r.pick(["einkauf", "quader", "kugelpi"]), o;
    if (v === "einkauf") {
      var it = r.shuffle([["Brot", 2.5], ["Milch", 1.25], ["Kaffee", 6.75], ["Aepfel", 0.5], ["Butter", 2.25], ["Eier", 0.25]]).slice(0, 3), n = [r.int(1, 4), r.int(1, 6), r.int(2, 10)], rab = r.pick([10, 5, 20]);
      var sum = 0, lines = it.map(function (p, i) { var s = n[i] * p[1]; sum += s; return p[0] + ": " + jd(s); });
      var endp = sum * (100 - rab) / 100;
      o = { cls: "Einkauf", t: "Schreiben Sie ein Programm `Einkauf` mit main. Legen Sie Variablen für die Stückpreise an (" + it.map(function (p) { return p[0] + " " + jd(p[1]) + " €"; }).join(", ") + ") und für die Mengen (" + it.map(function (p, i) { return n[i] + "× " + p[0]; }).join(", ") + "). Legen Sie eine Konstante RABATT = " + rab + " (Prozent) an. Berechnen und geben Sie aus: den Preis je Artikel, die Summe und den Endpreis nach Rabatt. Nichts doppelt berechnen!",
        body: it.map(function (p) { return "double preis" + p[0] + " = " + jd(p[1]) + ";"; }).join("\n") + "\n" + it.map(function (p, i) { return "int anzahl" + p[0] + " = " + n[i] + ";"; }).join("\n") + "\nfinal int RABATT = " + rab + ";\n\n" +
          it.map(function (p) { return "double summe" + p[0] + " = anzahl" + p[0] + " * preis" + p[0] + ";"; }).join("\n") + "\ndouble summe = " + it.map(function (p) { return "summe" + p[0]; }).join(" + ") + ";\ndouble endpreis = summe * (100 - RABATT) / 100;\n\n" +
          it.map(function (p) { return "System.out.println(\"" + p[0] + ": \" + summe" + p[0] + ");"; }).join("\n") + "\nSystem.out.println(\"Summe: \" + summe);\nSystem.out.println(\"Endpreis: \" + endpreis);",
        out: lines.concat(["Summe: " + jd(sum), "Endpreis: " + jd(endp)]).join("\n"), ck: ["Variablen für Preise und Mengen", "`final` für die Konstante, Name in GROSSBUCHSTABEN", "Zwischenergebnisse in Variablen speichern und wiederverwenden", "Ausgabe mit Text + Variable"] };
    } else if (v === "quader") {
      var a = r.int(2, 9) + r.pick([0, 0.5]), b = r.int(2, 9), c = r.int(2, 9) + r.pick([0, 0.25]);
      var V = a * b * c, O = 2 * (a * b + a * c + b * c), K = 4 * (a + b + c);
      o = { cls: "Quader", t: "Schreiben Sie ein Programm `Quader` mit main. Legen Sie Variablen laenge = " + jd(a) + ", breite = " + b + ", hoehe = " + jd(c) + " an (double). Berechnen Sie Volumen, Oberfläche und die Summe aller Kantenlängen und geben Sie die Werte jeweils in einer Zeile aus: „Volumen: …“, „Oberflaeche: …“, „Kantenlaenge: …“.",
        body: "double laenge = " + jd(a) + ";\ndouble breite = " + jd(b) + ";\ndouble hoehe = " + jd(c) + ";\n\ndouble volumen = laenge * breite * hoehe;\ndouble oberflaeche = 2 * (laenge * breite + laenge * hoehe + breite * hoehe);\ndouble kanten = 4 * (laenge + breite + hoehe);\n\nSystem.out.println(\"Volumen: \" + volumen);\nSystem.out.println(\"Oberflaeche: \" + oberflaeche);\nSystem.out.println(\"Kantenlaenge: \" + kanten);",
        out: "Volumen: " + jd(V) + "\nOberflaeche: " + jd(O) + "\nKantenlaenge: " + jd(K), ck: ["Werte als double-Variablen", "Je Ergebnis eine eigene Variable", "Formeln: V = l·b·h, O = 2(lb + lh + bh), Kanten = 4(l + b + h)"] };
    } else {
      var rr = r.int(1, 9);
      var PI = 3.141592, vol = 4.0 / 3 * PI * rr * rr * rr, ob = 4 * PI * rr * rr, d = 2 * rr;
      o = { cls: "Kugel", t: "Schreiben Sie ein Programm `Kugel` mit main. Legen Sie eine Konstante PI = 3.141592 und eine Variable radius = " + rr + " (int) an. Berechnen Sie Durchmesser (int), Oberfläche 4·π·r² und Volumen 4/3·π·r³ (double) und geben Sie sie aus: „Durchmesser: …“, „Oberflaeche: …“, „Volumen: …“. Achtung bei 4/3!",
        body: "final double PI = 3.141592;\nint radius = " + rr + ";\n\nint durchmesser = 2 * radius;\ndouble oberflaeche = 4 * PI * radius * radius;\ndouble volumen = 4.0 / 3 * PI * radius * radius * radius;\n\nSystem.out.println(\"Durchmesser: \" + durchmesser);\nSystem.out.println(\"Oberflaeche: \" + oberflaeche);\nSystem.out.println(\"Volumen: \" + volumen);",
        out: "Durchmesser: " + d + "\nOberflaeche: " + jd(ob) + "\nVolumen: " + jd(vol), ck: ["`final double PI = 3.141592;`", "`4.0 / 3` – mit `4 / 3` wäre das Volumen falsch (Faktor 1)", "Durchmesser bleibt int"] };
    }
    var sol = "public class " + o.cls + " {\n    public static void main(String[] args) {\n" + o.body.split("\n").map(function (l) { return l ? "        " + l : ""; }).join("\n") + "\n    }\n}\n";
    return { rel: "VAR-5", title: "Programm " + o.cls, task: o.t, kind: "program", mainCls: o.cls, out: o.out,
      starterFiles: [{ name: o.cls + ".java", content: "public class " + o.cls + " {\n    public static void main(String[] args) {\n        // TODO: Variablen, Berechnungen, Ausgaben\n    }\n}\n" }],
      solFiles: [{ name: o.cls + ".java", content: sol }], tests: [], mins: 10, check: o.ck };
  }});

  // ---------- Weitere Kursprojekte, abgestimmt auf die Einsendeaufgaben ----------
  proj({ id: "p-doku", rel: "EJP-3", ref: "EJP-E1 (Fähigkeiten)", title: "Methode dokumentieren und testen", mins: 12,
    task: "Fähigkeit aus EJP-E1: Ergänzen Sie die Klasse `Aufgabe` um eine statische Methode `quadratsumme(int a, int b)`, die a² + b² zurückgibt. Schreiben Sie einen vollständigen javadoc-Kommentar (Beschreibung, @param für beide Parameter, @return). Erzeugen Sie die Doku anschließend mit `javadoc Aufgabe.java` und öffnen Sie index.html.",
    sigs: ["public static int quadratsumme(int a, int b)"], dummies: ["return 0;"],
    bodies: ["return a * a + b * b;"], doc: ["/**\n     * Berechnet die Summe der Quadrate zweier Zahlen.\n     * @param a die erste Zahl\n     * @param b die zweite Zahl\n     * @return a * a + b * b\n     */"],
    tests: [[3, 4, 25], [0, 0, 0], [-2, 5, 29]].map(function (p) { return T("quadratsumme(" + p[0] + ", " + p[1] + ")", "Aufgabe.quadratsumme(" + p[0] + ", " + p[1] + ")", String(p[2]), String(p[2])); }),
    check: ["Kommentar beginnt mit `/**`", "`@param` für jeden Parameter, `@return` für den Rückgabewert", "javadoc ohne Fehler ausgeführt", "Testaufrufe in einer main oder per Test.java"] });
  proj({ id: "p-folge", rel: "ITR-1", ref: "ITR-E1 (Fähigkeiten)", title: "Zählen, bis ein Ereignis eintritt", mins: 10,
    task: "Fähigkeit aus ITR-E1: Die Klasse `Zahlenquelle` ist gegeben und liefert mit `naechste()` nacheinander Zahlen. Schreiben Sie `versucheBis(Zahlenquelle q, int ziel)`, die so lange Zahlen holt, bis ziel kommt, und die Anzahl der benötigten Versuche zurückgibt (inklusive des Treffers). Welche Schleife passt am besten?",
    given: [{ name: "Zahlenquelle.java", content: "public class Zahlenquelle {\n    private int[] folge;\n    private int pos = 0;\n\n    public Zahlenquelle(int[] folge) {\n        this.folge = folge;\n    }\n\n    /** Liefert die nächste Zahl der Folge (am Ende wieder von vorne). */\n    public int naechste() {\n        int z = folge[pos];\n        pos = (pos + 1) % folge.length;\n        return z;\n    }\n}\n" }],
    sigs: ["public static int versucheBis(Zahlenquelle q, int ziel)"], dummies: ["return 0;"],
    bodies: ["int versuche = 0;\nint zahl;\ndo {\n    zahl = q.naechste();\n    versuche++;\n} while (zahl != ziel);\nreturn versuche;"],
    tests: [T("Treffer an 4. Stelle", "Aufgabe.versucheBis(new Zahlenquelle(new int[]{3, 1, 5, 6, 2}), 6)", "4", "4"), T("Treffer sofort", "Aufgabe.versucheBis(new Zahlenquelle(new int[]{6, 6}), 6)", "1", "1"), T("Treffer am Ende", "Aufgabe.versucheBis(new Zahlenquelle(new int[]{1, 2, 3, 4, 5, 6}), 6)", "6", "6")],
    check: ["do-while: erst würfeln/holen, dann prüfen", "Zähler pro Durchlauf erhöhen", "Bedingung `!= ziel`"] });
  proj({ id: "p-koerper", rel: "VRB-4", ref: "VRB-E1 (Fähigkeiten)", title: "Abstrakte Klasse und zwei Vererbungsstufen", mins: 20,
    task: "Fähigkeit aus VRB-E1 (mit anderem Beispiel): Gegeben ist die abstrakte Klasse `Koerper` mit Position x, y, z und den abstrakten Methoden `volumen()` und `oberflaeche()`.\n1. Schreiben Sie `Quader extends Koerper` mit den Attributen a, b, c (double), Konstruktor `Quader(double x, double y, double z, double a, double b, double c)`, Gettern, beiden Methoden und `toString()` = super.toString() + \" Quader \" + a + \"x\" + b + \"x\" + c.\n2. Schreiben Sie `Wuerfel extends Quader` mit Konstruktor `Wuerfel(double x, double y, double z, double kante)` – ohne neue Attribute – und `toString()` = Text der Klasse Koerper + \" Wuerfel \" + kante.\n3. Schreiben Sie in `Bericht` die statische Methode `bericht(Koerper k)`, die \"V=\" + k.volumen() + \" O=\" + k.oberflaeche() zurückgibt – für jeden Körper (Polymorphie).",
    cls: "Quader",
    given: [{ name: "Koerper.java", content: "public abstract class Koerper {\n    protected double x, y, z;\n\n    public Koerper(double x, double y, double z) {\n        this.x = x;\n        this.y = y;\n        this.z = z;\n    }\n\n    public abstract double volumen();\n\n    public abstract double oberflaeche();\n\n    @Override\n    public String toString() {\n        return \"Ursprung (\" + x + \", \" + y + \", \" + z + \")\";\n    }\n}\n" }],
    starter: [{ name: "Quader.java", content: "public class Quader extends Koerper {\n    // TODO\n}\n" }, { name: "Wuerfel.java", content: "public class Wuerfel extends Quader {\n    // TODO\n}\n" }, { name: "Bericht.java", content: "public class Bericht {\n    // TODO: public static String bericht(Koerper k)\n}\n" }],
    sol: [{ name: "Quader.java", content: "public class Quader extends Koerper {\n    private double a, b, c;\n\n    public Quader(double x, double y, double z, double a, double b, double c) {\n        super(x, y, z);\n        this.a = a;\n        this.b = b;\n        this.c = c;\n    }\n\n    public double getA() { return a; }\n    public double getB() { return b; }\n    public double getC() { return c; }\n\n    @Override\n    public double volumen() {\n        return a * b * c;\n    }\n\n    @Override\n    public double oberflaeche() {\n        return 2 * (a * b + a * c + b * c);\n    }\n\n    /** Nur der Text der Klasse Koerper – für Unterklassen. */\n    protected String basisText() {\n        return super.toString();\n    }\n\n    @Override\n    public String toString() {\n        return super.toString() + \" Quader \" + a + \"x\" + b + \"x\" + c;\n    }\n}\n" },
      { name: "Wuerfel.java", content: "public class Wuerfel extends Quader {\n\n    public Wuerfel(double x, double y, double z, double kante) {\n        super(x, y, z, kante, kante, kante);\n    }\n\n    @Override\n    public String toString() {\n        return basisText() + \" Wuerfel \" + getA();\n    }\n}\n" },
      { name: "Bericht.java", content: "public class Bericht {\n    public static String bericht(Koerper k) {\n        return \"V=\" + k.volumen() + \" O=\" + k.oberflaeche();\n    }\n}\n" }],
    tests: [T("Quader volumen", "q.volumen()", "24.0", "24.0", "dbl", "Koerper q = new Quader(0, 0, 0, 2, 3, 4);\nKoerper w = new Wuerfel(1, 1, 1, 3);"), T("Quader oberflaeche", "q.oberflaeche()", "52.0", "52.0", "dbl"),
      T("Quader toString", "q.toString()", "\"Ursprung (0.0, 0.0, 0.0) Quader 2.0x3.0x4.0\"", "\"Ursprung (0.0, 0.0, 0.0) Quader 2.0x3.0x4.0\""), T("Wuerfel volumen (geerbt)", "w.volumen()", "27.0", "27.0", "dbl"),
      T("Wuerfel toString", "w.toString()", "\"Ursprung (1.0, 1.0, 1.0) Wuerfel 3.0\"", "\"Ursprung (1.0, 1.0, 1.0) Wuerfel 3.0\""), T("Wuerfel ist ein Quader", "w instanceof Quader", "true", "true"),
      T("bericht(q) polymorph", "Bericht.bericht(q)", "\"V=24.0 O=52.0\"", "\"V=24.0 O=52.0\""), T("bericht(w) polymorph", "Bericht.bericht(w)", "\"V=27.0 O=54.0\"", "\"V=27.0 O=54.0\"")],
    check: ["`extends Koerper` bzw. `extends Quader`", "Konstruktoren rufen `super(...)` auf; Würfel übergibt dreimal die Kante", "Würfel braucht keine eigenen Attribute und keine eigene volumen()", "Abstrakte Methoden mit @Override implementiert", "Für den Würfel-Text: Den Text von Koerper erreicht man nicht mit super.super – hier hilft eine geschützte Hilfsmethode in Quader (eine mögliche Lösung)", "bericht arbeitet mit dem Typ Koerper – Polymorphie"] });
  proj({ id: "p-ausnahme", rel: "EXC-3", ref: "EXC-E1 / EXC-E2 (Fähigkeiten)", title: "Eigene checked Exception", mins: 15,
    task: "Fähigkeit aus EXC-E1/E2 (mit anderem Beispiel):\n1. Schreiben Sie die checked Exception `UngueltigeTemperaturException` (erbt von Exception, Konstruktor mit Nachricht).\n2. Schreiben Sie die Klasse `Temperatur` mit privatem Attribut `celsius`, Getter und einem Konstruktor, der die Exception wirft, wenn der Wert unter -273.15 liegt (Nachricht: \"unter dem absoluten Nullpunkt\").\n3. Schreiben Sie in `Temperatur` die statische Methode `sicherErzeugen(double c)`, die die Exception mit try-catch auffängt und dann null zurückgibt.",
    cls: "Temperatur",
    starter: [{ name: "UngueltigeTemperaturException.java", content: "// TODO: checked Exception\n" }, { name: "Temperatur.java", content: "public class Temperatur {\n    // TODO\n}\n" }],
    sol: [{ name: "UngueltigeTemperaturException.java", content: "public class UngueltigeTemperaturException extends Exception {\n    public UngueltigeTemperaturException(String nachricht) {\n        super(nachricht);\n    }\n}\n" },
      { name: "Temperatur.java", content: "public class Temperatur {\n    private double celsius;\n\n    public Temperatur(double celsius) throws UngueltigeTemperaturException {\n        if (celsius < -273.15) {\n            throw new UngueltigeTemperaturException(\"unter dem absoluten Nullpunkt\");\n        }\n        this.celsius = celsius;\n    }\n\n    public double getCelsius() {\n        return celsius;\n    }\n\n    public static Temperatur sicherErzeugen(double c) {\n        try {\n            return new Temperatur(c);\n        } catch (UngueltigeTemperaturException e) {\n            return null;\n        }\n    }\n}\n" }],
    tests: [T("gültige Temperatur", "Temperatur.sicherErzeugen(21.5).getCelsius()", "21.5", "21.5", "dbl"), T("Grenzwert -273.15 ist gültig", "Temperatur.sicherErzeugen(-273.15) != null", "true", "true"),
      T("zu kalt → null", "Temperatur.sicherErzeugen(-300)", "null", "null"), T("Exception ist checked", "Exception.class.isAssignableFrom(UngueltigeTemperaturException.class) && !RuntimeException.class.isAssignableFrom(UngueltigeTemperaturException.class)", "true", "true"),
      T("Nachricht der Exception", "Test.nachricht(() -> new Temperatur(-500))", "\"unter dem absoluten Nullpunkt\"", "\"unter dem absoluten Nullpunkt\"")],
    check: ["`extends Exception` (checked), Konstruktor ruft `super(nachricht)`", "Konstruktor kündigt mit `throws` an", "`throw new ...Exception(\"...\")` bei ungültigem Wert", "try-catch in sicherErzeugen – dort darf kein throws stehen", "Name endet auf …Exception"] });
  proj({ id: "p-kino", rel: "ARR-1", ref: "ARR-E1 (Fähigkeiten)", title: "Belegung mit boolean-Array", mins: 15,
    task: "Fähigkeit aus ARR-E1 (mit anderem Beispiel): Schreiben Sie die Klasse `Kinoreihe` mit einem privaten boolean-Array für n Plätze (Platznummern 1 bis n).\n- Konstruktor `Kinoreihe(int n)`\n- `reservieren(int platz)`: wirft IllegalArgumentException bei Platz außerhalb 1..n; gibt false zurück, wenn der Platz schon belegt ist; sonst wird er belegt und true zurückgegeben.\n- `istAusverkauft()`: true, wenn alle Plätze belegt sind.\n- `freiePlaetze()`: Anzahl der freien Plätze.",
    cls: "Kinoreihe",
    starter: [{ name: "Kinoreihe.java", content: "public class Kinoreihe {\n    // TODO: boolean-Array als Attribut\n}\n" }],
    sol: [{ name: "Kinoreihe.java", content: "public class Kinoreihe {\n    private boolean[] belegt;\n\n    public Kinoreihe(int n) {\n        belegt = new boolean[n];\n    }\n\n    public boolean reservieren(int platz) {\n        if (platz < 1 || platz > belegt.length) {\n            throw new IllegalArgumentException(\"Platz \" + platz + \" gibt es nicht\");\n        }\n        if (belegt[platz - 1]) {\n            return false;\n        }\n        belegt[platz - 1] = true;\n        return true;\n    }\n\n    public boolean istAusverkauft() {\n        for (boolean b : belegt) {\n            if (!b) {\n                return false;\n            }\n        }\n        return true;\n    }\n\n    public int freiePlaetze() {\n        int frei = 0;\n        for (boolean b : belegt) {\n            if (!b) {\n                frei++;\n            }\n        }\n        return frei;\n    }\n}\n" }],
    tests: [T("neue Reihe: 3 frei", "k.freiePlaetze()", "3", "3", "eq", "Kinoreihe k = new Kinoreihe(3);"), T("Platz 2 reservieren", "k.reservieren(2)", "true", "true"), T("Platz 2 nochmal", "k.reservieren(2)", "false", "false"),
      T("nicht ausverkauft", "k.istAusverkauft()", "false", "false"), T("Platz 1 und 3", "k.reservieren(1) && k.reservieren(3)", "true", "true"), T("jetzt ausverkauft", "k.istAusverkauft()", "true", "true"),
      T("0 frei", "k.freiePlaetze()", "0", "0"), T("Platz 4 wirft Exception", "Test.wirft(() -> k.reservieren(4))", "true", "true"), T("Platz 0 wirft Exception", "Test.wirft(() -> k.reservieren(0))", "true", "true")],
    check: ["`new boolean[n]` – alle Werte starten mit false", "Platznummer 1..n auf Index 0..n-1 umrechnen (`platz - 1`)", "Bereichsprüfung zuerst, dann belegt?", "istAusverkauft: früh `return false`"] });
  proj({ id: "p-verwaltung", rel: "ARR-3", ref: "ARR-E2 (Fähigkeiten)", title: "Objekte in einem Array verwalten", mins: 20,
    task: "Fähigkeit aus ARR-E2 (mit anderem Beispiel): Gegeben ist die Klasse `Mitglied` (Name, Beitrag). Schreiben Sie die Klasse `Verein` mit einem Array für maximal 5 Mitglieder.\n- `aufnehmen(String name)`: legt ein neues Mitglied an der ersten freien Stelle an und gibt die Mitgliedsnummer (= Index) zurück, -1 wenn voll.\n- `finden(int nr)`: gibt das Mitglied zurück; wirft die gegebene checked `MitgliedNichtGefundenException`, wenn nr ungültig ist oder dort niemand steht.\n- `beitragZahlen(int nr, double betrag)`: zahlt über finden() ein und reicht die Exception mit throws weiter.\n- `gesamtbeitrag()`: Summe aller Beiträge.",
    cls: "Verein",
    given: [{ name: "Mitglied.java", content: "public class Mitglied {\n    private String name;\n    private double beitrag;\n\n    public Mitglied(String name) {\n        this.name = name;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public double getBeitrag() {\n        return beitrag;\n    }\n\n    public void zahlen(double betrag) {\n        if (betrag > 0) {\n            beitrag += betrag;\n        }\n    }\n}\n" },
      { name: "MitgliedNichtGefundenException.java", content: "public class MitgliedNichtGefundenException extends Exception {\n    public MitgliedNichtGefundenException(int nr) {\n        super(\"Kein Mitglied mit Nummer \" + nr);\n    }\n}\n" }],
    starter: [{ name: "Verein.java", content: "public class Verein {\n    // TODO: Array von Mitglied als Attribut\n}\n" }],
    sol: [{ name: "Verein.java", content: "public class Verein {\n    private Mitglied[] mitglieder = new Mitglied[5];\n\n    public int aufnehmen(String name) {\n        for (int i = 0; i < mitglieder.length; i++) {\n            if (mitglieder[i] == null) {\n                mitglieder[i] = new Mitglied(name);\n                return i;\n            }\n        }\n        return -1;\n    }\n\n    public Mitglied finden(int nr) throws MitgliedNichtGefundenException {\n        if (nr < 0 || nr >= mitglieder.length || mitglieder[nr] == null) {\n            throw new MitgliedNichtGefundenException(nr);\n        }\n        return mitglieder[nr];\n    }\n\n    public void beitragZahlen(int nr, double betrag) throws MitgliedNichtGefundenException {\n        finden(nr).zahlen(betrag);\n    }\n\n    public double gesamtbeitrag() {\n        double summe = 0;\n        for (Mitglied m : mitglieder) {\n            if (m != null) {\n                summe += m.getBeitrag();\n            }\n        }\n        return summe;\n    }\n}\n" }],
    tests: [T("erstes Mitglied hat Nr. 0", "v.aufnehmen(\"Ana\")", "0", "0", "eq", "Verein v = new Verein();"), T("zweites Mitglied hat Nr. 1", "v.aufnehmen(\"Ben\")", "1", "1"),
      T("finden(1) liefert Ben", "Test.leise(() -> v.finden(1).getName())", "\"Ben\"", "\"Ben\""), T("finden(3) wirft Exception", "Test.wirftChecked(() -> v.finden(3))", "true", "true"), T("finden(-1) wirft Exception", "Test.wirftChecked(() -> v.finden(-1))", "true", "true"),
      T("Beiträge zahlen und summieren", "Test.leise(() -> { v.beitragZahlen(0, 30); v.beitragZahlen(1, 12.5); return v.gesamtbeitrag(); })", "42.5", "42.5"),
      T("Verein voll → -1", "Test.leise(() -> { v.aufnehmen(\"C\"); v.aufnehmen(\"D\"); v.aufnehmen(\"E\"); return v.aufnehmen(\"F\"); })", "-1", "-1")],
    check: ["Array `new Mitglied[5]` – anfangs lauter null", "Freien Platz per `== null` suchen", "Ungültige Nummer UND leerer Platz → Exception", "`throws` im Methodenkopf weiterreichen", "Summe nur über nicht-null-Elemente"] });

  // ---------- Testklasse erzeugen ----------
  function harness(task) {
    var imps = ["java.util.Arrays", "java.util.function.Supplier"].concat(task.testImports || []).filter(function (v, i, a) { return a.indexOf(v) === i; });
    var lines = [];
    task.tests.forEach(function (t, i) {
      if (t.setup) t.setup.split("\n").forEach(function (l) { lines.push("        " + l); });
      var lbl = JSON.stringify(t.label);
      if (t.kind === "dbl") lines.push("        pruefeDouble(" + lbl + ", () -> " + t.call + ", " + t.exp + ");");
      else lines.push("        pruefe(" + lbl + ", () -> " + t.call + ", " + t.exp + ");");
    });
    return imps.map(function (i) { return "import " + i + ";\n"; }).join("") + "\n" +
      "/** Automatische Tests – nicht verändern. Starten mit: java Test */\n" +
      "public class Test {\n" +
      "    static int ok = 0, fehler = 0;\n\n" +
      "    static void pruefe(String name, Supplier<Object> aufruf, Object erwartet) {\n" +
      "        try {\n" +
      "            Object erhalten = aufruf.get();\n" +
      "            if (String.valueOf(erhalten).equals(String.valueOf(erwartet))) { ok++; System.out.println(\"OK      \" + name); }\n" +
      "            else { fehler++; System.out.println(\"FEHLER  \" + name + \"  erwartet: \" + erwartet + \"  erhalten: \" + erhalten); }\n" +
      "        } catch (RuntimeException e) { fehler++; System.out.println(\"FEHLER  \" + name + \"  Exception: \" + e); }\n" +
      "    }\n\n" +
      "    static void pruefeDouble(String name, Supplier<Double> aufruf, double erwartet) {\n" +
      "        try {\n" +
      "            double erhalten = aufruf.get();\n" +
      "            if (Math.abs(erhalten - erwartet) < 1e-9) { ok++; System.out.println(\"OK      \" + name); }\n" +
      "            else { fehler++; System.out.println(\"FEHLER  \" + name + \"  erwartet: \" + erwartet + \"  erhalten: \" + erhalten); }\n" +
      "        } catch (RuntimeException e) { fehler++; System.out.println(\"FEHLER  \" + name + \"  Exception: \" + e); }\n" +
      "    }\n\n" +
      "    static boolean wirft(Runnable r) {\n" +
      "        try { r.run(); return false; } catch (IllegalArgumentException | ArithmeticException e) { return true; }\n" +
      "    }\n\n" +
      "    interface Aktion<T> { T run() throws Exception; }\n\n" +
      "    static boolean wirftChecked(Aktion<?> a) {\n" +
      "        try { a.run(); return false; } catch (RuntimeException e) { return false; } catch (Exception e) { return true; }\n" +
      "    }\n\n" +
      "    static String nachricht(Aktion<?> a) {\n" +
      "        try { a.run(); return \"keine Exception\"; } catch (Exception e) { return e.getMessage(); }\n" +
      "    }\n\n" +
      "    static Object leise(Aktion<?> a) {\n" +
      "        try { return a.run(); } catch (Exception e) { return \"Exception: \" + e; }\n" +
      "    }\n\n" +
      "    public static void main(String[] args) {\n" + lines.join("\n") + "\n" +
      "        System.out.println();\n" +
      "        System.out.println(ok + \" von \" + (ok + fehler) + \" Tests bestanden.\");\n" +
      "    }\n}\n";
  }

  // ---------- Öffentliche Schnittstelle ----------
  var W = function (ids) { return WRITE.filter(function (w) { return ids.indexOf(w.id) >= 0; }); };
  var CATS = [
    { id: "trace", name: "Ausgabe lesen", list: TRACE },
    { id: "program", name: "Programm schreiben", list: W(["w-linear"]) },
    { id: "method", name: "Methoden schreiben", list: W(["w-formel", "w-summe", "w-zahl", "w-if", "w-switch", "w-array", "w-string", "w-zaehler", "w-2d"]) },
    { id: "class", name: "Klassen schreiben", list: W(["w-klasse", "w-objekt"]) },
    { id: "inherit", name: "Vererbung", list: W(["w-erben"]) },
    { id: "project", name: "Kursprojekte", list: PROJECTS }
  ];
  function catOf(genId) { for (var i = 0; i < CATS.length; i++) for (var j = 0; j < CATS[i].list.length; j++) if (CATS[i].list[j].id === genId) return CATS[i].id; return null; }

  function make(catId, seed, genId) {
    var cat = CATS.filter(function (c) { return c.id === catId; })[0], r = rng(seed);
    var g = genId ? cat.list.filter(function (x) { return x.id === genId; })[0] : r.pick(cat.list);
    if (catId === "trace") {
      var t = g.gen(r);
      return { cat: catId, gen: g.id, seed: seed, kind: "trace", rel: g.rel, title: g.title, code: t.code, out: t.out, why: t.why, helpers: t.helpers || "", staticHelper: t.staticHelper || "", body: t.body || t.code, imports: g.imports || [], mins: 4 };
    }
    var w = catId === "project" ? projTask(g) : g.gen(r);
    if (!w.starterFiles) w.starterFiles = [{ name: "Aufgabe.java", content: w.starter }];
    if (!w.solFiles) w.solFiles = [{ name: "Aufgabe.java", content: w.sol }];
    w.givenFiles = w.givenFiles || [];
    w.cat = catId; w.gen = g.id; w.seed = seed; w.kind = w.kind || "write";
    w.harness = w.kind === "program" ? "" : harness(w);
    return w;
  }

  return { CATS: CATS, make: make, catOf: catOf, rng: rng, harness: harness, PROJECTS: PROJECTS, TRACE: TRACE, WRITE: WRITE, jd: jd };
})();
if (typeof module !== "undefined") module.exports = GEN;
