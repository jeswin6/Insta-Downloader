import React from 'react'
import { GripVertical } from 'lucide-react'

export default function HabitColumn({ title, dayDate, instances, habitsMap, onToggle, onDropToDay }) {
  return (
    <section
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        const dragType = event.dataTransfer.getData('dragType')
        if (dragType === 'habit') {
          onDropToDay({ type: 'habit', habitId: event.dataTransfer.getData('habitId'), date: dayDate })
        }
        if (dragType === 'instance') {
          onDropToDay({ type: 'instance', instanceId: event.dataTransfer.getData('instanceId'), date: dayDate })
        }
      }}
      className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 transition hover:border-violet-400/60"
    >
      <h4 className="mb-1 text-center font-semibold text-slate-400">{title}</h4>
      <p className="mb-3 text-center text-xs text-slate-500">{dayDate}</p>
      <div className="space-y-2">
        {instances.map((instance) => {
          const habit = habitsMap[instance.habitId]
          if (!habit) return null
          return (
            <div
              key={instance.instanceId}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData('dragType', 'instance')
                event.dataTransfer.setData('instanceId', instance.instanceId)
              }}
              className="rounded-xl border border-slate-800 p-2"
              style={{ backgroundColor: `${habit.color}1c` }}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={instance.completed}
                  onChange={() => onToggle(instance.instanceId, !instance.completed)}
                  className="h-5 w-5 accent-violet-500"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{habit.name}</p>
                  <p className="text-[11px] text-slate-400">{habit.label || 'No label'}</p>
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
