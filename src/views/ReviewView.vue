<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useVocabularyStore } from '@/stores/vocabulary'
import type { ReviewGrade, Vocabulary } from '@/types/vocabulary'
import { applyGrade } from '@/utils/srs'
import { speak } from '@/utils/speech'
import MasteryStats from '@/components/MasteryStats.vue'
import QuizCard from '@/components/QuizCard.vue'

type Mode = 'flashcard' | 'quiz'

const store = useVocabularyStore()
const selectedDay = ref<string | null>(null)
const mode = ref<Mode>('flashcard')
const sessionActive = ref(false)
const flipped = ref(false)
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

watch(selectedDay, () => {
  sessionActive.value = false
  sessionCount.value = 0
  sessionCorrect.value = 0
})

function startSession() {
  const ids = dueQueue.value.map((c) => c.id)
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

onMounted(() => window.addEventListener('keydown', handleKey))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKey))
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
          <span class="text-5xl font-black">{{ dueQueue.length }}</span>
          <span class="text-sm opacity-90 pb-2">thẻ đến hạn</span>
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
          <p class="text-xs opacity-80 mt-2">
            <span v-if="mode === 'flashcard'">Tự đánh giá độ nhớ: Quên / Khó / Tốt / Dễ.</span>
            <span v-else>4 đáp án — kiểm tra nghĩa, từ vựng và điền chỗ trống.</span>
          </p>
        </div>

        <button
          class="mt-5 w-full px-5 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="dueQueue.length === 0"
          @click="startSession"
        >
          {{ dueQueue.length === 0 ? 'Không có thẻ đến hạn' : `Bắt đầu ôn ${dueQueue.length} thẻ` }}
        </button>
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
            <div class="flex items-center justify-center gap-3 flex-wrap">
              <h2 class="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">{{ current.word }}</h2>
              <button class="text-indigo-600 text-3xl hover:scale-110 transition" @click.stop="speak(current.word)">🔊</button>
            </div>
            <p v-if="current.pronunciation" class="text-slate-500 font-mono mt-3 text-lg">{{ current.pronunciation }}</p>
            <span class="mt-3 text-xs uppercase tracking-widest text-indigo-700 font-bold">
              {{ current.partOfSpeech }}
            </span>
            <p class="mt-10 text-xs text-slate-400">Bấm thẻ hoặc Space để xem nghĩa</p>
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
