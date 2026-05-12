import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { ReviewGrade, Vocabulary, VocabularyInput } from '@/types/vocabulary'
import { applyGrade, isDue, newSrsState } from '@/utils/srs'
import { seedVocabulary } from '@/data/seed'

const STORAGE_KEY = 'vocab.v2'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

function loadFromStorage(): Vocabulary[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function buildCard(input: VocabularyInput): Vocabulary {
  const now = new Date()
  return {
    id: uid(),
    word: input.word.trim(),
    pronunciation: input.pronunciation?.trim() ?? '',
    partOfSpeech: input.partOfSpeech ?? 'other',
    meaningVi: input.meaningVi.trim(),
    meaningEn: input.meaningEn?.trim() ?? '',
    day: input.day.trim(),
    topic: input.topic.trim(),
    examples: (input.examples ?? []).map((e) => e.trim()).filter(Boolean),
    collocations: (input.collocations ?? []).map((c) => c.trim()).filter(Boolean),
    notes: input.notes?.trim() ?? '',
    audioUrl: input.audioUrl?.trim() ?? '',
    ...newSrsState(now),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  }
}

function mergeSeed(existing: Vocabulary[]): Vocabulary[] {
  const known = new Set(existing.map((it) => `${it.day}::${it.word.toLowerCase()}`))
  const missing = seedVocabulary
    .filter((s) => !known.has(`${s.day}::${s.word.toLowerCase()}`))
    .map(buildCard)
  return missing.length ? [...existing, ...missing] : existing
}

export const useVocabularyStore = defineStore('vocabulary', () => {
  const stored = loadFromStorage()
  const items = ref<Vocabulary[]>(stored ? mergeSeed(stored) : seedVocabulary.map(buildCard))

  watch(
    items,
    (val) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    },
    { deep: true },
  )

  const topics = computed(() => {
    const set = new Set<string>()
    items.value.forEach((it) => set.add(it.topic))
    return Array.from(set).sort()
  })

  const days = computed(() => {
    const set = new Set<string>()
    items.value.forEach((it) => set.add(it.day))
    return Array.from(set).sort((a, b) => {
      const na = parseInt(a.replace(/\D/g, ''), 10) || 0
      const nb = parseInt(b.replace(/\D/g, ''), 10) || 0
      return na - nb
    })
  })

  const dueCards = computed(() => items.value.filter((it) => isDue(it)))

  function topicsForDay(day: string | null) {
    const set = new Set<string>()
    items.value
      .filter((it) => (day === null ? true : it.day === day))
      .forEach((it) => set.add(it.topic))
    return Array.from(set).sort()
  }

  function add(input: VocabularyInput) {
    items.value.push(buildCard(input))
  }

  function update(id: string, patch: Partial<VocabularyInput>) {
    const idx = items.value.findIndex((it) => it.id === id)
    if (idx === -1) return
    const cur = items.value[idx]
    if (!cur) return
    items.value[idx] = {
      ...cur,
      word: patch.word?.trim() ?? cur.word,
      pronunciation: patch.pronunciation?.trim() ?? cur.pronunciation,
      partOfSpeech: patch.partOfSpeech ?? cur.partOfSpeech,
      meaningVi: patch.meaningVi?.trim() ?? cur.meaningVi,
      meaningEn: patch.meaningEn?.trim() ?? cur.meaningEn,
      day: patch.day?.trim() ?? cur.day,
      topic: patch.topic?.trim() ?? cur.topic,
      examples:
        patch.examples !== undefined
          ? patch.examples.map((e) => e.trim()).filter(Boolean)
          : cur.examples,
      collocations:
        patch.collocations !== undefined
          ? patch.collocations.map((c) => c.trim()).filter(Boolean)
          : cur.collocations,
      notes: patch.notes?.trim() ?? cur.notes,
      audioUrl: patch.audioUrl?.trim() ?? cur.audioUrl,
      updatedAt: new Date().toISOString(),
    }
  }

  function remove(id: string) {
    items.value = items.value.filter((it) => it.id !== id)
  }

  function grade(id: string, g: ReviewGrade) {
    const idx = items.value.findIndex((it) => it.id === id)
    if (idx === -1) return
    const cur = items.value[idx]
    if (!cur) return
    items.value[idx] = applyGrade(cur, g)
  }

  function getById(id: string) {
    return items.value.find((it) => it.id === id) ?? null
  }

  function exportJson(): string {
    return JSON.stringify(items.value, null, 2)
  }

  function importJson(json: string) {
    const data = JSON.parse(json)
    if (!Array.isArray(data)) throw new Error('Invalid data format')
    items.value = data as Vocabulary[]
  }

  function resetToSeed() {
    items.value = seedVocabulary.map(buildCard)
  }

  return {
    items,
    topics,
    days,
    dueCards,
    topicsForDay,
    add,
    update,
    remove,
    grade,
    getById,
    exportJson,
    importJson,
    resetToSeed,
  }
})
