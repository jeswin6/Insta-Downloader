import { getWeekDates, toDateKey, WEEK_DAYS } from './habitStorage'

export function getWeeklyCompletion(instances, date = new Date()) {
  const weekSet = new Set(getWeekDates(date))
  const weekly = instances.filter((item) => weekSet.has(item.date))
  const completed = weekly.filter((item) => item.completed).length
  const total = weekly.length
  return {
    completed,
    total,
    percent: total ? Math.round((completed / total) * 100) : 0,
  }
}

export function getHabitWeeklyPercent(habitId, instances, date = new Date()) {
  const weekSet = new Set(getWeekDates(date))
  const weekly = instances.filter((item) => item.habitId === habitId && weekSet.has(item.date))
  if (!weekly.length) return 0
  const completed = weekly.filter((item) => item.completed).length
  return Math.round((completed / weekly.length) * 100)
}

export function getDailyChartData(instances, date = new Date()) {
  const weekDates = getWeekDates(date)
  return WEEK_DAYS.map((day, index) => {
    const dayItems = instances.filter((item) => item.date === weekDates[index])
    return {
      day: day.slice(0, 3),
      scheduled: dayItems.length,
      completed: dayItems.filter((item) => item.completed).length,
    }
  })
}

export function getHabitPerformance(habits, instances, date = new Date()) {
  return habits.map((habit) => {
    const percent = getHabitWeeklyPercent(habit.id, instances, date)
    const totalCompleted = instances.filter((item) => item.habitId === habit.id && item.completed).length
    return { ...habit, percent, totalCompleted }
  })
}

export function getStreakForHabit(habitId, instances) {
  const completedDates = instances
    .filter((item) => item.habitId === habitId && item.completed)
    .map((item) => item.date)
    .sort()

  if (!completedDates.length) return { current: 0, longest: 0 }

  let longest = 1
  let run = 1

  for (let i = 1; i < completedDates.length; i += 1) {
    const prev = new Date(`${completedDates[i - 1]}T00:00:00`)
    const now = new Date(`${completedDates[i]}T00:00:00`)
    const diff = Math.round((now - prev) / (1000 * 60 * 60 * 24))
    if (diff === 1) {
      run += 1
      longest = Math.max(longest, run)
    } else if (diff > 1) {
      run = 1
    }
  }

  const today = new Date(`${toDateKey(new Date())}T00:00:00`)
  const latest = new Date(`${completedDates[completedDates.length - 1]}T00:00:00`)
  const lag = Math.round((today - latest) / (1000 * 60 * 60 * 24))
  const current = lag <= 1 ? run : 0

  return { current, longest }
}

export function getMonthlyHeatmap(instances, span = 30) {
  const data = []
  for (let i = span - 1; i >= 0; i -= 1) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const key = toDateKey(date)
    const count = instances.filter((item) => item.date === key && item.completed).length
    data.push({ date: key, count })
  }
  return data
}
