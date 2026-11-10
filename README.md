# nibble_ – GdP1 in Häppchen

Lern-Webapp für **Grundlagen der Programmierung 1** (Java). Statt auf den großen Lernblock zu warten: Zeit einstellen (10–45 Minuten), loslegen.

## Funktionen

**Lernpfad entlang des Lehrplans** – EIP → PUP → PJA → EJP → VAR → STA → OBJ → KLA → VER → ITR → VRB → EXC → ARR → ZKT. Einheit antippen, Zeit einstellen (10–45 Min.), loslegen. Jede Einheit hat Stufen:

1. **Lernen** – kurze Häppchen mit Erklärung, Codebeispiel und Quiz.
2. **Programmieren** – unbegrenzt neue Aufgaben (Zufallsgenerator: jedes Mal andere Zahlen, Namen, Varianten), passend zum Stoff der Einheit:
   Ausgabe vorhersagen, lineare Programme, statische Methoden, Verzweigungen, Schleifen, Arrays, 2D-Arrays, Strings, Klassen, Vererbung, Exceptions – plus Kursprojekte angelehnt an die Übungen der Lerneinheiten.
   - *Auf Papier:* wie in der Klausur, mit Zeitvorgabe, Musterlösung, Korrektur-Checkliste und typischen Klausur-Fallen.
   - *Am Rechner:* Vorlage und fertige `Test.java` kopieren, `javac *.java` und `java Test` – jede Zeile meldet OK oder FEHLER.
3. **Kapitel-Check** – gemischter Test, ab 80 % ist die Einheit abgeschlossen.
4. **Einsendeaufgaben vorbereiten** – für jede Einsendeaufgabe die geforderten Fähigkeiten mit passenden Übungen. Die Original-Aufgaben löst du selbst; die App trainiert die Bausteine mit eigenen, ähnlichen Aufgaben.

**Nichts vergessen:** Jede Session enthält fällige Wiederholungen (Abstände 1, 3, 7, 14, 30 Tage) und einen Rückblick auf abgeschlossene Einheiten.

**Lernt mit, wo du Fehler machst:** *Meine Baustellen* zeigt Themen, die gerade haken, mit „Gezielt üben“. Dazu ein Protokoll der letzten Fehler.

**Klausurtraining** im Aufbau der Probeklausur (A1–A5).

**Webapp:** installierbar, offline nutzbar, Fortschritt sichern/laden.

## Geprüfte Inhalte

Alle Programmieraufgaben werden aus Generatoren erzeugt, die gegen echtes Java geprüft sind:

```bash
node tools/verify.js 200 40   # erzeugt Tausende Varianten, kompiliert sie und vergleicht Ausgaben/Tests
node tools/mutate.js          # baut typische Fehler in Musterlösungen ein und prüft, ob die Tests sie finden
```

Benötigt Node.js und ein JDK (17+).

## Online stellen (GitHub Pages)

1. Inhalt dieses Ordners ins Repository hochladen (`index.html` muss im Hauptverzeichnis liegen).
2. Im Repository: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main**, Ordner **/ (root)** → **Save**
3. Nach ca. 1 Minute läuft die App unter `https://<benutzername>.github.io/GdP1/`.

## Auf dem Handy installieren

- **iPhone (Safari):** Seite öffnen → Teilen-Symbol → **Zum Home-Bildschirm**.
- **Android (Chrome):** Seite öffnen → Menü ⋮ → **App installieren** bzw. **Zum Startbildschirm hinzufügen**.

Wichtig: Lerne danach immer in der installierten App. Browser und installierte App speichern den Fortschritt getrennt. Zum Umziehen gibt es unten **Fortschritt sichern** und **Fortschritt laden**.

## Inhalte ändern oder ergänzen

```
src/content1.js   Lern-Häppchen EIP, PUP, PJA, EJP
src/content2.js   Lern-Häppchen VAR, STA, OBJ, KLA
src/content3.js   Lern-Häppchen VER, ITR, VRB, EXC, ARR, ZKT
src/exam.js       Klausurtraining (A1–A5) und Musterlösungen der Mini-Aufgaben
src/gen.js        Aufgabengeneratoren und Kursprojekte
src/units.js      Lehrplan: Übungen und Einsendeaufgaben je Einheit
src/app.js        Logik der App
src/template.html Oberfläche (HTML/CSS)
```

Nach einer Änderung:

```bash
python3 build.py          # baut index.html neu
```

Vorher am besten `node tools/verify.js` laufen lassen. Dann in `sw.js` die Zeile `const VERSION = "nibble-v4";` hochzählen (z. B. `nibble-v5`), damit installierte Apps die neue Version laden. Danach committen und pushen.

## Farben und Logo

- Farben: in `src/template.html` beim Kommentar **HIER FARBEN ÄNDERN**.
- Zusätzliches Logo: in `src/template.html` die Variable `PARTNER_LOGO` mit einer Bild-URL füllen.

## Hinweis zu den Inhalten

Alle Erklärungen, Quizfragen und Klausuraufgaben sind eigene Zusammenfassungen und Parallelaufgaben. Original-Lernmaterialien und die Probeklausur sind nicht enthalten. Code-Ausgaben und Musterlösungen wurden mit `javac`/`java` geprüft.
