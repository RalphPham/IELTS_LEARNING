import type { Vocabulary } from '@/types/vocabulary'

// 6 study days make up one week. Day 1-6 → Tuần 1, Day 7-12 → Tuần 2, ...
export const DAYS_PER_WEEK = 6

function dayNumber(day: string): number {
  const n = parseInt(day.replace(/\D/g, ''), 10)
  return Number.isFinite(n) && n > 0 ? n : 0
}

export function weekOfDay(day: string): number {
  const n = dayNumber(day)
  return n === 0 ? 0 : Math.ceil(n / DAYS_PER_WEEK)
}

export function weekLabel(week: number): string {
  return `Tuần ${week}`
}

/** All distinct week numbers present in the items, sorted ascending. */
export function weeksFrom(items: Vocabulary[]): number[] {
  const set = new Set<number>()
  items.forEach((it) => {
    const w = weekOfDay(it.day)
    if (w > 0) set.add(w)
  })
  return Array.from(set).sort((a, b) => a - b)
}

/** Days that belong to a given week, sorted by day number. */
export function daysInWeek(items: Vocabulary[], week: number): string[] {
  const set = new Set<string>()
  items.forEach((it) => {
    if (weekOfDay(it.day) === week) set.add(it.day)
  })
  return Array.from(set).sort((a, b) => dayNumber(a) - dayNumber(b))
}

export function itemsInWeek(items: Vocabulary[], week: number): Vocabulary[] {
  return items.filter((it) => weekOfDay(it.day) === week)
}
