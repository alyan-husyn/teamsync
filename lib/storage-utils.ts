// Utility functions for localStorage operations with error handling

export const STORAGE_KEYS = {
  USER: "classroom-user",
  LOGIN_TIMESTAMP: "classroom-login-timestamp",
  CHATROOMS: "classroom-chatrooms",
  POSTS: "classroom-posts",
} as const

export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error parsing localStorage item ${key}:`, error)
    return defaultValue
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error setting localStorage item ${key}:`, error)
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing localStorage item ${key}:`, error)
  }
}

export function clearAppStorage(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    removeStorageItem(key)
  })
}

// Check if session is still valid (within specified duration)
export function isSessionValid(loginTimestamp: string, durationMs: number = 7 * 24 * 60 * 60 * 1000): boolean {
  try {
    const loginTime = Number.parseInt(loginTimestamp)
    const currentTime = Date.now()
    return currentTime - loginTime < durationMs
  } catch {
    return false
  }
}

// Convert date strings back to Date objects for stored data
export function reviveDates<T extends Record<string, any>>(obj: T, dateFields: string[]): T {
  const result = { ...obj }

  dateFields.forEach((field) => {
    if (result[field] && typeof result[field] === "string") {
      result[field] = new Date(result[field])
    }
  })

  return result
}
