import React from 'react'
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const pieColors = ['#8b5cf6', '#06b6d4', '#f43f5e', '#22c55e', '#f59e0b']

export default function AnalyticsCharts({ weekData, categoryData }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="panel p-4">
        <h3 className="mb-4 font-semibold">Weekly Productivity</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekData}>
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="completed" radius={[6, 6, 0, 0]}>
                {weekData.map((entry, index) => <Cell key={entry.day} fill={pieColors[index % pieColors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="panel p-4">
        <h3 className="mb-4 font-semibold">Habit Category Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie dataKey="value" data={categoryData} cx="50%" cy="50%" outerRadius={95} label>
                {categoryData.map((entry, index) => <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
