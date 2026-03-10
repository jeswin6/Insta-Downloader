import React from 'react'
import { Plus, Target, Trophy, CheckCircle2 } from 'lucide-react'
import { completionRate, getStreakForHabit } from '../utils/analyticsUtils'
import { WEEK_DAYS, createHabit, getTodayDate } from '../utils/habitStorage'
import HabitColumn from '../components/HabitColumn'
import CreateHabitModal from '../components/CreateHabitModal'

export default function HabitsPage({ data, setData }) {
  const [openModal, setOpenModal] = React.useState(false)
  const todayDate = getTodayDate()

  const habitsMap = React.useMemo(() => Object.fromEntries(data.habits.map((habit) => [habit.id, habit])), [data.habits])

  const streaks = React.useMemo(
    () => Object.fromEntries(data.habits.map((habit) => [habit.id, getStreakForHabit(habit.id, data.completions)])),
    [data.habits, data.completions],
  )

  const board = React.useMemo(() => {
    return WEEK_DAYS.map((_, dayIndex) => {
      const items = []
      data.habits.forEach((habit) => {
        if ((data.schedule[habit.id] || []).includes(dayIndex)) {
          items.push({ habitId: habit.id, dayIndex, date: todayDate, entryId: `${dayIndex}:${habit.id}` })
        }
      })
      return items
    })
  }, [data.habits, data.schedule, todayDate])

  const weeklyPct = completionRate(data.schedule, data.completions)
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const totalToday = board[todayIndex]?.length || 0
  const completedToday = Object.keys(data.completions).filter((key) => key.endsWith(todayDate) && data.completions[key]).length
  const currentBest = Math.max(0, ...Object.values(streaks).map((s) => s.current))

  function onCreate(payload) {
    const habit = createHabit(payload)
    setData((prev) => ({ ...prev, habits: [...prev.habits, habit], schedule: { ...prev.schedule, [habit.id]: [1] } }))
    setOpenModal(false)
  }

  function toggleCompletion(habitId, date) {
    const key = `${habitId}:${date}`
    setData((prev) => ({ ...prev, completions: { ...prev.completions, [key]: !prev.completions[key] } }))
  }

  function onDropHabit(habitId, dayIndex) {
    if (!habitId) return
    setData((prev) => {
      const current = prev.schedule[habitId] || []
      if (current.includes(dayIndex)) return prev
      return {
        ...prev,
        schedule: {
          ...prev.schedule,
          [habitId]: [...current, dayIndex].sort((a, b) => a - b),
        },
      }
    })
  }

  return (
    <>
      <div className="mb-4 grid gap-4 md:grid-cols-4">
        <StatCard icon={Target} title="Weekly completion" value={`${weeklyPct}%`} />
        <StatCard icon={CheckCircle2} title="Completed today" value={`${completedToday}/${totalToday}`} />
        <StatCard icon={Plus} title="Total habits" value={data.habits.length} />
        <StatCard icon={Trophy} title="Current best streak" value={`${currentBest} days`} />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">My Habits</h2>
        <button onClick={() => setOpenModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 font-semibold">
          <Plus size={18} /> Create Habit
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {WEEK_DAYS.map((day, dayIndex) => (
          <HabitColumn
            key={day}
            dayIndex={dayIndex}
            title={day}
            items={board[dayIndex]}
            habitsMap={habitsMap}
            completions={data.completions}
            onToggle={toggleCompletion}
            onDropHabit={onDropHabit}
            streaks={streaks}
          />
        ))}
      </div>

      <CreateHabitModal open={openModal} onClose={() => setOpenModal(false)} onCreate={onCreate} />
    </>
  )
}

function StatCard({ icon: Icon, title, value }) {
  return (
    <article className="panel p-4">
      <div className="mb-2 flex items-center gap-2 text-slate-400"><Icon size={16} /> {title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </article>
  )
}
