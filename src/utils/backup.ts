import type { useVocabularyStore } from '@/stores/vocabulary'
import type { useGrammarStore } from '@/stores/grammar'
import type { useActivityStore } from '@/stores/activity'

interface FullBackup {
  version: 1
  exportedAt: string
  vocab: ReturnType<ReturnType<typeof useVocabularyStore>['$state']['items']['valueOf']> | unknown
  grammarProgress: unknown
  grammarUserQuestions: unknown
  activity: { studyDates: string[] }
}

export function buildBackupJson(
  vocab: ReturnType<typeof useVocabularyStore>,
  grammar: ReturnType<typeof useGrammarStore>,
  activity: ReturnType<typeof useActivityStore>,
): string {
  const payload = {
    version: 1 as const,
    exportedAt: new Date().toISOString(),
    vocab: vocab.items,
    grammarProgress: grammar.progress,
    grammarUserQuestions: grammar.userQuestions,
    activity: { studyDates: activity.studyDates },
  }
  return JSON.stringify(payload, null, 2)
}

export function restoreBackupJson(
  json: string,
  vocab: ReturnType<typeof useVocabularyStore>,
  grammar: ReturnType<typeof useGrammarStore>,
  activity: ReturnType<typeof useActivityStore>,
): { vocabCount: number; grammarUserCount: number; days: number } {
  const data = JSON.parse(json) as Partial<FullBackup> & {
    vocab?: unknown[]
    grammarProgress?: Record<string, unknown>
    grammarUserQuestions?: unknown[]
    activity?: { studyDates?: string[] }
  }

  if (!data || typeof data !== 'object') throw new Error('Định dạng không hợp lệ')

  if (Array.isArray(data.vocab)) {
    vocab.importJson(JSON.stringify(data.vocab))
  }
  if (data.grammarProgress && typeof data.grammarProgress === 'object') {
    // Reset and re-populate
    grammar.reset()
    Object.assign(grammar.progress, data.grammarProgress)
  }
  if (Array.isArray(data.grammarUserQuestions)) {
    grammar.importUserQuestionsJson(JSON.stringify(data.grammarUserQuestions))
  }
  if (data.activity?.studyDates && Array.isArray(data.activity.studyDates)) {
    activity.reset()
    data.activity.studyDates.forEach((d) => {
      if (!activity.data.studyDates.includes(d)) activity.data.studyDates.push(d)
    })
    activity.data.studyDates.sort()
  }

  return {
    vocabCount: Array.isArray(data.vocab) ? data.vocab.length : 0,
    grammarUserCount: Array.isArray(data.grammarUserQuestions) ? data.grammarUserQuestions.length : 0,
    days: data.activity?.studyDates?.length ?? 0,
  }
}

export function downloadJsonFile(json: string, filename: string) {
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
