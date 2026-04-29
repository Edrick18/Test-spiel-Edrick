-- Setup-Skript für PostgreSQL Datenbank
-- Führe dieses Skript aus: psql -U postgres -f setup-db.sql

-- Datenbank erstellen (falls noch nicht vorhanden)
CREATE DATABASE game_db;

-- Verbindung zur Datenbank herstellen
\c game_db

-- Sachema anwenden (aus schema.sql)
\i server/src/models/schema.sql