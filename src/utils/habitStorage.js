const HABITS_KEY = 'habitflow-habits-v2'
const INSTANCES_KEY = 'habitflow-instances-v2'
const LEGACY_KEY = 'habitflow-v1'

export const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function uid(prefix) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`
}

export function toDateKey(date) {
  return new Date(date).toISOString().slice(0, 10)
}

export function getWeekDates(baseDate = new Date()) {
  const date = new Date(baseDate)
  const day = date.getDay() || 7
  if (day !== 1) date.setDate(date.getDate() - (day - 1))
  date.setHours(0, 0, 0, 0)

  return WEEK_DAYS.map((_, index) => {
    const item = new Date(date)
    item.setDate(date.getDate() + index)
    return toDateKey(item)
  })
}

export function getDayIndex(dateString) {
  const day = new Date(`${dateString}T12:00:00`).getDay()
  return day === 0 ? 6 : day - 1
}

function parseArray(raw) {
  try {
    const parsed = JSON.parse(raw || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function getHabits() {
  return parseArray(localStorage.getItem(HABITS_KEY))
}

export function saveHabits(habits) {
  localStorage.setItem(HABITS_KEY, JSON.stringify([...habits]))
}

export function getInstances() {
  return parseArray(localStorage.getItem(INSTANCES_KEY))
}

export function saveInstances(instances) {
  localStorage.setItem(INSTANCES_KEY, JSON.stringify([...instances]))
}

export function loadAppData() {
  migrateLegacyData()
  return {
    habits: getHabits(),
    instances: getInstances(),
  }
}

export function createHabit(habitData) {
  const habit = {
    id: uid('habit'),
    name: habitData.name,
    color: habitData.color,
    label: habitData.label || '',
    createdAt: Date.now(),
  }

  const habits = getHabits()
  saveHabits([...habits, habit])
  return habit
}

export function createInstance(habitId, date) {
  const normalizedDate = toDateKey(date)
  const instance = {
    instanceId: uid('ins'),
    habitId,
    date: normalizedDate,
    completed: false,
  }

  const instances = getInstances()
  saveInstances([...instances, instance])
  return instance
}

export function createInstancesForWeekdays(habitId, weekdays = [], baseDate = new Date()) {
  const dates = getWeekDates(baseDate)
  const instances = getInstances()
  const next = [...instances]

  weekdays.forEach((dayIndex) => {
    const date = dates[dayIndex]
    const alreadyExists = next.some((item) => item.habitId === habitId && item.date === date)
    if (!alreadyExists) {
      next.push({
        instanceId: uid('ins'),
        habitId,
        date,
        completed: false,
      })
    }
  })

  saveInstances(next)
  return next
}

export function toggleInstanceCompleted(instanceId, completed) {
  const instances = getInstances()
  const next = instances.map((item) =>
    item.instanceId === instanceId ? { ...item, completed: typeof completed === 'boolean' ? completed : !item.completed } : item,
  )
  saveInstances(next)
  return next
}

export function moveInstanceToDate(instanceId, date) {
  const normalizedDate = toDateKey(date)
  const instances = getInstances()
  const next = instances.map((item) => (item.instanceId === instanceId ? { ...item, date: normalizedDate } : item))
  saveInstances(next)
  return next
}

export function deleteHabit(habitId) {
  const habits = getHabits().filter((habit) => habit.id !== habitId)
  const instances = getInstances().filter((instance) => instance.habitId !== habitId)
  saveHabits(habits)
  saveInstances(instances)
  return { habits, instances }
}

function migrateLegacyData() {
  const habitsExist = localStorage.getItem(HABITS_KEY)
  const instancesExist = localStorage.getItem(INSTANCES_KEY)
  if (habitsExist || instancesExist) return

  const legacyRaw = localStorage.getItem(LEGACY_KEY)
  if (!legacyRaw) return

  try {
    const legacy = JSON.parse(legacyRaw)
    const legacyHabits = Array.isArray(legacy.habits) ? legacy.habits : []
    const schedule = legacy.schedule || {}
    const completions = legacy.completions || {}
    const weekDates = getWeekDates()

    const habits = legacyHabits.map((habit) => ({
      id: habit.id || uid('habit'),
      name: habit.name || 'Untitled Habit',
      color: habit.color || '#6366f1',
      label: habit.label || '',
      createdAt: habit.createdAt ? new Date(habit.createdAt).getTime() || Date.now() : Date.now(),
    }))

    const instances = []
    Object.entries(schedule).forEach(([habitId, dayIndexes]) => {
      if (!Array.isArray(dayIndexes)) return
      dayIndexes.forEach((dayIndex) => {
        const date = weekDates[dayIndex]
        if (!date) return
        const completed = !!completions[`${habitId}:${date}`]
        instances.push({
          instanceId: uid('ins'),
          habitId,
          date,
          completed,
        })
      })
    })

    saveHabits(habits)
    saveInstances(instances)
  } catch {
    saveHabits([])
    saveInstances([])
  }
}
