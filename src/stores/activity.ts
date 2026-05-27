import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'activity.v1'

interface ActivityData {
  /** YYYY-MM-DD strings, kept sorted and unique. */
  studyDates: string[]
}

function todayStr(d: Date = new Date()): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function load(): ActivityData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { studyDates: [] }
    const parsed = JSON.parse(raw)
    return {
      studyDates: Array.isArray(parsed?.studyDates) ? parsed.studyDates : [],
    }
  } catch {
    return { studyDates: [] }
  }
}

export const useActivityStore = defineStore('activity', () => {
  const data = ref<ActivityData>(load())

  watch(
    data,
    (val) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    },
    { deep: true },
  )

  function markStudied() {
    const t = todayStr()
    if (!data.value.studyDates.includes(t)) {
      data.value.studyDates.push(t)
      data.value.studyDates.sort()
    }
  }

  /**
   * Current streak: consecutive days ending today (or yesterday if today
   * hasn't been studied yet — grace day so the streak shows "still alive").
   */
  const currentStreak = computed(() => {
    const set = new Set(data.value.studyDates)
    const d = new Date()
    if (!set.has(todayStr(d))) {
      d.setDate(d.getDate() - 1)
    }
    let count = 0
    while (set.has(todayStr(d))) {
      count += 1
      d.setDate(d.getDate() - 1)
    }
    return count
  })

  const longestStreak = computed(() => {
    const sorted = [...data.value.studyDates].sort()
    let best = 0
    let cur = 0
    let prev: Date | null = null
    for (const s of sorted) {
      const [y, m, d] = s.split('-').map((x) => parseInt(x, 10))
      const date = new Date(y!, (m ?? 1) - 1, d ?? 1)
      if (prev) {
        const diffDays = Math.round((date.getTime() - prev.getTime()) / 86400000)
        cur = diffDays === 1 ? cur + 1 : 1
      } else {
        cur = 1
      }
      if (cur > best) best = cur
      prev = date
    }
    return best
  })

  const totalDays = computed(() => data.value.studyDates.length)

  /** Last N days as { date, studied } for a heatmap. */
  function lastNDays(n: number): Array<{ date: string; studied: boolean }> {
    const set = new Set(data.value.studyDates)
    const out: Array<{ date: string; studied: boolean }> = []
    const d = new Date()
    for (let i = n - 1; i >= 0; i--) {
      const dt = new Date(d)
      dt.setDate(dt.getDate() - i)
      const s = todayStr(dt)
      out.push({ date: s, studied: set.has(s) })
    }
    return out
  }

  function reset() {
    data.value = { studyDates: [] }
  }

  return {
    data,
    studyDates: computed(() => data.value.studyDates),
    currentStreak,
    longestStreak,
    totalDays,
    lastNDays,
    markStudied,
    reset,
  }
})
