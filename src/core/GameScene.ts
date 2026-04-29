import * as Phaser from 'phaser'
import { GameLoop } from './GameLoop'
import { Character } from '../entities/Character'

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  init(data) {
    if (data && data.character) {
      this.player = data.character
    }
  }

  preload() {
    // Assets laden
  }

  create() {
    this.cameras.main.setBackgroundColor('#1a1a2e')
    
    this.add.text(400, 50, 'Shakes & Fidget Clone', { 
      fontSize: '32px', 
      color: '#ffff00',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    if (this.player) {
      this.add.text(400, 120, 'Charakter: ' + this.player.name, { 
        fontSize: '24px', 
        color: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5)
      
      this.add.text(400, 160, 'Klasse: ' + this.player.class_type + ' | Level: ' + this.player.level, { 
        fontSize: '20px', 
        color: '#00ff00' 
      }).setOrigin(0.5)
      
      this.add.text(400, 200, 'Gold: ' + this.player.gold + ' | XP: ' + this.player.xp, { 
        fontSize: '18px', 
        color: '#ffff00' 
      }).setOrigin(0.5)
    } else {
      this.createTestPlayer()
    }
    
    this.gameLoop = new GameLoop(this)
    
    var questButton = this.add.text(400, 280, '[ Starte Overworld-Quest (5 Min) ]', { 
      fontSize: '22px', 
      color: '#00ff00', 
      backgroundColor: '#004400',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive()
    
    questButton.on('pointerover', function() { questButton.setBackgroundColor('#006600') })
    questButton.on('pointerout', function() { questButton.setBackgroundColor('#004400') })
    questButton.on('pointerdown', function() {
      if (this.gameLoop && this.player) {
        this.gameLoop.setPlayer(this.player)
        this.gameLoop.startOverworldQuest(5)
      }
    }.bind(this))
    
    var backButton = this.add.text(400, 350, '[ Neuer Charakter ]', { 
      fontSize: '18px', 
      color: '#aaaaaa', 
      backgroundColor: '#333333',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setInteractive()
    
    backButton.on('pointerdown', function() {
      this.scene.start('CharacterCreation')
    }.bind(this))
    
    this.add.text(400, 420, 'Backend: Nicht verbunden (Test-Modus)', { 
      fontSize: '12px', 
      color: '#ff6600' 
    }).setOrigin(0.5)
  }

  update(time, delta) {
    // Game loop
  }

  createTestPlayer() {
    this.player = {
      id: 1,
      user_id: 1,
      name: 'Test-Held',
      class_type: 'Krieger',
      level: 5,
      xp: 500,
      gold: 1000,
      vitality: 20,
      strength: 25,
      intelligence: 15,
      dexterity: 18,
      luck: 12,
      wisdom: 15,
      hp: 300,
      max_hp: 300,
      mana: 125,
      max_mana: 125,
      armor: 50,
      dodge_chance: 14,
      crit_chance: 17,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    if (this.gameLoop) {
      this.gameLoop.setPlayer(this.player)
    }
  }
}

// Manuell hinzufügen von Instanzvariablen (da keine TypeScript-Typen)
GameScene.prototype.gameLoop = null
GameScene.prototype.player = null