import { Scene } from 'phaser'
import { Character } from '../entities/Character'
import { CombatSystem, Monster, CombatResult } from '../systems/CombatSystem'

export class GameLoop {
  constructor(scene) {
    this.scene = scene
  }

  setPlayer(player) {
    this.player = player
  }

  startOverworldQuest(durationMinutes) {
    if (!this.player || this.isCombatActive) return
    
    var rarity = this.getRarityByDuration(durationMinutes)
    var levelFactor = rarity === 'Einzigartig' ? 1.2 : rarity === 'Mythisch' ? 1.1 : 1.0
    var monsterLevel = Math.floor(this.player.level * levelFactor)
    
    this.currentMonster = this.createMonster(monsterLevel, rarity)
    this.isCombatActive = true
    
    this.executeQuestCombat()
  }

  executeQuestCombat() {
    if (!this.player || !this.currentMonster) return
    
    this.scene.add.text(100, 200, 'Kampf gegen ' + this.currentMonster.name + '!', { fontSize: '20px', color: '#ff0' })
    
    CombatSystem.executeCombat(this.player, this.currentMonster).then(result => {
      this.showCombatResult(result)
      this.updatePlayerAfterCombat(result)
      this.isCombatActive = false
    })
  }

  showCombatResult(result) {
    var text = result.winner === 'player' 
      ? 'SieG! ' + result.gold_earned + ' Gold, ' + result.xp_earned + ' XP'
      : 'Niederlage...'
    
    this.scene.add.text(100, 250, text, { fontSize: '18px', color: result.winner === 'player' ? '#0f0' : '#f00' })
  }

  updatePlayerAfterCombat(result) {
    if (!this.player) return
    
    this.player.hp = result.player_hp_remaining
    this.player.gold += result.gold_earned
    this.player.xp += result.xp_earned
    
    this.checkLevelUp()
  }

  checkLevelUp() {
    if (!this.player) return
    
    var xpNeeded = Math.floor(100 * Math.pow(this.player.level, 1.5))
    
    while (this.player.xp >= xpNeeded) {
      this.player.xp -= xpNeeded
      this.player.level++
      
      this.player.strength += 5
      this.player.intelligence += 5
      this.player.dexterity += 5
      this.player.vitality += 5
      this.player.luck += 5
      this.player.wisdom += 5
      
      this.player.max_hp = 100 + (this.player.vitality * 10)
      this.player.max_mana = 50 + (this.player.intelligence * 5)
      this.player.armor = this.player.strength * 2
      this.player.dodge_chance = Math.min(75, 5 + (this.player.dexterity * 0.5))
      this.player.crit_chance = Math.min(100, 5 + (this.player.luck * 1))
      
      this.player.hp = this.player.max_hp
      this.player.mana = this.player.max_mana
      
      this.scene.add.text(100, 300, 'Level Up! Jetzt Level ' + this.player.level, { fontSize: '24px', color: '#ff0' })
    }
  }

  getRarityByDuration(minutes) {
    if (minutes >= 30) return 'Einzigartig'
    if (minutes >= 25) return 'Mythisch'
    if (minutes >= 20) return 'Legendär'
    if (minutes >= 15) return 'Selten'
    if (minutes >= 10) return 'Ungewöhnlich'
    return 'Gewöhnlich'
  }

  createMonster(level, rarity) {
    var baseStats = {
      vitality: level * 10,
      strength: level * 8,
      intelligence: level * 8,
      dexterity: level * 6,
      luck: level * 5,
      wisdom: level * 5
    }
    
    var multiplier = rarity === 'Einzigartig' ? 5 : rarity === 'Mythisch' ? 3 : rarity === 'Legendär' ? 2 : rarity === 'Selten' ? 1.5 : 1
    
    return {
      name: 'Monster Level ' + level,
      level: level,
      vitality: Math.floor(baseStats.vitality * multiplier),
      strength: Math.floor(baseStats.strength * multiplier),
      intelligence: Math.floor(baseStats.intelligence * multiplier),
      dexterity: Math.floor(baseStats.dexterity * multiplier),
      luck: Math.floor(baseStats.luck * multiplier),
      wisdom: Math.floor(baseStats.wisdom * multiplier),
      hp: Math.floor((100 + (baseStats.vitality * 10)) * multiplier),
      max_hp: Math.floor((100 + (baseStats.vitality * 10)) * multiplier),
      armor: Math.floor(baseStats.strength * 2 * multiplier),
      dodge_chance: Math.min(75, 5 + (baseStats.dexterity * 0.5)),
      crit_chance: Math.min(100, 5 + (baseStats.luck * 1))
    }
  }
}

// Instanzvariablen definieren (da keine TypeScript-Klassen)
GameLoop.prototype.scene = null
GameLoop.prototype.player = null
GameLoop.prototype.currentMonster = null
GameLoop.prototype.isCombatActive = false