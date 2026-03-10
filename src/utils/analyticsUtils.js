import { getDayIndex, WEEK_DAYS } from './habitStorage'

export function completionRate(schedule, completions, date = new Date()) {
  const monday = getMonday(date)
  let total = 0
  let done = 0

  for (let i = 0; i < 7; i += 1) {
    const current = new Date(monday)
    current.setDate(monday.getDate() + i)
    const dateKey = current.toISOString().slice(0, 10)
    const dayIndex = i

    Object.entries(schedule).forEach(([habitId, days]) => {
      if (days?.includes(dayIndex)) {
        total += 1
        if (completions[`${habitId}:${dateKey}`]) done += 1
      }
    })
  }

  return total ? Math.round((done / total) * 100) : 0
}

export function dailyCounts(schedule, completions, date = new Date()) {
  const monday = getMonday(date)
  return WEEK_DAYS.map((name, i) => {
    const current = new Date(monday)
    current.setDate(monday.getDate() + i)
    const dateKey = current.toISOString().slice(0, 10)

    let scheduled = 0
    let completed = 0
    Object.entries(schedule).forEach(([habitId, days]) => {
      if (days?.includes(i)) {
        scheduled += 1
        if (completions[`${habitId}:${dateKey}`]) completed += 1
      }
    })

    return { day: name.slice(0, 3), scheduled, completed }
  })
}

export function habitStats(habits, schedule, completions) {
  return habits.map((habit) => {
    const days = schedule[habit.id] || []
    let total = 0
    let done = 0

    Object.entries(completions).forEach(([key, completed]) => {
      if (!completed) return
      const [habitId, date] = key.split(':')
      if (habitId !== habit.id) return
      if (days.includes(getDayIndex(date))) done += 1
    })

    total = days.length * 4 || 1
    const rate = Math.round((done / total) * 100)
    return { ...habit, rate, completedCount: done }
  })
}

export function getStreakForHabit(habitId, completions) {
  const entries = Object.entries(completions)
    .filter(([key, value]) => value && key.startsWith(`${habitId}:`))
    .map(([key]) => key.split(':')[1])
    .sort()

  if (!entries.length) return { current: 0, longest: 0 }

  let longest = 1
  let current = 1
  let running = 1

  for (let i = 1; i < entries.length; i += 1) {
    const prev = new Date(`${entries[i - 1]}T00:00:00`)
    const now = new Date(`${entries[i]}T00:00:00`)
    const diff = Math.floor((now - prev) / (1000 * 60 * 60 * 24))
    if (diff === 1) {
      running += 1
      longest = Math.max(longest, running)
    } else if (diff > 1) {
      running = 1
    }
  }

  const today = new Date()
  const latest = new Date(`${entries[entries.length - 1]}T00:00:00`)
  const diffFromToday = Math.floor((today - latest) / (1000 * 60 * 60 * 24))
  current = diffFromToday <= 1 ? running : 0

  return { current, longest }
}

export function monthlyHeatmapData(completions) {
  const days = []
  for (let i = 29; i >= 0; i -= 1) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const key = date.toISOString().slice(0, 10)
    const count = Object.entries(completions).filter(([entryKey, done]) => done && entryKey.endsWith(key)).length
    days.push({ date: key, count })
  }
  return days
}

function getMonday(date) {
  const current = new Date(date)
  const day = current.getDay() || 7
  if (day !== 1) current.setHours(-24 * (day - 1))
  current.setHours(0, 0, 0, 0)
  return current
}
