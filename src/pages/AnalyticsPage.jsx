import AnalyticsCharts from '../components/AnalyticsCharts'
import { dailyCounts, habitStats, monthlyHeatmapData } from '../utils/analyticsUtils'

export default function AnalyticsPage({ data }) {
  const weekData = dailyCounts(data.schedule, data.completions)
  const stats = habitStats(data.habits, data.schedule, data.completions)
  const mostConsistent = [...stats].sort((a, b) => b.rate - a.rate)[0]
  const leastCompleted = [...stats].sort((a, b) => a.rate - b.rate)[0]
  const heatmap = monthlyHeatmapData(data.completions)

  const categoryMap = data.habits.reduce((acc, habit) => {
    const label = habit.label || 'No Label'
    acc[label] = (acc[label] || 0) + 1
    return acc
  }, {})
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }))

  const totalCompleted = Object.values(data.completions).filter(Boolean).length
  const avgCompletion = weekData.reduce((acc, day) => acc + (day.scheduled ? day.completed / day.scheduled : 0), 0) / 7
  const longest = Math.max(0, ...stats.map((item) => item.completedCount))

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Weekly Completion Rate" value={`${Math.round(avgCompletion * 100)}%`} />
        <Metric title="Most Consistent Habit" value={mostConsistent?.name || '-'} />
        <Metric title="Least Completed Habit" value={leastCompleted?.name || '-'} />
        <Metric title="Total Habits Completed" value={totalCompleted} />
      </div>

      <AnalyticsCharts weekData={weekData} categoryData={categoryData.length ? categoryData : [{ name: 'None', value: 1 }]} />

      <section className="panel p-4">
        <h3 className="mb-3 text-lg font-semibold">Monthly Completion Heatmap</h3>
        <div className="grid grid-cols-10 gap-2">
          {heatmap.map((entry) => (
            <div
              key={entry.date}
              title={`${entry.date}: ${entry.count} completions`}
              className="h-8 rounded"
              style={{ backgroundColor: entry.count ? `rgba(139, 92, 246, ${Math.min(0.25 + entry.count * 0.15, 1)})` : '#1e293b' }}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Metric title="Average Completion %" value={`${Math.round(avgCompletion * 100)}%`} />
        <Metric title="Longest Streak Achieved" value={`${longest} days`} />
        <Metric title="Tracked Habits" value={data.habits.length} />
      </section>
    </div>
  )
}

function Metric({ title, value }) {
  return (
    <article className="panel p-4">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-xl font-bold">{value}</p>
    </article>
  )
}
