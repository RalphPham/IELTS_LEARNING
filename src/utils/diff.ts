export type DiffType = 'match' | 'missing' | 'extra'
export interface DiffToken {
  text: string
  type: DiffType
}

function normalize(w: string): string {
  return w.toLowerCase().replace(/[^a-z0-9']/gi, '')
}

/**
 * Word-level diff between the correct text and what the user typed,
 * using an LCS alignment. Returns tokens in reading order:
 *   match   — word the user got right
 *   missing — word in the correct text the user left out / mistyped
 *   extra   — word the user typed that isn't in the correct text
 */
export function wordDiff(correct: string, typed: string): DiffToken[] {
  const a = correct.split(/\s+/).filter(Boolean)
  const b = typed.split(/\s+/).filter(Boolean)
  const na = a.map(normalize)
  const nb = b.map(normalize)
  const m = na.length
  const n = nb.length

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i]![j] = na[i] === nb[j] ? dp[i + 1]![j + 1]! + 1 : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!)
    }
  }

  const out: DiffToken[] = []
  let i = 0
  let j = 0
  while (i < m && j < n) {
    if (na[i] === nb[j]) {
      out.push({ text: a[i]!, type: 'match' })
      i++
      j++
    } else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) {
      out.push({ text: a[i]!, type: 'missing' })
      i++
    } else {
      out.push({ text: b[j]!, type: 'extra' })
      j++
    }
  }
  while (i < m) {
    out.push({ text: a[i]!, type: 'missing' })
    i++
  }
  while (j < n) {
    out.push({ text: b[j]!, type: 'extra' })
    j++
  }
  return out
}

export function diffAccuracy(tokens: DiffToken[]): number {
  const correctWords = tokens.filter((t) => t.type !== 'extra').length
  const matched = tokens.filter((t) => t.type === 'match').length
  return correctWords === 0 ? 0 : matched / correctWords
}

/** Split a paragraph into sentences for sentence-by-sentence dictation. */
export function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/** Count occurrences of a phrase (word-boundary, case-insensitive). */
export function countPhrase(haystack: string, phrase: string): number {
  const re = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
  const matches = haystack.match(re)
  return matches ? matches.length : 0
}
