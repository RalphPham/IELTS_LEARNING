import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { GrammarProgressMap, TenseId } from '@/types/grammar'

const STORAGE_KEY = 'grammar.v1'

function load(): GrammarProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

export const useGrammarStore = defineStore('grammar', () => {
  const progress = ref<GrammarProgressMap>(load())

  watch(
    progress,
    (val) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    },
    { deep: true },
  )

  function recordSession(
    tenseId: TenseId,
    answeredIds: string[],
    wrongIds: string[],
  ) {
    const cur = progress.value[tenseId] ?? {
      attempts: 0,
      totalAnswered: 0,
      totalCorrect: 0,
      lastScore: 0,
      wrongIds: [],
    }
    const correct = answeredIds.length - wrongIds.length
    cur.attempts += 1
    cur.totalAnswered += answeredIds.length
    cur.totalCorrect += correct
    cur.lastScore = answeredIds.length === 0 ? 0 : correct / answeredIds.length

    // Add new wrong IDs to the cumulative set
    const wrongSet = new Set(cur.wrongIds)
    wrongIds.forEach((id) => wrongSet.add(id))
    // Drop any IDs the user answered correctly this round
    answeredIds
      .filter((id) => !wrongIds.includes(id))
      .forEach((id) => wrongSet.delete(id))
    cur.wrongIds = Array.from(wrongSet)

    progress.value[tenseId] = cur
  }

  function reset() {
    progress.value = {}
  }

  function getForTense(tenseId: TenseId) {
    return progress.value[tenseId] ?? null
  }

  return { progress, recordSession, reset, getForTense }
})
