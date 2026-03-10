# HabitFlow (React + Vite + Tailwind)

A modern dark-mode habit tracker web app inspired by productivity dashboards.

## Features

- Create habits with name, optional label, and color
- Weekly board with Monday–Sunday columns
- Drag habits between day columns (native drag & drop)
- Mark daily completion with checkboxes
- LocalStorage persistence for habits, schedule, and completion history
- Streak tracking (current + longest)
- Analytics page with:
  - Weekly completion metrics
  - Recharts bar chart (daily completed habits)
  - Recharts pie chart (habit category distribution)
  - Monthly heatmap-style completion view

## Tech Stack

- React + Vite
- Tailwind CSS
- Lucide React
- Recharts
- LocalStorage

## Local setup

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Project structure

```text
src/
  components/
    HabitCard.jsx
    HabitColumn.jsx
    CreateHabitModal.jsx
    AnalyticsCharts.jsx
  pages/
    HabitsPage.jsx
    AnalyticsPage.jsx
  utils/
    habitStorage.js
    analyticsUtils.js
```
