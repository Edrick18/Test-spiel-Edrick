# GAME_DESIGN.md - Spielkonzept

## Grundkonzept
Spiel ähnlich wie "Shakes and Fidget" (ein RPG mit humorvoller Präsentation)

## Kernfeatures
- [ ] Charaktererstellung
- [ ] Kämpfe (Turn-based)
- [ ] Quest-System
- [ ] Ausrüstung/Items
- [ ] Level-System
- [ ] Durchmesser (Dungeons)
- [ ] Guild-System
- [ ] PvP-Arena
- [ ] Tägliche Quests

## Spielmechaniken
- **Kampf-System**: Vollautomatisch (Kampf läuft automatisch ab, Spieler kann nur durch Ausrüstung/Items beeinflussen)
- **Level-System**: Klassisch (XP sammeln -> Level-Up -> Stats steigen)
- **Wirtschaft**: Gold-Wirtschaft mit Shop (Gold durch Kämpfe/Quests, Items im Shop kaufen)
- **Speicherung**: Datenbank-Backend (globaler Spielstand, cloudbasiert)
- **Multiplayer**: Asynchron (Ranglisten, PvP-Arena, Gilden - keine Echtzeit-Interaktion)
- **Charaktererstellung**: Einfach (Klasse wählen + Name eingeben)
- **Shop-System**:
  - Preis-Formel: (Item-Level^1.5) * Basis-Preis (z.B. 10 Gold)
  - Inventar-Größe: 20 Slots (erweiterbar mit Gold)
  - Verfügbarkeit: Items bis Spieler-Level + 5
  - Item-Verkauf: Spieler kann Items für 50% des Kaufpreises verkaufen

## Level-Tabelle (XP-Bedarf)
Formel: XP = 100 * (Level)^1.5 (Potenzfunktion mit Exponent 1.5)
- Level 1 → 2: 100 XP
- Level 2 → 3: 283 XP
- Level 3 → 4: 519 XP
- Level 4 → 5: 800 XP
- Level 5 → 6: 1125 XP
- Level 10 → 11: 3162 XP
- Level 20 → 21: 8944 XP
- Kein Max-Level (Soft-Cap durch exponentiell steigenden Bedarf)

## Charakter-Attribute
- **Vitalität**: Erhöht HP (Lebenspunkte)
- **Stärke**: Erhöht Rüstung (Verteidigung)
- **Intelligenz**: Erhöht Mana
- **Geschicklichkeit**: Erhöht Ausweichchance (max 75%)
- **Glück**: Erhöht Krit-Chance (max 100%)
- **Weisheit**: Erhöht Mana-Regeneration

## Attribute-Grundwerte (für alle Klassen)
- Basis-HP: 100 + (Vitalität * 10)
- Basis-Mana: 50 + (Intelligenz * 5)
- Basis-Rüstung: Stärke * 2
- Basis-Ausweichchance: min(75%, 5% + Geschicklichkeit * 0.5%)
- Basis-Krit-Chance: min(100%, 5% + Glück * 1%)
- Basis-Mana-Regeneration: 1 + Weisheit * 0.1 pro Runde

## Klassen-System (Alle Kombinationen)

### Reine Klassen (1 Attribut)
1. **Krieger** - Stärke-basiert (physischer Schaden)
2. **Magier** - Intelligenz-basiert (magischer Schaden)
3. **Schütze** - Geschicklichkeit-basiert (physischer Schaden)
4. **Priester** - Weisheit-basiert (magischer Schaden)
5. **Paladin** - Vitalität-basiert (physischer Schaden)
6. **Glücksritter** - Glück-basiert (hybrid Schaden)

### Hybrid-Klassen (2 Attribute) - Alle 15 Kombinationen
1. **Battlemage** - Stärke + Intelligenz (hybrid: physisch + magisch)
2. **Ranger** - Stärke + Geschicklichkeit (physischer Schaden)
3. **Cleric** - Stärke + Weisheit (hybrid: physisch + magisch)
4. **Juggernaut** - Stärke + Vitalität (physischer Schaden)
5. **Berserker** - Stärke + Glück (physischer Schaden)
6. **Spellbow** - Intelligenz + Geschicklichkeit (hybrid: magisch + physisch)
7. **Archmage** - Intelligenz + Weisheit (magischer Schaden)
8. **Warlock** - Intelligenz + Vitalität (hybrid: magisch + physisch)
9. **Gambler** - Intelligenz + Glück (hybrid: magisch + physisch)
10. **Monk** - Geschicklichkeit + Weisheit (hybrid: physisch + magisch)
11. **Assassin** - Geschicklichkeit + Glück (physischer Schaden)
12. **Evasion Tank** - Geschicklichkeit + Vitalität (physischer Schaden)
13. **Healer-Tank** - Weisheit + Vitalität (hybrid: magisch + physisch)
14. **Lucky Priest** - Weisheit + Glück (hybrid: magisch + physisch)
15. **Tank Berserker** - Vitalität + Glück (physischer Schaden)

## Schadens-Formel
- **Physischer Schaden**: Stärke * 2 + Geschicklichkeit * 1 (wenn Klasse physisch nutzt)
- **Magischer Schaden**: Intelligenz * 2 + Weisheit * 1 (wenn Klasse magisch nutzt)
- **Hybrid**: Nutzt beide Formeln, Schaden wird addiert
- **Rüstung-Berechnung**: Schaden = Max(1, Angriff - Rüstung/2)
- **Ausweich-Check**: Zufallszahl 1-100 > Ausweichchance → Treffer
- **Krit-Check**: Zufallszahl 1-100 < Krit-Chance → Schaden * 2

## Quest-Typen
- Kampf-Quests (Monster töten)
- Tägliche Quests (Daily Quests)

## Tägliche Quests System
- **Anzahl**: 5 tägliche Quests pro Tag
- **Reset-Zeit**: Jeden Tag um 00:00 Uhr (Mitternacht)
- **Belohnungen**:
  - Gold (wie normale Quests)
  - XP (wie normale Quests)
  - Tägliche Items (exklusiv, nur durch tägliche Quests erhältlich)
- **Dauer**: Quests dauern zwischen 0.5 und 30 Minuten (wie Overworld-Quests)
- **Seltenheit**: Gleiche Seltenheiten wie Overworld (Gewöhnlich bis Einzigartig)

## Monster-System
### Raritäten und Multiplikatoren
- **Normal**: x1 Stats, Standard Gold/XP
- **Elite**: x2 Stats (HP, Angriff, etc.), +50% Gold/XP
- **Boss**: x5 Stats, +200% Gold/XP

### Skalierung
- Monster-Level = Spieler-Level * (1 + Variation je nach Seltenheit)
- Normal: Spieler-Level * 1.0
- Elite: Spieler-Level * 1.1
- Boss: Spieler-Level * 1.2

### Monster-Attribute (wie Spieler)
- Vitalität → Monster-HP
- Stärke → Monster-Angriff (physisch)
- Intelligenz → Monster-Zauberschaden (magisch)
- Geschicklichkeit → Monster-Ausweichen
- Glück → Monster-Krit-Chance
- Weisheit → Monster-Mana-Regeneration

### Monster-Typen (Beispiele)
- **Goblin** (Stärke-betont, Normal)
- **Skelett-Magier** (Intelligenz-betont, Normal)
- **Ork-Berserker** (Stärke+Glück, Elite)
- **Dungeon-Boss** (Alle Attribute, Boss)

## Dungeon-System
- **Struktur**: Nur Boss-Gegner (keine Räume, nur Boss-Kämpfe)
- **Fortschritt**: Besiege einen Boss → nächster Boss wird freigeschaltet
- **Boss sind gleich für alle Spieler**: Feste Reihenfolge, identische Bosse für jeden Spieler
- **Belohnungen**: Gold, XP, Boss-Schatz (am Ende)
- **Dungeon-Level**: Bosse haben feste Level (Boss N = Level N)
  - Boss 1: Level 1
  - Boss 2: Level 2
  - Boss 3: Level 3
  - ... (linear fortlaufend, kein Max-Level)

## Overworld-System
- **Erkunden**: Spieler kann seinen Helden automatisch erkunden lassen
- **Zeitfenster**: Held erkundet 8 Stunden am Stück, dann Pause bis erneut gestartet
- **Quests**: Held führt alle 0.5 bis 30 Minuten automatisch eine Quest aus (Monster bekämpfen)
- **Dauer-Einfluss**: Je länger die Quest dauert, desto seltener das Monster, desto höher die Belohnung
- **Einschränkung**: Während des Erkundens kann der Held keine Items ausrüsten/wechseln
- **Overworld-Monster**: Normale Monster (keine Bosse) in der Overworld

### Overworld-Quest-Formel
**Seltenheiten (gleichmäßige Verteilung der Dauer):**
- Gewöhnlich (0.5-5 Min)
- Ungewöhnlich (5-10 Min)
- Selten (10-15 Min)
- Legendär (15-20 Min)
- Mythisch (20-25 Min)
- Einzigartig (nur bei 30 Min Dauer)

**Belohnungs-Formel (Gold/XP):**
- Belohnung = Basis * (Dauer in Minuten)^1.3
- Einzigartig: Zusätzlicher Multiplikator x5
- Mythisch: Zusätzlicher Multiplikator x3
- Legendär: Zusätzlicher Multiplikator x2
- Selten: Zusätzlicher Multiplikator x1.5
- Ungewöhnlich: Zusätzlicher Multiplikator x1.2
- Gewöhnlich: Kein extra Multiplikator (x1)

## Item-Typen
- Waffen (Schwerter, Äxte, Bögen, Stäbe)
- Rüstungen (Helme, Rüstungen, Schilde, Handschuhe)
- Accessoires (Ringe, Amulette)
- Scrolls/Zauber
- Tränke

## Item-Skalierung und Seltenheit
- **Skalierungs-Formel**: Attribut = Level^1.5 (für alle Item-Attribute)
- **Seltenheit**: Common (x1), Rare (x1.5), Epic (x2), Legendary (x3)
- Items haben unendliche Stufen (wie Level-System)

## Waffen-System (Klassenspezifisch)

### Reine Klassen (2-Hand Waffen)
1. **Krieger** (Stärke) - Zweihänder (Greatsword) - 2-Hand
2. **Magier** (Intelligenz) - Zauberstab (Magic Staff) - 2-Hand
3. **Schütze** (Geschicklichkeit) - Langbogen (Longbow) - 2-Hand
4. **Priester** (Weisheit) - Krummstab (Crozier) - 2-Hand
5. **Paladin** (Vitalität) - Zweihand-Axt (Great Axe) - 2-Hand
6. **Glücksritter** (Glück) - Glückswürfel-Waffe (Lucky Dice Weapon) - 2-Hand

### Hybrid-Klassen (1-Hand Waffe + Nebenhand ODER 2x 1-Hand Waffen)
1. **Battlemage** (Str+Int) - Schwert (1-Hand) + Zauberbuch (Offhand)
2. **Ranger** (Str+Dex) - Axt (1-Hand) + Schild (Offhand)
3. **Cleric** (Str+Wis) - Kriegshammer (1-Hand) + Heiliges Symbol (Offhand)
4. **Juggernaut** (Str+Vit) - Morgenstern (1-Hand) + Schwerer Schild (Offhand)
5. **Berserker** (Str+Luck) - Einhand-Axt (1-Hand) + Glücksanhänger (Offhand)
6. **Spellbow** (Int+Dex) - Eingefrorener Stab (1-Hand) + Zauberbogen (1-Hand) *oder* Stab + Köcher
7. **Archmage** (Int+Wis) - Zauberstab (1-Hand) + Orb (Offhand)
8. **Warlock** (Int+Vit) - Dämonenstab (1-Hand) + Tomeschild (Offhand)
9. **Gambler** (Int+Luck) - Tarot-Karten (1-Hand) + Glückswürfel (Offhand)
10. **Monk** (Dex+Wis) - Fäustlinge (1-Hand) + Gebetskette (Offhand)
11. **Assassin** (Dex+Luck) - Dolch (1-Hand) + Giftflasche (Offhand)
12. **Evasion Tank** (Dex+Vit) - Speer (1-Hand) + Leichtschild (Offhand)
13. **Healer-Tank** (Wis+Vit) - Mace (1-Hand) + Healing Tome (Offhand)
14. **Lucky Priest** (Wis+Luck) - Krummstab (1-Hand) + Glücksamulett (Offhand)
15. **Tank Berserker** (Vit+Luck) - Zweihand-Hammer (1-Hand) + Glücksschild (Offhand)

## Rüstungs-System
- **Helme**: +Stärke, +Intelligenz, +Geschicklichkeit
- **Rüstungen**: +Vitalität, +Stärke
- **Schilde** (nur für Hybrid-Klassen): +Stärke, +Vitalität
- **Handschuhe**: +Geschicklichkeit, +Stärke
- **Stiefel**: +Geschicklichkeit, +Vitalität

## Art Style
- Humorvolle Karikaturen (wie Shakes and Fidget)

## Zielplattform
- Browser (Web)

## Guild-System
- **Gründung**: 1000 Gold Gründungskosten
- **Mitgliedsbeiträge**: Spieler kann selbst bestimmen, welcher %-Satz von Quest-Belohnungen an die Gilde geht
- **Gilden-Gold**: Wird durch Mitgliedsbeiträge gesammelt, Gilde kann das Gold nutzen für:
  - **Guild-Buffs**: Stat-Boni für alle Mitglieder (z.B. +10% XP, +5% Gold, +Stärke, etc.)
  - **Bessere Belohnungen**: Quests der Mitglieder geben mehr Gold/XP
- **Guild-Features**:
  - **Guild-Quests**: Spezielle Gilden-Quests mit Bonbelohnungen
  - **Gilden-Kämpfe**: Kämpfe zwischen Gilden (PvP)
  - **Gilden-Dungeon**: Exklusive Dungeons nur für Gilden-Mitglieder

## PvP-Arena System
- **Matchmaking**: Kämpfe gegen Spieler mit ähnlicher MMR (Matchmaking Rating)
- **MMR-System**: 
  - MMR erhöht sich bei Sieg, sinkt bei Niederlage
  - Basis-MMR zu Saison-Beginn = F(Level) (z.B. Level * 10)
  - Nach Saison-Start ist MMR unabhängig vom Level/Rang
  - Dadurch spielen neue Spieler (Level 10) gegen ähnliche neue Spieler, nicht gegen Level 1000
- **Belohnungen**:
  - Sieg: Gold, XP, Arena-Punkte (MMR)
  - Niederlage: Kleine Menge Gold/XP als Trostpreis
  - Arena-Items: Exklusive Items nur durch Arena-Siege erhältlich
- **Saison-System**:
  - Alle 30 Tage (1 Monat) neue Saison
  - Rang wird zu Saison-Beginn zurückgesetzt
  - Basis-MMR wird basierend auf aktuellem Level neu berechnet
  - Arena-Items bleiben erhalten nach Saison-Reset

## Referenz: Shakes and Fidget
- Browser-basiertes RPG
- Klicker-Mechaniken mit RPG-Elementen
- Humorvolle Grafik
- Guild-System
- PvP-Arena
