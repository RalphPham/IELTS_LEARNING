export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'phrase'
  | 'phrasal verb'
  | 'collocation'
  | 'idiom'
  | 'other'

export interface Vocabulary {
  id: string
  word: string
  pronunciation: string
  partOfSpeech: PartOfSpeech
  meaningVi: string
  meaningEn: string
  day: string
  topic: string
  examples: string[]
  collocations: string[]
  notes: string
  audioUrl: string

  // SM-2 SRS state
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewDate: string
  lastReviewedAt: string | null
  createdAt: string
  updatedAt: string
}

export type ReviewGrade = 'again' | 'hard' | 'good' | 'easy'

export interface VocabularyInput {
  word: string
  pronunciation?: string
  partOfSpeech?: PartOfSpeech
  meaningVi: string
  meaningEn?: string
  day: string
  topic: string
  examples?: string[]
  collocations?: string[]
  notes?: string
  audioUrl?: string
}
