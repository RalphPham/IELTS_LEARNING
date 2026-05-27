<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVocabularyStore } from '@/stores/vocabulary'
import type { ReviewGrade, Vocabulary } from '@/types/vocabulary'
import { applyGrade } from '@/utils/srs'
import { speak } from '@/utils/speech'
import MasteryStats from '@/components/MasteryStats.vue'
import QuizCard from '@/components/QuizCard.vue'
import { weeksFrom, weekLabel, itemsInWeek } from '@/utils/week'

type Mode = 'flashcard' | 'quiz'
type Scope = 'due' | 'all'

const store = useVocabularyStore()
const route = useRoute()
const router = useRouter()
const selectedDay = ref<string | null>(null)
const scope = ref<Scope>('due')
const mode = ref<Mode>('flashcard')
const sessionActive = ref(false)
const flipped = ref(false)
// Reverse mode: show meaning first, recall the English word
const reverseMode = ref(false)
const sessionCount = ref(0)
const sessionCorrect = ref(0)
const initialQueueSize = ref(0)

// Session queue holds card IDs in current-session order. Wrong answers
// cycle to the back so the user gets retried within the same session,
// independent of the SRS due flag (which would otherwise loop on the
// same card forever after an "again" grade).
const sessionQueue = ref<string[]>([])

const scopedCards = computed(() =>
  store.items.filter((it) => (selectedDay.value === null ? true : it.day === selectedDay.value)),
)

const dueQueue = computed(() =>
  store.dueCards.filter((it) => (selectedDay.value === null ? true : it.day === selectedDay.value)),
)

// The pool used to actually build a session, depending on scope:
//  - 'due': only cards whose nextReviewDate <= now (default SRS behavior)
//  - 'all': every card in the selected scope, regardless of due date
//    (use this for on-demand re-review of a whole day's vocab)
const sessionSourceCount = computed(() =>
  scope.value === 'due' ? dueQueue.value.length : scopedCards.value.length,
)

const weeks = computed(() =>
  weeksFrom(store.items).map((w) => ({
    week: w,
    label: weekLabel(w),
    count: itemsInWeek(store.items, w).length,
  })),
)

const current = computed<Vocabulary | null>(() => {
  if (!sessionActive.value) return null
  const id = sessionQueue.value[0]
  return id ? store.getById(id) : null
})

const progressPct = computed(() => {
  const total = initialQueueSize.value
  if (total === 0) return 0
  return Math.round(((total - sessionQueue.value.length) / total) * 100)
})

watch(current, () => {
  flipped.value = false
})

watch([selectedDay, scope], () => {
  sessionActive.value = false
  sessionCount.value = 0
  sessionCorrect.value = 0
})

function startSession() {
  const source = scope.value === 'due' ? dueQueue.value : scopedCards.value
  const ids = source.map((c) => c.id)
  if (ids.length === 0) return
  sessionQueue.value = [...ids].sort(() => Math.random() - 0.5)
  sessionActive.value = true
  sessionCount.value = 0
  sessionCorrect.value = 0
  initialQueueSize.value = sessionQueue.value.length
  flipped.value = false
}

function endSession() {
  sessionActive.value = false
  sessionQueue.value = []
  flipped.value = false
}

function advance(wasCorrect: boolean) {
  const id = sessionQueue.value.shift()
  if (id && !wasCorrect) {
    // Send wrong card to the back; user will retry it later in this session
    sessionQueue.value.push(id)
  }
  flipped.value = false
}

function formatInterval(days: number): string {
  if (days < 1) return '< 1d'
  if (days < 30) return `${days}d`
  if (days < 365) return `${Math.round(days / 30)}mo`
  return `${Math.round(days / 365)}y`
}

function previewInterval(g: ReviewGrade): string {
  if (!current.value) return ''
  return formatInterval(applyGrade(current.value, g).interval)
}

function grade(g: ReviewGrade) {
  if (!current.value) return
  store.grade(current.value.id, g)
  sessionCount.value += 1
  if (g !== 'again') sessionCorrect.value += 1
  advance(g !== 'again')
}

function onQuizDone(correct: boolean) {
  if (!current.value) return
  store.grade(current.value.id, correct ? 'good' : 'again')
  sessionCount.value += 1
  if (correct) sessionCorrect.value += 1
  advance(correct)
}

function handleKey(e: KeyboardEvent) {
  if (!sessionActive.value || !current.value) return
  if (mode.value !== 'flashcard') return
  if (!flipped.value) {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault()
      flipped.value = true
    }
    return
  }
  if (e.key === '1') grade('again')
  else if (e.key === '2') grade('hard')
  else if (e.key === '3' || e.code === 'Space') {
    e.preventDefault()
    grade('good')
  } else if (e.key === '4') grade('easy')
}

onMounted(() => {
  window.addEventListener('keydown', handleKey)

  // Read deep-link query params: /review?day=Day+4&scope=all&start=1
  const qDay = route.query.day
  if (typeof qDay === 'string' && store.days.includes(qDay)) {
    selectedDay.value = qDay
  }
  const qScope = route.query.scope
  if (qScope === 'all' || qScope === 'due') {
    scope.value = qScope
  }
  if (route.query.start === '1') {
    // Auto-start the session if the link asked for it
    setTimeout(() => startSession(), 0)
  }
})

onBeforeUnmount(() => window.removeEventListener('keydown', handleKey))

function quickStart(day: string, s: Scope = 'all') {
  selectedDay.value = day
  scope.value = s
  router.replace({ query: { day, scope: s } })
  startSession()
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 lg:px-8 py-6">
    <!-- ============ LANDING / DASHBOARD ============ -->
    <div v-if="!sessionActive">
      <h1 class="text-2xl font-bold mb-1">Ôn tập</h1>
      <p class="text-sm text-slate-500 mb-5">Spaced repetition — học ít, nhớ lâu.</p>

      <div class="flex items-center gap-2 mb-4 flex-wrap">
        <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Phạm vi:</label>
        <select
          v-model="selectedDay"
          class="text-sm px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:border-indigo-500 focus:outline-none font-medium"
        >
          <option :value="null">Tất cả buổi ({{ store.items.length }})</option>
          <option v-for="d in store.days" :key="d" :value="d">
            {{ d }} ({{ store.items.filter((it) => it.day === d).length }})
          </option>
        </select>
      </div>

      <section class="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 mb-4">
        <h2 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Mức độ thành thạo</h2>
        <MasteryStats :cards="scopedCards" />
      </section>

      <section class="rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg p-5 mb-4">
        <p class="text-xs uppercase tracking-widest font-bold opacity-80">Sẵn sàng ôn</p>
        <div class="flex items-end gap-2 mt-1">
          <span class="text-5xl font-black">{{ sessionSourceCount }}</span>
          <span class="text-sm opacity-90 pb-2">
            {{ scope === 'due' ? 'thẻ đến hạn' : 'thẻ trong phạm vi' }}
          </span>
        </div>

        <div class="mt-4">
          <p class="text-[10px] uppercase tracking-widest font-bold opacity-80 mb-2">Phạm vi thẻ</p>
          <div class="flex rounded-xl bg-white/10 p-1 backdrop-blur">
            <button
              class="flex-1 px-3 py-2 rounded-lg text-sm font-bold transition"
              :class="scope === 'due' ? 'bg-white text-indigo-700 shadow' : 'text-white hover:bg-white/10'"
              @click="scope = 'due'"
            >
              ⏰ Đến hạn
            </button>
            <button
              class="flex-1 px-3 py-2 rounded-lg text-sm font-bold transition"
              :class="scope === 'all' ? 'bg-white text-indigo-700 shadow' : 'text-white hover:bg-white/10'"
              @click="scope = 'all'"
            >
              📚 Tất cả thẻ
            </button>
          </div>
          <p class="text-[11px] opacity-80 mt-1.5">
            <span v-if="scope === 'due'">Chỉ ôn thẻ đến lịch lặp lại.</span>
            <span v-else>Ôn lại tất cả thẻ trong phạm vi (không quan tâm hạn).</span>
          </p>
        </div>

        <div class="mt-4">
          <p class="text-[10px] uppercase tracking-widest font-bold opacity-80 mb-2">Chế độ ôn</p>
          <div class="flex rounded-xl bg-white/10 p-1 backdrop-blur">
            <button
              class="flex-1 px-3 py-2 rounded-lg text-sm font-bold transition"
              :class="mode === 'flashcard' ? 'bg-white text-indigo-700 shadow' : 'text-white hover:bg-white/10'"
              @click="mode = 'flashcard'"
            >
              🎴 Lật thẻ
            </button>
            <button
              class="flex-1 px-3 py-2 rounded-lg text-sm font-bold transition"
              :class="mode === 'quiz' ? 'bg-white text-indigo-700 shadow' : 'text-white hover:bg-white/10'"
              @click="mode = 'quiz'"
            >
              📝 Trắc nghiệm
            </button>
          </div>

          <label
            v-if="mode === 'flashcard'"
            class="mt-2 flex items-center gap-2 cursor-pointer text-sm"
          >
            <input v-model="reverseMode" type="checkbox" class="rounded" />
            <span class="opacity-90">🔁 Chiều ngược (Việt → Anh) — khó hơn, củng cố chủ động</span>
          </label>
        </div>

        <button
          class="mt-5 w-full px-5 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="sessionSourceCount === 0"
          @click="startSession"
        >
          {{ sessionSourceCount === 0 ? 'Không có thẻ' : `Bắt đầu ôn ${sessionSourceCount} thẻ` }}
        </button>
      </section>

      <!-- Quick-start review by Day -->
      <section class="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 mb-4">
        <h2 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Ôn nhanh theo buổi</h2>
        <p class="text-xs text-slate-500 mb-3">Chọn 1 buổi để ôn lại toàn bộ từ trong buổi đó (không cần đến hạn).</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            v-for="d in store.days"
            :key="d"
            class="px-3 py-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-left transition"
            @click="quickStart(d, 'all')"
          >
            <div class="text-sm font-bold text-slate-900">{{ d }}</div>
            <div class="text-[10px] text-slate-500 mt-0.5">
              {{ store.items.filter((it) => it.day === d).length }} thẻ — ôn tất cả
            </div>
          </button>
        </div>
      </section>

      <!-- Weekly review — 4 skills -->
      <section v-if="weeks.length" class="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-sm p-5 mb-4">
        <h2 class="text-xs font-bold uppercase tracking-widest text-amber-700 mb-1">
          📅 Ôn tập cuối tuần — đủ 4 kỹ năng
        </h2>
        <p class="text-xs text-slate-600 mb-3">
          Nghe · Nói · Đọc · Viết — luyện lại toàn bộ từ vựng đã học trong tuần.
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <RouterLink
            v-for="w in weeks"
            :key="w.week"
            :to="`/week/${w.week}`"
            class="px-3 py-2.5 rounded-xl bg-white border border-amber-200 hover:border-amber-400 hover:shadow-sm text-left transition"
          >
            <div class="text-sm font-bold text-slate-900">{{ w.label }}</div>
            <div class="text-[10px] text-slate-500 mt-0.5">{{ w.count }} từ · 4 kỹ năng</div>
          </RouterLink>
        </div>
      </section>

      <RouterLink to="/" class="block text-center text-sm text-slate-500 hover:text-indigo-700">
        ← Về danh sách từ vựng
      </RouterLink>
    </div>

    <!-- ============ ACTIVE SESSION ============ -->
    <div v-else>
      <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
        <button class="text-sm text-slate-500 hover:text-rose-600 font-medium" @click="endSession">
          ← Kết thúc
        </button>
        <div class="text-sm text-slate-600">
          Còn: <span class="font-bold text-indigo-700">{{ sessionQueue.length }}</span>
          · Đúng: <span class="font-bold text-emerald-700">{{ sessionCorrect }}/{{ sessionCount }}</span>
        </div>
      </div>

      <div class="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-6">
        <div
          class="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
          :style="{ width: progressPct + '%' }"
        ></div>
      </div>

      <div v-if="!current" class="rounded-3xl bg-white border border-slate-200 p-12 text-center shadow-sm">
        <div class="text-6xl mb-4">🎉</div>
        <p class="text-xl font-bold text-slate-800">Hoàn thành phiên ôn!</p>
        <p class="text-sm text-slate-500 mt-2">
          {{ sessionCorrect }}/{{ sessionCount }} câu đúng
          <span v-if="sessionCount > 0">({{ Math.round((sessionCorrect / sessionCount) * 100) }}%)</span>
        </p>
        <button class="mt-6 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700" @click="endSession">
          Quay lại
        </button>
      </div>

      <QuizCard
        v-else-if="mode === 'quiz'"
        :key="current.id + '-' + sessionCount"
        :card="current"
        :pool="scopedCards"
        @done="onQuizDone"
      />

      <div v-else class="space-y-4">
        <div
          class="rounded-3xl bg-white border border-slate-200 shadow-lg overflow-hidden min-h-[440px] flex flex-col cursor-pointer"
          @click="flipped = !flipped"
        >
          <div class="flex items-center justify-between px-6 pt-5 text-[10px] uppercase font-bold tracking-widest text-slate-400">
            <span>{{ current.topic }}</span>
            <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 normal-case tracking-normal">
              {{ current.day }}
            </span>
          </div>

          <div v-if="!flipped" class="flex-1 flex flex-col items-center justify-center text-center px-6 py-10">
            <!-- Normal: show English word; Reverse: show Vietnamese meaning -->
            <template v-if="!reverseMode">
              <div class="flex items-center justify-center gap-3 flex-wrap">
                <h2 class="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">{{ current.word }}</h2>
                <button class="text-indigo-600 text-3xl hover:scale-110 transition" @click.stop="speak(current.word)">🔊</button>
              </div>
              <p v-if="current.pronunciation" class="text-slate-500 font-mono mt-3 text-lg">{{ current.pronunciation }}</p>
              <span class="mt-3 text-xs uppercase tracking-widest text-indigo-700 font-bold">
                {{ current.partOfSpeech }}
              </span>
              <p class="mt-10 text-xs text-slate-400">Bấm thẻ hoặc Space để xem nghĩa</p>
            </template>
            <template v-else>
              <span class="text-[10px] uppercase tracking-widest font-bold text-rose-600 mb-3">🔁 Chiều ngược</span>
              <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">{{ current.meaningVi }}</h2>
              <p v-if="current.meaningEn" class="text-sm text-slate-500 mt-3 max-w-md">
                {{ current.meaningEn }}
              </p>
              <span class="mt-3 text-xs uppercase tracking-widest text-indigo-700 font-bold">
                {{ current.partOfSpeech }}
              </span>
              <p class="mt-10 text-xs text-slate-400">Nhớ từ tiếng Anh? Bấm thẻ hoặc Space để kiểm tra</p>
            </template>
          </div>

          <div v-else class="flex-1 px-6 py-6 space-y-4">
            <div class="text-center pb-3 border-b border-slate-100">
              <div class="flex items-center justify-center gap-2 flex-wrap">
                <h2 class="text-3xl font-bold text-slate-900">{{ current.word }}</h2>
                <button class="text-indigo-600 text-2xl hover:scale-110 transition" @click.stop="speak(current.word)">🔊</button>
              </div>
              <p v-if="current.pronunciation" class="text-slate-500 font-mono mt-1">{{ current.pronunciation }}</p>
              <span class="text-[11px] uppercase tracking-widest text-indigo-700 font-bold">{{ current.partOfSpeech }}</span>
            </div>

            <div>
              <p class="text-lg font-semibold text-slate-900">{{ current.meaningVi }}</p>
              <p v-if="current.meaningEn" class="text-sm text-slate-600 mt-1.5 leading-relaxed">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">EN</span>
                {{ current.meaningEn }}
              </p>
            </div>

            <div v-if="current.examples.length">
              <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Ví dụ</p>
              <ul class="space-y-1.5">
                <li v-for="(ex, i) in current.examples" :key="i" class="text-sm italic text-slate-700 flex items-start gap-2">
                  <button class="text-indigo-500 shrink-0 mt-0.5" @click.stop="speak(ex)">▶</button>
                  <span>{{ ex }}</span>
                </li>
              </ul>
            </div>

            <div v-if="current.collocations.length">
              <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Cụm hay đi kèm</p>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="(c, i) in current.collocations" :key="i" class="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {{ c }}
                </span>
              </div>
            </div>

            <p v-if="current.notes" class="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              💡 {{ current.notes }}
            </p>
          </div>
        </div>

        <div v-if="flipped" class="grid grid-cols-4 gap-2">
          <button class="rounded-2xl bg-white border-2 border-rose-200 hover:border-rose-400 hover:bg-rose-50 py-4 text-rose-700 font-bold transition flex flex-col items-center" @click="grade('again')">
            <span>Quên</span>
            <span class="text-[10px] opacity-70 mt-0.5">{{ previewInterval('again') }}</span>
          </button>
          <button class="rounded-2xl bg-white border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 py-4 text-amber-700 font-bold transition flex flex-col items-center" @click="grade('hard')">
            <span>Khó</span>
            <span class="text-[10px] opacity-70 mt-0.5">{{ previewInterval('hard') }}</span>
          </button>
          <button class="rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-4 text-white font-bold transition flex flex-col items-center shadow-md" @click="grade('good')">
            <span>Tốt</span>
            <span class="text-[10px] opacity-90 mt-0.5">{{ previewInterval('good') }}</span>
          </button>
          <button class="rounded-2xl bg-white border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50 py-4 text-sky-700 font-bold transition flex flex-col items-center" @click="grade('easy')">
            <span>Dễ</span>
            <span class="text-[10px] opacity-70 mt-0.5">{{ previewInterval('easy') }}</span>
          </button>
        </div>
        <p v-else class="text-center text-xs text-slate-400 pt-2">
          Phím tắt: <kbd class="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono">Space</kbd>
        </p>
      </div>
    </div>
  </div>
</template>
