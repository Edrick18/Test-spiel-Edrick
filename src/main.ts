import * as Phaser from 'phaser'
import { GameScene } from './core/GameScene'
import { CharacterCreation } from './ui/CharacterCreation'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#1a1a2e', // Dunkelblau Hintergrund
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [CharacterCreation, GameScene], // Starte mit Charakter-Erstellung
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
}

window.addEventListener('load', () => {
  new Phaser.Game(config)
})