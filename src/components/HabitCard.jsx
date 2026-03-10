import React from 'react'
import { Flame, Trash2, GripVertical } from 'lucide-react'

export default function HabitCard({ habit, progress, streak, onDelete }) {
  return (
    <article
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData('dragType', 'habit')
        event.dataTransfer.setData('habitId', habit.id)
      }}
      className="rounded-xl border p-3"
      style={{ borderColor: `${habit.color}66`, backgroundColor: `${habit.color}12` }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: habit.color }} />
          <h3 className="font-semibold">{habit.name}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button className="cursor-grab text-slate-400" title="Drag to day column">
            <GripVertical size={16} />
          </button>
          <button onClick={() => onDelete(habit)} className="text-rose-300 hover:text-rose-200" title="Delete habit">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      {habit.label && <p className="mb-2 text-xs text-slate-400">{habit.label}</p>}
      <div className="text-sm font-semibold" style={{ color: habit.color }}>{progress}% this week</div>
      <div className="mt-1 flex items-center gap-1 text-xs text-amber-300">
        <Flame size={13} /> {streak.current} streak (best {streak.longest})
      </div>
    </article>
  )
}
