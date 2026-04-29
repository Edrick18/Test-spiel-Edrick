# TASKS.md - Aufgabenverwaltung

## Aktueller Status
**Projektphase**: Online-Funktion für Playtester - BEREIT!
**Letztes Update**: 29.04.2026

## Was bisher gemacht wurde:
1. **Backend (server/)**: SQLite-Datenbank eingerichtet (kein PostgreSQL nötig!)
   - Läuft auf `http://localhost:3000`
   - Datenbank-Datei: `server/game.db` (wird automatisch erstellt)
   
2. **API-Endpunkte** erstellt:
   - `/auth/register` & `/auth/login` - Registrierung/Login
   - `/characters` - Charaktere erstellen/auflisten/aktualisieren
   - `/characters/:id/equip` - Items ausrüsten
   - `/guilds` - Gilden gründen/beitreten
   - `/pvp` - PvP-Kämpfe & Leaderboard
   - `/dungeon` - Dungeon-Bosse
   - `/shop` - Shop-Inventar & Kaufen
   - `/daily-quests` - Tägliche Quests

3. **Frontend (src/main-simple.js)**
   - Login-System auf **API-Calls** umgestellt (statt localStorage)
   - Charakter-Erstellung speichert in SQLite
   - Inventory, Shop, PvP, Guild, DailyQuests verbinden sich mit Backend
   - Syntax-Fehler korrigiert (Datei bereinigt)
   - Frontend gebaut: `dist/index.html` ist bereit

4. **Playtester-Infrastruktur**
   - `PLAYTEST.md` - Anleitung für Tester
   - `start-playtest.bat` - Ein-Klick-Startskript für Windows
   - `dist/` - Fertige Frontend-Dateien

## Offene Aufgaben
- [x] SQLite Backend einrichten (server/)
- [x] API-Endpunkte erstellen (Auth, Characters, Items, Guild, PvP, Dungeon, Shop)
- [x] Backend mit Frontend verbinden (Login, Charakter, Kampf-Speichern)
- [x] Frontend-Szenen an Backend anbinden (Inventory, Shop, PvP, Guild, DailyQuests)
- [x] Syntax-Fehler korrigieren (main-simple.js bereinigt)
- [x] Frontend build testen (`npm run build`)
- [x] Playtester-Anleitung erstellen (PLAYTEST.md)
- [x] Start-Skript erstellen (start-playtest.bat)
- [ ] Multi-User Test (mehrere Playtester gleichzeitig)
- [ ] Visuals verbessern (Sprites, Animationen) - als nächstes Ziel identifiziert
- [ ] Balance-Test (Level-Kurve, Item-Preise)

## In Bearbeitung
- [ ] Projektstruktur aufsetzen (ERLEDIGT)

## Erledigt
- [x] Verzeichnisse erstellen
- [x] Dokumentationsdateien anlegen
- [x] Zielplattform definiert (Browser/Web)
- [x] Art Style definiert (Humorvolle Karikaturen)
- [x] Klassische Features (Gilden, PvP-Arena) festgelegt
- [x] Kampf-System definiert (Vollautomatisch)
- [x] Level-System definiert (Klassisch: XP -> Level -> Stats)
- [x] Wirtschaft definiert (Gold-Wirtschaft mit Shop)
- [x] Charakter-Attribute definiert (Vitalität, Stärke, Intelligenz, Geschicklichkeit, Glück, Weisheit)
- [x] Quest-Typen festgelegt (Kampf-Quests, Tägliche Quests)
- [x] Item-Typen festgelegt (Waffen, Rüstungen, Accessoires, Scrolls, Tränke)
- [x] Tech Stack gewählt (TypeScript + Phaser.js + Vite)
- [x] Klassen-System definiert (6 reine + 15 Hybrid-Klassen)
- [x] Schadens-Formel mit Caps (Ausweichen max 75%, Krit max 100%) ausgearbeitet
- [x] Testing Framework gewählt (Vitest)
- [x] Level-Tabelle erstellt (Potenzfunktion Level^1.5, kein Max-Level, Soft-Cap)
- [x] Item-Skalierung definiert (Level^1.5)
- [x] Seltenheits-System für Items festgelegt (Common x1, Rare x1.5, Epic x2, Legendary x3)
- [x] Waffen-System für alle 21 Klassen definiert (2-Hand für rein, 1-Hand+Nebenhand für Hybrid)
- [x] Rüstungs-System festgelegt (Helme, Rüstungen, Schilde, Handschuhe, Stiefel)
- [x] Monster-System definiert (3 Raritäten: Normal/Elite/Boss mit Multiplikatoren)
- [x] Monster-Skalierung festgelegt (Spieler-Level-basiert mit Variation)
- [x] Monster-Attribute festgelegt (gleiche 6 Attribute wie Spieler)
- [x] Dungeon-System definiert (nur Bosse, fester Fortschritt, Bosse gleich für alle)
- [x] Overworld-System definiert (automatische Quests 0.5-30min, Belohnung steigt mit Dauer)
- [x] Boss-Level-Tabelle erstellt (linear: Boss N = Level N)
- [x] Overworld-Seltenheiten definiert (6 Stufen: Gewöhnlich bis Einzigartig)
- [x] Overworld-Belohnungsformel erstellt (Dauer^1.3 * Seltenheits-Multiplikator)
- [x] Idle-Mechanik festgelegt (8h Zeitfenster am Stück)
- [x] Shop-System definiert (Preis = Level^1.5 * Basis, 20 Slots, Verfügbar bis Level+5)
- [x] Guild-System definiert (Gründung 1000 Gold, %-Beiträge, Buffs, Gilden-Kämpfe/Dungeon/Quests)
- [x] PvP-Arena System definiert (MMR-basiert, Saison alle 30 Tage, Level-Basis-MMR, Arena-Items)
- [x] Tägliche Quests System definiert (5/Tag, Reset 00:00, Gold/XP/Exklusive Items)
- [x] Backend-Architektur festgelegt (Node.js + PostgreSQL)
- [x] Multiplayer-Typ definiert (Asynchron: Ranglisten, PvP, Gilden)
- [x] Charaktererstellung definiert (Einfach: Klasse + Name)
- [x] Vite + TypeScript + Phaser.js Frontend initialisiert
- [x] Vitest konfiguriert
- [x] Node.js + Express Backend aufgesetzt
- [x] PostgreSQL Datenbank-Schema erstellt (Users, Characters, Items, Guilds, etc.)
- [x] Basis API-Endpunkte erstellt (Auth, Character)
- [x] CombatSystem implementiert (Schaden, Ausweichen, Krit, Rüstung)
- [x] GameLoop erstellt (Overworld-Quests, Level-Up, Kampf)

## Nächste Schritte
1. Datenbank-Schema anwenden (PostgreSQL installieren & Schema ausführen)
2. API-Endpunkte vervollständigen (Guild, PvP-Arena, Daily Quests, Shop)
3. Frontend-Backend Verbindung herstellen (API-Calls)
4. Charakter-Erstellung UI implementieren (Klasse wählen + Name)
5. Assets hinzufügen (Grafiken für Klassen, Monster, Items)
6. Game Loop mit echten Phaser-Animationen vervollständigen

## Bekannte Probleme
- Keine bisher
