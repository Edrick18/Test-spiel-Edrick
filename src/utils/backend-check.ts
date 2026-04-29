// Prüfe ob Backend erreichbar ist
export async function checkBackendStatus(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:3000/api/health')
    return response.ok
  } catch {
    return false
  }
}