import React from 'react'
import { Plus, Target, Trophy, CheckCircle2 } from 'lucide-react'
import HabitColumn from '../components/HabitColumn'
import CreateHabitModal from '../components/CreateHabitModal'
import HabitCard from '../components/HabitCard'
import {
  WEEK_DAYS,
  createHabit,
  createInstance,
  createInstancesForWeekdays,
  deleteHabit,
  getWeekDates,
  moveInstanceToDate,
  toggleInstanceCompleted,
} from '../utils/habitStorage'
import { getHabitPerformance, getStreakForHabit, getWeeklyCompletion } from '../utils/analyticsUtils'

export default function HabitsPage({ data, refreshData }) {
  const [openModal, setOpenModal] = React.useState(false)
  const [habitToDelete, setHabitToDelete] = React.useState(null)

  const weekDates = React.useMemo(() => getWeekDates(), [])

  const habitsMap = React.useMemo(() => Object.fromEntries(data.habits.map((habit) => [habit.id, habit])), [data.habits])

  const habitsWithProgress = React.useMemo(
    () => getHabitPerformance(data.habits, data.instances),
    [data.habits, data.instances],
  )

  const streaks = React.useMemo(
    () => Object.fromEntries(data.habits.map((habit) => [habit.id, getStreakForHabit(habit.id, data.instances)])),
    [data.habits, data.instances],
  )

  const weekly = getWeeklyCompletion(data.instances)
  const todayDate = new Date().toISOString().slice(0, 10)
  const totalToday = data.instances.filter((item) => item.date === todayDate).length
  const completedToday = data.instances.filter((item) => item.date === todayDate && item.completed).length
  const currentBest = Math.max(0, ...Object.values(streaks).map((s) => s.current))

  const board = weekDates.map((date) => data.instances.filter((item) => item.date === date))

  function handleCreateHabit(payload) {
    const habit = createHabit(payload)
    const weekdays = payload.weekdays?.length ? payload.weekdays : [1]
    createInstancesForWeekdays(habit.id, weekdays)
    setOpenModal(false)
    refreshData()
  }

  function handleToggle(instanceId, completed) {
    toggleInstanceCompleted(instanceId, completed)
    refreshData()
  }

  function handleDropToDay({ type, habitId, instanceId, date }) {
    if (type === 'habit' && habitId) {
      const exists = data.instances.some((item) => item.habitId === habitId && item.date === date)
      if (!exists) createInstance(habitId, date)
      refreshData()
      return
    }

    if (type === 'instance' && instanceId) {
      moveInstanceToDate(instanceId, date)
      refreshData()
    }
  }

  function confirmDeleteHabit() {
    if (!habitToDelete) return
    deleteHabit(habitToDelete.id)
    setHabitToDelete(null)
    refreshData()
  }

  return (
    <>
      <div className="mb-4 grid gap-4 md:grid-cols-4">
        <StatCard icon={Target} title="Weekly completion" value={`${weekly.percent}%`} />
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

      <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {habitsWithProgress.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            progress={habit.percent}
            streak={streaks[habit.id]}
            onDelete={(selected) => setHabitToDelete(selected)}
          />
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {WEEK_DAYS.map((day, dayIndex) => (
          <HabitColumn
            key={day}
            title={day}
            dayDate={weekDates[dayIndex]}
            instances={board[dayIndex]}
            habitsMap={habitsMap}
            onToggle={handleToggle}
            onDropToDay={handleDropToDay}
          />
        ))}
      </div>

      <CreateHabitModal open={openModal} onClose={() => setOpenModal(false)} onCreate={handleCreateHabit} />

      {habitToDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="panel w-full max-w-md p-5">
            <h3 className="mb-2 text-lg font-bold">Delete habit?</h3>
            <p className="mb-4 text-sm text-slate-300">
              This will remove <span className="font-semibold">{habitToDelete.name}</span> and all of its scheduled instances.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setHabitToDelete(null)} className="rounded-lg border border-slate-700 py-2">Cancel</button>
              <button onClick={confirmDeleteHabit} className="rounded-lg bg-rose-600 py-2 font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
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
