// Prüft alle Generatoren gegen echtes Java:
//  - Ausgabe-Aufgaben: erwartete Ausgabe == tatsächliche Ausgabe
//  - Schreib-Aufgaben: Musterlösung besteht alle Tests der generierten Testklasse
//  - Vorlagen (Methoden-Stubs) kompilieren zusammen mit der Testklasse
const fs = require("fs"), path = require("path"), cp = require("child_process");
const GEN = require("../src/gen.js");
const N_TRACE = +(process.argv[2] || 60), N_WRITE = +(process.argv[3] || 25);
const dir = require("os").tmpdir() + "/nibble-verify"; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
const cases = []; let n = 0;

function put(pkg, name, content) { const d = path.join(dir, pkg); fs.mkdirSync(d, { recursive: true }); fs.writeFileSync(path.join(d, name), "package " + pkg + ";\n" + content); }

for (const cat of GEN.CATS) {
  for (const g of cat.list) {
    const reps = cat.id === "trace" ? N_TRACE : cat.id === "project" ? 1 : N_WRITE;
    for (let s = 1; s <= reps; s++) {
      const t = GEN.make(cat.id, s * 7919 + n, g.id); const pkg = "p" + (n++);
      if (t.kind === "trace") {
        put(pkg, "T.java", t.imports.map(i => "import " + i + ";\n").join("") + "public class T {\n" + (t.staticHelper || "") + "\n public static void main(String[] args) {\n" + t.body + "\n }\n}\n" + (t.helpers || ""));
        cases.push({ pkg, kind: "trace", t, main: pkg + ".T" });
      } else {
        t.givenFiles.concat(t.solFiles).forEach(f => put(pkg, f.name, f.content));
        if (t.kind === "program") { cases.push({ pkg, kind: "program", t, main: pkg + "." + t.mainCls }); continue; }
        put(pkg, "Test.java", t.harness);
        cases.push({ pkg, kind: "write", t, main: pkg + ".Test" });
        if (!t.stubOnly) { // Vorlage muss mit den Tests kompilieren
          const sp = "s" + pkg; t.givenFiles.concat(t.starterFiles).forEach(f => put(sp, f.name, f.content)); put(sp, "Test.java", t.harness);
          cases.push({ pkg: sp, kind: "stub", t, main: sp + ".Test" });
        }
      }
    }
  }
}
fs.writeFileSync(path.join(dir, "Runner.java"), `
import java.io.*; import java.lang.reflect.*;
public class Runner { public static void main(String[] a) throws Exception {
  PrintStream orig = System.out;
  for (String cls : a) { ByteArrayOutputStream b = new ByteArrayOutputStream(); System.setOut(new PrintStream(b, true, "UTF-8"));
    String res; try { Class.forName(cls).getMethod("main", String[].class).invoke(null, (Object) new String[0]); res = b.toString("UTF-8"); }
    catch (InvocationTargetException e) { res = b.toString("UTF-8") + "\\n!!EXCEPTION " + e.getCause(); }
    System.setOut(orig); System.out.print("@@@" + cls + "\\n" + res + "\\n@@@END\\n"); } } }`);
const files = cp.execSync(`find ${dir} -name "*.java"`).toString().trim().split("\n");
fs.writeFileSync(path.join(dir, "sources.txt"), files.join("\n"));
try { cp.execSync(`cd ${dir} && javac -encoding UTF-8 -nowarn -d out @sources.txt 2>&1`, { stdio: "pipe" }); }
catch (e) { console.log("COMPILE ERROR\n" + e.stdout.toString().split("\n").filter(l => !l.includes("JAVA_TOOL")).slice(0, 40).join("\n")); process.exit(1); }
const out = cp.execSync(`cd ${dir} && java -Dfile.encoding=UTF-8 -cp out Runner ${cases.map(c => c.main).join(" ")} 2>/dev/null`, { maxBuffer: 1 << 28 }).toString();
const res = {}; out.split("@@@END\n").forEach(chunk => { const m = chunk.match(/^@@@(\S+)\n([\s\S]*)\n$/); if (m) res[m[1]] = m[2]; });
let bad = 0; const stat = {};
for (const c of cases) {
  const got = res[c.main]; const key = c.kind + ":" + c.t.gen; stat[key] = stat[key] || [0, 0]; stat[key][0]++;
  let ok;
  if (c.kind === "program") ok = got !== undefined && got.replace(/\n$/, "") === c.t.out;
  else if (c.kind === "trace") ok = got !== undefined && got.replace(/\n$/, "") === c.t.out.replace(/\n$/, "");
  else if (c.kind === "write") ok = got && /(\d+) von \1 Tests bestanden\./.test(got) && !got.includes("FEHLER");
  else ok = got !== undefined && /Tests bestanden\./.test(got);
  if (!ok) { stat[key][1]++; if (bad++ < 6) console.log("MISMATCH", key, c.pkg, "\n--- code ---\n" + (c.t.code || c.t.title) + "\n--- erwartet ---\n" + JSON.stringify(c.t.out) + "\n--- erhalten ---\n" + JSON.stringify(got && got.slice(0, 1500))); }
}
Object.keys(stat).forEach(k => console.log(k.padEnd(28), "geprüft", String(stat[k][0]).padStart(4), " Fehler", stat[k][1]));
console.log(bad ? "FEHLER: " + bad : "ALLES OK: " + cases.length + " Fälle");
