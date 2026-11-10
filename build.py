#!/usr/bin/env python3
"""Baut index.html (Webapp für GitHub Pages) aus den Dateien in src/.

    python3 build.py

Inhalte ändern: src/content*.js (Lern-Häppchen) und src/exam.js (Klausurtraining).
Danach build.py ausführen und index.html committen.
"""
from pathlib import Path

root = Path(__file__).parent
src = root / "src"
t = (src / "template.html").read_text(encoding="utf-8")
content = "".join((src / f"content{i}.js").read_text(encoding="utf-8") for i in (1, 2, 3))
t = t.replace("/*CONTENT*/", content).replace("/*EXAM*/", (src / "exam.js").read_text(encoding="utf-8"))
t = t.replace("<!--PWA-->", "")

split = t.index('<div class="app"')
head, body = t[:split], t[split:]
page = f"""<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0E1726">
<meta name="description" content="Lern-App für Grundlagen der Programmierung 1: kurze Sessions, Quiz, Klausurtraining und Fehleranalyse.">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/logo.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="nibble">
<style>
:root {{ color-scheme: light; padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); }}
body {{ margin: 0; font: 14px system-ui, sans-serif; -webkit-text-size-adjust: 100%; }}
img {{ max-width: 100%; }}
[hidden] {{ display: none !important; }}
</style>
{head}</head>
<body>
{body}
</body>
</html>
"""
(root / "index.html").write_text(page, encoding="utf-8")
print("index.html gebaut:", len(page), "Zeichen")
