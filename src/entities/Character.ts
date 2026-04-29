// Charakter-Klasse für das Frontend
export interface CharacterStats {
  vitality: number
  strength: number
  intelligence: number
  dexterity: number
  luck: number
  wisdom: number
}

export interface Character {
  id: number
  user_id: number
  name: string
  class_type: string
  level: number
  xp: number
  gold: number
  vitality: number
  strength: number
  intelligence: number
  dexterity: number
  luck: number
  wisdom: number
  hp: number
  max_hp: number
  mana: number
  max_mana: number
  armor: number
  dodge_chance: number
  crit_chance: number
  created_at: string
  updated_at: string
}

// Klassen-Definitionen
export const CLASS_STATS: Record<string, Partial<CharacterStats>> = {
  'Krieger': { strength: 15, vitality: 10 },
  'Magier': { intelligence: 15, wisdom: 10 },
  'Schütze': { dexterity: 15, strength: 5 },
  'Priester': { wisdom: 15, intelligence: 10 },
  'Paladin': { vitality: 15, strength: 10 },
  'Glücksritter': { luck: 15, vitality: 5 },
  // Hybrid-Klassen...
}

// Berechne Grundwerte basierend auf Stats
export function calculateBaseStats(character: Character): void {
  // HP: 100 + (Vitalität * 10)
  character.max_hp = 100 + (character.vitality * 10)
  
  // Mana: 50 + (Intelligenz * 5)
  character.max_mana = 50 + (character.intelligence * 5)
  
  // Rüstung: Stärke * 2
  character.armor = character.strength * 2
  
  // Ausweichchance: min(75%, 5% + Geschicklichkeit * 0.5%)
  character.dodge_chance = Math.min(75, 5 + (character.dexterity * 0.5))
  
  // Krit-Chance: min(100%, 5% + Glück * 1%)
  character.crit_chance = Math.min(100, 5 + (character.luck * 1))
}