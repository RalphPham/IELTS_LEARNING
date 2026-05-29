import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useActivityStore } from './activity'

const STORAGE_KEY = 'skills.v1'

export interface DictationRecord {
  date: string
  accuracy: number
  sentences: number
}

export interface SpeakingRecord {
  date: string
  promptId: string
  fluency: number
  pronunciation: number
  target: number
}

interface SkillsData {
  dictation: DictationRecord[]
  speaking: SpeakingRecord[]
  /** Aggregate of words missed during dictation, for the "âm hay sót" table */
  missedWords: Record<string, number>
}

function load(): SkillsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { dictation: [], speaking: [], missedWords: {} }
    const p = JSON.parse(raw)
    return {
      dictation: Array.isArray(p?.dictation) ? p.dictation : [],
      speaking: Array.isArray(p?.speaking) ? p.speaking : [],
      missedWords: p?.missedWords && typeof p.missedWords === 'object' ? p.missedWords : {},
    }
  } catch {
    return { dictation: [], speaking: [], missedWords: {} }
  }
}

export const useSkillsStore = defineStore('skills', () => {
  const data = ref<SkillsData>(load())

  watch(
    data,
    (val) => localStorage.setItem(STORAGE_KEY, JSON.stringify(val)),
    { deep: true },
  )

  function recordDictation(accuracy: number, sentences: number, missed: string[]) {
    data.value.dictation.push({
      date: new Date().toISOString(),
      accuracy,
      sentences,
    })
    missed.forEach((w) => {
      const key = w.toLowerCase()
      if (!key) return
      data.value.missedWords[key] = (data.value.missedWords[key] ?? 0) + 1
    })
    useActivityStore().markStudied()
  }

  function recordSpeaking(promptId: string, fluency: number, pronunciation: number, target: number) {
    data.value.speaking.push({
      date: new Date().toISOString(),
      promptId,
      fluency,
      pronunciation,
      target,
    })
    useActivityStore().markStudied()
  }

  const dictationCount = computed(() => data.value.dictation.length)
  const speakingCount = computed(() => data.value.speaking.length)

  const avgDictationAccuracy = computed(() => {
    const ds = data.value.dictation
    if (ds.length === 0) return 0
    return ds.reduce((s, d) => s + d.accuracy, 0) / ds.length
  })

  const topMissedWords = computed(() =>
    Object.entries(data.value.missedWords)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15)
      .map(([word, count]) => ({ word, count })),
  )

  function reset() {
    data.value = { dictation: [], speaking: [], missedWords: {} }
  }

  return {
    data,
    dictationCount,
    speakingCount,
    avgDictationAccuracy,
    topMissedWords,
    recordDictation,
    recordSpeaking,
    reset,
  }
})
