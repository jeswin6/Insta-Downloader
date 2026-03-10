const STORAGE_KEY = 'habitflow-v1'

const defaultData = {
  habits: [],
  schedule: {},
  completions: {},
}

export const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function getTodayDate() {
  return new Date().toISOString().slice(0, 10)
}

export function getDayIndex(dateString) {
  const day = new Date(`${dateString}T12:00:00`).getDay()
  return day === 0 ? 6 : day - 1
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultData
    return { ...defaultData, ...JSON.parse(raw) }
  } catch {
    return defaultData
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function createHabit({ name, label, color }) {
  return {
    id: crypto.randomUUID(),
    name,
    label: label || '',
    color,
    createdAt: new Date().toISOString(),
  }
}
