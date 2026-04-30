// Shakes & Fidget Clone - Mit Online-Login-System (Backend API)
// Konto erforderlich: Name + E-Mail + Passwort

// API URL: Backend-Tunnel (feste URL)
const API_BASE = 'https://shakes-game-edrick-api.loca.lt/api'

// ===== Backend API Account System =====
let currentUser = null

async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  }
  if (body) options.body = JSON.stringify(body)
  
  const response = await fetch(`${API_BASE}${endpoint}`, options)
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'API Fehler')
  }
  return data
}

async function createAccount(username, password) {
  try {
    const result = await apiRequest('/auth/register', 'POST', { username, password })
    return { success: true, user: result }
  } catch (error) {
    return { error: error.message }
  }
}

async function login(username, password) {
  try {
    const user = await apiRequest('/auth/login', 'POST', { username, password })
    currentUser = user
    localStorage.setItem('sfg_user', JSON.stringify(user))
    return { success: true, user }
  } catch (error) {
    return { error: error.message }
  }
}

function getLoggedInUser() {
  if (currentUser) return currentUser
  const saved = localStorage.getItem('sfg_user')
  if (saved) {
    currentUser = JSON.parse(saved)
    return currentUser
  }
  return null
}

function logout() {
  currentUser = null
  localStorage.removeItem('sfg_user')
}

async function loadAccountCharacters() {
  const user = getLoggedInUser()
  if (!user) return []
  try {
    const chars = await apiRequest(`/characters/user/${user.id}`, 'GET')
    return chars
  } catch (error) {
    console.error('Fehler beim Laden der Charaktere:', error)
    return []
  }
}

async function saveCharacterToAccount(character) {
  if (!character || !character.id) return character
  try {
    const updateData = {
      level: character.level,
      xp: character.xp,
      gold: character.gold,
      vitality: character.vitality,
      strength: character.strength,
      intelligence: character.intelligence,
      dexterity: character.dexterity,
      luck: character.luck,
      wisdom: character.wisdom,
      hp: character.hp,
      mana: character.mana,
      armor: character.armor,
      dodge_chance: character.dodge_chance,
      crit_chance: character.crit_chance
    }
    const updated = await apiRequest(`/characters/${character.id}`, 'PUT', updateData)
    return updated
  } catch (error) {
    console.error('Fehler beim Speichern:', error)
    return character
  }
}

// ===== Hilfsfunktionen =====
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}
function cap1(v) {
  return isFinite(v) ? v : 0
}

// ===== Item-System =====
const RARITIES = {
  Common: { mult: 1, color: '#ffffff', name: 'Gewöhnlich', prefix: ['Einfacher', 'Gemeiner', 'Schlichter'] },
  Rare: { mult: 1.5, color: '#0088ff', name: 'Selten', prefix: ['Spezieller', 'Seltener', 'Bemerkenswerter'] },
  Epic: { mult: 2, color: '#aa00ff', name: 'Episch', prefix: ['Epischer', 'Legendärer', 'Mythischer'] },
  Legendary: { mult: 3, color: '#ffaa00', name: 'Legendär', prefix: ['Legendärer', 'Göttlicher', 'Uralter'] }
}

const ITEM_TYPES = {
  twosword: { name: 'Zweihandschwert', slot: 'weapon', stat: 'strength', offhand: null },
  twostaff: { name: 'Zauberstab', slot: 'weapon', stat: 'intelligence', offhand: null },
  twbow: { name: 'Langbogen', slot: 'weapon', stat: 'dexterity', offhand: null },
  twcrozier: { name: 'Krummstab', slot: 'weapon', stat: 'wisdom', offhand: null },
  twaxe: { name: 'Zweihandaxt', slot: 'weapon', stat: 'vitality', offhand: null },
  sword1h: { name: 'Kurzschwert', slot: 'weapon', stat: 'strength', offhand: 'shield' },
  staff1h: { name: 'Zauberstab', slot: 'weapon', stat: 'intelligence', offhand: 'tome' },
  bow1h: { name: 'Kurzbogen', slot: 'weapon', stat: 'dexterity', offhand: 'quiver' },
  hammer1h: { name: 'Kriegshammer', slot: 'weapon', stat: 'strength', offhand: 'holy' },
  fist: { name: 'Fäustlinge', slot: 'weapon', stat: 'dexterity', offhand: 'prayer' },
  shield: { name: 'Schild', slot: 'offhand', stat: 'strength' },
  tome: { name: 'Zauberbuch', slot: 'offhand', stat: 'intelligence' },
  quiver: { name: 'Köcher', slot: 'offhand', stat: 'dexterity' },
  holy: { name: 'Heiliges Symbol', slot: 'offhand', stat: 'wisdom' },
  prayer: { name: 'Gebetskette', slot: 'offhand', stat: 'wisdom' },
  helmet: { name: 'Helm', slot: 'armor', stat: 'strength' },
  armor: { name: 'Rüstung', slot: 'armor', stat: 'vitality' },
  gloves: { name: 'Handschuhe', slot: 'armor', stat: 'dexterity' },
  boots: { name: 'Stiefel', slot: 'armor', stat: 'dexterity' },
  ring: { name: 'Ring', slot: 'accessory', stat: 'luck' },
  amulet: { name: 'Amulett', slot: 'accessory', stat: 'wisdom' }
}

const CLASS_WEAPONS = {
  'Krieger': { weapon: 'twosword', offhand: null },
  'Magier': { weapon: 'twostaff', offhand: null },
  'Schütze': { weapon: 'twbow', offhand: null },
  'Priester': { weapon: 'twcrozier', offhand: null },
  'Paladin': { weapon: 'twaxe', offhand: null },
  'Battlemage': { weapon: 'sword1h', offhand: 'tome' },
  'Ranger': { weapon: 'sword1h', offhand: 'shield' },
  'Cleric': { weapon: 'hammer1h', offhand: 'holy' },
  'Juggernaut': { weapon: 'sword1h', offhand: 'shield' },
  'Spellbow': { weapon: 'bow1h', offhand: 'quiver' },
  'Archmage': { weapon: 'staff1h', offhand: 'tome' },
  'Warlock': { weapon: 'staff1h', offhand: 'tome' },
  'Monk': { weapon: 'fist', offhand: 'prayer' },
  'Evasion Tank': { weapon: 'bow1h', offhand: 'quiver' },
  'Healer-Tank': { weapon: 'hammer1h', offhand: 'holy' }
}

function genItemName(type, rarity, level) {
  const typeData = ITEM_TYPES[type]
  const rarityData = RARITIES[rarity]
  const prefixes = rarityData.prefix
  const prefix = prefixes[randInt(0, prefixes.length-1)]
  return prefix + ' ' + typeData.name + ' Lv.' + level
}

function genItem(level, type, rarity, playerClass) {
  const t = type || Object.keys(ITEM_TYPES)[randInt(0, Object.keys(ITEM_TYPES).length-1)]
  const r = rarity || Object.keys(RARITIES)[randInt(0, 3)]
  const rd = RARITIES[r]
  const td = ITEM_TYPES[t]
  const base = Math.floor(Math.pow(level, 1.5))
  const sv = Math.floor(cap1(base * rd.mult))
  
  let bonus = 1
  if (playerClass && CLASS_WEAPONS[playerClass]) {
    if (t === CLASS_WEAPONS[playerClass].weapon || t === CLASS_WEAPONS[playerClass].offhand) {
      bonus = 1.2
    }
  }
  
  return {
    id: Date.now() + randInt(0, 9999),
    name: genItemName(t, r, level),
    type: t,
    slot: td.slot,
    rarity: r,
    level: level,
    stat: td.stat,
    statValue: Math.floor(sv * bonus),
    stat2: td.stat === 'strength' ? 'vitality' : td.stat === 'intelligence' ? 'wisdom' : 'strength',
    stat2Value: Math.floor(sv * 0.5 * bonus),
    price: Math.floor(Math.pow(level, 1.5) * 10 * rd.mult),
    sellPrice: Math.floor(Math.pow(level, 1.5) * 5 * rd.mult),
    color: rd.color,
    description: td.slot === 'weapon' ? 'Waffe' : td.slot === 'offhand' ? 'Nebenhand' : td.slot === 'armor' ? 'Rüstung' : 'Accessoire'
  }
}

// ===== Classes =====
const CLASSES = [
  { name: 'Krieger', desc: 'Stärke', stats: ['Stärke'] },
  { name: 'Magier', desc: 'Intelligenz', stats: ['Intelligenz'] },
  { name: 'Schütze', desc: 'Geschicklichkeit', stats: ['Geschicklichkeit'] },
  { name: 'Priester', desc: 'Weisheit', stats: ['Weisheit'] },
  { name: 'Paladin', desc: 'Vitalität', stats: ['Vitalität'] },
  { name: 'Battlemage', desc: 'Stärke+Intelligenz', stats: ['Stärke','Intelligenz'] },
  { name: 'Ranger', desc: 'Stärke+Geschick', stats: ['Stärke','Geschicklichkeit'] },
  { name: 'Cleric', desc: 'Stärke+Weisheit', stats: ['Stärke','Weisheit'] },
  { name: 'Juggernaut', desc: 'Stärke+Vitalität', stats: ['Stärke','Vitalität'] },
  { name: 'Spellbow', desc: 'Int+Geschick', stats: ['Intelligenz','Geschicklichkeit'] },
  { name: 'Archmage', desc: 'Int+Weisheit', stats: ['Intelligenz','Weisheit'] },
  { name: 'Warlock', desc: 'Int+Vitalität', stats: ['Intelligenz','Vitalität'] },
  { name: 'Monk', desc: 'Geschick+Weisheit', stats: ['Geschicklichkeit','Weisheit'] },
  { name: 'Evasion Tank', desc: 'Geschick+Vitalität', stats: ['Geschicklichkeit','Vitalität'] },
  { name: 'Healer-Tank', desc: 'Weisheit+Vitalität', stats: ['Weisheit','Vitalität'] }
]

// ===== Combat System =====
class CombatSystem {
  static calcDmg(att, magical) {
    let d = magical ? att.intelligence * 2 + att.wisdom : att.strength * 2 + att.dexterity
    return Math.max(1, Math.floor(d * (0.9 + Math.random() * 0.2)))
  }
  static dodge(def) { return Math.random() * 100 < def.dodge_chance }
  static crit(att) { return Math.random() * 100 < att.crit_chance }
  static armor(dmg, arm) { return Math.max(1, dmg - arm / 2) }
  static isMag(cls) { return ['Magier','Priester','Archmage','Warlock','Monk','Healer-Tank'].includes(cls) }
}

// ===== Game Loop =====
class GameLoop {
  constructor(scene) {
    this.scene = scene; this.player = null; this.monster = null
    this.active = false; this.log = []
  }
  setPlayer(p) { this.player = p; this.recalc() }
  recalc() {
    if (!this.player) return
    this.player.max_hp = 100 + this.player.vitality * 10
    this.player.max_mana = 50 + this.player.intelligence * 5
    this.player.armor = this.player.strength * 2
    this.player.dodge_chance = clamp(5 + this.player.dexterity * 0.5, 0, 75)
    this.player.crit_chance = clamp(5 + this.player.luck * 1, 0, 100)
  }
  startQuest(dur) {
    if (!this.player || this.active) return
    const rarity = dur >= 30 ? 'Legendary' : dur >= 25 ? 'Epic' : dur >= 20 ? 'Rare' : dur >= 15 ? 'Rare' : dur >= 10 ? 'Common' : 'Common'
    const lvl = Math.floor(this.player.level * (rarity === 'Legendary' ? 1.2 : rarity === 'Epic' ? 1.1 : 1))
    this.monster = this.mkMonster(lvl, rarity)
    this.active = true; this.log = []
    this.scene.showStart(this.monster, rarity)
    setTimeout(() => this.fight(), 1000)
  }
  startTravel(durationMinutes) {
    if (!this.player || this.active) return
    this.active = true
    this.scene.showTravelStart(durationMinutes)
    this.scene.startTravelTimer(durationMinutes)
  }
  startTavern(durationMinutes) {
    if (!this.player || this.active) return
    const neededProv = Math.ceil(durationMinutes / 60 * (100 + this.player.level * 10))
    if ((this.player.provisions || 0) < neededProv) {
      alert('Nicht genug Proviant! Benötigt: ' + neededProv + ', Vorhanden: ' + (this.player.provisions || 0))
      return
    }
    this.player.provisions -= neededProv
    this.active = true
    this.scene.showTravelStart(durationMinutes)
    const rarity = durationMinutes >= 30 ? 'Legendary' : durationMinutes >= 25 ? 'Epic' : durationMinutes >= 20 ? 'Rare' : durationMinutes >= 15 ? 'Rare' : durationMinutes >= 10 ? 'Common' : 'Common'
    const lvl = Math.floor(this.player.level * (rarity === 'Legendary' ? 1.2 : rarity === 'Epic' ? 1.1 : 1))
    this.monster = this.mkMonster(lvl, rarity)
    this.log = []
    this.scene.showStart(this.monster, rarity)
    setTimeout(() => this.fight(), 1000)
  }
  startDungeon() {
    if (!this.player || this.active) return
    const lvl = (this.player.dungeonProgress || 0) + 1
    this.monster = this.mkMonster(lvl * 5, 'Boss')
    this.active = true; this.log = []
    this.scene.showStart(this.monster, 'Boss')
    setTimeout(() => this.fight(), 1000)
  }
  startPvP() {
    if (!this.player || this.active) return
    const lv = clamp(this.player.level + randInt(-3, 3), 1, 1000)
    this.monster = {
      name: 'Gegner Lv.' + lv, level: lv, rarity: 'PvP',
      vitality: 10 + lv*2, strength: 10 + lv*2, intelligence: 10 + lv*2,
      dexterity: 10 + lv*2, luck: 10 + lv*2, wisdom: 10 + lv*2,
      hp: 100 + (10+lv*2)*10, max_hp: 100 + (10+lv*2)*10,
      armor: (10+lv*2)*2, dodge_chance: clamp(5+(10+lv*2)*0.5,0,75),
      crit_chance: clamp(5+(10+lv*2)*1,0,100)
    }
    this.active = true; this.log = []
    this.scene.showStart(this.monster, 'PvP')
    setTimeout(() => this.fight(), 1000)
  }
  startDaily(quest) {
    if (!this.player || this.active) return
    this.monster = this.mkMonster(this.player.level, quest.rarity)
    this.active = true; this.log = []
    this.scene.showStart(this.monster, quest.rarity)
    setTimeout(() => this.fight(), 1000)
  }
  mkMonster(level, rarity) {
    const b = { v: level*10, s: level*8, i: level*8, d: level*6, l: level*5, w: level*5 }
    const m = rarity === 'Legendary' ? 3 : rarity === 'Epic' ? 2 : rarity === 'Rare' ? 1.5 : 1
    return {
      name: (rarity === 'Boss' ? 'Boss' : 'Monster') + ' Lv.' + level, level: level, rarity: rarity,
      vitality: Math.floor(b.v * m), strength: Math.floor(b.s * m), intelligence: Math.floor(b.i * m),
      dexterity: Math.floor(b.d * m), luck: Math.floor(b.l * m), wisdom: Math.floor(b.w * m),
      hp: Math.floor((100 + b.v*10) * m), max_hp: Math.floor((100 + b.v*10) * m),
      armor: Math.floor(b.s * 2 * m), dodge_chance: clamp(5 + b.d*0.5,0,75),
      crit_chance: clamp(5 + b.l*1,0,100)
    }
  }
  fight() {
    if (!this.player || !this.monster) return
    let pHP = this.player.hp, mHP = this.monster.hp, turn = 0
    const step = () => {
      if (pHP <= 0 || mHP <= 0 || turn >= 50) { this.endFight(pHP, mHP); return }
      // Player
      if (!CombatSystem.dodge(this.monster)) {
        let d = CombatSystem.armor(CombatSystem.calcDmg(this.player, CombatSystem.isMag(this.player.class_type)), this.monster.armor)
        let c = false
        if (CombatSystem.crit(this.player)) { d *= 2; c = true }
        mHP = Math.max(0, mHP - d)
        this.log.push('Du triffst für ' + d + (c ? ' (KRIT!)' : ''))
      } else { this.log.push('Monster weicht aus!') }
      if (mHP <= 0) { this.scene.updateLog(this.log); this.scene.updateBars(pHP, mHP); setTimeout(step, 500); return }
      // Monster
      if (!CombatSystem.dodge(this.player)) {
        let d = CombatSystem.armor(CombatSystem.calcDmg(this.monster, false), this.player.armor)
        let c = false
        if (CombatSystem.crit(this.monster)) { d *= 2; c = true }
        pHP = Math.max(0, pHP - d)
        this.log.push('Monster trifft für ' + d + (c ? ' (KRIT!)' : ''))
      } else { this.log.push('Du weichst aus!') }
      turn++
      this.scene.updateLog(this.log)
      this.scene.updateBars(pHP, mHP)
      if (pHP <= 0 || mHP <= 0) { setTimeout(step, 500) } else { setTimeout(step, 800) }
    }
    step()
  }
  async endFight(pHP, mHP) {
    this.active = false
    const won = mHP <= 0
    const gm = this.monster.rarity === 'Legendary' ? 3 : this.monster.rarity === 'Epic' ? 2 : this.monster.rarity === 'Rare' ? 1.5 : this.monster.rarity === 'Boss' ? 5 : 1
    const gold = won ? Math.floor(this.monster.level * 10 * gm) : 0
    const xp = won ? Math.floor(this.monster.level * 20 * gm) : 0
    this.player.hp = pHP
    this.player.gold += gold
    this.player.xp += xp
    let drop = null
    if (won && Math.random() < 0.3) { drop = genItem(this.monster.level, null, null, this.player.class_type); this.player.inventory = this.player.inventory || []; this.player.inventory.push(drop) }
    if (this.monster.rarity === 'Boss' && won) { this.player.dungeonProgress = (this.player.dungeonProgress || 0) + 1 }
    if (this.monster.rarity === 'PvP') {
      const mc = won ? randInt(20,50) : -randInt(20,50)
      this.player.pvpMMR = (this.player.pvpMMR || 1000) + mc
    }
    this.log.push('---')
    if (won) {
      this.log.push('SIEG! +' + gold + ' Gold, +' + xp + ' XP' + (drop ? ', Item: ' + drop.name : ''))
      this.levelUp()
    } else { this.log.push('NIEDERLAGE...') }
    this.scene.updateLog(this.log)
    this.scene.showResult(won, gold, xp, drop)
    // Save to backend
    await saveCharacterToAccount(this.player)
  }
  levelUp() {
    let needed = Math.floor(100 * Math.pow(this.player.level, 1.5))
    while (this.player.xp >= needed) {
      this.player.xp -= needed
      this.player.level++
      this.player.strength += 5; this.player.intelligence += 5; this.player.dexterity += 5
      this.player.vitality += 5; this.player.luck += 5; this.player.wisdom += 5
      this.player.hp = this.player.max_hp
      this.player.mana = this.player.max_mana
      this.log.push('LEVEL UP! Jetzt Level ' + this.player.level + '!')
      needed = Math.floor(100 * Math.pow(this.player.level, 1.5))
    }
    this.recalc()
  }
}

// ===== Shared UI Methods =====
function createCombatUI(scene, w, h, monster) {
  scene.ui = scene.add.container(0, 0)
  const bg = scene.add.graphics(); bg.fillStyle(0x000000, 0.8); bg.fillRect(0, 0, w, h); scene.ui.add(bg)
  scene.ui.add(scene.add.text(w/2, 160, 'Kampf: ' + monster.name, { fontSize: '24px', color: '#ff0000', fontStyle: 'bold' }).setOrigin(0.5))
  // Player HP
  scene.ui.add(scene.add.text(100, 230, 'Spieler HP:', { fontSize: '16px', color: '#00ff00' }))
  scene.pHPbar = scene.add.graphics(); scene.pHPbar.fillStyle(0x00ff00, 1); scene.pHPbar.fillRect(180, 230, 200, 20); scene.ui.add(scene.pHPbar)
  scene.pHPtxt = scene.add.text(290, 232, scene.player.hp + '/' + scene.player.max_hp, { fontSize: '12px', color: '#fff' }).setOrigin(0.5); scene.ui.add(scene.pHPtxt)
  // Monster HP
  scene.ui.add(scene.add.text(100, 270, 'Monster HP:', { fontSize: '16px', color: '#ff0000' }))
  scene.mHPbar = scene.add.graphics(); scene.mHPbar.fillStyle(0xff0000, 1); scene.mHPbar.fillRect(180, 270, 200, 20); scene.ui.add(scene.mHPbar)
  scene.mHPtxt = scene.add.text(290, 272, monster.hp + '/' + monster.max_hp, { fontSize: '12px', color: '#fff' }).setOrigin(0.5); scene.ui.add(scene.mHPtxt)
  // Log
  const logBg = scene.add.graphics(); logBg.fillStyle(0x000033,0.9); logBg.fillRect(100, 310, w-200, 150); scene.ui.add(logBg)
  scene.ui.add(scene.add.text(w/2, 325, 'Kampf-Log:', { fontSize: '14px', color: '#ffff00' }).setOrigin(0.5))
  scene.logTxt = scene.add.text(110, 345, '', { fontSize: '12px', color: '#cccccc', wordWrap: { width: w-220 } }); scene.ui.add(scene.logTxt)
}

function updateBars(scene, pHP, mHP) {
  if (scene.pHPbar) {
    scene.pHPbar.clear(); scene.pHPbar.fillStyle(0x00ff00, 1)
    scene.pHPbar.fillRect(180, 230, 200 * Math.max(0, pHP/scene.player.max_hp), 20)
    scene.pHPtxt.setText(Math.floor(pHP) + '/' + scene.player.max_hp)
  }
  if (scene.mHPbar) {
    scene.mHPbar.clear(); scene.mHPbar.fillStyle(0xff0000, 1)
    scene.mHPbar.fillRect(180, 270, 200 * Math.max(0, mHP/scene.loop.monster.max_hp), 20)
    scene.mHPtxt.setText(Math.floor(mHP) + '/' + scene.loop.monster.max_hp)
  }
}

function updateLog(scene, log) {
  if (scene.logTxt) scene.logTxt.setText(log.slice(-8).join('\n'))
}

function showResult(scene, won, gold, xp, drop) {
  const w = scene.cameras.main.width
  setTimeout(() => {
    scene.ui.add(scene.add.text(w/2, 480, won ? 'SIEG!' : 'NIEDERLAGE...', { fontSize: '32px', color: won?'#00ff00':'#ff0000', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5))
    if (won) scene.ui.add(scene.add.text(w/2, 520, '+' + gold + ' Gold, +' + xp + ' XP' + (drop ? ', ' + drop.name : ''), { fontSize: '20px', color: '#ffd700' }).setOrigin(0.5))
    const btn = scene.add.text(w/2, 560, '[ Beenden ]', { fontSize: '18px', color: '#fff', backgroundColor: '#333333', padding: {x:15,y:8} }).setOrigin(0.5).setInteractive()
    btn.on('pointerdown', () => {
      if (scene.ui) { scene.ui.destroy(); scene.ui = null }
      scene.player = scene.loop.player
      scene.scene.restart({ player: scene.player, username: scene.username })
    })
    scene.ui.add(btn)
  }, 1000)
}

// ===== Login Scene =====
class LoginScene extends Phaser.Scene {
  constructor() { super({ key: 'LoginScene' }) }
  
  create() {
    const w = this.cameras.main.width, h = this.cameras.main.height
    this.cameras.main.setBackgroundColor('#1a1a2e')
    
    // Check if already logged in
    const loggedIn = getLoggedInUser()
    if (loggedIn) {
      this.scene.start('CharacterSelect', { username: loggedIn.username })
      return
    }
    
    // Title
    this.add.text(w/2, 80, 'Shakes & Fidget Clone', { fontSize: '36px', color: '#ffd700', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5)
    this.add.text(w/2, 130, 'Bitte einloggen oder Konto erstellen', { fontSize: '18px', color: '#ccc' }).setOrigin(0.5)
    
    // Input fields background
    const bg = this.add.graphics()
    bg.fillStyle(0x002200, 0.8)
    bg.fillRoundedRect(w/2 - 200, 170, 400, 280, 10)
    
    // Username button (click to enter)
    this.add.text(w/2, 200, 'Benutzername:', { fontSize: '18px', color: '#fff' }).setOrigin(0.5)
    this.usernameDisplay = this.add.text(w/2, 230, '[ Klicken zum Eingeben ]', { fontSize: '16px', color: '#00ff00', backgroundColor: '#001100', padding: {x:10,y:5} }).setOrigin(0.5).setInteractive()
    this.usernameValue = ''
    
    this.usernameDisplay.on('pointerdown', () => {
      const u = prompt('Benutzername eingeben (neu eingeben!):')
      if (u && u.trim()) {
        this.usernameValue = u.trim()
        this.usernameDisplay.setText('Benutzername: ' + this.usernameValue)
        console.log('Username set to:', this.usernameValue) // Debug
      }
    })
    
    // Password button (click to enter)
    this.add.text(w/2, 280, 'Passwort:', { fontSize: '18px', color: '#fff' }).setOrigin(0.5)
    this.passwordDisplay = this.add.text(w/2, 310, '[ Klicken zum Eingeben ]', { fontSize: '16px', color: '#00ff00', backgroundColor: '#001100', padding: {x:10,y:5} }).setOrigin(0.5).setInteractive()
    this.passwordValue = ''
    
    this.passwordDisplay.on('pointerdown', () => {
      const p = prompt('Passwort eingeben (neu eingeben!):')
      if (p) {
        this.passwordValue = p
        this.passwordDisplay.setText('Passwort: ****')
        console.log('Password set (length):', this.passwordValue.length) // Debug
      }
    })
    
    // Login button
    const loginBtn = this.add.text(w/2, 380, '[ Einloggen ]', { fontSize: '22px', color: '#fff', backgroundColor: '#006600', padding: {x:20,y:10}, fontStyle: 'bold' }).setOrigin(0.5).setInteractive()
    loginBtn.on('pointerdown', async () => {
      console.log('Login clicked - Username:', this.usernameValue, 'Password length:', this.passwordValue.length)
      if (!this.usernameValue || !this.passwordValue) { alert('Benutzername und Passwort erforderlich!'); return }
      loginBtn.setText('Lade...')
      const result = await login(this.usernameValue, this.passwordValue)
      console.log('Login result:', result)
      if (result.error) { alert(result.error); loginBtn.setText('[ Einloggen ]'); return }
      this.scene.start('CharacterSelect', { username: result.user.username })
    })
    
    // Register button
    const regBtn = this.add.text(w/2, 440, '[ Konto erstellen ]', { fontSize: '18px', color: '#00aaff', backgroundColor: '#002233', padding: {x:15,y:8} }).setOrigin(0.5).setInteractive()
    regBtn.on('pointerdown', async () => {
      console.log('Register clicked - Username:', this.usernameValue, 'Password length:', this.passwordValue.length)
      if (!this.usernameValue || !this.passwordValue) { alert('Benutzername und Passwort erforderlich!'); return }
      regBtn.setText('Erstelle...')
      const result = await createAccount(this.usernameValue, this.passwordValue)
      console.log('Register result:', result)
      if (result.error) { alert(result.error); regBtn.setText('[ Konto erstellen ]'); return }
      alert('Konto erstellt! Du bist jetzt eingeloggt.')
      this.scene.start('CharacterSelect', { username: this.usernameValue })
    })
  }
}

// ===== Character Select Scene =====
class CharacterSelect extends Phaser.Scene {
  constructor() { super({ key: 'CharacterSelect' }) }
  init(data) { this.username = data.username; this.user = getLoggedInUser() }
  async create() {
    const w = this.cameras.main.width, h = this.cameras.main.height
    this.cameras.main.setBackgroundColor('#1a1a2e')
    
    this.add.text(w/2, 50, 'Willkommen, ' + this.username + '!', { fontSize: '28px', color: '#ffd700', fontStyle: 'bold' }).setOrigin(0.5)
    
    // Load characters from API
    const characters = await loadAccountCharacters()
    
    if (characters.length === 0) {
      this.add.text(w/2, 150, 'Keine Charaktere vorhanden', { fontSize: '20px', color: '#aaa' }).setOrigin(0.5)
    } else {
      this.add.text(w/2, 120, 'Deine Charaktere:', { fontSize: '22px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5)
      let y = 160
      characters.forEach(char => {
        const btn = this.add.text(w/2, y, char.name + ' (' + char.class_type + ', Lv.' + char.level + ')', { fontSize: '18px', color: '#00ff00', backgroundColor: '#003300', padding: {x:15,y:8} }).setOrigin(0.5).setInteractive()
        btn.on('pointerdown', () => this.scene.start('GameScene', { player: char, username: this.username }))
        y += 40
      })
    }
    
    // Create new character
    const newBtn = this.add.text(w/2, h-120, '[ Neuen Charakter erstellen ]', { fontSize: '20px', color: '#fff', backgroundColor: '#006600', padding: {x:20,y:10} }).setOrigin(0.5).setInteractive()
    newBtn.on('pointerdown', () => this.scene.start('CharacterCreation', { username: this.username, userId: this.user.id }))
    
    // Logout
    const logoutBtn = this.add.text(w/2, h-60, '[ Ausloggen ]', { fontSize: '16px', color: '#ff0000', backgroundColor: '#330000', padding: {x:15,y:8} }).setOrigin(0.5).setInteractive()
    logoutBtn.on('pointerdown', () => { logout(); this.scene.start('LoginScene') })
  }
}

// ===== Character Creation =====
class CharacterCreation extends Phaser.Scene {
  constructor() { super({ key: 'CharacterCreation' }) }
  init(data) { this.username = data.username; this.userId = data.userId }
  async create() {
    const w = this.cameras.main.width, h = this.cameras.main.height
    const g = this.add.graphics(); g.lineStyle(4, 0x00ff00, 1); g.strokeRect(50, 30, w-100, h-60)
    this.add.text(w/2, 60, 'Charakter erstellen', { fontSize: '36px', color: '#ffd700', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5)
    this.add.text(w/2, 100, 'Konto: ' + this.username, { fontSize: '16px', color: '#aaa' }).setOrigin(0.5)
    
    let charName = ''
    const nameBtn = this.add.text(w/2, 150, 'Name wählen (Klick)', { fontSize: '20px', color: '#00ff00', backgroundColor: '#003300', padding: {x:15,y:8} }).setOrigin(0.5).setInteractive()
    nameBtn.on('pointerdown', () => { const n = prompt('Charaktername:'); if (n && n.trim()) { charName = n.trim(); nameBtn.setText('Name: ' + charName) } })
    
    this.add.text(w/2, 200, 'Klasse wählen:', { fontSize: '22px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5)
    let idx = 0
    const classText = this.add.text(w/2, 180, '', { fontSize: '28px', color: '#ffd700', fontStyle: 'bold' }).setOrigin(0.5)
    const descText = this.add.text(w/2, 220, '', { fontSize: '18px', color: '#ccc' }).setOrigin(0.5)
    const statsText = this.add.text(w/2, 260, '', { fontSize: '18px', color: '#00ff00' }).setOrigin(0.5)
    const update = () => { classText.setText(CLASSES[idx].name); descText.setText(CLASSES[idx].desc); statsText.setText('Attribute: ' + CLASSES[idx].stats.join(', ')) }
    update()
    
    const prev = this.add.text(w/2-250, 180, '< Vorherige', { fontSize: '18px', color: '#00aaff', backgroundColor: '#002233', padding: {x:15,y:8} }).setOrigin(0.5).setInteractive()
    prev.on('pointerdown', () => { idx = (idx-1+CLASSES.length)%CLASSES.length; update() })
    const next = this.add.text(w/2+250, 180, 'Nächste >', { fontSize: '18px', color: '#00aaff', backgroundColor: '#002233', padding: {x:15,y:8} }).setOrigin(0.5).setInteractive()
    next.on('pointerdown', () => { idx = (idx+1)%CLASSES.length; update() })
    
    const createBtn = this.add.text(w/2, 400, 'Charakter erstellen', { fontSize: '24px', color: '#fff', backgroundColor: '#006600', padding: {x:20,y:12}, fontStyle: 'bold' }).setOrigin(0.5).setInteractive()
    createBtn.on('pointerdown', async () => {
      if (!charName) { alert('Wähle erst einen Namen!'); return }
      try {
        const cls = CLASSES[idx]
        const charData = { user_id: this.userId, name: charName, class_type: cls.name }
        const newChar = await apiRequest('/characters', 'POST', charData)
        // Stats initialisieren
        const stats = { vitality: 10, strength: 10, intelligence: 10, dexterity: 10, luck: 10, wisdom: 10 }
        cls.stats.forEach(s => {
          if (s === 'Stärke') stats.strength += 15
          if (s === 'Intelligenz') stats.intelligence += 15
          if (s === 'Geschicklichkeit') stats.dexterity += 15
          if (s === 'Vitalität') stats.vitality += 15
          if (s === 'Glück') stats.luck += 15
          if (s === 'Weisheit') stats.wisdom += 15
        })
        await apiRequest(`/characters/${newChar.id}`, 'PUT', stats)
        // Charakter mit aktualisierten Stats neu laden
        const updatedChar = await apiRequest(`/characters/${newChar.id}`, 'GET')
        this.scene.start('GameScene', { player: updatedChar, username: this.username })
      } catch (error) {
        alert('Fehler beim Erstellen: ' + error.message)
      }
    })
  }
}

// ===== Main Menu =====
class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }) }
  init(data) { this.player = data.player; this.username = data.username }
  async create() {
    const w = this.cameras.main.width, h = this.cameras.main.height
    this.cameras.main.setBackgroundColor('#1a1a2e')
    
    // Lade Charakter vom Backend falls nicht übergeben
    if (!this.player || !this.player.id) {
      const user = getLoggedInUser()
      if (user) {
        const chars = await loadAccountCharacters()
        if (chars && chars.length > 0) {
          this.player = chars[0]
        }
      }
      if (!this.player) this.testPlayer()
    }
    
    this.add.text(w/2, 30, 'Shakes & Fidget Clone', { fontSize: '28px', color: '#ffd700', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5)
    this.add.text(w/2, 70, 'Charakter: ' + this.player.name, { fontSize: '20px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5)
    this.add.text(w/2, 95, 'Klasse: ' + this.player.class_type + ' | Level: ' + this.player.level, { fontSize: '16px', color: '#00ff00' }).setOrigin(0.5)
    this.add.text(w/2, 120, 'Gold: ' + this.player.gold + ' | XP: ' + this.player.xp + ' | HP: ' + this.player.hp + '/' + this.player.max_hp, { fontSize: '14px', color: '#ffd700' }).setOrigin(0.5)
    this.add.text(w/2, 140, 'Proviant: ' + (this.player.provisions || 0), { fontSize: '14px', color: '#ffaa00' }).setOrigin(0.5)
    
    const menus = [
      { text:'Overworld Reise', scene:'QuestScene', color:'#00ff00', bg:'#004400' },
      { text:'Tavern (Direkte Quests)', scene:'TavernScene', color:'#ffaa00', bg:'#553300' },
      { text:'Dungeon (Bosse)', scene:'DungeonScene', color:'#ffaa00', bg:'#553300' },
      { text:'Inventar & Ausrüstung', scene:'InventoryScene', color:'#aa00ff', bg:'#330055' },
      { text:'Shop', scene:'ShopScene', color:'#00aaff', bg:'#002233' },
      { text:'PvP Arena', scene:'PvPScene', color:'#ff0000', bg:'#330000' },
      { text:'Gilde', scene:'GuildScene', color:'#ffff00', bg:'#555500' },
      { text:'Tägliche Quests', scene:'DailyQuestScene', color:'#00ffff', bg:'#003333' },
      { text:'Hideout (Versteck)', scene:'HideoutScene', color:'#ffaa55', bg:'#553311' }
    ]
    menus.forEach((m, i) => {
      const btn = this.add.text(w/2, 170+i*35, m.text, { fontSize:'18px', color:m.color, backgroundColor:m.bg, padding:{x:20,y:8} }).setOrigin(0.5).setInteractive()
      btn.on('pointerdown', () => this.scene.start(m.scene, { player: this.player, username: this.username }))
    })
    
    const backBtn = this.add.text(w/2, h-40, '[ Charakter wählen ]', { fontSize:'16px', color:'#aaa', backgroundColor:'#333333', padding:{x:15,y:8} }).setOrigin(0.5).setInteractive()
    backBtn.on('pointerdown', () => this.scene.start('CharacterSelect', { username: this.username }))
  }
  testPlayer() {
    this.player = { id:1, name:'Test-Held', class_type:'Krieger', level:5, xp:500, gold:1000, provisions: 200,
      vitality:20, strength:25, intelligence:15, dexterity:18, luck:12, wisdom:15,
      hp:300, max_hp:300, mana:125, max_mana:125, armor:50, dodge_chance:14, crit_chance:17,
      inventory:[genItem(5),genItem(5),genItem(5)], dungeonProgress:0, pvpMMR:1000, guildId:null,
      dailyQuests:[], lastDailyReset:null, hideoutLevel:0, hideoutIncome:0 }
  }
}

// ===== Quest Scene (Overworld) =====
class QuestScene extends Phaser.Scene {
  constructor() { super({ key: 'QuestScene' }) }
  init(data) { this.player = data.player; this.username = data.username; this.travelTimer = null; this.questTimer = null; this.questCount = 0; this.totalGold = 0; this.totalXP = 0 }
  create() {
    const w = this.cameras.main.width, h = this.cameras.main.height
    this.cameras.main.setBackgroundColor('#1a1a2e')
    this.add.text(w/2, 30, 'Overworld Reise', { fontSize:'28px', color:'#ffd700', fontStyle:'bold', stroke:'#000', strokeThickness:4 }).setOrigin(0.5)
    this.add.text(w/2, 80, 'Proviant: ' + (this.player.provisions || 0), { fontSize:'18px', color:'#ffaa00' }).setOrigin(0.5)
    const costPerHour = 100 + this.player.level * 10
    this.add.text(w/2, 110, 'Kosten: ' + costPerHour + ' Proviant/Stunde', { fontSize:'14px', color:'#aaa' }).setOrigin(0.5)
    this.add.text(w/2, 150, 'Reisezeit festlegen (max 12h = 720 Min):', { fontSize:'16px', color:'#fff' }).setOrigin(0.5)
    let travelMinutes = 60
    const timeText = this.add.text(w/2, 180, 'Dauer: ' + travelMinutes + ' Minuten', { fontSize:'18px', color:'#00ff00' }).setOrigin(0.5)
    const minusBtn = this.add.text(w/2-150, 220, '[- 10 Min]', { fontSize:'16px', color:'#ff0000', backgroundColor:'#330000', padding:{x:10,y:5} }).setOrigin(0.5).setInteractive()
    minusBtn.on('pointerdown', () => { travelMinutes = Math.max(10, travelMinutes-10); timeText.setText('Dauer: ' + travelMinutes + ' Minuten') })
    const plusBtn = this.add.text(w/2+150, 220, '[+ 10 Min]', { fontSize:'16px', color:'#00ff00', backgroundColor:'#003300', padding:{x:10,y:5} }).setOrigin(0.5).setInteractive()
    plusBtn.on('pointerdown', () => { travelMinutes = Math.min(720, travelMinutes+10); timeText.setText('Dauer: ' + travelMinutes + ' Minuten') })
    const startBtn = this.add.text(w/2, 280, '[ Reise starten ]', { fontSize:'22px', color:'#00ff00', backgroundColor:'#004400', padding:{x:20,y:10} }).setOrigin(0.5).setInteractive()
    startBtn.on('pointerdown', () => {
      const neededProv = Math.ceil(travelMinutes / 60 * costPerHour)
      if ((this.player.provisions || 0) < neededProv) {
        alert('Nicht genug Proviant! Benötigt: ' + neededProv + ', Vorhanden: ' + (this.player.provisions || 0))
        return
      }
      if (this.loop && this.loop.active) return
      this.player.provisions -= neededProv
      this.questCount = 0; this.totalGold = 0; this.totalXP = 0
      this.loop = new GameLoop(this); this.loop.setPlayer(this.player)
      this.loop.startTravel(travelMinutes)
    })
    this.statusText = this.add.text(w/2, 340, '', { fontSize:'16px', color:'#ffff00' }).setOrigin(0.5)
    this.questLog = this.add.text(w/2, 380, '', { fontSize:'12px', color:'#ccc', wordWrap:{width:w-100} }).setOrigin(0.5)
    const backBtn = this.add.text(w/2, h-40, '[ Zurück ]', { fontSize:'16px', color:'#aaa', backgroundColor:'#333333', padding:{x:15,y:8} }).setOrigin(0.5).setInteractive()
    backBtn.on('pointerdown', () => {
      if (this.travelTimer) clearTimeout(this.travelTimer)
      if (this.questTimer) clearTimeout(this.questTimer)
      this.scene.start('GameScene', { player: this.player, username: this.username })
    })
  }
  showTravelStart(durationMinutes) {
    const w = this.cameras.main.width
    this.travelEndTime = Date.now() + durationMinutes * 60 * 1000
    this.statusText.setText('Reise aktiv... (Noch ' + durationMinutes + ' Min)')
    this.questLog.setText('Der Held bricht zur Reise auf...\n')
    const firstQuestDelay = Math.min(randInt(1, 10) * 60 * 1000, 30 * 60 * 1000)
    this.questTimer = setTimeout(() => this.triggerQuest(), firstQuestDelay)
  }
  startTravelTimer(durationMinutes) {
    const totalMs = durationMinutes * 60 * 1000
    this.travelTimer = setTimeout(() => {
      this.statusText.setText('Reise beendet! ' + this.questCount + ' Quests erledigt.')
      this.questLog.setText(this.questLog.text + '\n--- REISE BEENDET ---\nGesamt: +' + this.totalGold + ' Gold, +' + this.totalXP + ' XP')
    }, totalMs)
  }
  triggerQuest() {
    if (!this.loop || this.loop.active) return
    const searchDuration = randInt(1, 30)
    let rarity
    if (searchDuration >= 25) rarity = 'Epic'
    else if (searchDuration >= 20) rarity = 'Rare'
    else if (searchDuration >= 15) rarity = 'Rare'
    else rarity = 'Common'
    const lvl = Math.floor(this.player.level * (rarity === 'Legendary' ? 1.2 : rarity === 'Epic' ? 1.1 : 1))
    this.loop.monster = this.loop.mkMonster(lvl, rarity)
    this.loop.active = true
    this.loop.log = []
    this.questLog.setText(this.questLog.text + '\nQuest gefunden (Suchdauer: ' + searchDuration + ' Min, ' + RARITIES[rarity].name + ')...')
    this.questCount++
    createCombatUI(this, this.cameras.main.width, this.cameras.main.height, this.loop.monster)
    this.scene.showStart = function(monster, r) {}
    setTimeout(() => this.loop.fight(), 1000)
    this.time.delayedCall(5000, () => {
      if (!this.loop.active && this.travelEndTime && Date.now() < this.travelEndTime) {
        const nextDelay = Math.min(randInt(1, 30) * 60 * 1000, this.travelEndTime - Date.now())
        if (nextDelay > 0) {
          this.questTimer = setTimeout(() => this.triggerQuest(), nextDelay)
          this.statusText.setText('Held sucht weiter... (Noch ca. ' + Math.floor((this.travelEndTime - Date.now())/(60*1000)) + ' Min)')
        }
      }
    })
  }
  showStart(monster, rarity) {}
  updateBars(pHP, mHP) { updateBars(this, pHP, mHP) }
  updateLog(log) { updateLog(this, log) }
  showResult(won, gold, xp, drop) {
    this.totalGold += gold; this.totalXP += xp
    if (this.ui) { this.ui.destroy(); this.ui = null }
    this.questLog.setText(this.questLog.text + '\nQuest ' + this.questCount + ': ' + (won ? 'SIEG! +' + gold + ' Gold' : 'Niederlage...') + (drop ? ' Item: ' + drop.name : ''))
    this.loop.active = false
    saveCharacterToAccount(this.player)
  }
}

// ===== Tavern Scene =====
class TavernScene extends Phaser.Scene {
  constructor() { super({ key: 'TavernScene' }) }
  init(data) { this.player = data.player; this.username = data.username }
  create() {
    const w = this.cameras.main.width, h = this.cameras.main.height
    this.cameras.main.setBackgroundColor('#2a1a0e')
    this.add.text(w/2, 30, 'Tavern - Direkte Quests', { fontSize:'28px', color:'#ffaa00', fontStyle:'bold', stroke:'#000', strokeThickness:4 }).setOrigin(0.5)
    this.add.text(w/2, 80, 'Proviant: ' + (this.player.provisions || 0), { fontSize:'18px', color:'#ffaa00' }).setOrigin(0.5)
    const costPerHour = 100 + this.player.level * 10
    this.add.text(w/2, 110, 'Kosten: ' + costPerHour + ' Proviant/Stunde', { fontSize:'14px', color:'#aaa' }).setOrigin(0.5)
    const quests = [
      { text:'5 Min (Gewöhnlich)', dur:5, color:'#aaaaaa', bg:'#333333' },
      { text:'10 Min (Ungewöhnlich)', dur:10, color:'#00aaff', bg:'#002233' },
      { text:'15 Min (Selten)', dur:15, color:'#aa00ff', bg:'#330055' },
      { text:'20 Min (Legendär)', dur:20, color:'#ffaa00', bg:'#553300' },
      { text:'25 Min (Episch)', dur:25, color:'#ff5500', bg:'#552200' },
      { text:'30 Min (Legendär)', dur:30, color:'#ff0000', bg:'#330000' }
    ]
    this.add.text(w/2, 150, 'Wähle Quest-Dauer:', { fontSize:'16px', color:'#fff' }).setOrigin(0.5)
    quests.forEach((q, i) => {
      const btn = this.add.text(w/2, 180+i*35, q.text + ' (' + Math.ceil(q.dur/60*costPerHour) + ' Prov)', { fontSize:'16px', color:q.color, backgroundColor:q.bg, padding:{x:15,y:5} }).setOrigin(0.5).setInteractive()
      btn.on('pointerdown', () => { this.loop = new GameLoop(this); this.loop.setPlayer(this.player); this.loop.startTavern(q.dur) })
    })
    const backBtn = this.add.text(w/2, h-40, '[ Zurück ]', { fontSize:'16px', color:'#aaa', backgroundColor:'#333333', padding:{x:15,y:8} }).setOrigin(0.5).setInteractive()
    backBtn.on('pointerdown', () => this.scene.start('GameScene', { player: this.player, username: this.username }))
  }
  showStart(monster, rarity) { createCombatUI(this, this.cameras.main.width, this.cameras.main.height, monster) }
  updateBars(pHP, mHP) { updateBars(this, pHP, mHP) }
  updateLog(log) { updateLog(this, log) }
  showResult(won, gold, xp, drop) { showResult(this, won, gold, xp, drop); saveCharacterToAccount(this.player) }
}

// ===== Dungeon Scene =====
class DungeonScene extends Phaser.Scene {
  constructor() { super({ key: 'DungeonScene' }) }
  init(data) { this.player = data.player; this.username = data.username }
  create() {
    const w = this.cameras.main.width, h = this.cameras.main.height
    this.cameras.main.setBackgroundColor('#2a1a0e')
    this.add.text(w/2, 30, 'Dungeon (Bosse)', { fontSize:'28px', color:'#ffaa00', fontStyle:'bold', stroke:'#000', strokeThickness:4 }).setOrigin(0.5)
    this.add.text(w/2, 80, 'Fortschritt: Boss ' + (this.player.dungeonProgress || 0) + ' besiegt', { fontSize:'16px', color:'#fff' }).setOrigin(0.5)
    this.add.text(w/2, 120, 'Nächster Boss: Level ' + ((this.player.dungeonProgress || 0) + 1), { fontSize:'18px', color:'#ff6600' }).setOrigin(0.5)
    this.loop = new GameLoop(this); this.loop.setPlayer(this.player)
    const fightBtn = this.add.text(w/2, 180, '[ Boss bekämpfen ]', { fontSize:'22px', color:'#ff0000', backgroundColor:'#330000', padding:{x:20,y:10} }).setOrigin(0.5).setInteractive()
    fightBtn.on('pointerdown', () => { if (!this.loop.active) this.loop.startDungeon() })
    const backBtn = this.add.text(w/2, h-40, '[ Zurück ]', { fontSize:'16px', color:'#aaa', backgroundColor:'#333333', padding:{x:15,y:8} }).setOrigin(0.5).setInteractive()
    backBtn.on('pointerdown', () => this.scene.start('GameScene', { player: this.player, username: this.username }))
  }
  showStart(monster, rarity) { createCombatUI(this, this.cameras.main.width, this.cameras.main.height, monster) }
  updateBars(pHP, mHP) { updateBars(this, pHP, mHP) }
  updateLog(log) { updateLog(this, log) }
  showResult(won, gold, xp, drop) { showResult(this, won, gold, xp, drop); saveCharacterToAccount(this.player) }
}

// ===== Inventory Scene =====
class InventoryScene extends Phaser.Scene {
  constructor() { super({ key: 'InventoryScene' }) }
  init(data) { this.player = data.player; this.username = data.username }
  async create() {
    const w = this.cameras.main.width, h = this.cameras.main.height
    this.cameras.main.setBackgroundColor('#0a1a2a')
    this.add.text(w/2, 30, 'Inventar & Ausrüstung', { fontSize:'28px', color:'#aa00ff', fontStyle:'bold', stroke:'#000', strokeThickness:4 }).setOrigin(0.5)
    this.add.text(w/2, 70, 'Gold: ' + this.player.gold + ' | Proviant: ' + (this.player.provisions || 0), { fontSize:'18px', color:'#ffd700' }).setOrigin(0.5)
    
    // Lade aktuelle Charakterdaten inkl. Items vom Backend
    try {
      const updatedChar = await apiRequest(`/characters/${this.player.id}`, 'GET')
      this.player = { ...this.player, ...updatedChar }
    } catch (error) {
      console.error('Fehler beim Laden der Items:', error)
    }
    
    // Equipment
    this.add.text(w/2, 100, 'Ausrüstung:', { fontSize:'16px', color:'#fff' }).setOrigin(0.5)
    let y = 120
    const items = this.player.items || []
    const equipped = {}
    items.forEach(item => {
      if (item.id === this.player.equipped_weapon || item.id === this.player.equipped_armor || item.id === this.player.equipped_accessory) {
        equipped[item.slot] = item
      }
    })
    
    Object.entries(equipped).forEach(([slot, item]) => {
      this.add.text(w/2, y, slot + ': ' + item.name, { fontSize:'14px', color:'#00ff00' }).setOrigin(0.5); y += 20
    })
    
    // Inventory (unequipped items)
    y += 20
    this.add.text(w/2, y, 'Inventar (Klick zum Anlegen):', { fontSize:'16px', color:'#fff' }).setOrigin(0.5); y += 25
    const unequippedItems = items.filter(item => 
      item.id !== this.player.equipped_weapon && 
      item.id !== this.player.equipped_armor && 
      item.id !== this.player.equipped_accessory
    )
    
    if (unequippedItems.length === 0) {
      this.add.text(w/2, y, 'Leer', { fontSize:'14px', color:'#888' }).setOrigin(0.5)
    } else {
      unequippedItems.forEach(item => {
        const btn = this.add.text(w/2, y, item.name + ' (' + Math.floor(Math.pow(item.level, 1.5) * 5) + ' Gold)', { fontSize:'14px', color:'#ffffff', backgroundColor:'#222222', padding:{x:10,y:5} }).setOrigin(0.5).setInteractive()
        btn.on('pointerdown', () => this.equipItem(item)); y += 25
      })
    }
    
    const backBtn = this.add.text(w/2, h-40, '[ Zurück ]', { fontSize:'16px', color:'#aaa', backgroundColor:'#333333', padding:{x:15,y:8} }).setOrigin(0.5).setInteractive()
    backBtn.on('pointerdown', () => this.scene.start('GameScene', { player: this.player, username: this.username }))
  }
  async equipItem(item) {
    try {
      let slot = 'weapon'
      if (item.slot === 'armor') slot = 'armor'
      if (item.slot === 'accessory') slot = 'accessory'
      
      await apiRequest(`/characters/${this.player.id}/equip`, 'PUT', { item_id: item.id, slot })
      this.scene.restart({ player: this.player, username: this.username })
    } catch (error) {
      alert('Fehler beim Ausrüsten: ' + error.message)
    }
  }
}

// ===== Shop Scene =====
class ShopScene extends Phaser.Scene {
  constructor() { super({ key: 'ShopScene' }) }
  init(data) { this.player = data.player; this.username = data.username }
  async create() {
    const w = this.cameras.main.width, h = this.cameras.main.height
    this.cameras.main.setBackgroundColor('#0a2a2a')
    this.add.text(w/2, 30, 'Shop', { fontSize:'28px', color:'#00aaff', fontStyle:'bold', stroke:'#000', strokeThickness:4 }).setOrigin(0.5)
    this.add.text(w/2, 70, 'Gold: ' + this.player.gold, { fontSize:'18px', color:'#ffd700' }).setOrigin(0.5)
    
    // Lade Items vom Backend (Shop-Inventar generieren)
    try {
      const shopItems = await apiRequest(`/shop/inventory/${this.player.level}`, 'GET')
      
      const categories = [
        { name:'Waffen', slot:'weapon', color:'#ffaa00' },
        { name:'Rüstungen', slot:'armor', color:'#00aaff' },
        { name:'Accessoires', slot:'accessory', color:'#aa00ff' }
      ]
      
      let y = 120
      categories.forEach(cat => {
        this.add.text(w/2, y, cat.name + ' (6 Slots):', { fontSize:'16px', color:cat.color }).setOrigin(0.5); y += 25
        const catItems = shopItems.filter(item => item.slot === cat.slot).slice(0, 6)
        catItems.forEach(item => {
          const btn = this.add.text(w/2, y, item.name + ' - ' + item.price + ' Gold', { fontSize:'14px', color:'#ffffff', backgroundColor:'#222222', padding:{x:10,y:5} }).setOrigin(0.5).setInteractive()
          const detailText = this.add.text(w/2, h-100, '', { fontSize:'12px', color:'#fff', backgroundColor:'#000000', padding:{x:5,y:3} }).setOrigin(0.5).setVisible(false)
          btn.on('pointerover', () => {
            detailText.setText(`${item.name}\nRarity: ${item.rarity}\nLevel: ${item.level}\nStat: +${item.stat_bonus}\nVerkauf: ${Math.floor(item.price * 0.5)} Gold`)
            detailText.setVisible(true)
          })
          btn.on('pointerout', () => detailText.setVisible(false))
          btn.on('pointerdown', () => this.buyItem(item))
          y += 25
        })
        y += 10
      })
    } catch (error) {
      console.error('Fehler beim Laden des Shops:', error)
      this.add.text(w/2, 200, 'Fehler beim Laden des Shops', { fontSize:'16px', color:'#ff0000' }).setOrigin(0.5)
    }
    
    const backBtn = this.add.text(w/2, h-40, '[ Zurück ]', { fontSize:'16px', color:'#aaa', backgroundColor:'#333333', padding:{x:15,y:8} }).setOrigin(0.5).setInteractive()
    backBtn.on('pointerdown', () => this.scene.start('GameScene', { player: this.player, username: this.username }))
  }
  async buyItem(item) {
    try {
      const result = await apiRequest('/shop/buy', 'POST', { character_id: this.player.id, item })
      this.player = result.character
      alert('Item gekauft: ' + result.item.name)
      this.scene.restart({ player: this.player, username: this.username })
    } catch (error) {
      alert('Fehler beim Kaufen: ' + error.message)
    }
  }
}

// ===== PvP Scene =====
class PvPScene extends Phaser.Scene {
  constructor() { super({ key: 'PvPScene' }) }
  init(data) { this.player = data.player; this.username = data.username }
  async create() {
    const w = this.cameras.main.width, h = this.cameras.main.height
    this.cameras.main.setBackgroundColor('#2a0a0a')
    this.add.text(w/2, 30, 'PvP Arena', { fontSize:'28px', color:'#ff0000', fontStyle:'bold', stroke:'#000', strokeThickness:4 }).setOrigin(0.5)
    
    // Lade aktuellen Charakter
    try {
      const updatedChar = await apiRequest(`/characters/${this.player.id}`, 'GET')
      this.player = { ...this.player, ...updatedChar }
    } catch (error) {
      console.error('Fehler beim Laden:', error)
    }
    
    this.add.text(w/2, 80, 'Dein MMR: ' + (this.player.pvpMMR || 1000) + ' | Level: ' + this.player.level, { fontSize:'16px', color:'#fff' }).setOrigin(0.5)
    this.loop = new GameLoop(this); this.loop.setPlayer(this.player)
    const oppLvl = clamp(this.player.level + randInt(-3,3), 1, 1000)
    const oppClass = CLASSES[randInt(0, CLASSES.length-1)]
    this.add.text(w/2, 120, 'Gegner: ' + oppClass.name + ' Lv.' + oppLvl, { fontSize:'18px', color:'#ff6600' }).setOrigin(0.5)
    const fightBtn = this.add.text(w/2, 180, '[ PvP Kampf ]', { fontSize:'22px', color:'#ff0000', backgroundColor:'#330000', padding:{x:20,y:10} }).setOrigin(0.5).setInteractive()
    fightBtn.on('pointerdown', () => { if (!this.loop.active) this.loop.startPvP() })
    const backBtn = this.add.text(w/2, h-40, '[ Zurück ]', { fontSize:'16px', color:'#aaa', backgroundColor:'#333333', padding:{x:15,y:8} }).setOrigin(0.5).setInteractive()
    backBtn.on('pointerdown', () => this.scene.start('GameScene', { player: this.player, username: this.username }))
  }
  showStart(monster, rarity) { createCombatUI(this, this.cameras.main.width, this.cameras.main.height, monster) }
  updateBars(pHP, mHP) { updateBars(this, pHP, mHP) }
  updateLog(log) { updateLog(this, log) }
  async showResult(won, gold, xp, drop) {
    const w = this.cameras.main.width
    const mmrChange = won ? randInt(20,50) : -randInt(20,50)
    setTimeout(() => {
      this.player.pvpMMR = (this.player.pvpMMR || 1000) + mmrChange; this.player = this.loop.player
      if (this.ui) this.ui.add(this.add.text(w/2, 480, won ? 'SIEG!' : 'NIEDERLAGE...', { fontSize:'32px', color: won?'#00ff00':'#ff0000', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5))
      if (won) this.ui.add(this.add.text(w/2, 520, 'MMR: ' + (mmrChange>0?'+':'') + mmrChange + ' (Jetzt: ' + this.player.pvpMMR + ')', { fontSize:'20px', color:'#ffd700' }).setOrigin(0.5))
      const btn = this.add.text(w/2, 560, '[ Beenden ]', { fontSize:'18px', color:'#fff', backgroundColor:'#333333', padding: {x:15,y:8} }).setOrigin(0.5).setInteractive()
      btn.on('pointerdown', async () => { 
        if (this.ui) { this.ui.destroy(); this.ui=null }
        await saveCharacterToAccount(this.player)
        this.scene.start('PvPScene', { player: this.player, username: this.username })
      })
      if (this.ui) this.ui.add(btn)
    }, 1000)
  }
}

// ===== Guild Scene =====
class GuildScene extends Phaser.Scene {
  constructor() { super({ key: 'GuildScene' }) }
  init(data) { this.player = data.player; this.username = data.username }
  async create() {
    const w = this.cameras.main.width, h = this.cameras.main.height
    this.cameras.main.setBackgroundColor('#2a2a0a')
    this.add.text(w/2, 30, 'Gilde', { fontSize:'28px', color:'#ffff00', fontStyle:'bold', stroke:'#000', strokeThickness:4 }).setOrigin(0.5)
    
    // Lade Gilden vom Backend
    try {
      const guilds = await apiRequest('/guilds', 'GET')
      if (guilds && guilds.length > 0) {
        this.add.text(w/2, 80, 'Verfügbare Gilden:', { fontSize:'18px', color:'#ffff00' }).setOrigin(0.5)
        let y = 120
        guilds.slice(0, 5).forEach(guild => {
          const btn = this.add.text(w/2, y, guild.name + ' (Lv.' + guild.level + ')', { fontSize:'16px', color:'#ffff00', backgroundColor:'#444400', padding:{x:15,y:8} }).setOrigin(0.5).setInteractive()
          btn.on('pointerdown', async () => {
            try {
              await apiRequest(`/guilds/${guild.id}/join`, 'POST', { user_id: this.player.id })
              alert('Gilde beigetreten: ' + guild.name)
              this.scene.restart({ player: this.player, username: this.username })
            } catch (error) {
              alert('Fehler: ' + error.message)
            }
          })
          y += 40
        })
      } else {
        this.add.text(w/2, 120, 'Keine Gilden vorhanden', { fontSize:'16px', color:'#aaa' }).setOrigin(0.5)
      }
    } catch (error) {
      console.error('Fehler beim Laden der Gilden:', error)
    }
    
    // Neue Gilde gründen
    const createBtn = this.add.text(w/2, 300, '[ Gilde gründen (1000 Gold) ]', { fontSize:'20px', color:'#ffff00', backgroundColor:'#444400', padding:{x:20,y:10} }).setOrigin(0.5).setInteractive()
    createBtn.on('pointerdown', async () => {
      const guildName = prompt('Gildenname:')
      if (!guildName || !guildName.trim()) return
      try {
        const result = await apiRequest('/guilds', 'POST', { name: guildName.trim(), leader_id: this.player.id })
        alert('Gilde erstellt: ' + result.name)
        this.scene.restart({ player: this.player, username: this.username })
      } catch (error) {
        alert('Fehler: ' + error.message)
      }
    })
    
    const backBtn = this.add.text(w/2, h-40, '[ Zurück ]', { fontSize:'16px', color:'#aaa', backgroundColor:'#333333', padding:{x:15,y:8} }).setOrigin(0.5).setInteractive()
    backBtn.on('pointerdown', () => this.scene.start('GameScene', { player: this.player, username: this.username }))
  }
}

// ===== Daily Quest Scene =====
class DailyQuestScene extends Phaser.Scene {
  constructor() { super({ key: 'DailyQuestScene' }) }
  init(data) { this.player = data.player; this.username = data.username }
  async create() {
    const w = this.cameras.main.width, h = this.cameras.main.height
    this.cameras.main.setBackgroundColor('#0a2a2a')
    this.add.text(w/2, 30, 'Tägliche Quests (5/Tag)', { fontSize:'28px', color:'#00ffff', fontStyle:'bold', stroke:'#000', strokeThickness:4 }).setOrigin(0.5)
    
    try {
      // Lade tägliche Quests vom Backend
      const quests = await apiRequest(`/daily-quests/${this.player.id}`, 'GET')
      this.player.dailyQuests = quests
      
      const remaining = quests.filter(q => !q.completed).length
      this.add.text(w/2, 80, 'Verbleibend: ' + remaining + '/5', { fontSize:'16px', color:'#fff' }).setOrigin(0.5)
      
      let y = 120
      quests.forEach(q => {
        const rarityName = q.rarity === 'Common' ? 'Gewöhnlich' : q.rarity === 'Rare' ? 'Selten' : 'Episch'
        const txt = rarityName + ' Quest (' + q.duration + ' Min)' + (q.completed ? ' - ERLEDIGT' : '')
        const color = q.completed ? '#888' : '#00ffff', bg = q.completed ? '#222' : '#002222'
        const btn = this.add.text(w/2, y, txt, { fontSize:'16px', color:color, backgroundColor:bg, padding:{x:15,y:8} }).setOrigin(0.5).setInteractive()
        if (!q.completed) {
          btn.on('pointerdown', () => { 
            if (!this.loop || !this.loop.active) { 
              this.loop = new GameLoop(this); 
              this.loop.setPlayer(this.player); 
              this.loop.startDaily(q) 
            } 
          })
        }
        y += 40
      })
    } catch (error) {
      console.error('Fehler beim Laden der Quests:', error)
      this.add.text(w/2, 120, 'Fehler beim Laden der Quests', { fontSize:'16px', color:'#ff0000' }).setOrigin(0.5)
    }
    
    const backBtn = this.add.text(w/2, h-40, '[ Zurück ]', { fontSize:'16px', color:'#aaa', backgroundColor:'#333333', padding:{x:15,y:8} }).setOrigin(0.5).setInteractive()
    backBtn.on('pointerdown', () => this.scene.start('GameScene', { player: this.player, username: this.username }))
  }
  showStart(monster, rarity) { createCombatUI(this, this.cameras.main.width, this.cameras.main.height, monster) }
  updateBars(pHP, mHP) { updateBars(this, pHP, mHP) }
  updateLog(log) { updateLog(this, log) }
  async showResult(won, gold, xp, drop) { 
    showResult(this, won, gold, xp, drop)
    // Markiere Quest als abgeschlossen
    const activeQuest = this.player.dailyQuests?.find(q => !q.completed)
    if (activeQuest) {
      try {
        await apiRequest(`/daily-quests/${activeQuest.id}/complete`, 'PUT')
      } catch (error) {
        console.error('Fehler beim Markieren der Quest:', error)
      }
    }
    setTimeout(() => {
      this.scene.start('DailyQuestScene', { player: this.player, username: this.username })
    }, 2000)
  }
}

// ===== Hideout Scene =====
class HideoutScene extends Phaser.Scene {
  constructor() { super({ key: 'HideoutScene' }) }
  init(data) { this.player = data.player; this.username = data.username }
  create() {
    const w = this.cameras.main.width, h = this.cameras.main.height
    this.cameras.main.setBackgroundColor('#1a1a2e')
    this.add.text(w/2, 30, 'Hideout (Versteck)', { fontSize:'28px', color:'#ffaa55', fontStyle:'bold', stroke:'#000', strokeThickness:4 }).setOrigin(0.5)
    this.add.text(w/2, 80, 'Level: ' + (this.player.hideoutLevel || 0), { fontSize:'18px', color:'#ffaa55' }).setOrigin(0.5)
    this.add.text(w/2, 110, 'Passives Einkommen: ' + ((this.player.hideoutLevel || 0) * 10) + ' Gold/Stunde', { fontSize:'16px', color:'#ffd700' }).setOrigin(0.5)
    this.add.text(w/2, 140, 'Gesammelt: ' + (this.player.hideoutIncome || 0) + ' Gold', { fontSize:'16px', color:'#00ff00' }).setOrigin(0.5)
    
    const upgradeBtn = this.add.text(w/2, 200, '[ Upgrade (500 Gold) ]', { fontSize:'20px', color:'#ffaa55', backgroundColor:'#553311', padding:{x:20,y:10} }).setOrigin(0.5).setInteractive()
    upgradeBtn.on('pointerdown', async () => {
      if (this.player.gold >= 500) {
        this.player.gold -= 500
        this.player.hideoutLevel = (this.player.hideoutLevel || 0) + 1
        await saveCharacterToAccount(this.player)
        this.scene.restart({ player: this.player, username: this.username })
      } else {
        alert('Nicht genug Gold! (500 benötigt)')
      }
    })
    
    const collectBtn = this.add.text(w/2, 250, '[ Einkommen einsammeln ]', { fontSize:'20px', color:'#ffd700', backgroundColor:'#333300', padding:{x:20,y:10} }).setOrigin(0.5).setInteractive()
    collectBtn.on('pointerdown', async () => {
      const income = (this.player.hideoutLevel || 0) * 10
      this.player.gold += income
      this.player.hideoutIncome = 0
      await saveCharacterToAccount(this.player)
      alert('Eingesammelt: ' + income + ' Gold')
      this.scene.restart({ player: this.player, username: this.username })
    })
    
    const backBtn = this.add.text(w/2, h-40, '[ Zurück ]', { fontSize:'16px', color:'#aaa', backgroundColor:'#333333', padding:{x:15,y:8} }).setOrigin(0.5).setInteractive()
    backBtn.on('pointerdown', () => this.scene.start('GameScene', { player: this.player, username: this.username }))
  }
}

// ===== Game Config =====
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  scene: [LoginScene, CharacterSelect, CharacterCreation, GameScene, QuestScene, TavernScene, DungeonScene, InventoryScene, ShopScene, PvPScene, GuildScene, DailyQuestScene, HideoutScene]
}

// ===== Start Game =====
const game = new Phaser.Game(config)
