<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVocabularyStore } from '@/stores/vocabulary'
import type { Vocabulary } from '@/types/vocabulary'
import { speak } from '@/utils/speech'

type ExerciseType = 'meaning' | 'cloze' | 'write'

interface Card {
  type: ExerciseType
  item: Vocabulary
  // For MCQ types
  options?: string[]
  /** Correct answer text (option text for MCQ) */
  answer?: string
  /** Cloze sentence with the target word blanked, if any */
  blanked?: string
}

const route = useRoute()
const router = useRouter()
const store = useVocabularyStore()

const topic = computed(() => (route.query.t as string) ?? '')
const items = computed(() => store.items.filter((it) => it.topic === topic.value))

const SIZE_OPTIONS = [
  { value: 15, label: 'Nhanh · 15 câu' },
  { value: 25, label: 'Vừa · 25 câu' },
  { value: 40, label: 'Dày · 40 câu' },
  { value: 0, label: 'Tất cả từ trong chủ đề' },
]
const sessionSize = ref(25)

function effectiveSize(): number {
  return sessionSize.value === 0 ? items.value.length : sessionSize.value
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function pickDistractors<T>(pool: T[], n: number, exclude: T[]): T[] {
  const out: T[] = []
  for (const x of shuffle(pool)) {
    if (exclude.includes(x)) continue
    if (out.includes(x)) continue
    out.push(x)
    if (out.length === n) break
  }
  return out
}

function buildCloze(item: Vocabulary): { blanked: string; options: string[] } | null {
  if (item.examples.length === 0) return null
  const ex = item.examples[0]!
  const re = new RegExp(`\\b${escapeRegex(item.word)}\\b`, 'i')
  if (!re.test(ex)) return null
  const blanked = ex.replace(re, '______')
  // Distractors: prefer same partOfSpeech
  const pool = items.value.filter((w) => w.id !== item.id)
  const samePos = pool.filter((w) => w.partOfSpeech === item.partOfSpeech).map((w) => w.word)
  const otherWords = pool.map((w) => w.word)
  const source = samePos.length >= 3 ? samePos : otherWords
  const distractors = pickDistractors(source, 3, [item.word])
  return { blanked, options: shuffle([item.word, ...distractors]) }
}

function buildMeaningMatch(item: Vocabulary): { options: string[] } {
  const pool = items.value.filter((w) => w.id !== item.id).map((w) => w.meaningVi)
  const distractors = pickDistractors(pool, 3, [item.meaningVi])
  return { options: shuffle([item.meaningVi, ...distractors]) }
}

function buildCard(item: Vocabulary): Card {
  // Random type — prefer cloze if examples exist, fall back to others
  const r = Math.random()
  if (r < 0.4 && item.examples.length > 0) {
    const cloze = buildCloze(item)
    if (cloze) {
      return {
        type: 'cloze',
        item,
        options: cloze.options,
        answer: item.word,
        blanked: cloze.blanked,
      }
    }
  }
  if (r < 0.75) {
    const mm = buildMeaningMatch(item)
    return { type: 'meaning', item, options: mm.options, answer: item.meaningVi }
  }
  return { type: 'write', item }
}

// ===== session state =====
const cards = ref<Card[]>([])
const index = ref(0)
const sessionActive = ref(false)
const finished = ref(false)
const done = ref(0)
const correct = ref(0)
const userText = ref('')
const selected = ref<string | null>(null)
const submitted = ref(false)
const revealed = ref(false)

const current = computed<Card | null>(() => cards.value[index.value] ?? null)
const total = computed(() => cards.value.length)
const progressPct = computed(() =>
  total.value === 0 ? 0 : Math.round((done.value / total.value) * 100),
)
const accuracy = computed(() => (done.value === 0 ? 0 : Math.round((correct.value / done.value) * 100)))

function start() {
  const n = effectiveSize()
  cards.value = shuffle(items.value)
    .slice(0, n)
    .map(buildCard)
  index.value = 0
  done.value = 0
  correct.value = 0
  sessionActive.value = true
  finished.value = false
  resetCard()
}

function resetCard() {
  userText.value = ''
  selected.value = null
  submitted.value = false
  revealed.value = false
}

function submit() {
  if (!current.value || submitted.value) return
  if ((current.value.type === 'meaning' || current.value.type === 'cloze') && selected.value === null) return
  submitted.value = true
  const ok = selected.value === current.value.answer
  if (ok) correct.value += 1
}

function nextCard() {
  done.value += 1
  if (index.value + 1 >= total.value) {
    finished.value = true
    return
  }
  index.value += 1
  resetCard()
}

function rateSelf(good: boolean) {
  if (good) correct.value += 1
  nextCard()
}

function back() {
  if (sessionActive.value) {
    sessionActive.value = false
    finished.value = false
  } else {
    router.push('/')
  }
}

function classFor(opt: string, ans: string): string {
  if (!submitted.value) {
    return selected.value === opt
      ? 'bg-indigo-50 border-indigo-400 text-indigo-800'
      : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50'
  }
  if (opt === ans) return 'bg-emerald-50 border-emerald-400 text-emerald-800'
  if (opt === selected.value) return 'bg-rose-50 border-rose-400 text-rose-800'
  return 'bg-white border-slate-200 opacity-60'
}

const TYPE_META: Record<ExerciseType, { label: string; emoji: string }> = {
  meaning: { label: 'Nhận diện nghĩa', emoji: '🔍' },
  cloze: { label: 'Điền từ trong câu', emoji: '✏️' },
  write: { label: 'Tự đặt câu', emoji: '✍️' },
}
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 lg:px-8 py-6">
    <!-- ===== MENU ===== -->
    <div v-if="!sessionActive">
      <button class="text-sm text-slate-500 hover:text-indigo-700 mb-3" @click="router.push('/')">
        ← Về danh sách
      </button>
      <h1 class="text-2xl font-bold mb-1">✍️ Luyện chủ đề</h1>
      <p class="text-sm text-slate-700 mb-1">{{ topic }}</p>
      <p class="text-xs text-slate-500 mb-5">
        {{ items.length }} từ · Trộn 3 dạng: nhận diện nghĩa, điền từ trong câu, tự đặt câu.
      </p>

      <div v-if="items.length === 0" class="rounded-2xl bg-white border border-slate-200 p-10 text-center text-slate-500">
        Chủ đề này chưa có từ vựng nào.
      </div>

      <div v-else>
        <div class="rounded-2xl bg-white border border-slate-200 p-4 mb-3">
          <p class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Độ dài bài</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="opt in SIZE_OPTIONS"
              :key="opt.value"
              class="px-3 py-1.5 rounded-lg text-sm font-semibold border transition"
              :class="sessionSize === opt.value
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400'"
              @click="sessionSize = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
          <p class="text-[11px] text-slate-400 mt-2">
            Mỗi bài lấy ngẫu nhiên {{ Math.min(effectiveSize(), items.length) }} từ.
          </p>
        </div>

        <div class="rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white p-5 shadow-lg">
          <p class="text-xs uppercase tracking-widest font-bold opacity-80 mb-1">3 dạng bài tập</p>
          <ul class="text-sm space-y-1 opacity-95 mb-4">
            <li>🔍 Nhận diện nghĩa — chọn nghĩa tiếng Việt đúng</li>
            <li>✏️ Điền từ trong câu — chọn từ phù hợp với ngữ cảnh</li>
            <li>✍️ Tự đặt câu — viết câu của bạn, so với câu mẫu</li>
          </ul>
          <button
            class="w-full px-5 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition"
            @click="start"
          >
            Bắt đầu luyện
          </button>
        </div>
      </div>
    </div>

    <!-- ===== FINISHED ===== -->
    <div v-else-if="finished" class="rounded-3xl bg-white border border-slate-200 p-10 text-center shadow-sm">
      <div class="text-5xl mb-3">{{ accuracy >= 80 ? '🏆' : accuracy >= 50 ? '👍' : '💪' }}</div>
      <p class="text-xl font-bold text-slate-900">Hoàn thành!</p>
      <p class="text-sm text-slate-500 mt-1">
        Đúng/Được {{ correct }}/{{ done }} ({{ accuracy }}%)
      </p>
      <div class="flex flex-wrap gap-2 justify-center mt-6">
        <button class="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700" @click="start">
          Làm lại
        </button>
        <button class="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200" @click="back">
          Quay lại
        </button>
      </div>
    </div>

    <!-- ===== ACTIVE SESSION ===== -->
    <div v-else-if="current">
      <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
        <button class="text-sm text-slate-500 hover:text-rose-600 font-medium" @click="back">← Thoát</button>
        <div class="text-xs text-slate-600">
          {{ index + 1 }}/{{ total }} · Đúng {{ correct }}/{{ done }}
        </div>
      </div>
      <div class="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-5">
        <div class="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all" :style="{ width: progressPct + '%' }"></div>
      </div>

      <div class="rounded-3xl bg-white border border-slate-200 shadow-lg p-6">
        <div class="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-3">
          <span>{{ current.item.day }} · {{ current.item.topic }}</span>
          <span>{{ TYPE_META[current.type].emoji }} {{ TYPE_META[current.type].label }}</span>
        </div>

        <!-- ===== MEANING MATCH ===== -->
        <template v-if="current.type === 'meaning'">
          <div class="flex items-center gap-3 flex-wrap mb-1">
            <h2 class="text-2xl font-bold text-slate-900">{{ current.item.word }}</h2>
            <button class="text-indigo-600 text-2xl" @click="speak(current.item.word)">🔊</button>
            <span v-if="current.item.pronunciation" class="text-sm font-mono text-slate-500">
              {{ current.item.pronunciation }}
            </span>
          </div>
          <p class="text-sm text-slate-500 mb-4">Chọn nghĩa tiếng Việt đúng:</p>
          <div class="grid gap-2.5">
            <button
              v-for="(opt, i) in current.options"
              :key="opt"
              class="text-left px-4 py-3 rounded-xl border-2 font-medium transition flex items-start gap-3"
              :class="classFor(opt, current.answer!)"
              :disabled="submitted"
              @click="selected = opt"
            >
              <span class="text-xs font-bold text-slate-400 mt-0.5">{{ String.fromCharCode(65 + i) }}</span>
              <span class="flex-1">{{ opt }}</span>
              <span v-if="submitted && opt === current.answer" class="text-emerald-600 font-bold">✓</span>
              <span v-else-if="submitted && opt === selected" class="text-rose-600 font-bold">✗</span>
            </button>
          </div>
        </template>

        <!-- ===== CLOZE ===== -->
        <template v-else-if="current.type === 'cloze'">
          <p class="text-sm text-slate-500 mb-2">Điền từ phù hợp vào chỗ trống:</p>
          <p class="text-lg italic text-slate-800 leading-relaxed mb-4">{{ current.blanked }}</p>
          <div class="grid sm:grid-cols-2 gap-2">
            <button
              v-for="(opt, i) in current.options"
              :key="opt"
              class="text-left px-4 py-3 rounded-xl border-2 font-medium transition flex items-center gap-2"
              :class="classFor(opt, current.answer!)"
              :disabled="submitted"
              @click="selected = opt"
            >
              <span class="text-xs font-bold text-slate-400">{{ String.fromCharCode(65 + i) }}</span>
              <span class="flex-1">{{ opt }}</span>
              <span v-if="submitted && opt === current.answer" class="text-emerald-600 font-bold">✓</span>
              <span v-else-if="submitted && opt === selected" class="text-rose-600 font-bold">✗</span>
            </button>
          </div>
        </template>

        <!-- ===== WRITE ===== -->
        <template v-else-if="current.type === 'write'">
          <p class="text-sm text-slate-500 mb-2">Viết một câu tiếng Anh dùng từ này:</p>
          <div class="flex items-center gap-3 flex-wrap mb-1">
            <h2 class="text-2xl font-bold text-slate-900">{{ current.item.word }}</h2>
            <button class="text-indigo-600 text-2xl" @click="speak(current.item.word)">🔊</button>
          </div>
          <p class="text-sm text-slate-700 mb-1">{{ current.item.meaningVi }}</p>
          <div v-if="current.item.collocations.length" class="flex flex-wrap gap-1.5 mb-3">
            <span
              v-for="(c, i) in current.item.collocations"
              :key="i"
              class="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200"
            >
              {{ c }}
            </span>
          </div>
          <textarea
            v-model="userText"
            rows="3"
            placeholder="Viết câu của bạn..."
            :disabled="revealed"
            class="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:outline-none"
          ></textarea>
        </template>

        <!-- ===== FEEDBACK / ACTIONS ===== -->
        <div v-if="(current.type === 'meaning' || current.type === 'cloze') && submitted" class="mt-5 pt-5 border-t border-slate-100">
          <div class="flex items-center gap-2 flex-wrap mb-2">
            <h3 class="text-lg font-bold text-slate-900">{{ current.item.word }}</h3>
            <button class="text-indigo-600 text-lg" @click="speak(current.item.word)">🔊</button>
            <span v-if="current.item.pronunciation" class="text-xs font-mono text-slate-500">
              {{ current.item.pronunciation }}
            </span>
          </div>
          <p class="text-sm text-slate-800">{{ current.item.meaningVi }}</p>
          <p v-if="current.item.meaningEn" class="text-xs text-slate-600 mt-1">
            <span class="font-bold uppercase tracking-wider text-slate-400 mr-1">EN</span>{{ current.item.meaningEn }}
          </p>
          <ul v-if="current.item.examples.length" class="space-y-1 mt-2">
            <li v-for="(ex, i) in current.item.examples" :key="i" class="text-sm italic text-slate-700 flex items-start gap-2">
              <button class="text-indigo-500 shrink-0 mt-0.5" @click="speak(ex)">▶</button>
              <span>{{ ex }}</span>
            </li>
          </ul>
        </div>

        <div v-if="current.type === 'write' && revealed" class="mt-4 pt-4 border-t border-slate-100">
          <p class="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Câu mẫu</p>
          <ul v-if="current.item.examples.length" class="space-y-1 mb-3">
            <li v-for="(ex, i) in current.item.examples" :key="i" class="text-sm italic text-slate-700 flex items-start gap-2">
              <button class="text-indigo-500 shrink-0 mt-0.5" @click="speak(ex)">▶</button>
              <span>{{ ex }}</span>
            </li>
          </ul>
          <p class="text-sm text-slate-600 mb-2">Câu của bạn ổn không?</p>
          <div class="grid grid-cols-2 gap-2">
            <button class="px-4 py-3 rounded-xl bg-white border-2 border-amber-300 text-amber-700 font-bold hover:bg-amber-50" @click="rateSelf(false)">
              Cần sửa thêm
            </button>
            <button class="px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700" @click="rateSelf(true)">
              Câu ổn
            </button>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="mt-5 flex gap-2">
          <!-- meaning/cloze submit/next -->
          <button
            v-if="(current.type === 'meaning' || current.type === 'cloze') && !submitted"
            class="flex-1 px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            :disabled="selected === null"
            @click="submit"
          >
            Kiểm tra
          </button>
          <button
            v-else-if="(current.type === 'meaning' || current.type === 'cloze') && submitted"
            class="flex-1 px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
            @click="nextCard"
          >
            {{ index + 1 >= total ? 'Xem kết quả' : 'Tiếp tục →' }}
          </button>

          <!-- write reveal -->
          <button
            v-else-if="current.type === 'write' && !revealed"
            class="flex-1 px-5 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 disabled:opacity-50 transition"
            :disabled="!userText.trim()"
            @click="revealed = true"
          >
            Xem câu mẫu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
