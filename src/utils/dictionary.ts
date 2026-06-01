/**
 * Two-tier EN→VI word lookup:
 *   1. Local vocab store — instant, offline, returns the user's own card data.
 *   2. MyMemory free API (no key, anonymous ~5k chars/day) — for any other word.
 *      Results are cached in localStorage so each unique word hits the network once.
 */
import { useVocabularyStore } from '@/stores/vocabulary'
import type { Vocabulary } from '@/types/vocabulary'

const CACHE_KEY = 'dict.cache.v1'

export interface DictLookup {
  word: string
  meaningVi: string
  pronunciation?: string
  partOfSpeech?: string
  source: 'vocab' | 'api' | 'cache'
  vocabId?: string
}

function normalizeWord(w: string): string {
  return w.toLowerCase().replace(/[^a-z'-]/gi, '').trim()
}

function loadCache(): Record<string, string> {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return {}
    const p = JSON.parse(raw)
    return typeof p === 'object' && p !== null ? p : {}
  } catch {
    return {}
  }
}

function saveCache(cache: Record<string, string>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    /* quota exceeded — silently ignore */
  }
}

const cache: Record<string, string> = loadCache()

function findInVocab(word: string): Vocabulary | null {
  const store = useVocabularyStore()
  const target = normalizeWord(word)
  if (!target) return null
  // Exact match first
  const exact = store.items.find((it) => normalizeWord(it.word) === target)
  if (exact) return exact
  // Match if the vocab "word" is a multi-word phrase containing this token
  // (skip — too noisy; users tap a single word, want THAT word's meaning)
  return null
}

async function fetchRemote(word: string): Promise<string | null> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|vi`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = (await res.json()) as {
      responseData?: { translatedText?: string }
      responseStatus?: number
    }
    const t = data?.responseData?.translatedText
    if (!t || typeof t !== 'string') return null
    // MyMemory sometimes returns an error string in this field — guard against it
    if (t.toUpperCase().includes('INVALID') || t.toUpperCase().includes('MYMEMORY WARNING')) {
      return null
    }
    return t
  } catch {
    return null
  }
}

export async function lookupWord(rawWord: string): Promise<DictLookup | null> {
  const word = rawWord.trim()
  if (!word) return null
  const key = normalizeWord(word)
  if (!key) return null

  // Tier 1: local vocab
  const vocab = findInVocab(word)
  if (vocab) {
    return {
      word: vocab.word,
      meaningVi: vocab.meaningVi,
      pronunciation: vocab.pronunciation,
      partOfSpeech: vocab.partOfSpeech,
      source: 'vocab',
      vocabId: vocab.id,
    }
  }

  // Tier 2: cache
  if (cache[key]) {
    return { word, meaningVi: cache[key], source: 'cache' }
  }

  // Tier 3: remote
  const remote = await fetchRemote(key)
  if (remote) {
    cache[key] = remote
    saveCache(cache)
    return { word, meaningVi: remote, source: 'api' }
  }
  return null
}

/** Add a freshly-looked-up word to the vocab store under a "Tra từ trong bài" topic. */
export function addLookupToVocab(lookup: DictLookup, exampleSentence?: string) {
  const store = useVocabularyStore()
  // Find the latest day already in the store, fall back to "Tra từ"
  const days = store.days
  const latestDay = days.length > 0 ? days[days.length - 1] : 'Tra từ'
  store.add({
    word: lookup.word,
    pronunciation: lookup.pronunciation ?? '',
    partOfSpeech: 'other',
    meaningVi: lookup.meaningVi,
    meaningEn: '',
    day: latestDay ?? 'Tra từ',
    topic: 'Tra từ trong bài',
    examples: exampleSentence ? [exampleSentence] : [],
    collocations: [],
    notes: 'Đã thêm từ popup tra từ.',
  })
}
