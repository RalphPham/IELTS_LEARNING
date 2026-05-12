import type { Vocabulary } from '@/types/vocabulary'

export type MasteryLevel = 1 | 2 | 3 | 4 | 5

export const MASTERY_META: Record<
  MasteryLevel,
  { label: string; short: string; color: string; bg: string; border: string; barBg: string }
> = {
  1: {
    label: 'Mới',
    short: 'Mới',
    color: 'text-slate-700',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    barBg: 'bg-slate-400',
  },
  2: {
    label: 'Đang học',
    short: 'Học',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    barBg: 'bg-amber-400',
  },
  3: {
    label: 'Nhớ sơ',
    short: 'Sơ',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    barBg: 'bg-orange-400',
  },
  4: {
    label: 'Quen',
    short: 'Quen',
    color: 'text-sky-700',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    barBg: 'bg-sky-400',
  },
  5: {
    label: 'Thành thạo',
    short: 'Thạo',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    barBg: 'bg-emerald-500',
  },
}

export const MASTERY_LEVELS: MasteryLevel[] = [1, 2, 3, 4, 5]

// 5-level classification by repetitions + interval
//   1 — Mới        (chưa ôn lần nào)
//   2 — Đang học   (đã ôn nhưng interval < 3 ngày)
//   3 — Nhớ sơ     (3 ≤ interval < 14 ngày)
//   4 — Quen       (14 ≤ interval < 30 ngày)
//   5 — Thành thạo (interval ≥ 30 ngày)
export function classify(card: Vocabulary): MasteryLevel {
  if (card.repetitions === 0) return 1
  if (card.interval < 3) return 2
  if (card.interval < 14) return 3
  if (card.interval < 30) return 4
  return 5
}

export function countByMastery(cards: Vocabulary[]): Record<MasteryLevel, number> {
  const out: Record<MasteryLevel, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  cards.forEach((c) => (out[classify(c)] += 1))
  return out
}

export function renderStars(level: MasteryLevel): string {
  return '★'.repeat(level) + '☆'.repeat(5 - level)
}
