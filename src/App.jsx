import React from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import { BarChart3, CalendarCheck2 } from 'lucide-react'
import HabitsPage from './pages/HabitsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import { createHabit, createInstancesForWeekdays, getHabits, loadAppData } from './utils/habitStorage'

export default function App() {
  const [data, setData] = React.useState(() => loadAppData())

  const refreshData = React.useCallback(() => {
    setData(loadAppData())
  }, [])

  React.useEffect(() => {
    const existing = getHabits()
    if (existing.length) return

    const meditation = createHabit({ name: 'Meditation', color: '#6366f1', label: 'Wellness' })
    const spoken = createHabit({ name: 'Spoken Practice', color: '#ef4444', label: 'Learning' })
    createInstancesForWeekdays(meditation.id, [1, 3, 5])
    createInstancesForWeekdays(spoken.id, [0, 2, 4])
    refreshData()
  }, [refreshData])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1e1b4b_0%,#020617_45%)] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="panel mb-6 flex flex-wrap items-center justify-between gap-3 p-4">
          <h1 className="text-2xl font-bold">Habit<span className="text-amber-400">Flow</span></h1>
          <nav className="flex gap-2">
            <NavItem to="/" icon={CalendarCheck2} label="Habits" />
            <NavItem to="/analytics" icon={BarChart3} label="Analytics" />
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<HabitsPage data={data} refreshData={refreshData} />} />
          <Route path="/analytics" element={<AnalyticsPage data={data} />} />
        </Routes>
      </div>
    </div>
  )
}

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
          isActive ? 'border-violet-500 bg-violet-500/20 text-violet-100' : 'border-slate-700 text-slate-300'
        }`
      }
    >
      <Icon size={16} /> {label}
    </NavLink>
  )
}
