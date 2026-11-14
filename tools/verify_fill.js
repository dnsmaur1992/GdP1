// Prüft jeden Lückencode gegen echtes Java:
//  - Musterlösung (jeweils erste Antwort je Lücke) einsetzen, kompilieren, ausführen → Ausgabe wird gespeichert
//  - jede alternative Antwort einzeln einsetzen → muss kompilieren und dieselbe Ausgabe liefern
//  - Lückentexte: Anzahl Marker == Anzahl Lücken
// Ergebnis: fillout.js (erwartete Ausgaben für die App)
const fs = require("fs"), path = require("path"), cp = require("child_process"), os = require("os");
const here = fs.existsSync(path.join(__dirname, "read1.js")) ? __dirname : path.join(__dirname, "..", "src");   // lokal oder im Repo (tools/ → src/)
const files = (process.argv[2] ? process.argv.slice(2) : ["read1.js", "read2.js", "read3.js"]).map(f => path.isAbsolute(f) ? f : path.join(here, f)).filter(f => fs.existsSync(f));
let READ = {}; const ctx = { READ };
files.forEach(f => { new Function("READ", fs.readFileSync(f, "utf8") + "\n;return READ;")(READ); });
const dir = path.join(os.tmpdir(), "nibble-fill"); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
const MARK = /\[\[(\d+)\]\]/g;
let problems = [], cases = [], n = 0;

function fillIn(s, ans) { return (s || "").replace(MARK, (_, i) => ans[+i]); }
function build(key, f, ans, pkg) {
  const imp = (f.imports || []).map(i => "import " + i + ";\n").join("");
  const head = "package " + pkg + ";\n" + imp;
  const pre = fillIn(f.pre, ans), code = fillIn(f.code, ans), run = fillIn(f.run, ans);
  if (f.wrap === "program") {
    const m = code.match(/public\s+class\s+(\w+)/); if (!m) throw new Error(key + ": program ohne public class");
    return { files: [[m[1] + ".java", head + code]], main: pkg + "." + m[1] };
  }
  if (f.wrap === "main") {
    return { files: [["F.java", head + "public class F {\n" + pre + "\npublic static void main(String[] args) throws Exception {\n" + code + "\n}\n}\n"]], main: pkg + ".F" };
  }
  if (f.wrap === "class") {
    const cls = (pre + "\n" + code).replace(/public\s+(abstract\s+|final\s+)?(class|enum|interface)/g, "$1$2");
    return { files: [["F.java", head + cls + "\npublic class F {\npublic static void main(String[] args) throws Exception {\n" + run + "\n}\n}\n"]], main: pkg + ".F" };
  }
  throw new Error(key + ": unbekanntes wrap " + f.wrap);
}

for (const key of Object.keys(READ)) {
  const f = READ[key].fill; if (!f) continue;
  const all = (f.pre || "") + (f.code || "") + (f.run || "") + (f.text || "");
  const marks = new Set([...all.matchAll(MARK)].map(m => +m[1]));
  if (marks.size !== f.gaps.length || [...marks].some(i => i >= f.gaps.length)) problems.push(key + ": Marker " + [...marks].join(",") + " passen nicht zu " + f.gaps.length + " Lücken");
  if (f.kind !== "java") continue;
  const canon = f.gaps.map(g => g[0]);
  const pkg = "f" + (n++); const b = build(key, f, canon, pkg);
  cases.push({ key, pkg, main: b.main, files: b.files, canon: true });
  f.gaps.forEach((g, j) => g.slice(1).forEach(alt => {
    const ans = canon.slice(); ans[j] = alt; const p = "f" + (n++); const bb = build(key, f, ans, p);
    cases.push({ key, pkg: p, main: bb.main, files: bb.files, alt: "Lücke " + j + " = " + alt });
  }));
}
cases.forEach(c => { const d = path.join(dir, c.pkg); fs.mkdirSync(d); c.files.forEach(([name, src]) => fs.writeFileSync(path.join(d, name), src)); });
fs.writeFileSync(path.join(dir, "R.java"), `
import java.io.*;
public class R { public static void main(String[] a) throws Exception { PrintStream orig = System.out;
 for (String cls : a) { ByteArrayOutputStream b = new ByteArrayOutputStream(); PrintStream ps = new PrintStream(b, true, "UTF-8"); System.setOut(ps);
  Thread t = new Thread(() -> { try { Class.forName(cls).getMethod("main", String[].class).invoke(null, (Object) new String[0]); } catch (Throwable e) { ps.println("!!EXCEPTION " + (e.getCause() != null ? e.getCause() : e)); } });
  t.setDaemon(true); t.start(); t.join(3000); String r = b.toString("UTF-8"); if (t.isAlive()) r += "!!TIMEOUT";
  System.setOut(orig); System.out.print("@@@" + cls + "\\n" + r + "@@@END\\n"); } System.exit(0); } }`);
const srcs = cp.execSync(`find ${dir} -name "*.java"`).toString().trim().split("\n");
// Einzeln aussortieren, was nicht kompiliert (mit Meldung)
let bad = new Set();
for (let k = 0; k < 30; k++) {
  fs.writeFileSync(path.join(dir, "src.txt"), srcs.filter(f => ![...bad].some(p => f.includes("/" + p + "/"))).join("\n"));
  try { cp.execSync(`cd ${dir} && javac -encoding UTF-8 -nowarn -Xmaxerrs 10000 -d out @src.txt 2>&1`); break; }
  catch (e) {
    const msg = e.stdout.toString();
    const hit = [...msg.matchAll(/\/(f\d+)\/\w+\.java:(\d+): error: ([^\n]*)/g)];
    if (!hit.length) { console.log(msg.slice(0, 2000)); process.exit(1); }
    hit.forEach(h => { if (!bad.has(h[1])) { bad.add(h[1]); const c = cases.find(x => x.pkg === h[1]); problems.push(c.key + (c.alt ? " [" + c.alt + "]" : " [Musterlösung]") + " kompiliert nicht: " + h[3]); } });
  }
}
const run = cases.filter(c => !bad.has(c.pkg));
const out = cp.execSync(`cd ${dir} && javac -d out R.java && java -Dfile.encoding=UTF-8 -Dstdout.encoding=UTF-8 -cp out R ${run.map(c => c.main).join(" ")} 2>/dev/null`, { maxBuffer: 1 << 26 }).toString();
const res = {}; out.split("@@@END\n").forEach(ch => { const m = ch.match(/^@@@(\S+)\n([\s\S]*)$/); if (m) res[m[1]] = m[2]; });
const FILLOUT = {};
run.filter(c => c.canon).forEach(c => {
  const o = res[c.main];
  if (o === undefined || /!!(EXCEPTION|TIMEOUT)/.test(o)) problems.push(c.key + " [Musterlösung] Laufzeitfehler: " + (o || "").slice(0, 200));
  else FILLOUT[c.key] = o;
});
run.filter(c => !c.canon).forEach(c => {
  const o = res[c.main];
  if (FILLOUT[c.key] !== undefined && o !== FILLOUT[c.key]) problems.push(c.key + " [" + c.alt + "] andere Ausgabe: " + JSON.stringify((o || "").slice(0, 120)) + " statt " + JSON.stringify(FILLOUT[c.key].slice(0, 120)));
});
fs.writeFileSync(path.join(here, "fillout.js"), "// automatisch erzeugt von verify_fill.js – erwartete Ausgaben der Lückencodes (mit javac/java ermittelt)\nvar FILLOUT = " + JSON.stringify(FILLOUT, null, 0) + ";\n");
const javaN = Object.keys(READ).filter(k => READ[k].fill && READ[k].fill.kind === "java").length;
const textN = Object.keys(READ).filter(k => READ[k].fill && READ[k].fill.kind === "text").length;
console.log("Lesetexte:", Object.keys(READ).length, "· Lückencode (Java):", javaN, "· Lückentexte:", textN, "· Java-Varianten geprüft:", cases.length);
if (problems.length) { console.log("PROBLEME:\n - " + problems.join("\n - ")); process.exit(1); }
console.log("ALLES OK");
