<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findTense } from '@/data/grammar/tenses'
import { QUESTIONS, questionsForTense } from '@/data/grammar/questions'
import { useGrammarStore } from '@/stores/grammar'
import type { GrammarQuestion, TenseId } from '@/types/grammar'

function combinedFor(tenseId: string, userQs: GrammarQuestion[]): GrammarQuestion[] {
  return [...questionsForTense(tenseId), ...userQs.filter((q) => q.tenseId === tenseId)]
}

const route = useRoute()
const router = useRouter()
const store = useGrammarStore()

// /grammar/mixed has no :id param. Detect it via the route name.
const isMixed = computed(() => route.name === 'grammar-mixed')
const tenseIdParam = computed(() => (route.params.id as string) ?? '')
const tense = computed(() => (isMixed.value ? null : findTense(tenseIdParam.value) ?? null))
const onlyWrong = computed(() => route.query.wrong === '1')

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function buildPool(): GrammarQuestion[] {
  if (isMixed.value) {
    const all = [...QUESTIONS, ...store.userQuestions]
    return shuffle(all).slice(0, 25) // mixed test = 25 random
  }
  if (!tense.value) return []
  const all = combinedFor(tense.value.id, store.userQuestions)
  if (onlyWrong.value) {
    const progress = store.getForTense(tense.value.id)
    if (progress && progress.wrongIds.length > 0) {
      const set = new Set(progress.wrongIds)
      return shuffle(all.filter((q) => set.has(q.id)))
    }
  }
  return shuffle(all)
}

const pool = ref<GrammarQuestion[]>(buildPool())
const index = ref(0)
const userAnswer = ref('')
const selected = ref<string | null>(null)
const submitted = ref(false)
const answeredIds = ref<string[]>([])
const wrongIds = ref<string[]>([])
const completed = ref(false)

const current = computed<GrammarQuestion | null>(() => pool.value[index.value] ?? null)
const total = computed(() => pool.value.length)
const progressPct = computed(() =>
  total.value === 0 ? 0 : Math.round((answeredIds.value.length / total.value) * 100),
)

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[’]/g, "'")
}

const isCorrect = computed(() => {
  if (!current.value || !submitted.value) return false
  const ans = current.value.answer
  if (current.value.type === 'mcq') return selected.value === ans
  return normalize(userAnswer.value) === normalize(ans)
})

function submit() {
  if (!current.value || submitted.value) return
  if (current.value.type === 'mcq' && selected.value === null) return
  if (current.value.type === 'fill' && userAnswer.value.trim() === '') return
  submitted.value = true
  answeredIds.value.push(current.value.id)
  if (!isCorrect.value) wrongIds.value.push(current.value.id)
}

function next() {
  if (!submitted.value) return
  if (index.value + 1 >= total.value) {
    finishSession()
    return
  }
  index.value += 1
  userAnswer.value = ''
  selected.value = null
  submitted.value = false
}

function finishSession() {
  // Record stats for single-tense sessions (mixed does not write to a single tense)
  if (!isMixed.value && tense.value) {
    store.recordSession(tense.value.id as TenseId, answeredIds.value, wrongIds.value)
  }
  completed.value = true
}

function restart() {
  pool.value = buildPool()
  index.value = 0
  userAnswer.value = ''
  selected.value = null
  submitted.value = false
  answeredIds.value = []
  wrongIds.value = []
  completed.value = false
}

function back() {
  if (isMixed.value) router.push('/grammar')
  else router.push(`/grammar/${tense.value?.id ?? ''}`)
}

function handleKey(e: KeyboardEvent) {
  if (completed.value || !current.value) return
  if (!submitted.value) {
    if (current.value.type === 'mcq') {
      const idx = ['1', '2', '3', '4', 'a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].indexOf(e.key)
      if (idx >= 0 && current.value.options) {
        const optIdx = idx % 4
        const opt = current.value.options[optIdx]
        if (opt) {
          selected.value = opt
          submit()
        }
      }
    }
    if (e.code === 'Enter' && current.value.type === 'fill') {
      e.preventDefault()
      submit()
    }
    return
  }
  if (e.code === 'Space' || e.code === 'Enter') {
    e.preventDefault()
    next()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKey)
})

const accuracy = computed(() => {
  if (answeredIds.value.length === 0) return 0
  return Math.round(((answeredIds.value.length - wrongIds.value.length) / answeredIds.value.length) * 100)
})
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 lg:px-8 py-6">
    <!-- Empty pool (no questions for "only wrong" set, etc.) -->
    <div v-if="total === 0" class="rounded-3xl bg-white border border-slate-200 p-12 text-center shadow-sm">
      <div class="text-5xl mb-3">🎉</div>
      <p class="text-lg font-semibold text-slate-800">Không có câu nào để luyện.</p>
      <button class="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold" @click="back">
        Quay lại
      </button>
    </div>

    <!-- Completed -->
    <div v-else-if="completed" class="rounded-3xl bg-white border border-slate-200 p-10 text-center shadow-sm">
      <div class="text-5xl mb-3">{{ accuracy >= 80 ? '🏆' : accuracy >= 50 ? '👍' : '💪' }}</div>
      <p class="text-2xl font-bold text-slate-900">{{ accuracy }}% chính xác</p>
      <p class="text-sm text-slate-500 mt-1">
        Đúng {{ answeredIds.length - wrongIds.length }} / {{ answeredIds.length }} câu
      </p>
      <div class="flex flex-wrap gap-2 justify-center mt-6">
        <button class="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700" @click="restart">
          Làm lại
        </button>
        <button class="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200" @click="back">
          Quay lại
        </button>
      </div>
    </div>

    <!-- Active session -->
    <div v-else-if="current">
      <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
        <button class="text-sm text-slate-500 hover:text-rose-600 font-medium" @click="back">← Thoát</button>
        <div class="text-xs text-slate-600">
          Câu {{ index + 1 }} / {{ total }}
          <span v-if="answeredIds.length > 0">
            · Đúng {{ answeredIds.length - wrongIds.length }} / {{ answeredIds.length }}
          </span>
        </div>
      </div>

      <div class="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-5">
        <div
          class="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
          :style="{ width: progressPct + '%' }"
        ></div>
      </div>

      <div class="rounded-3xl bg-white border border-slate-200 shadow-lg p-6">
        <div class="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-3">
          <span>{{ findTense(current.tenseId)?.nameVi ?? 'Mixed' }}</span>
          <span>{{ current.type === 'mcq' ? 'Trắc nghiệm' : 'Điền vào chỗ trống' }}</span>
        </div>

        <p class="text-lg sm:text-xl text-slate-800 leading-relaxed mb-1">{{ current.prompt }}</p>
        <p v-if="current.baseForm" class="text-xs text-slate-500 italic mb-4">
          Dạng cơ sở: <span class="font-mono">{{ current.baseForm }}</span>
        </p>
        <div v-else class="mb-4"></div>

        <!-- MCQ -->
        <div v-if="current.type === 'mcq' && current.options" class="grid gap-2.5">
          <button
            v-for="(opt, i) in current.options"
            :key="opt"
            class="text-left px-4 py-3 rounded-xl border-2 font-medium transition flex items-start gap-3"
            :class="
              !submitted
                ? selected === opt
                  ? 'bg-indigo-50 border-indigo-400 text-indigo-800'
                  : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50'
                : opt === current.answer
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                  : opt === selected
                    ? 'bg-rose-50 border-rose-400 text-rose-800'
                    : 'bg-white border-slate-200 opacity-60'
            "
            :disabled="submitted"
            @click="selected = opt"
          >
            <span class="text-xs font-bold text-slate-400 mt-0.5">{{ String.fromCharCode(65 + i) }}</span>
            <span class="flex-1">{{ opt }}</span>
            <span v-if="submitted && opt === current.answer" class="text-emerald-600 font-bold">✓</span>
            <span v-else-if="submitted && opt === selected" class="text-rose-600 font-bold">✗</span>
          </button>
        </div>

        <!-- Fill -->
        <div v-else>
          <input
            v-model="userAnswer"
            type="text"
            :disabled="submitted"
            placeholder="Gõ đáp án..."
            class="w-full px-4 py-3 rounded-xl border-2 focus:outline-none font-mono"
            :class="
              !submitted
                ? 'border-slate-200 focus:border-indigo-400'
                : isCorrect
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                  : 'border-rose-400 bg-rose-50 text-rose-800'
            "
            @keydown.enter.prevent="submitted ? next() : submit()"
          />
        </div>

        <!-- Feedback -->
        <div v-if="submitted" class="mt-5 pt-5 border-t border-slate-100">
          <div class="flex items-center gap-2 flex-wrap mb-2">
            <span
              class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
              :class="isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'"
            >
              {{ isCorrect ? '✓ Đúng' : '✗ Sai' }}
            </span>
            <span v-if="!isCorrect" class="text-sm text-slate-600">
              Đáp án: <span class="font-bold text-emerald-700 font-mono">{{ current.answer }}</span>
            </span>
          </div>
          <p class="text-sm text-slate-700 leading-relaxed">
            <span class="font-bold text-slate-900">Giải thích:</span> {{ current.explanation }}
          </p>
        </div>

        <!-- Action buttons -->
        <div class="mt-5 flex gap-2">
          <button
            v-if="!submitted"
            class="flex-1 px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            :disabled="(current.type === 'mcq' && selected === null) || (current.type === 'fill' && !userAnswer.trim())"
            @click="submit"
          >
            Kiểm tra
          </button>
          <button
            v-else
            class="flex-1 px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
            @click="next"
          >
            {{ index + 1 >= total ? 'Xem kết quả' : 'Tiếp tục →' }}
          </button>
        </div>
        <p class="text-center text-[11px] text-slate-400 mt-2">
          Phím tắt:
          <kbd class="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono">1-4</kbd>
          chọn,
          <kbd class="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono">Enter</kbd>
          /
          <kbd class="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono">Space</kbd>
          tiếp
        </p>
      </div>
    </div>
  </div>
</template>
