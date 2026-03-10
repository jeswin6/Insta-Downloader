import { X } from 'lucide-react'

const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#84cc16', '#14b8a6', '#3b82f6', '#ef4444']

export default function CreateHabitModal({ open, onClose, onCreate }) {
  if (!open) return null

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = form.get('name')?.toString().trim()
    if (!name) return
    onCreate({
      name,
      label: form.get('label')?.toString().trim(),
      color: form.get('color') || colors[0],
    })
    event.currentTarget.reset()
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="panel w-full max-w-xl animate-in rounded-2xl p-6 duration-200">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Create Habit Card</h2>
          <button onClick={onClose} className="rounded-full bg-slate-800/80 p-2 text-slate-300 hover:bg-slate-700"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-400">Card Name</label>
            <input name="name" placeholder="e.g. Read for 20 minutes" className="w-full rounded-xl border border-violet-500/60 bg-slate-950 px-4 py-3 outline-none focus:border-violet-300" required />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-400">Label (Optional)</label>
            <input name="label" placeholder="Wellness / Study / Work" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-400" />
          </div>
          <div>
            <p className="mb-3 text-sm text-slate-400">Color</p>
            <div className="grid grid-cols-5 gap-3">
              {colors.map((color, i) => (
                <label key={color} className="cursor-pointer">
                  <input defaultChecked={i === 0} type="radio" name="color" value={color} className="sr-only peer" />
                  <div className="h-10 rounded-xl border-2 border-transparent peer-checked:border-white" style={{ backgroundColor: color }} />
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-700 py-3 font-semibold text-slate-200">Cancel</button>
            <button type="submit" className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 font-semibold">Create Card</button>
          </div>
        </form>
      </div>
    </div>
  )
}
