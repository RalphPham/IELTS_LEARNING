import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { GrammarProgressMap, GrammarQuestion, TenseId } from '@/types/grammar'
import { useActivityStore } from './activity'

const PROGRESS_KEY = 'grammar.v1'
const USER_QUESTIONS_KEY = 'grammar.userQuestions.v1'

function loadProgress(): GrammarProgressMap {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

function loadUserQuestions(): GrammarQuestion[] {
  try {
    const raw = localStorage.getItem(USER_QUESTIONS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function uid() {
  return 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export const useGrammarStore = defineStore('grammar', () => {
  const progress = ref<GrammarProgressMap>(loadProgress())
  const userQuestions = ref<GrammarQuestion[]>(loadUserQuestions())

  watch(
    progress,
    (val) => {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(val))
    },
    { deep: true },
  )

  watch(
    userQuestions,
    (val) => {
      localStorage.setItem(USER_QUESTIONS_KEY, JSON.stringify(val))
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
    if (answeredIds.length > 0) useActivityStore().markStudied()

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

  // ============ User questions CRUD ============
  function addUserQuestion(q: Omit<GrammarQuestion, 'id'>): string {
    const id = uid()
    userQuestions.value.push({ ...q, id })
    return id
  }

  function addUserQuestions(qs: Array<Omit<GrammarQuestion, 'id'>>): string[] {
    const ids: string[] = []
    qs.forEach((q) => {
      const id = uid()
      userQuestions.value.push({ ...q, id })
      ids.push(id)
    })
    return ids
  }

  function removeUserQuestion(id: string) {
    userQuestions.value = userQuestions.value.filter((q) => q.id !== id)
  }

  function updateUserQuestion(id: string, patch: Partial<GrammarQuestion>) {
    const idx = userQuestions.value.findIndex((q) => q.id === id)
    if (idx === -1) return
    const cur = userQuestions.value[idx]
    if (!cur) return
    userQuestions.value[idx] = { ...cur, ...patch, id: cur.id }
  }

  function userQuestionsFor(tenseId: TenseId): GrammarQuestion[] {
    return userQuestions.value.filter((q) => q.tenseId === tenseId)
  }

  const userQuestionCount = computed(() => userQuestions.value.length)

  function exportUserQuestionsJson(): string {
    return JSON.stringify(userQuestions.value, null, 2)
  }

  function importUserQuestionsJson(json: string) {
    const data = JSON.parse(json)
    if (!Array.isArray(data)) throw new Error('Invalid format')
    userQuestions.value = data as GrammarQuestion[]
  }

  return {
    progress,
    userQuestions,
    userQuestionCount,
    recordSession,
    reset,
    getForTense,
    addUserQuestion,
    addUserQuestions,
    removeUserQuestion,
    updateUserQuestion,
    userQuestionsFor,
    exportUserQuestionsJson,
    importUserQuestionsJson,
  }
})
