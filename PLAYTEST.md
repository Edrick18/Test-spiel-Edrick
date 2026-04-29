# Playtester-Anleitung - Shakes & Fidget Clone

## Voraussetzungen
- Node.js installiert (Version 18 oder höher)
- Internetverbindung für npm install

## Installation

### 1. Projekt entpacken
Entpacke die Dateien in einen Ordner (z.B. `C:\spiel-wie-shakes-and-fidget`)

### 2. Dependencies installieren
Öffne ein Terminal (Eingabeaufforderung oder PowerShell) im Projektordner:

```bash
# Frontend-Abhängigkeiten installieren
npm install

# Backend-Abhängigkeiten installieren
cd server
npm install
cd ..
```

## Server starten

### 1. Backend starten (Datenbank)
In einem Terminal-Fenster:
```bash
cd server
npm run dev
```
**Wichtig**: Das Terminal-Fenster muss geöffnet bleiben! Du solltest sehen: `Server läuft auf Port 3000`

### 2. Frontend starten (Spiel)
In einem **neuen** Terminal-Fenster:
```bash
npm run dev
```
Du solltest sehen: `Local: http://localhost:5173/`

## Spielen

1. Öffne **http://localhost:5173** im Browser
2. **Registrieren**: Klicke auf "Konto erstellen", gib E-Mail, Passwort und Benutzernamen ein
3. **Einloggen**: Nutze deine E-Mail und Passwort
4. **Charakter erstellen**: Wähle Namen und Klasse, klicke "Charakter erstellen"
5. **Hauptmenü**: Wähle zwischen:
   - Overworld Reise (Proviant wird verbraucht)
   - Tavern (direkte Kämpfe)
   - Dungeon (Bosse)
   - Inventar & Ausrüstung
   - Shop (Items kaufen)
   - PvP Arena (gegen andere Spieler)
   - Gilde (beigetreten oder gründen)
   - Tägliche Quests (5 pro Tag)
   - Hideout (passives Einkommen)

## Was testen?

### Wichtigste Funktionen:
- [ ] Registrierung & Login funktioniert
- [ ] Charakter-Erstellung (alle 15 Klassen testen)
- [ ] Kampf-System (Overworld, Tavern, Dungeon, PvP)
- [ ] Items kaufen und ausrüsten
- [ ] Inventar-Verwaltung
- [ ] Level-Ups und Stats-Verteilung
- [ ] PvP-MM-Ranking
- [ ] Guild-System
- [ ] Tägliche Quests
- [ ] Speichern (nach Neustart noch da?)

### Bekannte Probleme:
- Spielstand wird in SQLite-Datei (`game.db`) gespeichert (im `server/`-Ordner)
- Bilder/Grafiken sind noch nicht implementiert (nur Text)
- Soundeffekte fehlen noch

## Fehler melden

Wenn du einen Fehler findest:
1. Notiere was du gemacht hast
2. Kopiere evtl. Fehlermeldungen aus den Terminal-Fenstern
3. Sende Bericht an den Entwickler

## Multi-Player Test

Um mit anderen Testern zu spielen:
1. Backend-Server muss für alle erreichbar sein (localhost reicht nur für eigene Tests)
2. Für LAN-Tests: Finde deine IP-Adresse mit `ipconfig`
3. Andere Spieler müssen in `src/main-simple.js` die Zeile `const API_BASE = 'http://localhost:3000/api'` ändern auf `const API_BASE = 'http://DEINE_IP:3000/api'`
4. Dann Frontend neu bauen: `npm run build` und `npm run preview`

## Wichtige Dateien:
- **Backend läuft auf**: `http://localhost:3000`
- **Frontend läuft auf**: `http://localhost:5173`
- **Datenbank**: `server/game.db` (wird automatisch erstellt)
- **Logs**: Siehe Terminal-Fenster von Backend und Frontend

Viel Spaß beim Testen! 🎮
