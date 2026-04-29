// Einfacher Test ohne TypeScript-Probleme
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#1a1a2e',
  scene: {
    preload: function() {
      console.log('Preload gestartet')
    },
    create: function() {
      console.log('Create gestartet')
      this.add.text(400, 100, 'TEST ERFOLGREICH!', { fontSize: '32px', color: '#ff0' }).setOrigin(0.5)
      this.add.text(400, 150, 'Wenn du das sichst, funktioniert Phaser', { fontSize: '18px', color: '#0f0' }).setOrigin(0.5)
    },
    update: function() {}
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
}

window.addEventListener('load', () => {
  new Phaser.Game(config)
})
