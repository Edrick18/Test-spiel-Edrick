// API-Client für Frontend-Backend Kommunikation
const API_BASE_URL = 'http://localhost:3000/api'

export class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  async createCharacter(userId, name, classType) {
    try {
      var response = await fetch(this.baseUrl + '/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, name: name, class_type: classType })
      })
      
      var data = await response.json()
      
      if (!response.ok) {
        return { error: data.error || 'Fehler bei Charaktererstellung' }
      }
      
      return { data: data }
    } catch (error) {
      return { error: 'Netzwerkfehler' }
    }
  }

  async getCharacter(characterId) {
    try {
      var response = await fetch(this.baseUrl + '/characters/' + characterId)
      var data = await response.json()
      
      if (!response.ok) {
        return { error: data.error || 'Fehler beim Laden des Charakters' }
      }
      
      return { data: data }
    } catch (error) {
      return { error: 'Netzwerkfehler' }
    }
  }

  async updateCharacter(characterId, updates) {
    try {
      var response = await fetch(this.baseUrl + '/characters/' + characterId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      var data = await response.json()
      
      if (!response.ok) {
        return { error: data.error || 'Fehler bei Charakter-Aktualisierung' }
      }
      
      return { data: data }
    } catch (error) {
      return { error: 'Netzwerkfehler' }
    }
  }
}

export var apiClient = new ApiClient()
