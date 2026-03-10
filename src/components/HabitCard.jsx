import { Flame, GripVertical } from 'lucide-react'

export default function HabitCard({ habit, streak, dragListeners, dragAttributes, compact = false }) {
  return (
    <article className="rounded-xl border p-3" style={{ borderColor: `${habit.color}66`, backgroundColor: `${habit.color}14` }}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="font-semibold">{habit.name}</h3>
        <button className="cursor-grab text-slate-300" {...dragListeners} {...dragAttributes}>
          <GripVertical size={16} />
        </button>
      </div>
      {!compact && habit.label && <p className="mb-1 text-xs text-slate-400">{habit.label}</p>}
      <div className="flex items-center gap-1 text-xs text-amber-300">
        <Flame size={14} /> {streak.current} day streak (best {streak.longest})
      </div>
    </article>
  )
}
