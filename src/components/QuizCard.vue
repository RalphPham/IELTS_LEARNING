<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Vocabulary } from '@/types/vocabulary'
import { speak } from '@/utils/speech'

type QuestionType = 'wordToVi' | 'viToWord' | 'fillBlank'

const props = defineProps<{
  card: Vocabulary
  pool: Vocabulary[]
}>()

const emit = defineEmits<{ (e: 'done', correct: boolean): void }>()

function pickType(card: Vocabulary): QuestionType {
  const opts: QuestionType[] = ['wordToVi', 'viToWord']
  if (card.examples.length > 0) opts.push('fillBlank')
  return opts[Math.floor(Math.random() * opts.length)]!
}

function distractors(card: Vocabulary, key: 'word' | 'meaningVi', n: number): string[] {
  const samePos = props.pool.filter(
    (c) => c.id !== card.id && c.partOfSpeech === card.partOfSpeech,
  )
  const others = props.pool.filter((c) => c.id !== card.id)
  const source = samePos.length >= n ? samePos : others
  const shuffled = [...source].sort(() => Math.random() - 0.5)
  const picked: string[] = []
  for (const c of shuffled) {
    const val = c[key]
    if (val && !picked.includes(val) && val !== card[key]) picked.push(val)
    if (picked.length === n) break
  }
  return picked
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

const qType = ref<QuestionType>(pickType(props.card))
const selected = ref<string | null>(null)
const correctAnswer = ref('')
const options = ref<string[]>([])
const stem = ref('')
const blankSentence = ref('')

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildQuestion() {
  qType.value = pickType(props.card)
  selected.value = null
  const c = props.card

  if (qType.value === 'wordToVi') {
    stem.value = c.word
    correctAnswer.value = c.meaningVi
    options.value = shuffle([c.meaningVi, ...distractors(c, 'meaningVi', 3)])
  } else if (qType.value === 'viToWord') {
    stem.value = c.meaningVi
    correctAnswer.value = c.word
    options.value = shuffle([c.word, ...distractors(c, 'word', 3)])
  } else {
    const ex = c.examples[Math.floor(Math.random() * c.examples.length)]!
    const re = new RegExp(`\\b${escapeRegex(c.word)}\\b`, 'i')
    const blanked = re.test(ex) ? ex.replace(re, '_____') : ex.replace(/\w+/, '_____')
    blankSentence.value = blanked
    stem.value = ''
    correctAnswer.value = c.word
    options.value = shuffle([c.word, ...distractors(c, 'word', 3)])
  }
}

watch(() => props.card.id, buildQuestion, { immediate: true })

const isAnswered = computed(() => selected.value !== null)

function pick(opt: string) {
  if (isAnswered.value) return
  selected.value = opt
}

function next() {
  if (!isAnswered.value) return
  emit('done', selected.value === correctAnswer.value)
}

function handleKey(e: KeyboardEvent) {
  if (!isAnswered.value) {
    const idx = ['1', '2', '3', '4', 'a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].indexOf(e.key)
    if (idx >= 0) {
      const optIdx = idx % 4
      const opt = options.value[optIdx]
      if (opt) pick(opt)
    }
    return
  }
  if (e.code === 'Space' || e.code === 'Enter') {
    e.preventDefault()
    next()
  }
}

onMounted(() => window.addEventListener('keydown', handleKey))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKey))

function classFor(opt: string): string {
  if (!isAnswered.value) {
    return 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50'
  }
  if (opt === correctAnswer.value) return 'bg-emerald-50 border-emerald-400 text-emerald-800'
  if (opt === selected.value) return 'bg-rose-50 border-rose-400 text-rose-800'
  return 'bg-white border-slate-200 opacity-60'
}
</script>

<template>
  <div class="rounded-3xl bg-white border border-slate-200 shadow-lg overflow-hidden">
    <div class="flex items-center justify-between px-6 pt-5 text-[10px] uppercase font-bold tracking-widest text-slate-400">
      <span>{{ card.topic }}</span>
      <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 normal-case tracking-normal">
        {{ card.day }}
      </span>
    </div>

    <div class="px-6 py-6">
      <!-- Question stem -->
      <div class="mb-5">
        <p class="text-[10px] uppercase tracking-widest text-indigo-600 font-bold mb-2">
          {{ qType === 'wordToVi' ? 'Nghĩa tiếng Việt của từ này?' : qType === 'viToWord' ? 'Từ tiếng Anh tương ứng?' : 'Điền từ còn thiếu' }}
        </p>
        <div v-if="qType === 'fillBlank'" class="text-lg sm:text-xl text-slate-800 italic leading-relaxed">
          {{ blankSentence }}
        </div>
        <div v-else class="flex items-center gap-3 flex-wrap">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900">{{ stem }}</h2>
          <button
            v-if="qType === 'wordToVi'"
            class="text-indigo-600 text-2xl hover:scale-110 transition"
            @click="speak(stem)"
          >
            🔊
          </button>
        </div>
      </div>

      <!-- Options -->
      <div class="grid sm:grid-cols-2 gap-2.5">
        <button
          v-for="(opt, i) in options"
          :key="opt"
          class="text-left px-4 py-3 rounded-xl border-2 font-medium transition flex items-start gap-3"
          :class="classFor(opt)"
          :disabled="isAnswered"
          @click="pick(opt)"
        >
          <span class="text-xs font-bold text-slate-400 mt-0.5">{{ String.fromCharCode(65 + i) }}</span>
          <span class="flex-1">{{ opt }}</span>
          <span v-if="isAnswered && opt === correctAnswer" class="text-emerald-600 font-bold">✓</span>
          <span v-else-if="isAnswered && opt === selected" class="text-rose-600 font-bold">✗</span>
        </button>
      </div>

      <!-- Feedback panel -->
      <div v-if="isAnswered" class="mt-5 pt-5 border-t border-slate-100 space-y-2">
        <div class="flex items-center gap-2 flex-wrap">
          <span
            class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            :class="selected === correctAnswer ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'"
          >
            {{ selected === correctAnswer ? '✓ Đúng' : '✗ Sai — sẽ hỏi lại sau' }}
          </span>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <h3 class="text-xl font-bold text-slate-900">{{ card.word }}</h3>
          <button class="text-indigo-600 text-xl hover:scale-110 transition" @click="speak(card.word)">🔊</button>
          <span v-if="card.pronunciation" class="text-sm text-slate-500 font-mono">{{ card.pronunciation }}</span>
        </div>
        <p class="text-slate-800 font-semibold">{{ card.meaningVi }}</p>
        <p v-if="card.meaningEn" class="text-sm text-slate-600">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">EN</span>
          {{ card.meaningEn }}
        </p>
        <ul v-if="card.examples.length" class="space-y-1 pt-1">
          <li v-for="(ex, i) in card.examples" :key="i" class="text-sm italic text-slate-700 flex items-start gap-2">
            <button class="text-indigo-500 shrink-0 mt-0.5" @click="speak(ex)">▶</button>
            <span>{{ ex }}</span>
          </li>
        </ul>
        <div v-if="card.collocations.length" class="flex flex-wrap gap-1.5 pt-1">
          <span v-for="(c, i) in card.collocations" :key="i" class="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {{ c }}
          </span>
        </div>

        <button
          class="mt-4 w-full px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
          @click="next"
        >
          Tiếp tục →
        </button>
        <p class="text-center text-[11px] text-slate-400">
          Phím tắt: <kbd class="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono">Space</kbd> / <kbd class="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono">Enter</kbd>
        </p>
      </div>
    </div>
  </div>
</template>
