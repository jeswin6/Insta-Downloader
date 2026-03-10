import { GripVertical } from 'lucide-react'

export default function HabitColumn({ dayIndex, title, items, habitsMap, completions, onToggle, onDropHabit, streaks }) {
  return (
    <section
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        const habitId = e.dataTransfer.getData('habitId')
        onDropHabit(habitId, dayIndex)
      }}
      className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 transition hover:border-violet-400/60"
    >
      <h4 className="mb-3 text-center font-semibold text-slate-400">{title}</h4>
      <div className="space-y-2">
        {items.map((entry) => {
          const habit = habitsMap[entry.habitId]
          return (
            <div
              key={entry.entryId}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('habitId', entry.habitId)}
              className="rounded-xl border border-slate-800 p-2"
              style={{ backgroundColor: `${habit.color}22` }}
            >
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={!!completions[`${entry.habitId}:${entry.date}`]} onChange={() => onToggle(entry.habitId, entry.date)} className="h-5 w-5 accent-violet-500" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{habit.name}</p>
                  <p className="text-[11px] text-slate-400">🔥 {streaks[entry.habitId]?.current || 0} streak</p>
                </div>
                <GripVertical size={15} className="text-slate-500" />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
