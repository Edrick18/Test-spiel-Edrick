# AGENTS.md - Workflow-Anleitung für KI-Agenten

## Projektübersicht
Dies ist ein Spiel-Projekt (ähnlich wie "Shakes and Fidget"). Der Agent muss bei Kontext-Reset oder Zusammenfassung effizient weiterarbeiten können.

## Wichtige Regeln
1. **Immer zuerst lesen**: Lies `GAME_DESIGN.md`, `ARCHITECTURE.md` und `TASKS.md` beim Start/Reset
2. **Kontext verstehen**: Analysiere bestehenden Code in `src/` bevor Änderungen gemacht werden
3. **Struktur beibehalten**: Nutze die bestehende Verzeichnisstruktur und Code-Konventionen
4. **Aufgaben tracken**: Aktualisiere `TASKS.md` nach jeder abgeschlossenen Aufgabe
5. **Dokumentation pflegen**: Halte `GAME_DESIGN.md` und `ARCHITECTURE.md` aktuell
6. **Code-Prüfung vor Änderungen**: Vor jeder Code-Änderung:
   - Prüfe Sinnhaftigkeit, Kompaktheit und Effizienz des Codes
   - Ändere nur wirklich relevante Code-Bereiche
   - Bei mehrdeutigen Anforderungen: Frage so lange nach, bis keine Interpretationsspielräume mehr bestehen
7. **Keine Annahmen**: Prüfe alles explizit nach, anstatt Annahmen zu treffen (Bibliotheken vorhanden? Pfade existieren? Variablen definiert?)
8. **Inkrementelle Änderungen**: Mache kleine, testbare Änderungen statt großer Rewrites. Teste nach jedem Schritt.
9. **Seiteneffekte prüfen**: Analysiere welche anderen Teile des Codes von einer Änderung betroffen sein könnten
10. **Existierende Muster nutzen**: Suche nach ähnlichen Implementierungen im Code und folge deren Stil
11. **Duplikate vermeiden**: Prüfe ob ähnliche Funktionalität bereits existiert, bevor neuen Code schreibst
12. **Fehlerbehandlung**: Berücksichtige Edge Cases und mögliche Fehlerquellen (null-checks, Array-Grenzen, etc.)
13. **Dependencies prüfen**: Verifiziere ob benötigte Bibliotheken/Frameworks im Projekt verfügbar sind, bevor du sie nutzt
14. **Sicherheit**: Niemals Secrets, API-Keys oder Passwörter in Code schreiben. Keine unsicheren Operationen.
15. **Validierung**: Prüfe Input/Output von Funktionen. Stelle sicher dass Daten im erwarteten Format vorliegen
16. **Lint/Typecheck**: Führe nach Code-Änderungen immer Linting und Typechecking aus (falls konfiguriert)
17. **Dokumentation synchronisieren**: Halte Code und Dokumentation konsistent. Wenn sich Code ändert, prüfe ob Docs aktualisiert werden müssen
18. **Tests schreiben**: Schreibe Tests für neue Funktionalität. Führe existierende Tests aus bevor du Änderungen commitest

## Dateien die beim Reset gelesen werden müssen (in Reihenfolge)
1. `TASKS.md` - Aktueller Status und nächste Schritte
2. `GAME_DESIGN.md` - Spielkonzept und Anforderungen
3. `ARCHITECTURE.md` - Technischer Aufbau
4. `src/` - Existierenden Code verstehen

## Code-Konventionen
- Sprache: [Wird in ARCHITECTURE.md festgelegt]
- Framework: [Wird in ARCHITECTURE.md festgelegt]
- Naming: [Wird in ARCHITECTURE.md festgelegt]

## Kommandos
- Lint: [Wird in ARCHITECTURE.md ergänzt]
- Build: [Wird in ARCHITECTURE.md ergänzt]
- Test: [Wird in ARCHITECTURE.md ergänzt]

## Workflow
1. Lies relevante Dokumentation
2. Verstehe bestehenden Code
3. Führe Aufgabe aus
4. Aktualisiere TASKS.md
5. Lint/Typecheck falls nötig
