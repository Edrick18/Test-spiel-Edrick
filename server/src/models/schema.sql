-- Datenbank-Schema für Shakes & Fidget Clone

-- Benutzer-Tabelle
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Charaktere-Tabelle
CREATE TABLE IF NOT EXISTS characters (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  class_type VARCHAR(50) NOT NULL,
  
  -- Level & XP
  level INTEGER DEFAULT 1,
  xp BIGINT DEFAULT 0,
  gold BIGINT DEFAULT 0,
  
  -- Attribute (6 Hauptattribute)
  vitality INTEGER DEFAULT 10,
  strength INTEGER DEFAULT 10,
  intelligence INTEGER DEFAULT 10,
  dexterity INTEGER DEFAULT 10,
  luck INTEGER DEFAULT 10,
  wisdom INTEGER DEFAULT 10,
  
  -- Berechnete Werte
  hp INTEGER DEFAULT 100,
  max_hp INTEGER DEFAULT 100,
  mana INTEGER DEFAULT 50,
  max_mana INTEGER DEFAULT 50,
  armor INTEGER DEFAULT 20,
  dodge_chance DECIMAL(5,2) DEFAULT 5.0,
  crit_chance DECIMAL(5,2) DEFAULT 5.0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items-Tabelle
CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'weapon', 'armor', 'accessory', 'scroll', 'potion'
  class_restriction VARCHAR(50), -- NULL = alle Klassen
  level_requirement INTEGER DEFAULT 1,
  rarity VARCHAR(20) DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
  
  -- Item-Attribute (welche Stats erhöht)
  vitality_bonus INTEGER DEFAULT 0,
  strength_bonus INTEGER DEFAULT 0,
  intelligence_bonus INTEGER DEFAULT 0,
  dexterity_bonus INTEGER DEFAULT 0,
  luck_bonus INTEGER DEFAULT 0,
  wisdom_bonus INTEGER DEFAULT 0,
  
  price BIGINT DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventar-Tabelle (Spieler-Inventar)
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
  item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  equipped BOOLEAN DEFAULT FALSE,
  slot VARCHAR(20), -- 'weapon', 'offhand', 'helmet', 'armor', 'shield', 'gloves', 'boots', 'ring', 'amulet'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guilds-Tabelle
CREATE TABLE IF NOT EXISTS guilds (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  leader_id INTEGER REFERENCES characters(id),
  gold BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guild-Mitglieder
CREATE TABLE IF NOT EXISTS guild_members (
  id SERIAL PRIMARY KEY,
  guild_id INTEGER REFERENCES guilds(id) ON DELETE CASCADE,
  character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
  contribution_percent DECIMAL(5,2) DEFAULT 0.0, -- Prozentsatz der Beiträge
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PvP-Arena Tabelle
CREATE TABLE IF NOT EXISTS pvp_matches (
  id SERIAL PRIMARY KEY,
  challenger_id INTEGER REFERENCES characters(id),
  defender_id INTEGER REFERENCES characters(id),
  winner_id INTEGER REFERENCES characters(id),
  challenger_mmr_before INTEGER,
  defender_mmr_before INTEGER,
  mmr_change INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tägliche Quests
CREATE TABLE IF NOT EXISTS daily_quests (
  id SERIAL PRIMARY KEY,
  character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
  quest_type VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL, -- 'gewöhnlich', 'ungewöhnlich', etc.
  duration_minutes INTEGER,
  reward_gold BIGINT,
  reward_xp BIGINT,
  completed BOOLEAN DEFAULT FALSE,
  reset_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dungeon-Progress (welcher Boss wurde besiegt)
CREATE TABLE IF NOT EXISTS dungeon_progress (
  id SERIAL PRIMARY KEY,
  character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
  boss_level INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Overworld-Quests (automatische Quests)
CREATE TABLE IF NOT EXISTS overworld_quests (
  id SERIAL PRIMARY KEY,
  character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
  monster_rarity VARCHAR(20) NOT NULL,
  duration_minutes INTEGER,
  reward_gold BIGINT,
  reward_xp BIGINT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indizes für Performance
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_character_id ON inventory(character_id);
CREATE INDEX IF NOT EXISTS idx_guild_members_guild_id ON guild_members(guild_id);
CREATE INDEX IF NOT EXISTS idx_pvp_matches_challenger ON pvp_matches(challenger_id);
CREATE INDEX IF NOT EXISTS idx_daily_quests_character_reset ON daily_quests(character_id, reset_at);