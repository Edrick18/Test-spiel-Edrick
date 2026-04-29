import * as Phaser from 'phaser'
import { apiClient } from '../api/api-client.js'

// Klassen-Definitionen (21 Klassen)
const CLASSES = [
  { name: 'Krieger', description: 'Stärke-basiert, physischer Schaden', primaryStats: ['Stärke'] },
  { name: 'Magier', description: 'Intelligenz-basiert, magischer Schaden', primaryStats: ['Intelligenz'] },
  { name: 'Schütze', description: 'Geschicklichkeit-basiert, physischer Schaden', primaryStats: ['Geschicklichkeit'] },
  { name: 'Priester', description: 'Weisheit-basiert, magischer Schaden', primaryStats: ['Weisheit'] },
  { name: 'Paladin', description: 'Vitalität-basiert, physischer Schaden', primaryStats: ['Vitalität'] },
  { name: 'Glücksritter', description: 'Glück-basiert, hybrid Schaden', primaryStats: ['Glück'] },
  { name: 'Battlemage', description: 'Stärke + Intelligenz, hybrid', primaryStats: ['Stärke', 'Intelligenz'] },
  { name: 'Ranger', description: 'Stärke + Geschicklichkeit, physisch', primaryStats: ['Stärke', 'Geschicklichkeit'] },
  { name: 'Cleric', description: 'Stärke + Weisheit, hybrid', primaryStats: ['Stärke', 'Weisheit'] },
  { name: 'Juggernaut', description: 'Stärke + Vitalität, physisch', primaryStats: ['Stärke', 'Vitalität'] },
  { name: 'Berserker', description: 'Stärke + Glück, physisch', primaryStats: ['Stärke', 'Glück'] },
  { name: 'Spellbow', description: 'Intelligenz + Geschicklichkeit, hybrid', primaryStats: ['Intelligenz', 'Geschicklichkeit'] },
  { name: 'Archmage', description: 'Intelligenz + Weisheit, magisch', primaryStats: ['Intelligenz', 'Weisheit'] },
  { name: 'Warlock', description: 'Intelligenz + Vitalität, hybrid', primaryStats: ['Intelligenz', 'Vitalität'] },
  { name: 'Gambler', description: 'Intelligenz + Glück, hybrid', primaryStats: ['Intelligenz', 'Glück'] },
  { name: 'Monk', description: 'Geschicklichkeit + Weisheit, hybrid', primaryStats: ['Geschicklichkeit', 'Weisheit'] },
  { name: 'Assassin', description: 'Geschicklichkeit + Glück, physisch', primaryStats: ['Geschicklichkeit', 'Glück'] },
  { name: 'Evasion Tank', description: 'Geschicklichkeit + Vitalität, physisch', primaryStats: ['Geschicklichkeit', 'Vitalität'] },
  { name: 'Healer-Tank', description: 'Weisheit + Vitalität, hybrid', primaryStats: ['Weisheit', 'Vitalität'] },
  { name: 'Lucky Priest', description: 'Weisheit + Glück, hybrid', primaryStats: ['Weisheit', 'Glück'] },
  { name: 'Tank Berserker', description: 'Vitalität + Glück, physisch', primaryStats: ['Vitalität', 'Glück'] }
]

export class CharacterCreation extends Phaser.Scene {
  constructor() {
    super({ key: 'CharacterCreation' })
  }

  create() {
    // Hintergrund-Rahmen
    var graphics = this.add.graphics()
    graphics.lineStyle(4, 0x00ff00, 1)
    graphics.strokeRect(50, 30, this.cameras.main.width - 100, this.cameras.main.height - 60)
    
    // Titel
    var title = this.add.text(this.cameras.main.centerX, 60, 'Charakter erstellen', { 
      fontSize: '36px', 
      color: '#ffd700',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 4
    }).setOrigin(0.5)
    
    // Untertitel
    this.add.text(this.cameras.main.centerX, 100, 'Ein Shakes & Fidget Klon', { 
      fontSize: '16px', 
      color: '#aaa' 
    }).setOrigin(0.5)
    
    // Hinweis: Backend-Status
    this.add.text(this.cameras.main.centerX, 30, 'Backend: Test-Modus (ohne DB)', { 
      fontSize: '11px', 
      color: '#ff6600' 
    }).setOrigin(0.5)
    
    // Name Button
    var nameButton = this.add.text(this.cameras.main.centerX, 150, 'Name wählen: (Klick hier)', { 
      fontSize: '20px', 
      color: '#00ff00',
      backgroundColor: '#003300',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setInteractive()
    
    nameButton.on('pointerover', () => nameButton.setBackgroundColor('#005500'))
    nameButton.on('pointerout', () => nameButton.setBackgroundColor('#003300'))
    
    var characterName = ''
    
    nameButton.on('pointerdown', () => {
      var name = prompt('Gib deinen Charakternamen ein:')
      if (name && name.trim()) {
        characterName = name.trim()
        nameButton.setText('Name: ' + characterName)
        nameButton.setBackgroundColor('#330033')
      }
    })
    
    // Klassen-Auswahl
    this.add.text(this.cameras.main.centerX, 200, 'Klasse wählen:', { 
      fontSize: '22px', 
      color: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    // Klassen-Anzeige
    var selectedClassIndex = 0
    var classText = this.add.text(this.cameras.main.centerX, 240, '', { 
      fontSize: '24px', 
      color: '#ffd700',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5)
    
    var descText = this.add.text(this.cameras.main.centerX, 280, '', { 
      fontSize: '16px', 
      color: '#ccc' 
    }).setOrigin(0.5)
    
    var statsText = this.add.text(this.cameras.main.centerX, 320, '', { 
      fontSize: '16px', 
      color: '#00ff00' 
    }).setOrigin(0.5)
    
    var updateClassDisplay = () => {
      var classInfo = CLASSES[selectedClassIndex]
      classText.setText(classInfo.name)
      descText.setText(classInfo.description)
      statsText.setText('Haupt-Attribute: ' + classInfo.primaryStats.join(', '))
    }
    
    updateClassDisplay()
    
    // Vorherige Klasse
    var prevButton = this.add.text(this.cameras.main.centerX - 100, 240, '< Vorherige', { 
      fontSize: '18px', 
      color: '#00aaff',
      backgroundColor: '#002233',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive()
    
    prevButton.on('pointerover', () => prevButton.setBackgroundColor('#003355'))
    prevButton.on('pointerout', () => prevButton.setBackgroundColor('#002233'))
    
    prevButton.on('pointerdown', () => {
      selectedClassIndex = (selectedClassIndex - 1 + CLASSES.length) % CLASSES.length
      updateClassDisplay()
    })
    
    // Nächste Klasse
    var nextButton = this.add.text(this.cameras.main.centerX + 100, 240, 'Nächste >', { 
      fontSize: '18px', 
      color: '#00aaff',
      backgroundColor: '#002233',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive()
    
    nextButton.on('pointerover', () => nextButton.setBackgroundColor('#003355'))
    nextButton.on('pointerout', () => nextButton.setBackgroundColor('#002233'))
    
    nextButton.on('pointerdown', () => {
      selectedClassIndex = (selectedClassIndex + 1) % CLASSES.length
      updateClassDisplay()
    })
    
    // Charakter erstellen Button
    var createButton = this.add.text(this.cameras.main.centerX, 400, 'Charakter erstellen', { 
      fontSize: '24px', 
      color: '#fff', 
      backgroundColor: '#006600',
      padding: { x: 20, y: 12 },
      fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive()
    
    createButton.on('pointerover', () => createButton.setBackgroundColor('#008800'))
    createButton.on('pointerout', () => createButton.setBackgroundColor('#006600'))
    
    createButton.on('pointerdown', () => {
      if (!characterName) {
        alert('Bitte wähle zuerst einen Namen!')
        return
      }
      
      var classInfo = CLASSES[selectedClassIndex]
      
      apiClient.createCharacter(1, characterName, classInfo.name).then(result => {
        if (result.error) {
          alert('Fehler: ' + result.error)
          return
        }
        
        this.scene.start('GameScene', { character: result.data })
      })
    })
    
    // Anleitung
    this.add.text(this.cameras.main.centerX, 460, 'Wähle Name und Klasse, dann klicke "Charakter erstellen"', { 
      fontSize: '14px', 
      color: '#888' 
    }).setOrigin(0.5)
  }
}
