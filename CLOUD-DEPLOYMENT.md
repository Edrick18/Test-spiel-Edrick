# Spiel online bringen - Cloud Deployment#

## Schritt 1: GitHub Repository erstellen#

1. Gehe zu [github.com/new](https://github.com/new)
2. **Repository-Name**: `Test-spiel-Edrick`
3. **Wichtig**: Wähle **Public** (für kostenlose Services)
4. **Keinen** Haken bei "Initialize with README"
5. Klicke **"Create repository"**

---

## Schritt 2: Code zu GitHub pushen#

Öffne ein Terminal im Projektordner (`C:\Users\Lutz\Desktop\spiel wie shakes and fidged`):

```bash
# Git initialisieren (falls noch nicht geschehen)
git init

# .gitignore erstellen
echo node_modules > .gitignore
echo dist >> .gitignore
echo .env >> .gitignore
echo *.db >> .gitignore
echo server\node_modules >> .gitignore

# Alle Dateien hinzufügen
git add .

# Ersten Commit machen
git commit -m "Ready for cloud deployment: Backend + Frontend"

# GitHub verbinden (ERSETZE DEIN_USERNAME)
git remote add origin https://github.com/DEIN_USERNAME/Test-spiel-Edrick.git

# Code pushen
git branch -M main
git push -u origin main
```

---

## Schritt 3: Backend auf Render.com deployen# (10 Min)

1. Gehe zu [render.com](https://render.com) → Registrieren (kostenlos)
2. Klicke **"New +"** → **"Web Service"**
3. Verbinde deinen GitHub-Account
4. Wähle das Repo `Test-spiel-Edrick`
5. Konfiguration:
   - **Name**: `Test-spiel-Edrick-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: `Free`

6. **Environment Variables** hinzufügen:
   - `NODE_ENV` = `production`

7. Klicke **"Create Web Service"**

8. **PostgreSQL Datenbank erstellen**:
   - Im Render-Dashboard: **"New +"** → **"PostgreSQL"**
   - **Name**: `Test-spiel-Edrick-db`
   - **Plan**: `Free`
   - Nach Erstellung: Kopiere die **"Internal Database URL"**

9. **Datenbank-URL zum Backend hinzufügen**:
   - Gehe zum Backend-Service → **"Environment"** Tab
   - Füge `DATABASE_URL` hinzu (kopierte URL aus Schritt 8)

10. **Schema ausführen**:
    - Gehe zum Backend-Service → **"Shell"** Tab
    - Führe aus: `psql $DATABASE_URL -f server/schema.sql`

---

## Schritt 4: Frontend auf Vercel.com deployen# (5 Min)

1. Gehe zu [vercel.com](https://vercel.com) → Registrieren (kostenlos)
2. Klicke **"New Project"**
3. Importiere das Repo `Test-spiel-Edrick`
4. Konfiguration:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Root Directory**: `./` (Hauptverzeichnis)

5. **Environment Variables** hinzufügen:
   - `VITE_API_URL` = `https://Test-spiel-Edrick-backend.onrender.com`

6. Klicke **"Deploy"**

---

## Schritt 5: Spiel testen#

Nach dem Deployment:
1. Vercel zeigt dir eine URL: `https://Test-spiel-Edrick.vercel.app`
2. Öffne die URL im Browser
3. Registriere dich und spiele!

---

## Wichtige Hinweise:#

- ✅ Render.com bietet **kostenlose PostgreSQL** (limitiert auf 1GB)
- ✅ Vercel.com bietet **kostenloses Hosting** für statische Seiten
- ⚠️ Die kostenlose Render-Instanz "schläft" nach 15 Min Inaktivität (erster Request dauert bis zu 30 Sek)
- ⚠️ Ändere `src/main-simple.js` Zeile 4-8 auf:
  ```javascript
  const API_BASE = typeof import.meta !== 'undefined' && import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL + '/api' 
    : 'http://localhost:3000/api'
  ```

## URLs nach Deployment:#

- **Frontend**: `https://Test-spiel-Edrick.vercel.app`
- **Backend**: `https://Test-spiel-Edrick-backend.onrender.com`
- **API Health Check**: `https://Test-spiel-Edrick-backend.onrender.com/api/health`

---

## Nächste Schritte:#

1. [ ] GitHub-Repo erstellen (Schritt 1)
2. [ ] Code zu GitHub pushen (Schritt 2)
3. [ ] Backend auf Render deployen (Schritt 3)
4. [ ] Frontend auf Vercel deployen (Schritt 4)
5. [ ] Spiel online testen!

Viel Erfolg beim Deployment! 🎮
