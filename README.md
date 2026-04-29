# Shakes & Fidget Clone

Ein Browser-basiertes RPG-Spiel ähnlich wie "Shakes and Fidget".

## Features (aktuell implementiert)
- ✅ Charakter-Erstellung (Name + 15 Klassen wählbar)
- ✅ Visueller Kampf mit HP-Balken
- ✅ Kampf-Log in Echtzeit
- ✅ 6 verschiedene Quest-Dauern (5-30 Min) = verschiedene Seltenheiten
- ✅ Level-System mit automatischem Level-Up
- ✅ Gold- und XP-System
- ✅ Demo-Modus (läuft komplett im Browser, keine Datenbank nötig)

## Spielen

Öffne `index.html` im Browser oder starte den Dev-Server:

```bash
npm run dev
```

Dann im Browser öffnen: `http://localhost:5173`

## Steuerung
1. **Charakter erstellen**: Name eingeben und Klasse wählen (Pfeile zum Wechseln)
2. **Quest starten**: Im Spiel klick auf eine der 6 Quest-Optionen
3. **Kampf beobachten**: HP-Balken, Kampf-Log und Ergebnis ansehen
4. **Neuer Charakter**: Button unten klicken

## Klassen (15 verfügbar)
### Reine Klassen (5)
- Krieger (Stärke)
- Magier (Intelligenz)
- Schütze (Geschicklichkeit)
- Priester (Weisheit)
- Paladin (Vitalität)

### Hybrid-Klassen (10)
- Battlemage, Ranger, Cleric, Juggernaut, Spellbow, Archmage, Warlock, Monk, Evasion Tank, Healer-Tank

## Technik
- **Frontend**: Phaser.js 4.0 + Vite
- **Backend**: Demo-Modus (ohne Datenbank)
- **Sprache**: JavaScript (vereinfachte Version)

## Nächste Schritte (TODO)
- [ ] Assets hinzufügen (Grafiken für Klassen, Monster)
- [ ] Dungeon-System (nur Bosse)
- [ ] Guild-System
- [ ] PvP-Arena
- [ ] PostgreSQL-Datenbank anbinden
- [ ] TypeScript-Version vervollständigen
