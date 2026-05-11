import type { ReviewGrade, Vocabulary } from '@/types/vocabulary'

const MS_PER_DAY = 24 * 60 * 60 * 1000

export function newSrsState(now: Date = new Date()) {
  return {
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: now.toISOString(),
    lastReviewedAt: null as string | null,
  }
}

// SM-2 adapted for 4-button Anki-style grading.
// again = fail (reset), hard / good / easy = pass with different ease adjustments.
export function applyGrade(card: Vocabulary, grade: ReviewGrade, now: Date = new Date()): Vocabulary {
  let { easeFactor, interval, repetitions } = card

  if (grade === 'again') {
    repetitions = 0
    interval = 0
    easeFactor = Math.max(1.3, easeFactor - 0.2)
  } else {
    const q = grade === 'hard' ? 3 : grade === 'good' ? 4 : 5
    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)))

    if (repetitions === 0) {
      interval = grade === 'easy' ? 4 : 1
    } else if (repetitions === 1) {
      interval = grade === 'hard' ? 3 : grade === 'easy' ? 7 : 6
    } else {
      const mult = grade === 'hard' ? 1.2 : grade === 'easy' ? easeFactor * 1.3 : easeFactor
      interval = Math.round(interval * mult)
    }
    repetitions += 1
  }

  const nextReviewDate = new Date(now.getTime() + interval * MS_PER_DAY).toISOString()

  return {
    ...card,
    easeFactor,
    interval,
    repetitions,
    nextReviewDate,
    lastReviewedAt: now.toISOString(),
    updatedAt: now.toISOString(),
  }
}

export function isDue(card: Vocabulary, now: Date = new Date()): boolean {
  return new Date(card.nextReviewDate).getTime() <= now.getTime()
}
