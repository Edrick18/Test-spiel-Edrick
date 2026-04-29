# ARCHITECTURE.md - Technische Architektur

## Tech Stack
- **Frontend**: TypeScript + Phaser.js (2D Browser Game Framework)
- **Build-Tool**: Vite
- **Testing**: Vitest
- **Backend**: Node.js + Express (API-Server)
- **Datenbank**: PostgreSQL (globaler Spielstand, Ranglisten, Gilden)
- **Kommunikation**: REST API (Frontend ↔ Backend)

## Projektstruktur
```
src/
├── core/        # Kern-Engine, Game Loop, Hauptklassen
├── systems/     # Spielsysteme (Kampf, Inventory, etc.)
├── entities/    # Spielobjekte (Charakter, Monster, Items)
├── ui/          # Benutzeroberfläche
├── api/         # API-Calls zum Backend
└── utils/       # Hilfsfunktionen
server/
├── routes/      # API-Endpunkte (Auth, Player, Guild, PvP)
├── models/      # Datenbank-Modelle (User, Character, Guild)
└── utils/       # Server-Hilfsfunktionen
tests/
├── unit/        # Unit Tests
└── integration/ # Integration Tests
docs/            # Zusätzliche Dokumentation
assets/          # Spieldaten (Bilder, Sounds, Fonts)
```

## TypeScript & Phaser Konventionen
- Nutze TypeScript Interfaces für Datenstrukturen
- Phaser Scenes für verschiedene Spielzustände (Menu, Game, Battle)
- Klassen für Entities (Character, Monster) mit klaren Typen
- Asset-Loading über Phaser's Preload-Funktion

## Architektur-Entscheidungen
- [Noch zu treffen]

## Wichtige Klassen/Module
- [Noch zu definieren]

## Datenstrukturen
- [Noch zu definieren]

## APIs/Schnittstellen
- [Noch zu definieren]
