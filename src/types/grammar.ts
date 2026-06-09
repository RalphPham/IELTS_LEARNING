export type TenseId =
  | 'present_simple'
  | 'present_continuous'
  | 'present_perfect'
  | 'present_perfect_continuous'
  | 'past_simple'
  | 'past_continuous'
  | 'past_perfect'
  | 'past_perfect_continuous'
  | 'future_simple'
  | 'future_continuous'
  | 'future_perfect'
  | 'future_perfect_continuous'
  // Special topics (rule-based, not one of the 12 tenses)
  | 'sequencing'
  | 'future_forms'
  | 'have_got'
  | 'used_to'
  | 'pp_vs_past'
  | 'modals'
  | 'modals_deduction'
  | 'conditionals'

export type TenseGroup = 'present' | 'past' | 'future'

export interface UsageCase {
  /** Vietnamese description of when to use this tense */
  description: string
  /** Realistic everyday examples in English */
  examples: string[]
}

export interface Tense {
  id: TenseId
  group: TenseGroup
  name: string
  nameVi: string
  emoji: string
  formula: {
    affirmative: string
    negative: string
    question: string
  }
  usages: UsageCase[]
  signalWords: string[]
  notes?: string
}

export type QuestionType = 'mcq' | 'fill'

export interface GrammarQuestion {
  id: string
  tenseId: TenseId
  type: QuestionType
  /** Sentence stem. Use ___ where the answer goes. */
  prompt: string
  /** Hint shown in parentheses for fill-in (e.g. "go"). Optional. */
  baseForm?: string
  /** Correct answer (the verb form for fill, or the option text for MCQ) */
  answer: string
  /** For MCQ: 3-4 options including the correct one */
  options?: string[]
  /** Why this answer is correct (helps when user gets it wrong) */
  explanation: string
}

export interface TenseProgress {
  attempts: number
  totalAnswered: number
  totalCorrect: number
  lastScore: number  // 0..1
  wrongIds: string[] // accumulated unique IDs the user got wrong
}

export type GrammarProgressMap = Partial<Record<TenseId, TenseProgress>>

// ===== Tense-coordination (sự phối thì) reference data =====
export interface SequencingPattern {
  /** When this pattern applies, in Vietnamese */
  situation: string
  /** The structural pattern, e.g. "WHEN + S + V(past), S + V(past)" */
  pattern: string
  /** A vivid everyday example */
  example: string
}

export interface SequencingRule {
  conjunction: string
  meaningVi: string
  patterns: SequencingPattern[]
}
