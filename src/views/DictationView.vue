<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { wordDiff, diffAccuracy, splitSentences, type DiffToken } from '@/utils/diff'
import { speak } from '@/utils/speech'
import { useSkillsStore } from '@/stores/skills'
import { useVocabularyStore } from '@/stores/vocabulary'
import WordPopover from '@/components/WordPopover.vue'

const router = useRouter()
const skills = useSkillsStore()
const vocab = useVocabularyStore()

const rawTranscript = ref('')
const sentences = ref<string[]>([])

// Clean a pasted YouTube transcript: strip timestamps (0:08, 1:07:09),
// drop lines that are only a timestamp, and collapse into clean prose.
function cleanTranscript(raw: string): string {
  return raw
    .split('\n')
    .map((line) => line.replace(/\b\d{1,2}:\d{2}(:\d{2})?\b/g, '').trim())
    .filter((line) => line.length > 0)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanInPlace() {
  rawTranscript.value = cleanTranscript(rawTranscript.value)
}
const index = ref(0)
const started = ref(false)
const finished = ref(false)

const userText = ref('')
const checked = ref(false)
const speed = ref(1)

// per-session accumulation
const accuracies = ref<number[]>([])
const allMissed = ref<string[]>([])

const current = computed(() => sentences.value[index.value] ?? '')
const total = computed(() => sentences.value.length)

const tokens = computed<DiffToken[]>(() =>
  checked.value ? wordDiff(current.value, userText.value) : [],
)
const accuracy = computed(() => (checked.value ? diffAccuracy(tokens.value) : 0))

const vocabSet = computed(() => new Set(vocab.items.map((it) => it.word.toLowerCase())))
function isLearned(text: string): boolean {
  return vocabSet.value.has(text.toLowerCase().replace(/[^a-z0-9']/gi, ''))
}

// All sentences from the cleaned transcript
const allSentences = computed(() => splitSentences(cleanTranscript(rawTranscript.value)))

// Track which saved script (if any) and which part this session belongs to
const currentScriptId = ref<string | null>(null)
const activeChunkIndex = ref<number | null>(null)

const currentScript = computed(() =>
  currentScriptId.value ? skills.getScript(currentScriptId.value) : null,
)
const completedChunks = computed<number[]>(() => currentScript.value?.completedChunks ?? [])

function saveCurrent() {
  const cleaned = cleanTranscript(rawTranscript.value)
  if (!cleaned) return
  const firstWords = cleaned.split(/\s+/).slice(0, 6).join(' ')
  const title = window.prompt('Đặt tên cho bài này:', firstWords) ?? firstWords
  const id = skills.addScript(title, cleaned, chunkSize.value)
  currentScriptId.value = id
}

function loadScript(id: string) {
  const s = skills.getScript(id)
  if (!s) return
  rawTranscript.value = s.text
  chunkSize.value = s.chunkSize
  currentScriptId.value = s.id
}

// Auto-split long transcripts into manageable parts
const chunkSize = ref(8)
const chunks = computed(() => {
  const all = allSentences.value
  const out: { index: number; from: number; to: number; sentences: string[] }[] = []
  for (let i = 0; i < all.length; i += chunkSize.value) {
    out.push({
      index: out.length,
      from: i + 1,
      to: Math.min(i + chunkSize.value, all.length),
      sentences: all.slice(i, i + chunkSize.value),
    })
  }
  return out
})

function startWith(ss: string[], chunkIndex: number | null = null) {
  if (ss.length === 0) return
  activeChunkIndex.value = chunkIndex
  sentences.value = ss
  index.value = 0
  started.value = true
  finished.value = false
  accuracies.value = []
  allMissed.value = []
  resetSentence()
}

function start() {
  startWith(allSentences.value, null)
}

function resetSentence() {
  userText.value = ''
  checked.value = false
}

// Word popover for inline EN→VI lookup on the reference sentence
const activePopover = ref<{ word: string; x: number; y: number } | null>(null)
function openWordPopover(e: MouseEvent, word: string) {
  e.stopPropagation()
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  activePopover.value = {
    word: word.replace(/[^A-Za-z'-]/g, ''),
    x: rect.left + rect.width / 2,
    y: rect.top,
  }
}

function playCurrent() {
  // Web Speech rate: clamp 0.1..10; we use 0.5/0.75/1
  speakAtRate(current.value, speed.value)
}

function speakAtRate(text: string, rate: number) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.rate = rate
  synth.speak(u)
}

function check() {
  if (checked.value) return
  checked.value = true
  accuracies.value.push(accuracy.value)
  tokens.value.filter((t) => t.type === 'missing').forEach((t) => {
    const w = t.text.toLowerCase().replace(/[^a-z0-9']/gi, '')
    if (w) allMissed.value.push(w)
  })
}

function next() {
  if (!checked.value) return
  if (index.value + 1 >= total.value) {
    finish()
    return
  }
  index.value++
  resetSentence()
}

function finish() {
  const avg =
    accuracies.value.length === 0
      ? 0
      : accuracies.value.reduce((a, b) => a + b, 0) / accuracies.value.length
  skills.recordDictation(avg, total.value, allMissed.value)
  // Mark this part complete if it came from a saved script
  if (currentScriptId.value && activeChunkIndex.value !== null) {
    skills.markChunkDone(currentScriptId.value, activeChunkIndex.value)
  }
  finished.value = true
}

function restart() {
  started.value = false
  finished.value = false
  sentences.value = []
}

const sessionAccuracy = computed(() =>
  accuracies.value.length === 0
    ? 0
    : Math.round((accuracies.value.reduce((a, b) => a + b, 0) / accuracies.value.length) * 100),
)
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 lg:px-8 py-6">
    <button class="text-sm text-slate-500 hover:text-indigo-700 mb-3" @click="router.push('/skills')">
      ← Về Luyện kỹ năng
    </button>
    <h1 class="text-2xl font-bold mb-1">🎧 Dictation Studio</h1>

    <!-- ===== SETUP ===== -->
    <div v-if="!started">
      <p class="text-sm text-slate-600 mb-4 leading-relaxed">
        Dán transcript chuẩn (vd lời thoại phút 9 của video). App tách thành từng câu —
        bạn nghe (YouTube thật hoặc nút 🔊), gõ lại, rồi app <b>bôi đỏ những từ bị sót</b>
        (thường là âm nối, mạo từ, đuôi -ed bị nuốt).
      </p>
      <textarea
        v-model="rawTranscript"
        rows="8"
        placeholder="Dán transcript vào đây (kể cả bản YouTube có timestamp 0:08, 1:07...)"
        class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 focus:outline-none text-sm mb-3"
      ></textarea>
      <div class="flex flex-wrap items-center gap-2">
        <button
          class="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50"
          :disabled="!rawTranscript.trim()"
          @click="start"
        >
          Làm tất cả ({{ allSentences.length }} câu)
        </button>
        <button
          class="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 disabled:opacity-50"
          :disabled="!rawTranscript.trim()"
          @click="cleanInPlace"
          title="Bỏ timestamp 0:08, 1:07... và gộp lại"
        >
          🧹 Dọn timestamp
        </button>
        <button
          v-if="!currentScriptId"
          class="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
          :disabled="!rawTranscript.trim()"
          @click="saveCurrent"
        >
          💾 Lưu bài này
        </button>
        <span v-else class="text-xs text-emerald-700 font-semibold self-center">✓ Đã lưu trong thư viện</span>
      </div>
      <p class="text-[11px] text-slate-400 mt-2">
        Paste thẳng transcript YouTube cũng được — app tự bỏ timestamp. Bấm <b>💾 Lưu bài này</b> để mai mở lại làm tiếp.
      </p>

      <!-- Saved transcript library -->
      <div v-if="skills.scripts.length" class="rounded-2xl bg-white border border-slate-200 p-4 mt-4">
        <h2 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">📚 Bài đã lưu</h2>
        <div class="space-y-2">
          <div
            v-for="s in skills.scripts"
            :key="s.id"
            class="flex items-center gap-3 px-3 py-2 rounded-lg border transition"
            :class="currentScriptId === s.id ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'"
          >
            <button class="flex-1 min-w-0 text-left" @click="loadScript(s.id)">
              <div class="text-sm font-semibold text-slate-800 truncate">{{ s.title }}</div>
              <div class="text-[10px] text-slate-500 mt-0.5">
                {{ s.completedChunks.length }} phần đã xong
              </div>
            </button>
            <button class="text-xs text-rose-600 hover:underline shrink-0" @click="skills.removeScript(s.id)">
              Xóa
            </button>
          </div>
        </div>
      </div>

      <!-- Auto chunking for long transcripts -->
      <div v-if="allSentences.length > chunkSize" class="rounded-2xl bg-amber-50 border border-amber-200 p-4 mt-4">
        <div class="flex items-center justify-between flex-wrap gap-2 mb-2">
          <h2 class="text-xs font-bold uppercase tracking-widest text-amber-700">
            📑 Bài dài — chia thành {{ chunks.length }} phần
          </h2>
          <div class="flex items-center gap-1 text-xs">
            <span class="text-slate-500">Câu/phần:</span>
            <button
              v-for="s in [5, 8, 10, 15]"
              :key="s"
              class="px-2 py-1 rounded-md font-bold transition"
              :class="chunkSize === s ? 'bg-amber-500 text-white' : 'bg-white border border-amber-200 text-slate-600'"
              @click="chunkSize = s"
            >
              {{ s }}
            </button>
          </div>
        </div>
        <p class="text-[11px] text-slate-500 mb-3">Mỗi buổi chỉ cần làm 1 phần ngắn. Chọn phần để bắt đầu:</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            v-for="c in chunks"
            :key="c.index"
            class="px-3 py-2.5 rounded-xl border text-left transition"
            :class="completedChunks.includes(c.index)
              ? 'bg-emerald-50 border-emerald-300 hover:border-emerald-400'
              : 'bg-white border-amber-200 hover:border-amber-400 hover:shadow-sm'"
            @click="startWith(c.sentences, c.index)"
          >
            <div class="text-sm font-bold text-slate-900 flex items-center gap-1">
              <span v-if="completedChunks.includes(c.index)" class="text-emerald-600">✓</span>
              Phần {{ c.index + 1 }}
            </div>
            <div class="text-[10px] text-slate-500 mt-0.5">câu {{ c.from }}–{{ c.to }}</div>
          </button>
        </div>
        <p v-if="currentScript" class="text-[11px] text-emerald-700 mt-2">
          ✓ = phần đã học xong. Mở lại "{{ currentScript.title }}" bất cứ lúc nào để làm tiếp.
        </p>
      </div>
    </div>

    <!-- ===== FINISHED ===== -->
    <div v-else-if="finished" class="rounded-3xl bg-white border border-slate-200 p-8 text-center shadow-sm">
      <div class="text-5xl mb-3">{{ sessionAccuracy >= 90 ? '🏆' : sessionAccuracy >= 70 ? '👍' : '💪' }}</div>
      <p class="text-2xl font-bold text-slate-900">{{ sessionAccuracy }}% chính xác</p>
      <p class="text-sm text-slate-500 mt-1">{{ total }} câu đã chép</p>

      <div v-if="skills.topMissedWords.length" class="mt-6 text-left">
        <p class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Âm/từ bạn hay sót</p>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="m in skills.topMissedWords"
            :key="m.word"
            class="text-xs px-2 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200"
          >
            {{ m.word }} <span class="opacity-60">×{{ m.count }}</span>
          </span>
        </div>
        <p class="text-[11px] text-slate-400 mt-2">Đây là pattern lỗi nghe — chú ý mấy từ này lần sau.</p>
      </div>

      <div class="flex flex-wrap gap-2 justify-center mt-6">
        <button class="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700" @click="restart">
          Bài mới
        </button>
        <button class="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200" @click="router.push('/skills')">
          Xong
        </button>
      </div>
    </div>

    <!-- ===== ACTIVE ===== -->
    <div v-else>
      <div class="flex items-center justify-between mb-3 text-xs text-slate-600">
        <button class="text-slate-500 hover:text-rose-600 font-medium" @click="restart">← Thoát</button>
        <span>Câu {{ index + 1 }}/{{ total }}</span>
      </div>
      <div class="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-5">
        <div class="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all" :style="{ width: ((index) / total) * 100 + '%' }"></div>
      </div>

      <div class="rounded-3xl bg-white border border-slate-200 shadow-lg p-6">
        <!-- Playback controls -->
        <div class="flex items-center gap-2 mb-4 flex-wrap">
          <button class="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700" @click="playCurrent">
            🔊 Nghe (TTS)
          </button>
          <div class="flex rounded-lg bg-slate-100 p-0.5 text-xs font-bold">
            <button
              v-for="s in [1, 0.75, 0.5]"
              :key="s"
              class="px-2.5 py-1.5 rounded-md transition"
              :class="speed === s ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'"
              @click="speed = s"
            >
              {{ s }}×
            </button>
          </div>
          <span class="text-[11px] text-slate-400">hoặc nghe trên YouTube rồi gõ ↓</span>
        </div>

        <textarea
          v-model="userText"
          rows="3"
          :disabled="checked"
          placeholder="Gõ lại những gì bạn nghe được..."
          class="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:outline-none mb-3"
          @keydown.enter.prevent="checked ? next() : check()"
        ></textarea>

        <!-- Feedback -->
        <div v-if="checked" class="mb-3">
          <div class="flex items-center gap-2 mb-2">
            <span
              class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
              :class="accuracy >= 0.9 ? 'bg-emerald-100 text-emerald-700' : accuracy >= 0.6 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'"
            >
              {{ Math.round(accuracy * 100) }}% đúng
            </span>
            <button class="text-xs text-indigo-600 hover:underline" @click="speakAtRate(current, 0.5)">
              🔉 Nghe lại thật chậm
            </button>
          </div>
          <p class="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Bản chuẩn (đỏ = bạn sót)</p>
          <p class="leading-relaxed">
            <template v-for="(t, i) in tokens" :key="i">
              <span
                v-if="t.type !== 'extra'"
                :class="[
                  t.type === 'match' ? 'text-emerald-700' : 'text-rose-600 font-bold underline',
                  isLearned(t.text) ? 'bg-amber-100 rounded px-0.5' : '',
                  'cursor-pointer hover:bg-yellow-100 rounded px-0.5',
                ]"
                @click="openWordPopover($event, t.text)"
              >{{ t.text }} </span>
            </template>
          </p>
          <p class="text-[10px] text-slate-400 mt-1">💡 Bấm vào từ bất kỳ để tra nghĩa.</p>
          <p v-if="tokens.some((t) => t.type === 'extra')" class="text-xs text-amber-600 mt-2">
            Từ bạn gõ thừa/sai:
            <span v-for="(t, i) in tokens.filter((x) => x.type === 'extra')" :key="i" class="font-mono">{{ t.text }} </span>
          </p>
        </div>

        <div class="flex gap-2">
          <button
            v-if="!checked"
            class="flex-1 px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50"
            :disabled="!userText.trim()"
            @click="check"
          >
            Kiểm tra
          </button>
          <button
            v-else
            class="flex-1 px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700"
            @click="next"
          >
            {{ index + 1 >= total ? 'Xem kết quả' : 'Câu tiếp →' }}
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <WordPopover
        v-if="activePopover"
        :word="activePopover.word"
        :context="current"
        :x="activePopover.x"
        :y="activePopover.y"
        @close="activePopover = null"
      />
    </Teleport>
  </div>
</template>
