# nibble_ – GdP1 in Häppchen

Lern-Webapp für **Grundlagen der Programmierung 1** (Java). Statt auf den großen Lernblock zu warten: Zeit einstellen (10–45 Minuten), loslegen.

## Funktionen

- **Lernen:** 64 kurze Häppchen aus allen 14 Lerneinheiten (EIP bis ZKT), jeweils mit Erklärung, Codebeispiel, Quiz und teils Mini-Aufgabe mit Musterlösung.
- **Klausurtraining:** 51 Aufgaben im Aufbau der Klausur (A1–A5): korrekt oder nicht, Konsolenausgabe angeben, Code schreiben, Erläutern – mit Musterlösung und Korrektur-Checkliste.
- **Lernt mit, wo du Fehler machst:**
  - Jede Antwort wird einem Thema zugeordnet. Unter **Meine Baustellen** stehen die Themen, die gerade haken, sortiert nach aktueller Fehlerneigung.
  - **Gezielt üben** startet eine Mini-Session nur zu diesem Thema: Erklärung, alle Quizfragen dazu und passende Klausuraufgaben.
  - **Spaced Repetition (Leitner):** Falsches kommt in der nächsten Session wieder. Richtiges wird nach 1, 3, 7 und 14 Tagen erneut geprüft.
  - **Letzte Fehler:** Protokoll mit deiner Antwort, der richtigen Antwort und der Erklärung.
- **Webapp:** installierbar auf dem Home-Bildschirm, funktioniert offline.
- **Fortschritt sichern/laden** als JSON-Datei, z. B. für einen Gerätewechsel.

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
src/content1.js   EIP, PUP, PJA, EJP
src/content2.js   VAR, STA, OBJ, KLA
src/content3.js   VER, ITR, VRB, EXC, ARR, ZKT
src/exam.js       Klausurtraining (A1–A5) und Musterlösungen der Mini-Aufgaben
src/template.html Oberfläche und Logik
```

Nach einer Änderung:

```bash
python3 build.py          # baut index.html neu
```

Dann in `sw.js` die Zeile `const VERSION = "nibble-v3";` hochzählen (z. B. `nibble-v4`), damit installierte Apps die neue Version laden. Danach committen und pushen.

## Farben und Logo

- Farben: in `src/template.html` beim Kommentar **HIER FARBEN ÄNDERN**.
- Zusätzliches Logo: in `src/template.html` die Variable `PARTNER_LOGO` mit einer Bild-URL füllen.

## Hinweis zu den Inhalten

Alle Erklärungen, Quizfragen und Klausuraufgaben sind eigene Zusammenfassungen und Parallelaufgaben. Original-Lernmaterialien und die Probeklausur sind nicht enthalten. Code-Ausgaben und Musterlösungen wurden mit `javac`/`java` geprüft.
