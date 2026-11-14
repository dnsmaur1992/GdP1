// Prüft den Probeklausur-Generator gegen echtes Java (javac im Prozess, daher schnell):
//  - A1: jede Code-Aussage – kompiliert sie? stimmt der behauptete Wert? → muss zu „korrekt/nicht korrekt“ passen
//  - A2/A3: Musterlösungen (Klasse + Unterklasse) kompilieren; Ausgaben der Ergänzungs- und Fallaufgaben stimmen
//  - A4/A5 nutzen die Generatoren aus gen.js (geprüft mit verify.js)
// Aufruf: node verify_mock.js [anzahlSeeds]
const fs = require("fs"), path = require("path"), cp = require("child_process"), os = require("os");
const here = fs.existsSync(path.join(__dirname, "mock.js")) ? __dirname : path.join(__dirname, "..", "src");
const MOCK = require(path.join(here, "mock.js")), GEN = require(path.join(here, "gen.js"));
let EXAM; { const src = fs.readFileSync(path.join(here, "exam.js"), "utf8"); EXAM = new Function(src + "\n;return EXAM;")(); }
const N = +(process.argv[2] || 300);
const dir = path.join(os.tmpdir(), "nibble-mock"); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);

const cases = [], seenTf = new Map(), problems = [];
let nParts = 0, nTf = 0;
function addCase(id, files, mainCls, expectCompile, expectOut, label) { cases.push({ id, files, mainCls, expectCompile, expectOut, label }); }

for (let s = 1; s <= N; s++) {
  const ex = MOCK.make(s * 7 + 3, { GEN, EXAM });
  nParts += ex.parts.length;
  const secs = ex.parts.map(p => p.sec).join("");
  if (secs !== "A1".repeat(10) + "A2".repeat(5) + "A3".repeat(3) + "A4".repeat(3) + "A5".repeat(4)) problems.push(`Seed ${s}: Aufbau ${secs}`);
  ex.parts.forEach(p => {
    ["sol", "q", "task", "s", "why"].forEach(k => { if (p[k] != null && /undefined|NaN/.test(p[k])) problems.push(`Seed ${s} ${p.sec}.${p.no}: ${k} enthält undefined/NaN`); });
    if (p.type !== "tf" && p.type !== "trace" && (!p.check || !p.check.length)) problems.push(`Seed ${s} ${p.sec}.${p.no}: keine Checkliste`);
    if (p.type === "tf" && p.java) {
      nTf++;
      const key = p.java.code + "|" + (p.java.print || "") + "|" + (p.java.claim || "");
      if (seenTf.has(key)) { if (seenTf.get(key) !== p.ok) problems.push("Widerspruch: " + p.s); return; }
      seenTf.set(key, p.ok);
      const id = "t" + seenTf.size;
      const body = p.java.code + (p.java.print ? "\nSystem.out.print(" + p.java.print + ");" : "");
      const src = `public class ${id} { public static void main(String[] args) {\n${body}\n} }\n`;
      if (p.java.check === "compile") addCase(id, [[id + ".java", src]], id, p.ok, null, p.s);
      else addCase(id, [[id + ".java", src]], id, true, null, p.s, p.java.claim, p.ok); // Wert prüfen
      if (p.java.print) { cases[cases.length - 1].claim = p.java.claim; cases[cases.length - 1].claimOk = p.ok; }
    }
  });
  // A2/A3 als Programm
  const p2 = ex.parts.find(p => p.java && p.java.kind === "a2"), pc = ex.parts.find(p => p.java && p.java.kind === "cases"), pe = ex.parts.find(p => p.java && p.java.kind === "eq");
  const D = ex.D, id = "k" + s;
  const main = `public class ${id} { public static void main(String[] args) {\n` +
    p2.sol.split("\n").filter(l => !l.startsWith("//")).join("\n") + "\n" +
    `${D.cls} a = new ${D.cls}(${JSON.stringify(pe.java.n)}); ${D.cls} b = new ${D.cls}(${JSON.stringify(pe.java.n)}); System.out.println(a == b);\n` +
    [pc.java.pos, pc.java.neg].map(v => `try { ${D.cls} x = new ${D.sub}(${JSON.stringify(pc.java.pr[0])}, ${JSON.stringify(pc.java.pr[1])}, ${v}); System.out.println(x.toString()); } catch (IllegalArgumentException e) { System.out.println(e.getMessage()); }`).join("\n") +
    "\n} }\n";
  const expect = `${D.art} ${p2.java.n1}\nfalse\n${pc.java.outPos}\n${D.msg}\n`;
  addCase(id, [[D.cls + ".java", ex.base], [D.sub + ".java", ex.sub], [id + ".java", main]], id, true, expect, "A2/A3 Seed " + s);
}
// Fall 3: Nicht-Zahl bei nextInt → InputMismatchException
const bad = `import java.util.*; public class bad { public static void main(String[] a) { for (String s : new String[]{"Hallo","zwölf","3.5","abc"}) { try { new Scanner(s).nextInt(); System.out.print("KEINE|"); } catch (InputMismatchException e) { System.out.print("IME|"); } } } }\n`;
addCase("bad", [["bad.java", bad]], "bad", true, "IME|IME|IME|IME|", "nextInt mit Nicht-Zahlen");

// Java-Runner: kompiliert jeden Fall im Prozess und führt ihn aus
const runner = `
import javax.tools.*; import java.io.*; import java.net.*; import java.nio.file.*; import java.util.*;
public class R {
  public static void main(String[] a) throws Exception {
    JavaCompiler jc = ToolProvider.getSystemJavaCompiler(); PrintStream orig = System.out;
    for (String line : Files.readAllLines(Paths.get(a[0]))) {
      String[] p = line.split("\\t"); File d = new File(p[0]); File out = new File(d, "out"); out.mkdirs();
      List<String> args = new ArrayList<>(List.of("-d", out.getPath(), "-nowarn", "-Xlint:none"));
      for (File f : d.listFiles()) if (f.getName().endsWith(".java")) args.add(f.getPath());
      int rc = jc.run(null, new ByteArrayOutputStream(), new ByteArrayOutputStream(), args.toArray(new String[0]));
      String res = "";
      if (rc == 0) {
        ByteArrayOutputStream bo = new ByteArrayOutputStream(); System.setOut(new PrintStream(bo, true, "UTF-8"));
        try (URLClassLoader cl = new URLClassLoader(new URL[]{ out.toURI().toURL() })) { cl.loadClass(p[1]).getMethod("main", String[].class).invoke(null, (Object) new String[0]); }
        catch (Throwable t) { System.out.print("EXC:" + t.getCause()); }
        System.setOut(orig); res = bo.toString("UTF-8");
      }
      orig.println(p[0].substring(p[0].lastIndexOf('/') + 1) + "\\t" + rc + "\\t" + res.replace("\\n", "\\\\n"));
    }
  }
}`;
fs.writeFileSync(path.join(dir, "R.java"), runner);
const list = cases.map(c => { const d = path.join(dir, c.id); fs.mkdirSync(d); c.files.forEach(([n, src]) => fs.writeFileSync(path.join(d, n), src)); return d + "\t" + c.mainCls; }).join("\n");
fs.writeFileSync(path.join(dir, "list.txt"), list + "\n");
const out = cp.execSync(`cd ${dir} && javac R.java && java -Dfile.encoding=UTF-8 -Dstdout.encoding=UTF-8 R list.txt`, { maxBuffer: 1 << 26 }).toString();
const res = {}; out.trim().split("\n").forEach(l => { const [id, rc, o] = l.split("\t"); res[id] = { rc: +rc, out: (o || "").replace(/\\n/g, "\n") }; });
cases.forEach(c => {
  const r = res[c.id]; if (!r) { problems.push("kein Ergebnis: " + c.label); return; }
  const compiled = r.rc === 0;
  if (c.claim != null) {
    if (!compiled) { problems.push("kompiliert nicht: " + c.label); return; }
    const truth = r.out === c.claim;
    if (truth !== c.claimOk) problems.push(`Wert falsch bewertet: ${c.label} → Java: ${r.out}`);
  } else if (compiled !== c.expectCompile) problems.push(`Kompilierbarkeit falsch: ${c.label} (javac: ${compiled ? "ok" : "Fehler"})`);
  else if (c.expectOut != null && r.out !== c.expectOut) problems.push(`Ausgabe weicht ab: ${c.label}\n  erwartet ${JSON.stringify(c.expectOut)}\n  Java     ${JSON.stringify(r.out)}`);
});
console.log(`Klausuren: ${N} · Teilaufgaben: ${nParts} · A1-Code-Aussagen: ${nTf} (davon ${seenTf.size} verschieden) · Java-Fälle: ${cases.length}`);
if (problems.length) { console.log("PROBLEME:\n" + problems.slice(0, 40).join("\n")); process.exit(1); }
console.log("ALLES OK");
