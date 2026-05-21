<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVocabularyStore } from '@/stores/vocabulary'
import type { Vocabulary } from '@/types/vocabulary'
import { itemsInWeek, weekLabel } from '@/utils/week'
import { speak } from '@/utils/speech'

type Skill = 'listening' | 'speaking' | 'reading' | 'writing'

const route = useRoute()
const router = useRouter()
const store = useVocabularyStore()

const week = computed(() => parseInt((route.params.week as string) ?? '1', 10) || 1)
const weekItems = computed(() => itemsInWeek(store.items, week.value))

const SKILLS: { id: Skill; label: string; emoji: string; desc: string }[] = [
  { id: 'listening', label: 'Nghe', emoji: '🎧', desc: 'Nghe từ và gõ lại — luyện chính tả & nghe' },
  { id: 'speaking', label: 'Nói', emoji: '🗣️', desc: 'Nhìn nghĩa, nói thành tiếng, tự đánh giá' },
  { id: 'reading', label: 'Đọc', emoji: '📖', desc: 'Đọc câu, điền từ còn thiếu — luyện hiểu ngữ cảnh' },
  { id: 'writing', label: 'Viết', emoji: '✍️', desc: 'Tự đặt câu với từ, so với câu mẫu' },
]

// How many questions per skill session — the user picks before starting.
const SIZE_OPTIONS = [
  { value: 20, label: 'Nhanh · 20 câu' },
  { value: 40, label: 'Vừa · 40 câu' },
  { value: 80, label: 'Dày · 80 câu' },
  { value: 0, label: 'Tất cả từ trong tuần' },
]
const sessionSize = ref(40)

function effectiveSize(): number {
  return sessionSize.value === 0 ? weekItems.value.length : sessionSize.value
}

// ----- session state -----
const skill = ref<Skill | null>(null)
const cards = ref<Vocabulary[]>([])
const index = ref(0)
const done = ref(0)
const correct = ref(0)
const finished = ref(false)

// per-card state
const userText = ref('')
const selected = ref<string | null>(null)
const revealed = ref(false)
const readingOptions = ref<string[]>([])

const current = computed<Vocabulary | null>(() => cards.value[index.value] ?? null)
const total = computed(() => cards.value.length)
const progressPct = computed(() => (total.value === 0 ? 0 : Math.round((done.value / total.value) * 100)))

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[’]/g, "'")
}

function startSkill(s: Skill) {
  skill.value = s
  cards.value = shuffle(weekItems.value).slice(0, effectiveSize())
  index.value = 0
  done.value = 0
  correct.value = 0
  finished.value = false
  resetCard()
}

function resetCard() {
  userText.value = ''
  selected.value = null
  revealed.value = false
  isAnswered.value = false
  if (skill.value === 'reading' && current.value) {
    buildReadingOptions()
  }
  // Auto-play for listening
  if (skill.value === 'listening' && current.value) {
    setTimeout(() => speak(current.value!.word), 250)
  }
}

function buildReadingOptions() {
  const c = current.value!
  const pool = weekItems.value.filter((w) => w.id !== c.id && w.partOfSpeech === c.partOfSpeech)
  const others = weekItems.value.filter((w) => w.id !== c.id)
  const src = pool.length >= 3 ? pool : others
  const distractors: string[] = []
  for (const w of shuffle(src)) {
    if (!distractors.includes(w.word) && w.word !== c.word) distractors.push(w.word)
    if (distractors.length === 3) break
  }
  readingOptions.value = shuffle([c.word, ...distractors])
}

// blanked example sentence for reading
const readingSentence = computed(() => {
  const c = current.value
  if (!c || c.examples.length === 0) return ''
  const ex = c.examples[0]!
  const re = new RegExp(`\\b${c.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
  return re.test(ex) ? ex.replace(re, '______') : ex
})

const isAnswered = ref(false)

function checkListening() {
  if (!current.value || isAnswered.value) return
  isAnswered.value = true
  const ok = normalize(userText.value) === normalize(current.value.word)
  if (ok) correct.value += 1
}
function checkReading() {
  if (!current.value || isAnswered.value || selected.value === null) return
  isAnswered.value = true
  if (selected.value === current.value.word) correct.value += 1
}

const listeningCorrect = computed(
  () => !!current.value && normalize(userText.value) === normalize(current.value.word),
)

function rateSelf(good: boolean) {
  if (good) correct.value += 1
  next()
}

function next() {
  done.value += 1
  isAnswered.value = false
  if (index.value + 1 >= total.value) {
    finished.value = true
    return
  }
  index.value += 1
  resetCard()
}

function exitSkill() {
  skill.value = null
  finished.value = false
}

watch(week, () => exitSkill())

const accuracy = computed(() =>
  done.value === 0 ? 0 : Math.round((correct.value / done.value) * 100),
)
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 lg:px-8 py-6">
    <!-- ===== MENU ===== -->
    <div v-if="!skill">
      <RouterLink to="/review" class="text-sm text-slate-500 hover:text-indigo-700 mb-3 inline-block">
        ← Về Ôn tập
      </RouterLink>
      <h1 class="text-2xl font-bold mb-1">📅 Ôn tập {{ weekLabel(week) }}</h1>
      <p class="text-sm text-slate-500 mb-5">
        Luyện đủ 4 kỹ năng dựa trên {{ weekItems.length }} từ vựng đã học trong tuần.
      </p>

      <div v-if="weekItems.length === 0" class="rounded-2xl bg-white border border-slate-200 p-10 text-center text-slate-500">
        Tuần này chưa có từ vựng nào.
      </div>

      <div v-else>
        <!-- Session length picker -->
        <div class="rounded-2xl bg-white border border-slate-200 p-4 mb-3">
          <p class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Độ dài mỗi bài</p>
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
            Mỗi bài sẽ có {{ Math.min(effectiveSize(), weekItems.length) }} câu (lấy ngẫu nhiên từ {{ weekItems.length }} từ trong tuần).
          </p>
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <button
            v-for="s in SKILLS"
            :key="s.id"
            class="text-left rounded-2xl bg-white border border-slate-200 p-5 hover:border-indigo-400 hover:shadow-md transition"
            @click="startSkill(s.id)"
          >
            <div class="text-3xl mb-2">{{ s.emoji }}</div>
            <h3 class="font-bold text-slate-900">{{ s.label }}</h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">{{ s.desc }}</p>
            <p class="text-[10px] uppercase tracking-wider text-indigo-500 font-bold mt-2">
              {{ Math.min(effectiveSize(), weekItems.length) }} câu
            </p>
          </button>
        </div>
      </div>
    </div>

    <!-- ===== FINISHED ===== -->
    <div v-else-if="finished" class="rounded-3xl bg-white border border-slate-200 p-10 text-center shadow-sm">
      <div class="text-5xl mb-3">{{ accuracy >= 80 ? '🏆' : accuracy >= 50 ? '👍' : '💪' }}</div>
      <p class="text-xl font-bold text-slate-900">Hoàn thành kỹ năng {{ SKILLS.find((x) => x.id === skill)?.label }}!</p>
      <p v-if="skill === 'listening' || skill === 'reading'" class="text-sm text-slate-500 mt-1">
        Đúng {{ correct }}/{{ done }} ({{ accuracy }}%)
      </p>
      <p v-else class="text-sm text-slate-500 mt-1">
        Tự đánh giá tốt: {{ correct }}/{{ done }}
      </p>
      <div class="flex flex-wrap gap-2 justify-center mt-6">
        <button class="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700" @click="startSkill(skill!)">
          Làm lại
        </button>
        <button class="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200" @click="exitSkill">
          Chọn kỹ năng khác
        </button>
      </div>
    </div>

    <!-- ===== ACTIVE SKILL ===== -->
    <div v-else-if="current">
      <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
        <button class="text-sm text-slate-500 hover:text-rose-600 font-medium" @click="exitSkill">← Thoát</button>
        <div class="text-xs text-slate-600">
          {{ SKILLS.find((x) => x.id === skill)?.emoji }} {{ SKILLS.find((x) => x.id === skill)?.label }}
          · {{ index + 1 }}/{{ total }}
        </div>
      </div>
      <div class="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-5">
        <div class="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all" :style="{ width: progressPct + '%' }"></div>
      </div>

      <div class="rounded-3xl bg-white border border-slate-200 shadow-lg p-6">
        <p class="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-3">
          {{ current.topic }} · {{ current.day }}
        </p>

        <!-- ===== LISTENING ===== -->
        <template v-if="skill === 'listening'">
          <p class="text-sm text-slate-600 mb-3">Nghe và gõ lại từ bạn nghe được:</p>
          <div class="flex gap-2 mb-4">
            <button class="px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700" @click="speak(current.word)">
              🔊 Nghe lại
            </button>
            <button
              v-if="current.examples.length"
              class="px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              @click="speak(current.examples[0] ?? current.word)"
            >
              🔉 Nghe câu ví dụ
            </button>
          </div>
          <input
            v-model="userText"
            type="text"
            :disabled="isAnswered"
            placeholder="Gõ từ bạn nghe..."
            class="w-full px-4 py-3 rounded-xl border-2 focus:outline-none"
            :class="!isAnswered ? 'border-slate-200 focus:border-indigo-400' : listeningCorrect ? 'border-emerald-400 bg-emerald-50' : 'border-rose-400 bg-rose-50'"
            @keydown.enter.prevent="isAnswered ? next() : checkListening()"
          />
          <div v-if="isAnswered" class="mt-4 pt-4 border-t border-slate-100">
            <p class="text-sm" :class="listeningCorrect ? 'text-emerald-700' : 'text-rose-700'">
              {{ listeningCorrect ? '✓ Chính xác!' : '✗ Chưa đúng' }}
            </p>
            <div class="flex items-center gap-2 mt-1 flex-wrap">
              <span class="text-xl font-bold text-slate-900">{{ current.word }}</span>
              <span v-if="current.pronunciation" class="text-sm font-mono text-slate-500">{{ current.pronunciation }}</span>
            </div>
            <p class="text-sm text-slate-700 mt-0.5">{{ current.meaningVi }}</p>
          </div>
          <button
            v-if="!isAnswered"
            class="mt-4 w-full px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50"
            :disabled="!userText.trim()"
            @click="checkListening"
          >
            Kiểm tra
          </button>
          <button v-else class="mt-4 w-full px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700" @click="next">
            {{ index + 1 >= total ? 'Xem kết quả' : 'Tiếp tục →' }}
          </button>
        </template>

        <!-- ===== SPEAKING ===== -->
        <template v-else-if="skill === 'speaking'">
          <p class="text-sm text-slate-600 mb-2">Nói to từ tiếng Anh có nghĩa sau:</p>
          <p class="text-2xl font-bold text-slate-900 mb-1">{{ current.meaningVi }}</p>
          <p v-if="current.meaningEn" class="text-sm text-slate-500 mb-4">{{ current.meaningEn }}</p>

          <div v-if="!revealed">
            <button class="w-full px-5 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800" @click="revealed = true">
              Xem đáp án & nghe mẫu
            </button>
          </div>
          <div v-else>
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <span class="text-2xl font-bold text-slate-900">{{ current.word }}</span>
              <button class="text-indigo-600 text-xl" @click="speak(current.word)">🔊</button>
              <span v-if="current.pronunciation" class="text-sm font-mono text-slate-500">{{ current.pronunciation }}</span>
            </div>
            <ul v-if="current.examples.length" class="space-y-1 mb-4">
              <li v-for="(ex, i) in current.examples" :key="i" class="text-sm italic text-slate-700 flex items-start gap-2">
                <button class="text-indigo-500 shrink-0 mt-0.5" @click="speak(ex)">▶</button>
                <span>{{ ex }}</span>
              </li>
            </ul>
            <p class="text-sm text-slate-600 mb-2">Bạn phát âm thế nào?</p>
            <div class="grid grid-cols-2 gap-2">
              <button class="px-4 py-3 rounded-xl bg-white border-2 border-amber-300 text-amber-700 font-bold hover:bg-amber-50" @click="rateSelf(false)">
                Cần luyện thêm
              </button>
              <button class="px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700" @click="rateSelf(true)">
                Nói được tốt
              </button>
            </div>
          </div>
        </template>

        <!-- ===== READING ===== -->
        <template v-else-if="skill === 'reading'">
          <p class="text-sm text-slate-600 mb-2">Đọc câu và chọn từ còn thiếu:</p>
          <p class="text-lg text-slate-800 italic leading-relaxed mb-4">
            {{ readingSentence || current.meaningVi }}
          </p>
          <div class="grid sm:grid-cols-2 gap-2">
            <button
              v-for="(opt, i) in readingOptions"
              :key="opt"
              class="text-left px-4 py-3 rounded-xl border-2 font-medium transition flex items-center gap-2"
              :class="!isAnswered ? (selected === opt ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400') : opt === current.word ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : opt === selected ? 'border-rose-400 bg-rose-50 text-rose-800' : 'border-slate-200 opacity-60'"
              :disabled="isAnswered"
              @click="selected = opt"
            >
              <span class="text-xs font-bold text-slate-400">{{ String.fromCharCode(65 + i) }}</span>
              <span class="flex-1">{{ opt }}</span>
            </button>
          </div>
          <div v-if="isAnswered" class="mt-4 pt-4 border-t border-slate-100">
            <p class="text-sm font-semibold text-slate-900">{{ current.word }} — {{ current.meaningVi }}</p>
            <p v-if="current.meaningEn" class="text-xs text-slate-600 mt-0.5">{{ current.meaningEn }}</p>
          </div>
          <button
            v-if="!isAnswered"
            class="mt-4 w-full px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50"
            :disabled="selected === null"
            @click="checkReading"
          >
            Kiểm tra
          </button>
          <button v-else class="mt-4 w-full px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700" @click="next">
            {{ index + 1 >= total ? 'Xem kết quả' : 'Tiếp tục →' }}
          </button>
        </template>

        <!-- ===== WRITING ===== -->
        <template v-else-if="skill === 'writing'">
          <p class="text-sm text-slate-600 mb-2">Tự đặt một câu tiếng Anh dùng từ/cụm sau:</p>
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <span class="text-2xl font-bold text-slate-900">{{ current.word }}</span>
            <button class="text-indigo-600 text-xl" @click="speak(current.word)">🔊</button>
          </div>
          <p class="text-sm text-slate-600 mb-1">{{ current.meaningVi }}</p>
          <div v-if="current.collocations.length" class="flex flex-wrap gap-1.5 mb-3">
            <span v-for="(c, i) in current.collocations" :key="i" class="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {{ c }}
            </span>
          </div>
          <textarea
            v-model="userText"
            rows="3"
            placeholder="Viết câu của bạn..."
            class="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:outline-none"
          ></textarea>

          <div v-if="!revealed">
            <button
              class="mt-3 w-full px-5 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 disabled:opacity-50"
              :disabled="!userText.trim()"
              @click="revealed = true"
            >
              Xem câu mẫu
            </button>
          </div>
          <div v-else class="mt-4 pt-4 border-t border-slate-100">
            <p class="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Câu mẫu</p>
            <ul class="space-y-1 mb-3">
              <li v-for="(ex, i) in current.examples" :key="i" class="text-sm italic text-slate-700 flex items-start gap-2">
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
        </template>
      </div>
    </div>
  </div>
</template>
