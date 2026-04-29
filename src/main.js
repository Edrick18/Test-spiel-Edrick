import * as Phaser from 'phaser'
import { GameScene } from './core/GameScene.js'
import { CharacterCreation } from './ui/CharacterCreation.js'

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [CharacterCreation, GameScene],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
}

window.addEventListener('load', () => {
  new Phaser.Game(config)
})
