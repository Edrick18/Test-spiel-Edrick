# Shakes & Fidget Clone - Cloud Deployment

## Schritt 1: GitHub Repository erstellen

1. Gehe zu [github.com/new](https://github.com/new)
2. Repository-Name: `shakes-fidget-clone`
3. **Wichtig**: Hake das Repository **PUBLIC** (für kostenlose Deployment-Services)
4. Klicke "Create repository"

## Schritt 2: Code zu GitHub pushen

Öffne ein Terminal im Projektordner:

```bash
# Initialisiere Git (falls noch nicht geschehen)
git init

# Füge alle Dateien hinzu (außer node_modules, dist, etc.)
git add .

# Erstelle ersten Commit
git commit -m "Initial commit: Shakes & Fidget Clone with Backend"

# Verbinde mit GitHub (ERSETZE DEIN_USERNAME)
git remote add origin https://github.com/DEIN_USERNAME/shakes-fidget-clone.git

# Pushe den Code
git push -u origin main
```

## Schritt 3: Backend auf Render.com deployen

1. Gehe zu [render.com](https://render.com) und registriere dich (kostenlos)
2. Klicke "New +" → "Web Service"
3. Verbinde dein GitHub-Account
4. Wähle das `shakes-fidget-clone` Repository
5. Konfiguration:
   - **Name**: `shakes-fidget-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: `Free`

6. **Environment Variables** hinzufügen:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = (wird automatisch durch Render PostgreSQL erstellt)

7. Klicke "Create Web Service"

8. **PostgreSQL Datenbank erstellen**:
   - Gehe auf Render Dashboard → "New +" → "PostgreSQL"
   - Name: `shakes-fidget-db`
   - Plan: `Free`
   - Nach Erstellung: Kopiere die "Internal Database URL"

9. **Verbinde Datenbank mit Backend**:
   - Gehe zum Backend-Service → "Environment" Tab
   - Füge `DATABASE_URL` hinzu mit der kopierten URL

10. **Schema ausführen**:
   - Nach dem ersten Deploy: Gehe zu "Shell" Tab im Backend-Service
   - Führe aus: `psql $DATABASE_URL -f server/schema.sql`

## Schritt 4: Frontend auf Vercel.com deployen

1. Gehe zu [vercel.com](https://vercel.com) und registriere dich (kostenlos)
2. Klicke "New Project"
3. Importiere das `shakes-fidget-clone` Repository von GitHub
4. Konfiguration:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Environment Variables** hinzufügen:
   - `VITE_API_URL` = `https://dein-backend-name.onrender.com`

6. Klicke "Deploy"

## Schritt 5: Frontend neu bauen mit korrekter API-URL

Nach dem Backend-Deployment auf Render:

1. Ändere `vite.config.js` oder setze die Environment-Variable:
```javascript
// In vite.config.js ist bereits definiert:
define: {
  'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://dein-backend.onrender.com')
}
```

2. Pushe die Änderungen:
```bash
git add .
git commit -m "Configure API URL for production"
git push origin main
```

3. Vercel wird automatisch neu deployen!

## Schritt 6: Spiel testen

1. Öffne die Vercel-URL (z.B. `https://shakes-fidget-clone.vercel.app`)
2. Registriere dich und spiele!

## Wichtige Hinweise:

- ✅ Render.com bietet **kostenlose PostgreSQL** (limitiert auf 1GB)
- ✅ Vercel.com bietet **kostenloses Hosting** für statische Seiten
- ⚠️ Die kostenlose Render-Instanz "schläft" nach 15 Min Inaktivität (erster Request dauert bis zu 30 Sek)
- ⚠️ Ändere `src/main-simple.js` Zeile 3 auf:
  ```javascript
  const API_BASE = process.env.VITE_API_URL 
    ? process.env.VITE_API_URL + '/api' 
    : 'http://localhost:3000/api'
  ```

## URLs nach Deployment:

- **Frontend**: `https://dein-projekt.vercel.app`
- **Backend**: `https://dein-backend.onrender.com`
- **API Health Check**: `https://dein-backend.onrender.com/api/health`

## Nächste Schritte:

1. [ ] GitHub-Repo erstellen
2. [ ] Backend auf Render deployen (mit PostgreSQL)
3. [ ] Frontend auf Vercel deployen
4. [ ] Schema auf PostgreSQL ausführen
5. [ ] Spiel online testen!
