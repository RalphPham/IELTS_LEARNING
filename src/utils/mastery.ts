import type { Vocabulary } from '@/types/vocabulary'

export type MasteryLevel = 'new' | 'learning' | 'young' | 'mature'

export const MASTERY_META: Record<
  MasteryLevel,
  { label: string; color: string; bg: string; border: string; ring: string }
> = {
  new: {
    label: 'Mới',
    color: 'text-slate-700',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    ring: 'ring-slate-300',
  },
  learning: {
    label: 'Đang học',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    ring: 'ring-amber-300',
  },
  young: {
    label: 'Quen',
    color: 'text-sky-700',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    ring: 'ring-sky-300',
  },
  mature: {
    label: 'Thành thạo',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    ring: 'ring-emerald-300',
  },
}

export function classify(card: Vocabulary): MasteryLevel {
  if (card.repetitions === 0) return 'new'
  if (card.interval < 7) return 'learning'
  if (card.interval < 21) return 'young'
  return 'mature'
}

export function countByMastery(cards: Vocabulary[]): Record<MasteryLevel, number> {
  const out: Record<MasteryLevel, number> = { new: 0, learning: 0, young: 0, mature: 0 }
  cards.forEach((c) => (out[classify(c)] += 1))
  return out
}
