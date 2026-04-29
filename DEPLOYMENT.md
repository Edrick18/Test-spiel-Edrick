# Deployment-Anleitung - Spiel online bringen

## Option 1: Tunneling (Schnellste Lösung für Playtester)

### 1. Tunnel-Services installieren
```bash
# Einmalig installieren
npm install -g localtunnel
# ODER (falls localtunnel nicht funktioniert)
npm install -g ngrok
```

### 2. Backend tunneln (Terminal 1)
```bash
# Mit localtunnel
lt --port 3000

# ODER mit ngrok (nach ngrok-Account-Registrierung)
ngrok http 3000
```
→ Notiere dir die URL (z.B. `https://abc123.loca.lt` oder `https://xyz.ngrok.io`)

### 3. Frontend-URL in main-simple.js anpassen
Öffne `src/main-simple.js` und ändere Zeile 3:
```javascript
// Alt:
const API_BASE = 'http://localhost:3000/api'

// Neu (ersetze TUNNEL_URL mit deiner URL):
const API_BASE = 'https://DEINE_TUNNEL_URL/api'
```

### 4. Frontend neu bauen
```bash
npm run build
```

### 5. Frontend tunneln (Terminal 2)
```bash
# Mit localtunnel
lt --port 5173

# ODER mit ngrok
ngrok http 5173
```
→ Notiere dir die URL (z.B. `https://def456.loca.lt`)

### 6. Playtester können jetzt spielen!
Sende ihnen die **Frontend-URL** aus Schritt 5. Sie müssen nichts installieren!

---

## Option 2: Cloud Deployment (Für dauerhafte Erreichbarkeit)

### Backend deployen (Render.com - kostenlos)

**Problem**: SQLite funktioniert in der Cloud nicht gut (Dateisystem ist ephemeral)

**Lösung A**: PostgreSQL auf Render nutzen
1. Erstelle kostenlose PostgreSQL auf Render.com
2. Ändere `server/src/models/database.ts`:
```typescript
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // Render gibt das automatisch
  ssl: { rejectUnauthorized: false }
})
```
3. Führe das Schema in `server/src/models/schema.sql` auf der Render-PostgreSQL aus

**Lösung B**: Railway.app (unterstützt SQLite mit Volumes)
1. Railway.app registrieren
2. Projekt von GitHub importieren
3. Volume für SQLite-Datei hinzufügen

### Frontend deployen (Vercel.com - kostenlos)

1. [vercel.com](https://vercel.com) → "New Project"
2. GitHub-Repo verbinden
3. Settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Environment Variable: `VITE_API_URL=https://dein-backend.onrender.com`
5. In `vite.config.js` die API-URL aus der Environment-Variable nutzen

---

## Schnell-Start für Playtester (Empfohlen):

Für sofortige Tester nutze **Option 1 (Tunneling)**:
1. `start-deploy.bat` doppelklicken (siehe unten)
2. URL an Tester senden
3. Fertig!

## Wichtige Hinweise:
- ⚠️ **SQLite**: Funktioniert nicht auf stateless Cloud-Plattformen (Render, Heroku, etc.)
- ✅ **Für Playtests**: Tunneling ist völlig okay
- 🚀 **Für Produktion**: Später auf PostgreSQL wechseln

## Nächste Schritte:
1. [ ] Tunneling testen
2. [ ] GitHub-Repo erstellen (für Cloud-Deployment)
3. [ ] Entscheiden: PostgreSQL für Produktion?
