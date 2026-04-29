// Monster-Interface (ohne TypeScript-Importe)
export class CombatSystem {
  static calculateDamage(attacker, isMagical = false) {
    var baseDamage
    
    if (isMagical) {
      baseDamage = attacker.intelligence * 2 + attacker.wisdom * 1
    } else {
      baseDamage = attacker.strength * 2 + attacker.dexterity * 1
    }
    
    var randomFactor = 0.9 + Math.random() * 0.2
    
    return Math.max(1, Math.floor(baseDamage * randomFactor))
  }

  static checkDodge(defender) {
    var dodgeRoll = Math.random() * 100
    return dodgeRoll < defender.dodge_chance
  }

  static checkCritical(attacker) {
    var critRoll = Math.random() * 100
    return critRoll < attacker.crit_chance
  }

  static applyArmor(damage, armor) {
    return Math.max(1, damage - armor / 2)
  }

  static executeCombat(player, monster) {
    return new Promise((resolve) => {
      var playerHP = player.hp
      var monsterHP = monster.hp
      var turns = 0
      
      var fight = () => {
        if (playerHP <= 0 || monsterHP <= 0 || turns >= 100) {
          var playerWon = monsterHP <= 0
          var goldEarned = playerWon ? this.calculateGoldReward(monster) : 0
          var xpEarned = playerWon ? this.calculateXPReward(monster) : 0
          
          resolve({
            winner: playerWon ? 'player' : 'monster',
            player_hp_remaining: playerHP,
            monster_hp_remaining: monsterHP,
            turns: turns,
            gold_earned: goldEarned,
            xp_earned: xpEarned
          })
          return
        }
        
        // Spieler greift an
        if (!this.checkDodge(monster)) {
          var playerDamage = this.calculateDamage(player, this.isMagicalClass(player))
          var finalDamage = this.applyArmor(playerDamage, monster.armor)
          
          if (this.checkCritical(player)) {
            finalDamage *= 2
          }
          
          monsterHP = Math.max(0, monsterHP - finalDamage)
        }
        
        if (monsterHP <= 0) {
          fight()
          return
        }
        
        // Monster greift an
        if (!this.checkDodge(player)) {
          var monsterDamage = this.calculateDamage(monster, this.isMonsterMagical(monster))
          var finalDamage = this.applyArmor(monsterDamage, player.armor)
          
          if (this.checkCritical(monster)) {
            finalDamage *= 2
          }
          
          playerHP = Math.max(0, playerHP - finalDamage)
        }
        
        turns++
        setTimeout(fight, 100) // Simuliere Kampf-Ticks
      }
      
      fight()
    })
  }

  static isMagicalClass(character) {
    var magicalClasses = ['Magier', 'Priester', 'Archmage', 'Warlock', 'Gambler', 'Monk', 'Healer-Tank', 'Lucky Priest']
    return magicalClasses.includes(character.class_type)
  }

  static isMonsterMagical(monster) {
    return monster.intelligence > monster.strength
  }

  static calculateGoldReward(monster) {
    var baseGold = monster.level * 10
    var rarityMultiplier = monster.rarity === 'elite' ? 1.5 : monster.rarity === 'boss' ? 3 : 1
    return Math.floor(baseGold * rarityMultiplier)
  }

  static calculateXPReward(monster) {
    var baseXP = monster.level * 20
    var rarityMultiplier = monster.rarity === 'elite' ? 1.5 : monster.rarity === 'boss' ? 3 : 1
    return Math.floor(baseXP * rarityMultiplier)
  }
}
