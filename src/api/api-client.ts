// API-Client für Frontend-Backend Kommunikation
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000/api'

export interface ApiResponse<T> {
  data?: T
  error?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  // Charakter erstellen
  async createCharacter(userId: number, name: string, classType: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/characters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, name, class_type: classType })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        return { error: data.error || 'Fehler bei Charaktererstellung' }
      }
      
      return { data }
    } catch (error) {
      return { error: 'Netzwerkfehler' }
    }
  }

  // Charakter abrufen
  async getCharacter(characterId: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/characters/${characterId}`)
      const data = await response.json()
      
      if (!response.ok) {
        return { error: data.error || 'Fehler beim Laden des Charakters' }
      }
      
      return { data }
    } catch (error) {
      return { error: 'Netzwerkfehler' }
    }
  }

  // Charakter aktualisieren (nach Kampf/Level-Up)
  async updateCharacter(characterId: number, updates: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/characters/${characterId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        return { error: data.error || 'Fehler bei Charakter-Aktualisierung' }
      }
      
      return { data }
    } catch (error) {
      return { error: 'Netzwerkfehler' }
    }
  }
}

export const apiClient = new ApiClient()