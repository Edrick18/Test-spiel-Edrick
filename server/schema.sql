-- PostgreSQL Schema for Shakes & Fidget Clone
-- Run this on your PostgreSQL database (Render provides this)

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Characters table
CREATE TABLE IF NOT EXISTS characters (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  class_type VARCHAR(255) NOT NULL,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  gold INTEGER DEFAULT 0,
  vitality INTEGER DEFAULT 10,
  strength INTEGER DEFAULT 10,
  intelligence INTEGER DEFAULT 10,
  dexterity INTEGER DEFAULT 10,
  luck INTEGER DEFAULT 10,
  wisdom INTEGER DEFAULT 10,
  hp INTEGER DEFAULT 100,
  mana INTEGER DEFAULT 50,
  armor INTEGER DEFAULT 20,
  dodge_chance REAL DEFAULT 5,
  crit_chance REAL DEFAULT 5,
  equipped_weapon VARCHAR(255),
  equipped_armor VARCHAR(255),
  equipped_accessory VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Items table
CREATE TABLE IF NOT EXISTS items (
  id VARCHAR(255) PRIMARY KEY,
  character_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  rarity VARCHAR(255) NOT NULL,
  level INTEGER NOT NULL,
  vitality_bonus INTEGER DEFAULT 0,
  strength_bonus INTEGER DEFAULT 0,
  intelligence_bonus INTEGER DEFAULT 0,
  dexterity_bonus INTEGER DEFAULT 0,
  luck_bonus INTEGER DEFAULT 0,
  wisdom_bonus INTEGER DEFAULT 0,
  hp_bonus INTEGER DEFAULT 0,
  mana_bonus INTEGER DEFAULT 0,
  armor_bonus INTEGER DEFAULT 0,
  slot VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (character_id) REFERENCES characters(id)
);

-- Guilds table
CREATE TABLE IF NOT EXISTS guilds (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  leader_id VARCHAR(255) NOT NULL,
  gold INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (leader_id) REFERENCES users(id)
);

-- Guild members table
CREATE TABLE IF NOT EXISTS guild_members (
  guild_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  role VARCHAR(255) DEFAULT 'member',
  contribution_percent INTEGER DEFAULT 10,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (guild_id, user_id),
  FOREIGN KEY (guild_id) REFERENCES guilds(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- PvP matches table
CREATE TABLE IF NOT EXISTS pvp_matches (
  id VARCHAR(255) PRIMARY KEY,
  challenger_id VARCHAR(255) NOT NULL,
  defender_id VARCHAR(255) NOT NULL,
  winner_id VARCHAR(255) NOT NULL,
  challenger_mmr_before INTEGER,
  defender_mmr_before INTEGER,
  challenger_mmr_after INTEGER,
  defender_mmr_after INTEGER,
  fought_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (challenger_id) REFERENCES characters(id),
  FOREIGN KEY (defender_id) REFERENCES characters(id),
  FOREIGN KEY (winner_id) REFERENCES characters(id)
);

-- Dungeon progress table
CREATE TABLE IF NOT EXISTS dungeon_progress (
  character_id VARCHAR(255) PRIMARY KEY,
  current_boss INTEGER DEFAULT 0,
  highest_boss INTEGER DEFAULT 0,
  last_fought_at TIMESTAMP,
  FOREIGN KEY (character_id) REFERENCES characters(id)
);

-- Daily quests table
CREATE TABLE IF NOT EXISTS daily_quests (
  id VARCHAR(255) PRIMARY KEY,
  character_id VARCHAR(255) NOT NULL,
  quest_type VARCHAR(255) NOT NULL,
  duration INTEGER NOT NULL,
  reward_gold INTEGER NOT NULL,
  reward_xp INTEGER NOT NULL,
  completed INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (character_id) REFERENCES characters(id)
);

-- Hideout table
CREATE TABLE IF NOT EXISTS hideout (
  character_id VARCHAR(255) PRIMARY KEY,
  level INTEGER DEFAULT 1,
  passive_income INTEGER DEFAULT 0,
  last_collected TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (character_id) REFERENCES characters(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_items_character_id ON items(character_id);
CREATE INDEX IF NOT EXISTS idx_guild_members_guild_id ON guild_members(guild_id);
CREATE INDEX IF NOT EXISTS idx_guild_members_user_id ON guild_members(user_id);
CREATE INDEX IF NOT EXISTS idx_pvp_matches_challenger ON pvp_matches(challenger_id);
CREATE INDEX IF NOT EXISTS idx_pvp_matches_defender ON pvp_matches(defender_id);
CREATE INDEX IF NOT EXISTS idx_daily_quests_character_id ON daily_quests(character_id);
