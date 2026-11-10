// ======================================================================
//  nibble – App-Logik: Lernpfad entlang des Lehrplans
// ======================================================================
var ORDER = ["EIP","PUP","PJA","EJP","VAR","STA","OBJ","KLA","VER","ITR","VRB","EXC","ARR","ZKT"];
CONTENT.sort(function(a,b){ return ORDER.indexOf(a.id) - ORDER.indexOf(b.id); });
CONTENT.forEach(function(c){ c.nibbles.forEach(function(n, i){ n.key = c.id + "-" + i; n.chap = c; }); });
var UNIT = {}; UNITS.forEach(function(u){ u.chap = CONTENT.filter(function(c){ return c.id === u.id; })[0]; UNIT[u.id] = u; });
var GENS = {}; GEN.CATS.forEach(function(c){ c.list.forEach(function(g){ GENS[g.id] = { cat: c.id, def: g }; }); });
function genTitle(id) { var g = GENS[id]; return g ? g.def.title : id; }
function genUnit(id) { for (var i = 0; i < UNITS.length; i++) if (UNITS[i].gens.indexOf(id) >= 0) return UNITS[i].id; return null; }

var LOGO = '<svg viewBox="0 0 220 220" aria-hidden="true"><rect width="220" height="220" rx="52" fill="#16233A"/><path d="M58 78 L96 110 L58 142" fill="none" stroke="#E6EDF7" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><rect x="108" y="132" width="54" height="14" rx="7" fill="#3DDC97"/><circle cx="70" cy="176" r="7" fill="#3DDC97"/><circle cx="96" cy="176" r="7" fill="#3DDC97"/><circle cx="122" cy="176" r="7" fill="#2A3A55"/><circle cx="148" cy="176" r="7" fill="#2A3A55"/></svg>';

// ---------- Speicher (auf diesem Gerät) ----------
var KEY = "nibble-gp1-v1";
var S = { minutes: 20, done: {}, wrong: {}, days: [], answered: 0, correct: 0, mode: "path", exam: {}, efocus: null,
  box: {}, stats: {}, log: [], unit: null, prog: {}, checks: {}, medium: "papier", seen: {} };
try { var raw = localStorage.getItem(KEY); if (raw) Object.assign(S, JSON.parse(raw)); } catch (e) {}
Object.keys(S.wrong || {}).forEach(function(k){ if (!S.box[k]) S.box[k] = { b: 0, due: 0 }; }); S.wrong = {};
if (S.mode === "learn") S.mode = "path";
["prog", "checks", "seen", "box", "stats"].forEach(function(k){ if (!S[k] || typeof S[k] !== "object") S[k] = {}; });
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

// ---------- Hilfen ----------
function esc(s) { return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
function md(s) {
  return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}
function mdBlock(s) { // Absätze und "- "-Listen
  var out = [], list = null;
  s.split("\n").forEach(function(line){
    if (/^- /.test(line)) { if (!list) { list = []; } list.push("<li>" + md(line.slice(2)) + "</li>"); }
    else { if (list) { out.push('<ul class="tlist">' + list.join("") + "</ul>"); list = null; } if (line.trim()) out.push("<p>" + md(line) + "</p>"); }
  });
  if (list) out.push('<ul class="tlist">' + list.join("") + "</ul>");
  return out.join("");
}
function hl(code) {
  var kws = "public|private|protected|static|final|void|int|long|short|byte|double|float|char|boolean|class|enum|new|return|if|else|for|while|do|switch|case|default|break|continue|try|catch|throw|throws|extends|abstract|import|package|this|super|null|true|false|instanceof";
  return code.split("\n").map(function(line){
    var ci = line.indexOf("//"); var body = line, cm = "";
    if (ci >= 0 && !/"[^"]*\/\/[^"]*"/.test(line)) { body = line.slice(0, ci); cm = line.slice(ci); }
    var out = esc(body).replace(new RegExp("(&quot;.*?&quot;)|\\b(" + kws + ")\\b", "g"), function(m, str, kw){
      return str ? '<span class="st">' + str + '</span>' : '<span class="kw">' + kw + '</span>';
    });
    return out + (cm ? '<span class="cm">' + esc(cm) + '</span>' : "");
  }).join("\n");
}
function est(n) { return 3 + n.quiz.length + (n.task ? 5 : 0); }
function today() { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate(); }
function streak() {
  var set = {}; S.days.forEach(function(d){ set[d] = 1; });
  var n = 0, d = new Date();
  if (!set[today()]) d.setDate(d.getDate() - 1);
  while (true) { var k = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate(); if (!set[k]) break; n++; d.setDate(d.getDate() - 1); }
  return n;
}
function allNibbles() { var a = []; CONTENT.forEach(function(c){ a = a.concat(c.nibbles); }); return a; }
function byKey(k) { var p = k.split("-"); var c = CONTENT.filter(function(x){ return x.id === p[0]; })[0]; return c && c.nibbles[+p[1]]; }
function seed() { return Math.floor(Math.random() * 2147483646) + 1; }
function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

// ---------- Lernsystem: Wiederholung mit wachsenden Abständen ----------
var GAPS = [0, 1, 3, 7, 14, 30];   // Tage bis zur nächsten Wiederholung je Stufe
function dayNum() { var d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000); }
function isDue(k) { return S.box[k] && S.box[k].due <= dayNum(); }
function record(itemKey, concept, ok, detail) {
  var b = S.box[itemKey] || { b: 0, due: 0 };
  b.b = ok ? Math.min(b.b + 1, GAPS.length - 1) : 0;
  b.due = dayNum() + (ok ? GAPS[b.b] : 0);
  S.box[itemKey] = b; S.seen[itemKey] = dayNum();
  var st = S.stats[concept] || { n: 0, w: 0, ema: 0, last: 0 };
  st.n++; if (!ok) { st.w++; st.last = Date.now(); }
  st.ema = st.ema * 0.6 + (ok ? 0 : 1) * 0.4;
  S.stats[concept] = st;
  if (!ok && detail) { detail.c = concept; detail.ts = Date.now(); S.log.unshift(detail); S.log = S.log.slice(0, 60); }
  if (sess) { sess.total++; if (ok) sess.right++; sess.concepts[concept] = (sess.concepts[concept] || 0) + (ok ? 0 : 1); }
  save();
}
function weakSpots() {
  return Object.keys(S.stats).filter(function(k){ var s = S.stats[k]; return s.w > 0 && s.ema >= 0.15 && byKey(k); })
    .sort(function(a, b){ return S.stats[b].ema - S.stats[a].ema || S.stats[b].w - S.stats[a].w; });
}
function dueCount() { return Object.keys(S.box).filter(isDue).length; }

// ---------- Fortschritt je Lerneinheit ----------
var PROG_TARGET = 3, CHECK_PASS = 0.8;
function learnStat(u) { var ns = UNIT[u].chap.nibbles; return { done: ns.filter(function(n){ return S.done[n.key]; }).length, total: ns.length }; }
function progStat(u) { var t = UNIT[u].gens.length ? PROG_TARGET : 0; return { done: Math.min(S.prog[u] || 0, t), total: t }; }
function checkStat(u) { return S.checks[u] || { best: 0, passed: false }; }
function unitDone(u) { var l = learnStat(u), p = progStat(u); return l.done === l.total && p.done >= p.total && checkStat(u).passed; }
function nextUnit() { for (var i = 0; i < UNITS.length; i++) if (!unitDone(UNITS[i].id)) return UNITS[i].id; return UNITS[UNITS.length - 1].id; }
function unitStage(u) {
  var l = learnStat(u), p = progStat(u), c = checkStat(u);
  if (l.done < l.total) return { id: "learn", text: "Lernen · " + l.done + "/" + l.total + " Häppchen" };
  if (p.done < p.total) return { id: "prog", text: "Programmieren · " + p.done + "/" + p.total + " Aufgaben" };
  if (!c.passed) return { id: "check", text: "Kapitel-Check steht an" };
  return { id: "done", text: "Abgeschlossen – Vertiefung und Wiederholung" };
}
function unitItems(u) { // alles, was zu einer Einheit abgefragt werden kann
  var it = [];
  UNIT[u].chap.nibbles.forEach(function(n){ n.quiz.forEach(function(_, i){ it.push({ type: "q", key: n.key + "|" + i, n: n, qi: i }); }); });
  EXAM.forEach(function(e){ if (e.rel.split("-")[0] === u && (e.type === "tf" || e.type === "trace")) it.push({ type: "exam", key: "ex:" + e.id, e: e }); });
  UNIT[u].gens.forEach(function(g){ if (GENS[g] && GENS[g].cat === "trace") it.push({ type: "gen", key: "g:" + g, gen: g }); });
  return it;
}
var COSTQ = { q: 1, exam: 1, gen: 4 };

// ---------- Sessions planen ----------
// 1) Fällige Wiederholungen  2) Rückblick auf abgeschlossene Einheiten  3) Arbeit an der gewählten Einheit
function itemFromKey(k) {
  if (k.indexOf("ex:") === 0) { var e = EXAM.filter(function(x){ return "ex:" + x.id === k; })[0]; return e ? { type: "exam", key: k, e: e } : null; }
  if (k.indexOf("g:") === 0) { var g = k.slice(2); return GENS[g] ? { type: "gen", key: k, gen: g } : null; }
  var p = k.split("|"), n = byKey(p[0]); return n && n.quiz[+p[1]] ? { type: "q", key: k, n: n, qi: +p[1] } : null;
}
function planUnit(u, minutes) {
  var items = [], used = 0, seenKeys = {};
  function add(it, cost, tag) { if (!it || seenKeys[it.key]) return false; seenKeys[it.key] = 1; it.tag = tag; items.push(it); used += cost; return true; }
  // 1) fällige Wiederholungen (max. ein Viertel der Zeit)
  var revBudget = Math.max(2, Math.round(minutes * 0.25));
  Object.keys(S.box).filter(isDue).sort(function(a, b){ return S.box[a].b - S.box[b].b; }).forEach(function(k){
    if (used >= revBudget) return; var it = itemFromKey(k); if (!it) return;
    if (it.type === "gen" && GENS[it.gen].cat !== "trace") return; // Schreibaufgaben kommen über die Einheit
    add(it, COSTQ[it.type], "rev");
  });
  // 2) Rückblick: abgeschlossene Einheiten (am längsten nicht gesehen zuerst)
  var doneUnits = UNITS.filter(function(x){ return x.id !== u && unitDone(x.id); });
  if (doneUnits.length) {
    var pool = []; doneUnits.forEach(function(x){ pool = pool.concat(unitItems(x.id)); });
    pool = shuffle(pool).sort(function(a, b){ return (S.seen[a.key] || 0) - (S.seen[b.key] || 0); });
    var rb = Math.max(2, Math.round(minutes * 0.2)), r0 = used;
    for (var i = 0; i < pool.length && used - r0 < rb; i++) if (!S.box[pool[i].key] || !isDue(pool[i].key)) add(pool[i], COSTQ[pool[i].type], "back");
  }
  // 3) Einheit
  var st = unitStage(u).id;
  if (st === "learn") {
    var ns = UNIT[u].chap.nibbles.filter(function(n){ return !S.done[n.key]; });
    for (var j = 0; j < ns.length; j++) { var m = est(ns[j]); if (used + m > minutes && items.some(function(x){ return x.type === "nibble"; })) break; items.push({ type: "nibble", n: ns[j], key: ns[j].key }); used += m; if (used >= minutes) break; }
  }
  if (st === "prog" || st === "done" || (st === "learn" && used < minutes - 6 && UNIT[u].gens.length && learnStat(u).done > 0)) {
    var gens = shuffle(UNIT[u].gens);
    for (var k = 0; used < minutes && k < 6; k++) {
      var g = gens[k % gens.length]; if (!g) break;
      var cost = GENS[g].cat === "trace" ? 4 : (GENS[g].def.mins || 10);
      if (used + cost > minutes + 3 && items.some(function(x){ return x.type === "task"; })) break;
      items.push({ type: "task", gen: g, key: "g:" + g }); used += Math.min(cost, 10);
    }
  }
  if (st === "check" && used < minutes) items.push({ type: "check", key: "check:" + u });
  return { items: items, minutes: used };
}

// ---------- Klausurtraining ----------
var COST = { tf: 1, trace: 4, explain: 3, write: 8 };
function examRank(e) { var b = S.box["ex:" + e.id]; if (!b) return 1; if (b.due > dayNum()) return 3; return b.b === 0 ? 0 : 2; }
function planExam(minutes) {
  var secs = S.efocus ? [S.efocus] : SECTIONS.map(function(s){ return s.id; });
  var pools = {};
  secs.forEach(function(id){
    pools[id] = EXAM.filter(function(e){ return e.sec === id; }).map(function(e, i){ return { e: e, r: examRank(e), i: i }; })
      .sort(function(a, b){ return a.r - b.r || a.i - b.i; }).filter(function(x){ return x.r < 3; }).map(function(x){ return x.e; });
  });
  var rot = (S.eruns || 0) % secs.length; secs = secs.slice(rot).concat(secs.slice(0, rot));
  var picked = [], used = 0, progress = true, round = 0;
  while (used < minutes && progress) {
    progress = false;
    secs.forEach(function(id){
      if (used >= minutes) return;
      var take = id === "A1" ? (round === 0 ? 4 : 2) : 1;
      for (var k = 0; k < take; k++) {
        var left = minutes - used, idx = -1;
        for (var j = 0; j < pools[id].length; j++) { if (COST[pools[id][j].type] <= left) { idx = j; break; } }
        if (idx < 0 && !picked.length && pools[id].length) idx = 0;
        if (idx < 0) break;
        var e = pools[id].splice(idx, 1)[0]; picked.push(e); used += COST[e.type]; progress = true;
      }
    });
    round++;
  }
  picked.sort(function(a, b){ return a.sec < b.sec ? -1 : a.sec > b.sec ? 1 : 0; });
  return { items: picked, minutes: used };
}
function secTitle(id) { return SECTIONS.filter(function(s){ return s.id === id; })[0].title; }

// ---------- Ansichten ----------
var app = document.getElementById("app");
var timer = null, sess = null;
function header() {
  return '<header class="top">' + LOGO + '<div class="brand"><b>nibble<span>_</span></b><small>Grundlagen der Programmierung 1</small></div><img id="partnerLogo" alt="Logo" hidden></header>';
}
function applyPartner() { var img = document.getElementById("partnerLogo"); if (img && PARTNER_LOGO) { img.src = PARTNER_LOGO; img.hidden = false; } }
function render(h) { app.innerHTML = h; applyPartner(); window.scrollTo(0, 0); }
function timePicker() {
  return '<div class="timepick"><output id="minOut" for="min">' + S.minutes + '</output><span>Minuten</span></div>' +
    '<input type="range" id="min" min="10" max="45" step="5" value="' + S.minutes + '" aria-label="Lernzeit in Minuten">' +
    '<div class="ticks"><span>10</span><span>15</span><span>20</span><span>25</span><span>30</span><span>35</span><span>40</span><span>45</span></div>';
}
function bindTime(onChange) {
  var r = document.getElementById("min");
  r.addEventListener("input", function(){ S.minutes = +r.value; document.getElementById("minOut").textContent = r.value; save(); if (onChange) onChange(); });
}
function pill(u) {
  if (unitDone(u)) return '<span class="pill ok">fertig</span>';
  var l = learnStat(u); if (l.done > 0 || (S.prog[u] || 0) > 0) return '<span class="pill">läuft</span>';
  return '';
}
function stageBar(u) {
  var l = learnStat(u), p = progStat(u), c = checkStat(u);
  var seg = [l.done / l.total, p.total ? p.done / p.total : null, c.passed ? 1 : (c.best ? 0.5 : 0)];
  return '<span class="stages">' + seg.filter(function(x){ return x !== null; }).map(function(x){ return '<i><b style="width:' + Math.round(x * 100) + '%"></b></i>'; }).join("") + '</span>';
}

function home() {
  clearInterval(timer); sess = null;
  if (!S.unit || !UNIT[S.unit]) S.unit = nextUnit();
  var ex = S.mode === "exam", cd = S.mode === "code";
  var h = header() + '<div class="seg three" role="group" aria-label="Modus"><button id="mPath" aria-pressed="' + (!ex && !cd) + '">Lernpfad</button><button id="mCode" aria-pressed="' + cd + '">Programmieren</button><button id="mExam" aria-pressed="' + ex + '">Klausur</button></div>';
  if (!ex && !cd) h += planCard();
  if (ex) h += examHome(); else if (cd) h += codeHome(); else h += pathHome();
  h += weakPanel(3);
  h += '<div class="foot">Fortschritt wird auf diesem Gerät gespeichert.<br><button class="linkbtn" id="exp">Fortschritt sichern</button>' +
    '<label class="linkbtn" for="imp" style="display:inline-block;cursor:pointer">Fortschritt laden</label><input type="file" id="imp" accept=".json,application/json" hidden>' +
    '<button class="linkbtn" id="reset">Zurücksetzen</button><div id="ioMsg" role="status" class="hint"></div></div>';
  render(h);
  document.getElementById("mPath").onclick = function(){ S.mode = "path"; save(); home(); };
  document.getElementById("mExam").onclick = function(){ S.mode = "exam"; save(); home(); };
  document.getElementById("mCode").onclick = function(){ S.mode = "code"; save(); home(); };
  if (ex) bindExamHome(); else if (cd) bindCodeHome(); else { bindPathHome(); bindPlanCard(); }
  bindWeak(); var wa = document.getElementById("weakAll"); if (wa) wa.onclick = weakView;
  bindIO();
  var rs = document.getElementById("reset");
  rs.onclick = function(){
    if (rs.dataset.armed) { var keep = { minutes: S.minutes, medium: S.medium, examDate: S.examDate }; S = Object.assign({ done: {}, wrong: {}, days: [], answered: 0, correct: 0, mode: "path", exam: {}, efocus: null, box: {}, stats: {}, log: [], unit: null, prog: {}, checks: {}, seen: {} }, keep); save(); home(); }
    else { rs.dataset.armed = 1; rs.textContent = "Wirklich alles zurücksetzen? Nochmal tippen"; }
  };
}

function pathHome() {
  var u = S.unit, U = UNIT[u], st = unitStage(u), p = planUnit(u, S.minutes), sug = nextUnit();
  var doneN = UNITS.filter(function(x){ return unitDone(x.id); }).length;
  var h = (examPlan().finalPhase ? '<button class="btn" id="toExam">Endspurt: Klausurtraining starten</button>' : '') + '<section class="panel hero" aria-labelledby="h-now"><span class="label" id="h-now">' + (u === sug ? "Als Nächstes im Lehrplan" : "Gewählte Lerneinheit") + '</span>' +
    '<button class="unitlink" id="openUnit"><span class="code big">' + u + '</span><span><b>' + esc(U.chap.title) + '</b><br><span class="hint">' + st.text + '</span></span><span aria-hidden="true">›</span></button>' +
    timePicker() + '<div class="plan" id="plan">' + planUnitHtml(p) + '</div>' +
    '<button class="btn" id="go">Session starten</button>' +
    (U.gens.length ? '<button class="btn ghost" id="goCode">Nur Programmieren: Aufgabe aus ' + u + '</button>' : '') +
    (u !== sug ? '<button class="linkbtn" id="toSug" style="align-self:flex-start">Zurück zum Lehrplan: ' + sug + '</button>' : '') + '</section>';
  h += '<section class="panel stats" aria-label="Fortschritt"><div class="stat"><b>' + doneN + '/' + UNITS.length + '</b><small>Einheiten fertig</small></div>' +
    '<div class="stat"><b>' + dueCount() + '</b><small>heute fällig</small></div><div class="stat"><b>' + streak() + '</b><small>Tage in Folge</small></div></section>';
  h += '<section class="panel" aria-labelledby="h-lp"><span class="label" id="h-lp">Lehrplan · Einheit antippen</span><div class="chapters">';
  UNITS.forEach(function(x){
    h += '<button class="chap' + (x.id === u ? " focus" : "") + '" data-u="' + x.id + '"><span class="code">' + x.id + '</span>' +
      '<span><span class="name">' + esc(x.chap.title) + '</span>' + stageBar(x.id) + '</span><span class="pct">' + pill(x.id) + '</span></button>';
  });
  return h + '</div><p class="hint">Balken: Lernen · Programmieren · Kapitel-Check. Abgeschlossene Einheiten kommen als Rückblick in späteren Sessions wieder.</p></section>';
}
function planUnitHtml(p) {
  var rev = p.items.filter(function(x){ return x.tag === "rev"; }).length, back = p.items.filter(function(x){ return x.tag === "back"; }).length;
  var h = '';
  if (rev) h += '<div><span class="tag rev">Wdh.</span><span>' + rev + ' fällige Wiederholung' + (rev > 1 ? "en" : "") + '</span></div>';
  if (back) h += '<div><span class="tag">Rückblick</span><span>' + back + ' Frage' + (back > 1 ? "n" : "") + ' aus abgeschlossenen Einheiten</span></div>';
  p.items.forEach(function(x){
    if (x.type === "nibble") h += '<div><span class="tag">Lernen</span><span>' + esc(x.n.t) + '</span></div>';
    if (x.type === "task") h += '<div><span class="tag">Code</span><span>' + esc(genTitle(x.gen)) + '</span></div>';
    if (x.type === "check") h += '<div><span class="tag">Check</span><span>Kapitel-Check ' + S.unit + ' (≥ 80 % zum Abschließen)</span></div>';
  });
  return h || '<p class="muted">Nichts geplant.</p>';
}
function bindPathHome() {
  bindTime(function(){ document.getElementById("plan").innerHTML = planUnitHtml(planUnit(S.unit, S.minutes)); });
  document.getElementById("go").onclick = function(){ startUnit(S.unit); };
  document.getElementById("openUnit").onclick = function(){ unitView(S.unit); };
  var te = document.getElementById("toExam"); if (te) te.onclick = function(){ S.mode = "exam"; save(); home(); };
  var gc = document.getElementById("goCode"); if (gc) gc.onclick = function(){ startTasks([shuffle(UNIT[S.unit].gens)[0]], S.unit); };
  var ts = document.getElementById("toSug"); if (ts) ts.onclick = function(){ S.unit = nextUnit(); save(); home(); };
  app.querySelectorAll("[data-u]").forEach(function(b){ b.onclick = function(){ S.unit = b.dataset.u; save(); unitView(b.dataset.u); }; });
}

// ---------- Klausurplan: Zieldaten bis zur Klausur ----------
var WEIGHT = { EIP: 1, PUP: 1, PJA: 1, EJP: 1, VAR: 2, STA: 2, OBJ: 1.5, KLA: 3, VER: 2, ITR: 3, VRB: 3, EXC: 2, ARR: 3, ZKT: 2 };
var FINAL_DAYS = 14; // die letzten zwei Wochen: Klausurtraining und Wiederholung
function dateOf(dn) { return new Date(dn * 86400000); }
function dnOf(iso) { var p = iso.split("-"); return Math.floor(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000); }
function fmtDate(dn) { var d = dateOf(dn); return ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"][d.getUTCDay()] + " " + String(d.getUTCDate()).padStart(2, "0") + "." + String(d.getUTCMonth() + 1).padStart(2, "0") + "."; }
function examPlan() {
  if (!S.examDate) S.examDate = "2027-01-28";
  if (!S.planStart) { S.planStart = dayNum(); save(); }
  var exam = dnOf(S.examDate), start = S.planStart, learnEnd = exam - FINAL_DAYS;
  var total = 0; ORDER.forEach(function(u){ total += WEIGHT[u]; });
  var acc = 0, due = {};
  ORDER.forEach(function(u){ acc += WEIGHT[u]; due[u] = Math.round(start + (learnEnd - start) * acc / total); });
  var today = dayNum();
  var behind = ORDER.filter(function(u){ return due[u] < today && !unitDone(u); });
  var thisWeek = ORDER.filter(function(u){ return !unitDone(u) && due[u] >= today && due[u] < today + 7; });
  return { exam: exam, left: exam - today, learnEnd: learnEnd, due: due, behind: behind, thisWeek: thisWeek, finalPhase: today >= learnEnd };
}
// Klausurreife: grobe Schätzung aus abgeschlossenen Einheiten, sicheren Klausuraufgaben, Programmierpraxis und offenen Baustellen
function readiness() {
  var units = UNITS.filter(function(u){ return unitDone(u.id); }).length / UNITS.length;
  var exam = EXAM.filter(function(e){ var b = S.box["ex:" + e.id]; return b && b.b >= 2; }).length / EXAM.length;
  var solved = 0; Object.keys(S.prog).forEach(function(k){ solved += S.prog[k]; });
  var prog = Math.min(1, solved / 60);
  var weak = weakSpots().length, weakPen = Math.min(0.15, weak * 0.02);
  var score = Math.max(0, 0.35 * units + 0.3 * exam + 0.35 * prog - weakPen);
  var todo = [];
  if (units < 1) todo.push((UNITS.length - Math.round(units * UNITS.length)) + " Einheiten abschließen");
  if (prog < 1) todo.push("noch " + Math.max(0, 60 - solved) + " Programmieraufgaben (viele davon auf Papier)");
  if (exam < 1) todo.push(Math.round((1 - exam) * EXAM.length) + " Klausuraufgaben mehrfach sicher lösen");
  if (weak) todo.push(weak + " Baustelle" + (weak > 1 ? "n" : "") + " schließen");
  return { pct: Math.round(score * 100), todo: todo };
}
function planCard() {
  var P = examPlan(), R = readiness();
  var h = '<section class="panel plancard" aria-labelledby="h-plan"><div class="weak-h"><span class="label" id="h-plan" style="flex:1">Klausur ' + fmtDate(P.exam) + ' · Ziel 1,0</span><span class="pill' + (P.behind.length ? " hot" : " ok") + '">' + (P.left >= 0 ? "noch " + P.left + " Tage" : "vorbei") + '</span></div>';
  if (P.finalPhase) h += '<p><b>Endspurt:</b> Jetzt täglich Klausurtraining und Baustellen. Schreib die Probeklausur ca. 4 Tage vorher einmal unter echten Bedingungen (nur Papier, Zeit stoppen).</p>';
  else if (P.behind.length) h += '<p><b>' + P.behind.length + ' Einheit' + (P.behind.length > 1 ? "en" : "") + ' hinter dem Plan:</b> ' + P.behind.join(", ") + '. Plane diese Woche zusätzliche Sessions ein.</p>';
  else h += '<p><b>Im Plan.</b> ' + (P.thisWeek.length ? "Diese Woche dran: " + P.thisWeek.map(function(u){ return u + " (bis " + fmtDate(P.due[u]) + ")"; }).join(", ") + "." : "Nächste Einheit: " + nextUnit() + " bis " + fmtDate(P.due[nextUnit()]) + ".") + '</p>';
  h += '<div class="ready"><div class="bar"><i style="width:' + Math.max(2, R.pct) + '%"></i></div><span class="mono">' + R.pct + ' %</span></div><p class="hint">Klausurreife – Schätzung aus deinem Fortschritt' + (R.todo.length ? '. Noch offen: ' + R.todo.slice(0, 3).join(" · ") : '') + '</p>' +
    '<details><summary class="hint">Zeitplan und Klausurdatum</summary><ol class="tlist num">' + ORDER.map(function(u){ return '<li>' + u + ' bis ' + fmtDate(P.due[u]) + (unitDone(u) ? ' ✓' : '') + '</li>'; }).join("") + '<li>Ab ' + fmtDate(P.learnEnd) + ': Klausurtraining, Probeklausur, Wiederholung</li></ol>' +
    '<label class="hint" for="exDate">Klausurdatum</label> <input type="date" id="exDate" value="' + S.examDate + '"> <button class="linkbtn" id="replan">Plan ab heute neu verteilen</button></details></section>';
  return h;
}
function bindPlanCard() {
  var d = document.getElementById("exDate"); if (!d) return;
  d.onchange = function(){ if (d.value) { S.examDate = d.value; save(); home(); } };
  document.getElementById("replan").onclick = function(){ S.planStart = dayNum(); save(); home(); };
}

// ---------- Einheiten-Ansicht ----------
function unitView(u) {
  clearInterval(timer); sess = null;
  var U = UNIT[u], l = learnStat(u), p = progStat(u), c = checkStat(u);
  var h = header() + '<button class="btn ghost back" id="back">← Übersicht</button>' +
    '<section class="panel"><span class="label">' + u + ' · Lerneinheit ' + (ORDER.indexOf(u) + 1) + ' von ' + ORDER.length + '</span><h2>' + esc(U.chap.title) + '</h2>' +
    (unitDone(u) ? '<p class="pill ok" style="align-self:flex-start">abgeschlossen</p>' : '') + '</section>';
  h += '<section class="panel"><div class="stage"><span class="num">1</span><div><b>Lernen</b><p class="hint">' + l.done + ' von ' + l.total + ' Häppchen mit Quiz</p></div><button class="btn small" id="sLearn">' + (l.done < l.total ? "Weiter" : "Wiederholen") + '</button></div>';
  if (p.total) {
    h += '<div class="stage"><span class="num">2</span><div><b>Programmieren</b><p class="hint">' + p.done + ' von ' + p.total + ' Aufgaben gelöst · danach unbegrenzt weiterüben</p></div><button class="btn small" id="sProg">Aufgabe</button></div>' +
      '<div class="chips">' + U.gens.map(function(g){ return '<button class="chip" data-g="' + g + '">' + esc(genTitle(g)) + '</button>'; }).join("") + '</div>';
  }
  h += '<div class="stage"><span class="num">' + (p.total ? 3 : 2) + '</span><div><b>Kapitel-Check</b><p class="hint">' + (c.passed ? "Bestanden (" + Math.round(c.best * 100) + " %)" : c.best ? "Bestes Ergebnis " + Math.round(c.best * 100) + " % – 80 % nötig" : "Gemischter Test, 80 % zum Abschließen") + '</p></div><button class="btn small" id="sCheck">Check</button></div></section>';
  if (U.esa.length) {
    h += '<section class="panel"><h2 style="font-size:20px">Einsendeaufgaben vorbereiten</h2><p class="hint">Die Original-Aufgaben löst du selbst. Hier trainierst du genau die Bausteine, die sie verlangen – mit eigenen, ähnlichen Übungen.</p>';
    U.esa.forEach(function(e){
      h += '<div class="esa"><b>' + e.id + ' · ' + esc(e.title) + '</b><ul class="tlist">' + e.skills.map(function(s){ return "<li>" + md(s) + "</li>"; }).join("") + '</ul>' +
        '<div class="chips">' + e.gens.map(function(g){ return '<button class="chip" data-g="' + g + '">Üben: ' + esc(genTitle(g)) + '</button>'; }).join("") + '</div></div>';
    });
    h += '</section>';
  }
  render(h);
  document.getElementById("back").onclick = home;
  document.getElementById("sLearn").onclick = function(){ startLearn(u); };
  var sp = document.getElementById("sProg"); if (sp) sp.onclick = function(){ startTasks([shuffle(U.gens)[0]], u); };
  document.getElementById("sCheck").onclick = function(){ startCheck(u); };
  app.querySelectorAll("[data-g]").forEach(function(b){ b.onclick = function(){ startTasks([b.dataset.g], u); }; });
}

// ---------- Sessions starten ----------
function newSess(steps, mins, extra) {
  sess = Object.assign({ steps: steps, i: 0, end: Date.now() + mins * 60000, right: 0, total: 0, nibs: 0, tasksOk: 0, warned: false, started: Date.now(), concepts: {} }, extra || {});
  if (S.days.indexOf(today()) < 0) S.days.push(today());
  save(); clearInterval(timer); timer = setInterval(tick, 1000); step();
}
function nibbleSteps(n) {
  var st = [{ k: "learn", n: n }]; n.quiz.forEach(function(_, i){ st.push({ k: "q", n: n, qi: i }); });
  if (n.task) st.push({ k: "task", n: n }); st.push({ k: "fin", n: n }); return st;
}
function genStep(g, u) { var cat = GENS[g].cat; return { k: "gen", t: GEN.make(cat, seed(), g), unit: u || genUnit(g) }; }
function itemStep(it) {
  if (it.type === "q") return { k: "q", n: it.n, qi: it.qi, review: it.tag };
  if (it.type === "exam") return { k: "exam", e: it.e, review: it.tag };
  if (it.type === "gen") { var s = genStep(it.gen); s.review = it.tag; return s; }
  return null;
}
function startUnit(u) {
  var p = planUnit(u, S.minutes), steps = [];
  p.items.forEach(function(it){
    if (it.type === "nibble") steps = steps.concat(nibbleSteps(it.n));
    else if (it.type === "task") steps.push(genStep(it.gen, u));
    else if (it.type === "check") steps = steps.concat(checkSteps(u));
    else { var s = itemStep(it); if (s) steps.push(s); }
  });
  newSess(steps, S.minutes, { unit: u, check: p.items.some(function(x){ return x.type === "check"; }) ? u : null });
}
function startLearn(u) {
  var ns = UNIT[u].chap.nibbles.filter(function(n){ return !S.done[n.key]; });
  if (!ns.length) ns = shuffle(UNIT[u].chap.nibbles).slice(0, 3);
  var steps = []; ns.slice(0, 4).forEach(function(n){ steps = steps.concat(nibbleSteps(n)); });
  newSess(steps, S.minutes, { unit: u });
}
function startTasks(gens, u) { newSess(gens.map(function(g){ return genStep(g, u); }), S.minutes, { unit: u, practice: true }); }
function checkSteps(u) {
  var qs = []; UNIT[u].chap.nibbles.forEach(function(n){ n.quiz.forEach(function(_, i){ qs.push({ k: "q", n: n, qi: i, check: true }); }); });
  var steps = shuffle(qs).slice(0, 6);
  shuffle(EXAM.filter(function(e){ return e.rel.split("-")[0] === u && e.type === "tf"; })).slice(0, 2).forEach(function(e){ steps.push({ k: "exam", e: e, check: true }); });
  var tr = UNIT[u].gens.filter(function(g){ return GENS[g].cat === "trace"; });
  if (tr.length) { var s = genStep(shuffle(tr)[0], u); s.check = true; steps.push(s); }
  return steps;
}
function startCheck(u) { newSess(checkSteps(u), Math.max(S.minutes, 10), { unit: u, check: u }); }

// ---------- Session-Ablauf ----------
function remaining() { return Math.round((sess.end - Date.now()) / 1000); }
function fmt(s) { var a = Math.abs(s); return (s < 0 ? "+" : "") + Math.floor(a / 60) + ":" + String(a % 60).padStart(2, "0"); }
function tick() {
  var c = document.getElementById("clock"); if (!c || !sess) return;
  var r = remaining(); c.textContent = fmt(r); c.classList.toggle("over", r < 0);
  if (r <= 0 && !sess.warned) { sess.warned = true; var tu = document.getElementById("timeup"); if (tu) tu.hidden = false; }
}
function showWs(t) { return t.split("\n").map(function(l){ var m = l.match(/^(.*?)( *)$/); return esc(m[1]) + '<span class="ws">' + m[2].replace(/ /g, "·") + '</span>'; }).join("\n"); }
function norm(t) { return t.replace(/\r/g, "").split("\n").map(function(l){ return l.replace(/\s+$/, ""); }).join("\n").replace(/\n+$/, ""); }
// Ausgaben vergleichen: Text exakt, Zahlen mit winziger Toleranz (verschiedene Java-Versionen runden die letzte Stelle anders)
function sameOutput(a, b) {
  a = norm(a).split("\n"); b = norm(b).split("\n"); if (a.length !== b.length) return false;
  var num = /-?\d+(?:\.\d+)?(?:E-?\d+)?/g;
  for (var i = 0; i < a.length; i++) {
    if (a[i] === b[i]) continue;
    if (a[i].replace(num, "#") !== b[i].replace(num, "#")) return false;
    var x = a[i].match(num) || [], y = b[i].match(num) || [];
    for (var j = 0; j < x.length; j++) { var p = parseFloat(x[j]), q = parseFloat(y[j]); if (Math.abs(p - q) > 1e-9 * Math.max(1, Math.abs(q))) return false; }
  }
  return true;
}
function sbar(cur, total) {
  return '<div class="sbar"><button class="iconbtn" id="quit" aria-label="Session beenden"><svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' +
    '<div class="prog" aria-label="Schritt ' + (cur + 1) + ' von ' + total + '">' + Array.apply(null, Array(total)).map(function(_, i){ return '<i class="' + (i < cur ? "done" : i === cur ? "now" : "") + '"></i>'; }).join("") + '</div>' +
    '<span class="clock" id="clock" role="timer" aria-label="Verbleibende Zeit">' + fmt(remaining()) + '</span></div>' +
    '<div class="timeup" id="timeup"' + (sess.warned ? "" : " hidden") + '><span>Deine Zeit ist um. Aktuellen Schritt noch abschließen?</span><button class="btn" id="stopNow">Jetzt beenden</button></div>';
}
function tagLine(s) {
  var lbl = s.review === "rev" ? '<span class="label" style="color:var(--bad)">Wiederholung</span>' : s.review === "back" ? '<span class="label" style="color:var(--accent)">Rückblick</span>' : s.check ? '<span class="label">Kapitel-Check</span>' : '';
  return lbl;
}
function step() {
  while (sess.i < sess.steps.length && sess.steps[sess.i].k === "fin") {
    var f = sess.steps[sess.i]; S.done[f.n.key] = true; sess.nibs++; save(); sess.i++;
    if (remaining() <= 0 && !sess.check) return summary();
  }
  if (sess.i >= sess.steps.length) return summary();
  var s = sess.steps[sess.i], bars = sess.steps.filter(function(x){ return x.k !== "fin"; }), cur = bars.indexOf(s);
  var h = sbar(cur, bars.length);
  if (s.k === "exam") h += examCard(s.e, tagLine(s));
  else if (s.k === "gen") h += genCard(s);
  else {
    var tag = '<span class="label">' + s.n.chap.id + ' · ' + esc(s.n.chap.title) + '</span>' + tagLine(s);
    if (s.k === "learn") {
      h += '<article class="card">' + tag + '<h2>' + esc(s.n.t) + '</h2><ul class="learn">' + s.n.learn.map(function(l){ return '<li>' + md(l) + '</li>'; }).join("") + '</ul>' +
        (s.n.code ? '<pre><code>' + hl(s.n.code) + '</code></pre>' : '') + '<button class="btn" id="next">Verstanden, zum Quiz</button></article>';
    } else if (s.k === "q") {
      var q = s.n.quiz[s.qi];
      h += '<article class="card">' + tag + '<p class="q">' + md(q.q) + '</p><div class="answers">' +
        q.a.map(function(a, i){ return '<button class="ans" data-i="' + i + '"><span class="k">' + "ABCD"[i] + '</span><span>' + md(a) + '</span></button>'; }).join("") + '</div><div id="fb"></div></article>';
    } else if (s.k === "task") {
      var sol = SOLS[s.n.key];
      h += '<article class="card">' + tag + '<h2>Mini-Aufgabe</h2><div class="task"><p>' + md(s.n.task) + '</p><p class="hint">Am besten direkt in der IDE ausprobieren, ca. 5 Minuten.</p></div>' +
        (sol ? '<button class="btn ghost" id="showSol">Musterlösung zeigen</button><div id="sol" class="reveal" hidden><span class="label">Musterlösung</span><pre><code>' + hl(sol) + '</code></pre></div>' : '') +
        '<div class="row"><button class="btn ghost" id="skip">Später</button><button class="btn" id="next">Erledigt</button></div></article>';
    }
  }
  render(h);
  document.getElementById("quit").onclick = summary;
  document.getElementById("stopNow").onclick = summary;
  var nx = document.getElementById("next"); if (nx) nx.onclick = advance;
  var sk = document.getElementById("skip"); if (sk) sk.onclick = advance;
  var ss = document.getElementById("showSol"); if (ss) ss.onclick = function(){ document.getElementById("sol").hidden = false; ss.hidden = true; };
  if (s.k === "q") bindQuiz(s);
  if (s.k === "exam") bindExam(s.e);
  if (s.k === "gen") bindGen(s);
}
function advance() { sess.i++; step(); }
function nextBtn() { return '<button class="btn" id="next" style="margin-top:14px;width:100%">Weiter</button>'; }

// ---------- Quiz ----------
function bindQuiz(s) {
  var q = s.n.quiz[s.qi], k = s.n.key + "|" + s.qi;
  app.querySelectorAll(".ans").forEach(function(b){
    b.onclick = function(){
      var pick = +b.dataset.i, ok = pick === q.c;
      app.querySelectorAll(".ans").forEach(function(x){ x.disabled = true; var i = +x.dataset.i; if (i === q.c) x.classList.add("right"); else if (i === pick) x.classList.add("wrong"); });
      S.answered++; if (ok) S.correct++;
      record(k, s.n.key, ok, { q: q.q, pick: q.a[pick], right: q.a[q.c], why: q.why });
      document.getElementById("fb").innerHTML = '<div class="why ' + (ok ? "ok" : "no") + '" role="status"><b>' + (ok ? "Richtig" : "Nicht ganz – richtig ist " + "ABCD"[q.c]) + '</b>' + md(q.why) + '</div>' + (ok ? '' : nudge(s.n.key)) + nextBtn();
      var nx = document.getElementById("next"); nx.onclick = advance; nx.focus();
    };
  });
}

// ---------- Klausuraufgaben ----------
var TYPE_NAME = { tf: "Korrekt oder nicht?", trace: "Ausgabe angeben", write: "Code schreiben", explain: "Erläutern" };
function examCard(e, extra) {
  var h = '<article class="card"><span class="label">' + e.sec + ' · ' + esc(secTitle(e.sec)) + ' · ' + TYPE_NAME[e.type] + '</span>' + (extra || '');
  if (e.type === "tf") {
    h += '<p class="stmt">' + md(e.s) + '</p><p class="hint">Formuliere die Begründung erst im Kopf, dann tippen.</p><div class="tfrow"><button class="ans" data-v="1">Korrekt</button><button class="ans" data-v="0">Nicht korrekt</button></div>';
  } else if (e.type === "trace") {
    h += '<p class="q">Geben Sie exakt die produzierte Konsolenausgabe an.</p><pre><code>' + hl(e.code) + '</code></pre>' +
      '<label class="hint" for="ans-x">Deine Ausgabe</label><textarea id="ans-x" spellcheck="false" autocapitalize="off" placeholder="Zeile für Zeile, wie auf der Konsole"></textarea><button class="btn" id="reveal">Lösung zeigen</button>';
  } else {
    h += '<div class="q">' + mdBlock(e.type === "write" ? e.task : e.q) + '</div><label class="hint" for="ans-x">' + (e.type === "write" ? "Deine Lösung (Papier geht auch – wie in der Klausur)" : "Deine Antwort in Stichpunkten") + '</label>' +
      '<textarea id="ans-x" spellcheck="false" autocapitalize="off"' + (e.type === "write" ? ' style="min-height:200px"' : '') + '></textarea><button class="btn" id="reveal">' + (e.type === "write" ? "Musterlösung zeigen" : "Lösung zeigen") + '</button>';
  }
  return h + '<div id="fb" class="reveal"></div></article>';
}
function rateButtons(pre) { return '<p class="hint">Wie lief es?</p><div class="row"><button class="btn ghost" id="rateNo"' + (pre === 0 ? ' style="border-color:var(--bad)"' : '') + '>Nochmal üben</button><button class="btn" id="rateOk">Sitzt</button></div>'; }
function bindExam(e) {
  var fb = document.getElementById("fb");
  if (e.type === "tf") {
    app.querySelectorAll(".tfrow .ans").forEach(function(b){
      b.onclick = function(){
        var pick = b.dataset.v === "1", ok = pick === e.ok;
        app.querySelectorAll(".tfrow .ans").forEach(function(x){ x.disabled = true; var v = x.dataset.v === "1"; if (v === e.ok) x.classList.add("right"); else if (x === b) x.classList.add("wrong"); });
        S.exam[e.id] = ok ? 1 : 0;
        record("ex:" + e.id, e.rel, ok, { q: e.s, pick: pick ? "korrekt" : "nicht korrekt", right: e.ok ? "korrekt" : "nicht korrekt", why: e.why });
        fb.innerHTML = '<div class="why ' + (ok ? "ok" : "no") + '" role="status"><b>' + (ok ? "Richtig" : "Nicht ganz") + ' – die Aussage ist ' + (e.ok ? "korrekt" : "nicht korrekt") + '</b>' + md(e.why) + '</div>' + (ok ? '' : nudge(e.rel)) + nextBtn();
        var nx = document.getElementById("next"); nx.onclick = advance; nx.focus();
      };
    });
    return;
  }
  var rv = document.getElementById("reveal");
  rv.onclick = function(){
    rv.hidden = true;
    var mine = document.getElementById("ans-x").value, pre = null, h = '';
    if (e.type === "trace") {
      h += '<span class="label">Erwartete Ausgabe <span style="text-transform:none;letter-spacing:0">(· = Leerzeichen)</span></span><pre><code>' + showWs(e.out) + '</code></pre>';
      if (mine.trim()) { var ok = sameOutput(mine, e.out); pre = ok ? 1 : 0; h += '<p class="verdict ' + (ok ? "ok" : "no") + '">' + (ok ? "Stimmt überein" : "Weicht ab – vergleiche Zeile für Zeile") + '</p>'; }
      h += '<div class="why ok"><b>Erklärung</b>' + md(e.why) + '</div>';
    } else {
      h += '<span class="label">' + (e.type === "write" ? "Musterlösung" : "Lösung") + '</span>';
      if (e.type === "write") h += '<pre><code>' + hl(e.sol) + '</code></pre>'; else h += '<p class="soltext">' + md(e.sol) + '</p>' + (e.code ? '<pre><code>' + hl(e.code) + '</code></pre>' : '');
      h += checklist(e.check, "ex");
    }
    fb.innerHTML = h + rateButtons(pre);
    var text = (e.type === "write" ? e.task : e.type === "trace" ? "Ausgabe angeben" : e.q).split("\n")[0];
    bindRate(function(v){ S.exam[e.id] = v ? 1 : 0; record("ex:" + e.id, e.rel, v, { q: text, self: true, why: e.type === "trace" ? e.why : "" }); });
    fb.scrollIntoView({ behavior: "smooth", block: "start" });
  };
}
function checklist(items, id) {
  return '<span class="label">Darauf achten Korrektoren – hast du das?</span><ul class="check">' +
    items.map(function(c, i){ return '<li><label><input type="checkbox" id="ck-' + id + '-' + i + '"><span>' + md(c) + '</span></label></li>'; }).join("") + '</ul>';
}
function bindRate(fn) {
  document.getElementById("rateOk").onclick = function(){ fn(true); advance(); };
  document.getElementById("rateNo").onclick = function(){ fn(false); advance(); };
}

// ---------- Generierte Programmieraufgaben ----------
var FALLEN = ["Semikolon am Ende jeder Anweisung", "Jede geöffnete Klammer geschlossen ({ } ( ) [ ])", "Rückgabetyp passt, `return` in jedem Pfad", "Schleifengrenzen: `<` oder `<=`? Start bei 0 oder 1?", "Array: `.length` – String: `.length()`", "Strings mit `equals` vergleichen, nie mit `==`", "int / int schneidet ab – bei Bedarf `/ 2.0` oder Cast", "Summen/Zähler vor der Schleife initialisieren", "Groß-/Kleinschreibung von Namen exakt wie in der Aufgabe"];
function copyBtn(id, label) { return '<button class="btn ghost small copy" data-copy="' + id + '">' + label + '</button>'; }
function fileBlock(f, id, role) {
  return '<details class="file"' + (role === "vorlage" ? " open" : "") + '><summary><span class="mono">' + esc(f.name) + '</span><span class="pill">' + role + '</span></summary>' +
    '<pre><code id="' + id + '">' + hl(f.content) + '</code></pre><div class="row" style="justify-content:flex-end">' + copyBtn(id, "Kopieren") + '</div></details>';
}
function testsTable(t) {
  if (!t.tests || !t.tests.length) return '';
  return '<div class="tablewrap"><table class="tests"><thead><tr><th>Test</th><th>erwartet</th></tr></thead><tbody>' +
    t.tests.map(function(x){ return '<tr><td><code>' + esc(x.label) + '</code></td><td><code>' + esc(x.show) + '</code></td></tr>'; }).join("") + '</tbody></table></div>';
}
function genCard(s) {
  var t = s.t, U = s.unit ? UNIT[s.unit] : null;
  var head = '<article class="card"><span class="label">' + (U ? s.unit + ' · ' : '') + esc(GEN.CATS.filter(function(c){ return c.id === t.cat; })[0].name) + (t.ref ? ' · angelehnt an ' + esc(t.ref) : '') + '</span>' + tagLine(s) + '<h2>' + esc(t.title) + '</h2>';
  if (t.kind === "trace") {
    return head + '<p class="q">Geben Sie exakt die produzierte Konsolenausgabe an.</p><pre><code>' + hl(t.code) + '</code></pre>' +
      '<label class="hint" for="ans-x">Deine Ausgabe</label><textarea id="ans-x" spellcheck="false" autocapitalize="off" placeholder="Zeile für Zeile, wie auf der Konsole"></textarea><button class="btn" id="reveal">Lösung zeigen</button><div id="fb" class="reveal"></div></article>';
  }
  var pap = S.medium !== "rechner";
  var h = head + '<div class="seg small" role="group" aria-label="Bearbeitung"><button id="mPap" aria-pressed="' + pap + '">Auf Papier</button><button id="mPc" aria-pressed="' + !pap + '">Am Rechner</button></div>' +
    '<div class="q">' + mdBlock(t.task) + '</div>';
  (t.givenFiles || []).forEach(function(f, i){ h += fileBlock(f, "gv" + i, "gegeben"); });
  if (t.kind === "program") h += '<span class="label">Erwartete Ausgabe</span><pre><code>' + esc(t.out) + '</code></pre>';
  else h += '<span class="label">Daran wird geprüft</span>' + testsTable(t);
  if (pap) {
    h += '<div class="task"><p><b>Auf Papier schreiben</b> – wie in der Klausur, ohne IDE. Richtwert: ' + t.mins + ' Minuten.</p><p class="hint">Danach vergleichst du mit der Musterlösung und hakst die Punkte der Korrektur ab.</p></div>' +
      '<button class="btn" id="reveal">Fertig – mit Musterlösung vergleichen</button>';
  } else {
    h += '<div class="task"><p><b>Am Rechner</b></p><ol class="tlist num"><li>Lege einen neuen Ordner an und darin die Dateien unten an (Kopieren-Knopf).</li>' +
      (t.kind === "program" ? '<li>Im Terminal: <code>javac ' + esc(t.mainCls) + '.java</code> und <code>java ' + esc(t.mainCls) + '</code></li><li>Füge deine Ausgabe unten ein – die App vergleicht sie.</li>'
        : '<li>Programmiere in der Vorlage.</li><li>Im Terminal: <code>javac *.java</code> und <code>java Test</code> – jede Zeile zeigt OK oder FEHLER.</li>' + (t.stubOnly ? '<li class="hint">Test.java kompiliert erst, wenn alle geforderten Methoden und Konstruktoren existieren.</li>' : '')) + '</ol></div>';
    t.starterFiles.forEach(function(f, i){ h += fileBlock(f, "st" + i, "vorlage"); });
    if (t.kind !== "program") h += fileBlock({ name: "Test.java", content: t.harness }, "tst", "Tests");
    if (t.kind === "program") h += '<label class="hint" for="ans-x">Deine Konsolenausgabe</label><textarea id="ans-x" spellcheck="false" autocapitalize="off"></textarea>';
    h += t.kind === "program" ? '<button class="btn" id="reveal">Ausgabe prüfen</button>' : '<div class="row"><button class="btn ghost" id="pcNo">Es gibt FEHLER</button><button class="btn" id="pcOk">Alle Tests OK</button></div>';
  }
  return h + '<div id="fb" class="reveal"></div><p id="copyMsg" class="hint" role="status"></p></article>';
}
function solutionHtml(t) {
  var h = '<span class="label">Musterlösung</span>';
  t.solFiles.forEach(function(f){ h += '<p class="mono hint">' + esc(f.name) + '</p><pre><code>' + hl(f.content) + '</code></pre>'; });
  return h + checklist(t.check, "g") + '<details class="file"><summary>Typische Klausur-Fallen</summary><ul class="tlist">' + FALLEN.map(function(f){ return "<li>" + md(f) + "</li>"; }).join("") + '</ul></details>';
}
function genDone(s, ok) {
  var t = s.t;
  record("g:" + t.gen, t.rel, ok, { q: t.title + (t.kind === "trace" ? "" : " (" + (S.medium === "rechner" ? "Rechner" : "Papier") + ")"), self: t.kind !== "trace", why: t.why || "" });
  if (ok && s.unit && UNIT[s.unit].gens.indexOf(t.gen) >= 0) { S.prog[s.unit] = (S.prog[s.unit] || 0) + 1; sess.tasksOk++; save(); }
}
function bindGen(s) {
  var t = s.t, fb = document.getElementById("fb");
  app.querySelectorAll("[data-copy]").forEach(function(b){ b.onclick = function(){ copyFrom(b.dataset.copy); }; });
  var mp = document.getElementById("mPap"), mc = document.getElementById("mPc");
  if (mp) { mp.onclick = function(){ S.medium = "papier"; save(); step(); }; mc.onclick = function(){ S.medium = "rechner"; save(); step(); }; }
  function finish(pre, extraHtml) {
    fb.innerHTML = (extraHtml || '') + (t.kind === "trace" ? '' : solutionHtml(t)) + rateButtons(pre);
    bindRate(function(v){ genDone(s, v); });
    fb.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  var rv = document.getElementById("reveal");
  if (rv) rv.onclick = function(){
    rv.hidden = true;
    var box = document.getElementById("ans-x"), mine = box ? box.value : "";
    if (t.kind === "trace") {
      var h = '<span class="label">Erwartete Ausgabe <span style="text-transform:none;letter-spacing:0">(· = Leerzeichen)</span></span><pre><code>' + showWs(t.out) + '</code></pre>', pre = null;
      if (mine.trim()) { var ok = sameOutput(mine, t.out); pre = ok ? 1 : 0; h += '<p class="verdict ' + (ok ? "ok" : "no") + '">' + (ok ? "Stimmt überein" : "Weicht ab – vergleiche Zeile für Zeile") + '</p>'; }
      finish(pre, h + '<div class="why ok"><b>Erklärung</b>' + md(t.why) + '</div>');
    } else if (t.kind === "program" && S.medium === "rechner") {
      var ok2 = sameOutput(mine, t.out);
      finish(ok2 ? 1 : 0, '<p class="verdict ' + (ok2 ? "ok" : "no") + '">' + (ok2 ? "Deine Ausgabe stimmt." : mine.trim() ? "Deine Ausgabe weicht ab. Vergleiche mit der erwarteten Ausgabe oben." : "Keine Ausgabe eingefügt.") + '</p>');
    } else finish(null);
  };
  var ok = document.getElementById("pcOk"), no = document.getElementById("pcNo");
  if (ok) {
    ok.onclick = function(){ ok.parentNode.hidden = true; finish(1, '<p class="verdict ok">Stark – alle Tests grün. Vergleiche trotzdem kurz mit der Musterlösung.</p>'); };
    no.onclick = function(){ ok.parentNode.hidden = true; finish(0, '<p class="verdict no">Lies die FEHLER-Zeilen: Sie zeigen erwartet und erhalten. Korrigiere und teste erneut – oder schau in die Musterlösung.</p>'); };
  }
}
function copyFrom(id) {
  var el = document.getElementById(id), msg = document.getElementById("copyMsg"), txt = el ? el.textContent : "";
  function fallback() {
    var r = document.createRange(); r.selectNodeContents(el); var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
    if (msg) msg.textContent = "Text ist markiert – jetzt mit Strg+C bzw. Kopieren übernehmen.";
  }
  try { navigator.clipboard.writeText(txt).then(function(){ if (msg) msg.textContent = "Kopiert."; }, fallback); } catch (e) { fallback(); }
}

// ---------- Zusammenfassung ----------
function summary() {
  clearInterval(timer);
  var mins = Math.max(1, Math.round((Date.now() - sess.started) / 60000)), h = header() + '<article class="card"><span class="label">Session beendet</span>';
  var checkHtml = '';
  if (sess.check) {
    var u = sess.check, chk = sess.steps.filter(function(x){ return x.check; }).length, pct = sess.total ? sess.right / sess.total : 0;
    var c = S.checks[u] || { best: 0, passed: false }, pass = pct >= CHECK_PASS && sess.total >= Math.min(chk, 5);
    c.best = Math.max(c.best, pct); c.passed = c.passed || pass; S.checks[u] = c; save();
    checkHtml = '<div class="why ' + (pass ? "ok" : "no") + '"><b>Kapitel-Check ' + u + ': ' + Math.round(pct * 100) + ' %</b>' +
      (pass ? (unitDone(u) ? "Bestanden – die Einheit ist abgeschlossen und kommt ab jetzt als Rückblick wieder." : "Bestanden.") : "80 % sind nötig. Übe die Baustellen unten und versuch es noch einmal.") + '</div>';
    if (pass && unitDone(u)) S.unit = nextUnit();
  }
  h += '<p class="big">' + (sess.nibs ? sess.nibs + ' Häppchen · ' : '') + sess.total + ' Antworten in ' + mins + ' Min.</p>' + checkHtml +
    '<div class="stats"><div class="stat"><b>' + sess.right + '/' + sess.total + '</b><small>richtig / sitzt</small></div><div class="stat"><b>' + sess.tasksOk + '</b><small>Code-Aufgaben gelöst</small></div><div class="stat"><b>' + streak() + '</b><small>Tage in Folge</small></div></div>' +
    '<p class="muted">Was nicht saß, kommt in der nächsten Session wieder. Was saß, wird nach 1, 3, 7, 14 und 30 Tagen erneut geprüft.</p>' + sessionWeak(sess.concepts) +
    (sess.practice ? '<button class="btn ghost" id="more">Noch eine Aufgabe</button>' : '') + '<button class="btn" id="home">Zur Übersicht</button></article>';
  var wasPractice = sess.practice ? { u: sess.unit, g: sess.steps[0] && sess.steps[0].t && sess.steps[0].t.gen } : null;
  sess = null; save(); render(h); bindWeak();
  document.getElementById("home").onclick = home;
  var mo = document.getElementById("more"); if (mo) mo.onclick = function(){ startTasks([wasPractice.g], wasPractice.u); };
}

// ---------- Programmieren: Startseite ----------
function reachedGens() { // Übungstypen aller Einheiten bis zur aktuellen
  var idx = ORDER.indexOf(nextUnit()), g = [];
  UNITS.forEach(function(u, i){ if (i <= Math.max(idx, ORDER.indexOf(S.unit))) u.gens.forEach(function(x){ g.push({ g: x, u: u.id }); }); });
  if (!g.length) ["EJP", "VAR"].forEach(function(id){ UNIT[id].gens.forEach(function(x){ g.push({ g: x, u: id }); }); });
  return g;
}
function codeHome() {
  var pap = S.medium !== "rechner", reached = reachedGens(), solved = 0;
  Object.keys(S.prog).forEach(function(k){ solved += S.prog[k]; });
  var h = '<section class="panel"><span class="label">Programmieren üben</span>' +
    '<p class="hint">Jede Aufgabe wird neu erzeugt – andere Zahlen, Namen, Varianten. So trainierst du Können statt Auswendiglernen.</p>' +
    '<div class="seg small" role="group" aria-label="Bearbeitung"><button id="cPap" aria-pressed="' + pap + '">Auf Papier</button><button id="cPc" aria-pressed="' + !pap + '">Am Rechner</button></div>' +
    '<p class="hint">' + (pap ? "Wie in der Klausur: von Hand schreiben, dann mit Musterlösung und Checkliste vergleichen." : "Vorlage und Test.java kopieren, in der IDE programmieren, Tests laufen lassen.") + '</p>' +
    '<button class="btn" id="cMix"' + (reached.length ? '' : ' disabled') + '>Gemischte Aufgabe' + (reached.length ? ' (bis ' + reached[reached.length - 1].u + ')' : '') + '</button>' +
    (reached.length ? '' : '<p class="hint">Programmieraufgaben beginnen ab EJP – wähle unten eine Einheit.</p>') +
    '<div class="stats" style="margin-top:4px"><div class="stat"><b>' + solved + '</b><small>Aufgaben gelöst</small></div><div class="stat"><b>' + Object.keys(GENS).length + '</b><small>Aufgabentypen</small></div><div class="stat"><b>∞</b><small>Varianten</small></div></div></section>';
  UNITS.filter(function(u){ return u.gens.length; }).forEach(function(u){
    h += '<section class="panel"><div class="weak-h"><span class="code big" style="font-size:13px">' + u.id + '</span><b style="flex:1;min-width:0">' + esc(u.chap.title) + '</b>' + pill(u.id) + '</div>' +
      '<div class="chips">' + u.gens.map(function(g){ return '<button class="chip" data-cg="' + g + '" data-cu="' + u.id + '">' + esc(genTitle(g)) + '</button>'; }).join("") + '</div>' +
      (u.esa.length ? '<button class="linkbtn" data-esa="' + u.id + '" style="align-self:flex-start">Einsendeaufgaben ' + u.esa.map(function(e){ return e.id; }).join(", ") + ' vorbereiten</button>' : '') + '</section>';
  });
  return h;
}
function bindCodeHome() {
  document.getElementById("cPap").onclick = function(){ S.medium = "papier"; save(); home(); };
  document.getElementById("cPc").onclick = function(){ S.medium = "rechner"; save(); home(); };
  var mx = document.getElementById("cMix");
  if (mx) mx.onclick = function(){ var r = reachedGens(); if (!r.length) return; var pick = shuffle(r)[0]; startTasks([pick.g], pick.u); };
  app.querySelectorAll("[data-cg]").forEach(function(b){ b.onclick = function(){ startTasks([b.dataset.cg], b.dataset.cu); }; });
  app.querySelectorAll("[data-esa]").forEach(function(b){ b.onclick = function(){ unitView(b.dataset.esa); }; });
}

// ---------- Klausurtraining: Startseite ----------
function examHome() {
  var p = planExam(S.minutes), sitzt = EXAM.filter(function(e){ return S.exam[e.id] === 1; }).length;
  var h = '<section class="panel"><span class="label">Aufbau wie die Probeklausur</span>' + timePicker() + '<div class="plan" id="plan">' + planExamHtml(p) + '</div><button class="btn" id="go">Training starten</button></section>';
  h += '<section class="panel stats"><div class="stat"><b>' + sitzt + '/' + EXAM.length + '</b><small>Aufgaben sitzen</small></div><div class="stat"><b>' + EXAM.filter(function(e){ return S.exam[e.id] === 0; }).length + '</b><small>offen</small></div><div class="stat"><b>' + streak() + '</b><small>Tage in Folge</small></div></section>';
  h += '<section class="panel"><span class="label">Abschnitte · antippen für Fokus</span><div class="chapters">';
  SECTIONS.forEach(function(s){
    var all = EXAM.filter(function(e){ return e.sec === s.id; }), d = all.filter(function(e){ return S.exam[e.id] === 1; }).length;
    h += '<button class="chap' + (S.efocus === s.id ? " focus" : "") + '" data-s="' + s.id + '" aria-pressed="' + (S.efocus === s.id) + '"><span class="code">' + s.id + '</span><span><span class="name">' + esc(s.title) + '</span><span class="bar"><i style="width:' + Math.round(100 * d / all.length) + '%"></i></span></span><span class="pct">' + d + '/' + all.length + '</span></button>';
  });
  return h + '</div><p class="hint">Zusätzlich gibt es im Lernpfad bei jeder Einheit unbegrenzt neue Programmieraufgaben.</p></section>';
}
function planExamHtml(p) {
  if (!p.items.length) return '<p class="muted">Gerade ist nichts fällig. Komm morgen wieder oder setze den Fortschritt zurück.</p>';
  var groups = {}; p.items.forEach(function(e){ (groups[e.sec] = groups[e.sec] || []).push(e); });
  return Object.keys(groups).map(function(sec){
    var types = {}; groups[sec].forEach(function(e){ types[e.type] = (types[e.type] || 0) + 1; });
    return '<div><span class="tag">' + sec + '</span><span>' + esc(secTitle(sec)) + ' <span class="muted">· ' + Object.keys(types).map(function(t){ return types[t] + "× " + TYPE_NAME[t]; }).join(", ") + '</span></span></div>';
  }).join("");
}
function bindExamHome() {
  bindTime(function(){ var p = planExam(S.minutes); document.getElementById("plan").innerHTML = planExamHtml(p); document.getElementById("go").disabled = !p.items.length; });
  var p = planExam(S.minutes); document.getElementById("go").disabled = !p.items.length;
  document.getElementById("go").onclick = function(){ S.eruns = (S.eruns || 0) + 1; newSess(planExam(S.minutes).items.map(function(e){ return { k: "exam", e: e }; }), S.minutes, { exam: true }); };
  app.querySelectorAll("[data-s]").forEach(function(b){ b.onclick = function(){ S.efocus = S.efocus === b.dataset.s ? null : b.dataset.s; save(); home(); }; });
}

// ---------- Sichern & Laden ----------
function bindIO() {
  var msg = document.getElementById("ioMsg");
  document.getElementById("exp").onclick = function(){
    var data = JSON.stringify(S);
    try { var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([data], { type: "application/json" })); a.download = "nibble-fortschritt-" + today() + ".json"; document.body.appendChild(a); a.click(); a.remove(); msg.textContent = "Datei wird heruntergeladen."; }
    catch (e) { msg.textContent = "Download nicht möglich."; }
    try { navigator.clipboard.writeText(data).then(function(){ msg.textContent += " Zusätzlich in die Zwischenablage kopiert."; }, function(){}); } catch (e) {}
  };
  document.getElementById("imp").onchange = function(ev){
    var f = ev.target.files[0]; if (!f) return; var r = new FileReader();
    r.onload = function(){ try { var d = JSON.parse(r.result); if (!d || typeof d.done !== "object") throw 0; Object.assign(S, d); save(); home(); } catch (e) { msg.textContent = "Die Datei ist keine gültige nibble-Sicherung."; } };
    r.readAsText(f);
  };
}

// ---------- Baustellen ----------
function conceptName(k) { var n = byKey(k); return n ? n.t : k; }
function nudge(k) { var st = S.stats[k]; if (!st || st.w < 2) return ''; return '<p class="hint" style="margin-top:10px">„' + esc(conceptName(k)) + '“ hakt öfter (' + st.w + '× falsch). Unter <b>Meine Baustellen</b> kannst du es gezielt üben.</p>'; }
function weakRow(k) {
  var st = S.stats[k], n = byKey(k), pct = Math.round(st.ema * 100), lvl = st.ema >= 0.5 ? "Hakt" : st.ema >= 0.3 ? "Wackelt" : "Wird besser";
  return '<div class="weak"><div class="weak-h"><span class="mono" style="font-size:12px">' + n.chap.id + '</span><span class="name">' + esc(n.t) + '</span><span class="pill' + (st.ema >= 0.5 ? " hot" : "") + '">' + lvl + '</span></div>' +
    '<div class="bar" aria-label="Fehlerneigung ' + pct + ' Prozent"><i style="width:' + Math.max(6, pct) + '%;background:var(--bad)"></i></div>' +
    '<div class="row" style="align-items:center"><span class="hint" style="flex:1 1 160px">' + st.w + ' von ' + st.n + ' Antworten falsch</span><button class="btn ghost small" data-train="' + k + '">Gezielt üben</button></div></div>';
}
function weakPanel(max) {
  var w = weakSpots(); if (!w.length) return '';
  return '<section class="panel" aria-labelledby="h-weak"><span class="label" id="h-weak">Meine Baustellen</span>' + w.slice(0, max).map(weakRow).join("") +
    '<button class="linkbtn" id="weakAll" style="align-self:flex-start">Alle Baustellen und Fehler ansehen</button></section>';
}
function sessionWeak(c) {
  var ks = Object.keys(c || {}).filter(function(k){ return c[k] > 0 && byKey(k); }); if (!ks.length) return '';
  return '<span class="label">Heute schwierig</span>' + ks.map(function(k){ return '<div class="row" style="align-items:center"><span style="flex:1 1 160px">' + esc(conceptName(k)) + ' <span class="muted">· ' + c[k] + '× falsch</span></span><button class="btn ghost small" data-train="' + k + '">Gleich üben</button></div>'; }).join("");
}
function bindWeak() { app.querySelectorAll("[data-train]").forEach(function(b){ b.onclick = function(){ startFocus(b.dataset.train); }; }); }
function weakView() {
  clearInterval(timer); sess = null; var w = weakSpots();
  var h = header() + '<button class="btn ghost back" id="back">← Übersicht</button><section class="panel"><h2 style="font-size:22px">Meine Baustellen</h2>' +
    '<p class="hint">Sortiert nach aktueller Fehlerneigung: Neuere Antworten zählen stärker. Sobald ein Thema mehrmals sitzt, rutscht es nach unten und verschwindet.</p>' +
    (w.length ? w.map(weakRow).join("") : '<p class="muted">Gerade keine Baustellen. Stark!</p>') + '</section>';
  if (S.log.length) {
    h += '<section class="panel"><h2 style="font-size:20px">Letzte Fehler</h2><div class="log">' + S.log.slice(0, 25).map(function(l){
      var when = new Date(l.ts).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
      return '<details class="logitem"><summary><span class="muted mono" style="font-size:12px">' + when + '</span> ' + esc(conceptName(l.c)) + '</summary><p class="q" style="font-size:15px">' + md(l.q) + '</p>' +
        (l.self ? '<p class="hint">Selbst als „Nochmal üben“ markiert.</p>' : '<p><span class="pill hot">Deine Antwort</span> ' + md(l.pick) + '</p><p><span class="pill">Richtig</span> ' + md(l.right) + '</p>') + (l.why ? '<p class="hint">' + md(l.why) + '</p>' : '') + '</details>';
    }).join("") + '</div></section>';
  }
  render(h); bindWeak(); document.getElementById("back").onclick = home;
}
// Gezielt üben: Erklärung, alle Fragen zum Thema, passende Klausur- und Programmieraufgaben
function startFocus(k) {
  var n = byKey(k); if (!n) return;
  var steps = [{ k: "learn", n: n }]; n.quiz.forEach(function(_, i){ steps.push({ k: "q", n: n, qi: i }); });
  EXAM.filter(function(e){ return e.rel === k; }).sort(function(a, b){ return COST[a.type] - COST[b.type]; }).slice(0, 3).forEach(function(e){ steps.push({ k: "exam", e: e }); });
  Object.keys(GENS).filter(function(g){ return GENS[g].def.rel === k; }).slice(0, 2).forEach(function(g){ steps.push(genStep(g)); });
  newSess(steps, 15, { unit: n.chap.id });
}

home();

// ---------- Webapp: Offline-Betrieb und automatische Updates ----------
var BUILD = "__BUILD__";
if ("serviceWorker" in navigator && location.protocol === "https:" && !/claude|anthropic/.test(location.hostname)) {
  var reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", function(){ if (!reloading && !sess) { reloading = true; location.reload(); } });
  navigator.serviceWorker.register("sw.js", { updateViaCache: "none" }).then(function(reg){
    function checkUpdate() {
      reg.update().catch(function(){});
      fetch("version.json?t=" + Date.now(), { cache: "no-store" }).then(function(r){ return r.json(); }).then(function(v){
        if (v.build && v.build !== BUILD && !document.getElementById("updBar")) {
          var bar = document.createElement("div"); bar.id = "updBar"; bar.className = "updbar";
          bar.innerHTML = '<span>Neue Version verfügbar.</span><button class="btn small" id="updGo">Jetzt laden</button>';
          document.body.appendChild(bar);
          document.getElementById("updGo").onclick = function(){ location.reload(); };
          if (!sess) location.reload();
        }
      }).catch(function(){});
    }
    checkUpdate();
    document.addEventListener("visibilitychange", function(){ if (document.visibilityState === "visible") checkUpdate(); });
  }).catch(function(){});
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function(){});
}
