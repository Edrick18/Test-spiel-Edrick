import { Character } from '../entities/Character'

// Monster-Interface (vereinfacht)
export interface Monster {
  name: string
  level: number
  vitality: number
  strength: number
  intelligence: number
  dexterity: number
  luck: number
  wisdom: number
  hp: number
  max_hp: number
  armor: number
  dodge_chance: number
  crit_chance: number
}

// Kampf-Resultat
export interface CombatResult {
  winner: 'player' | 'monster'
  player_hp_remaining: number
  monster_hp_remaining: number
  turns: number
  gold_earned: number
  xp_earned: number
}

export class CombatSystem {
  // Berechne Schaden (physisch oder magisch)
  static calculateDamage(attacker: Character | Monster, isMagical: boolean = false): number {
    let baseDamage: number
    
    if (isMagical) {
      // Magischer Schaden: Intelligenz * 2 + Weisheit * 1
      baseDamage = attacker.intelligence * 2 + attacker.wisdom * 1
    } else {
      // Physischer Schaden: Stärke * 2 + Geschicklichkeit * 1
      baseDamage = attacker.strength * 2 + attacker.dexterity * 1
    }
    
    // Zufallsfaktor 0.9 bis 1.1
    const randomFactor = 0.9 + Math.random() * 0.2
    
    return Math.max(1, Math.floor(baseDamage * randomFactor))
  }

  // Prüfe Ausweichen
  static checkDodge(defender: Character | Monster): boolean {
    const dodgeRoll = Math.random() * 100
    return dodgeRoll < defender.dodge_chance
  }

  // Prüfe Kritischer Treffer
  static checkCritical(attacker: Character | Monster): boolean {
    const critRoll = Math.random() * 100
    return critRoll < attacker.crit_chance
  }

  // Berechne Rüstungsreduktion
  static applyArmor(damage: number, armor: number): number {
    // Schaden = Max(1, Angriff - Rüstung/2)
    return Math.max(1, damage - armor / 2)
  }

  // Führe einen Kampf durch (vollautomatisch)
  static async executeCombat(player: Character, monster: Monster): Promise<CombatResult> {
    let playerHP = player.hp
    let monsterHP = monster.hp
    let turns = 0
    
    // Kampf-Schleife (max 100 Runden)
    while (playerHP > 0 && monsterHP > 0 && turns < 100) {
      turns++
      
      // Spieler greift an
      if (!this.checkDodge(monster)) {
        const playerDamage = this.calculateDamage(player, this.isMagicalClass(player))
        let finalDamage = this.applyArmor(playerDamage, monster.armor)
        
        if (this.checkCritical(player)) {
          finalDamage *= 2
        }
        
        monsterHP = Math.max(0, monsterHP - finalDamage)
      }
      
      if (monsterHP <= 0) break
      
      // Monster greift an
      if (!this.checkDodge(player)) {
        const monsterDamage = this.calculateDamage(monster, this.isMonsterMagical(monster))
        let finalDamage = this.applyArmor(monsterDamage, player.armor)
        
        if (this.checkCritical(monster)) {
          finalDamage *= 2
        }
        
        playerHP = Math.max(0, playerHP - finalDamage)
      }
    }
    
    // Resultat
    const playerWon = monsterHP <= 0
    const goldEarned = playerWon ? this.calculateGoldReward(monster) : 0
    const xpEarned = playerWon ? this.calculateXPReward(monster) : 0
    
    return {
      winner: playerWon ? 'player' : 'monster',
      player_hp_remaining: playerHP,
      monster_hp_remaining: monsterHP,
      turns,
      gold_earned: goldEarned,
      xp_earned: xpEarned
    }
  }

  // Hilfsfunktionen
  private static isMagicalClass(character: Character): boolean {
    const magicalClasses = ['Magier', 'Priester', 'Archmage', 'Warlock', 'Gambler', 'Monk', 'Healer-Tank', 'Lucky Priest']
    return magicalClasses.includes(character.class_type)
  }

  private static isMonsterMagical(monster: Monster): boolean {
    return monster.intelligence > monster.strength
  }

  private static calculateGoldReward(monster: Monster): number {
    const baseGold = monster.level * 10
    const rarityMultiplier = monster.rarity === 'elite' ? 1.5 : monster.rarity === 'boss' ? 3 : 1
    return Math.floor(baseGold * rarityMultiplier)
  }

  private static calculateXPReward(monster: Monster): number {
    const baseXP = monster.level * 20
    const rarityMultiplier = monster.rarity === 'elite' ? 1.5 : monster.rarity === 'boss' ? 3 : 1
    return Math.floor(baseXP * rarityMultiplier)
  }
}
