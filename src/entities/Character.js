// Charakter-Berechnungen für das Frontend

export function calculateBaseStats(character) {
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
