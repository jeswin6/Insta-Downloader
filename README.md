# HabitFlow (React + Vite + Tailwind)

A modern dark-mode habit tracker web app inspired by productivity dashboards.

## Features

- Create habits with name, optional label, color, and initial weekday schedule
- **Instance-level tracking**: every scheduled occurrence gets a unique `instanceId`
- Weekly board with Monday–Sunday columns
- Drag a habit card into a day column to create a scheduled instance for that day
- Drag existing instances between days
- Toggle completion per instance (only that instance changes)
- Delete a habit with confirmation (removes habit + related instances)
- Analytics page with weekly charts and monthly heatmap
- LocalStorage persistence with legacy migration from older storage shape

## Data model (LocalStorage)

- `habitflow-habits-v2`
  - `[{ id, name, color, label, createdAt }]`
- `habitflow-instances-v2`
  - `[{ instanceId, habitId, date, completed }]`

Legacy key `habitflow-v1` is migrated automatically on app boot.

## Local setup

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite (default: `http://localhost:5173`).

## Test flow

1. Create two habits with different colors.
2. Drag Habit A to Tuesday.
3. Drag Habit B to Tuesday and Thursday.
4. Toggle only one Tuesday instance and verify only that checkbox changes.
5. Delete Habit A and verify its instances and analytics are removed.
