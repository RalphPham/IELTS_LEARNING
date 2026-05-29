<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { SPEAKING_PROMPTS, type SpeakingPrompt } from '@/data/speakingPrompts'
import { countPhrase } from '@/utils/diff'
import { useSkillsStore } from '@/stores/skills'

const router = useRouter()
const skills = useSkillsStore()

const selected = ref<SpeakingPrompt>(SPEAKING_PROMPTS[0]!)
const phase = ref<'setup' | 'recording' | 'review'>('setup')

// timer
const duration = computed(() => (selected.value.part === 2 ? 120 : 60))
const remaining = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

// recording
let mediaRecorder: MediaRecorder | null = null
let chunks: BlobPart[] = []
const audioUrl = ref<string | null>(null)
const recError = ref('')

// speech recognition (auto-transcribe)
let recognition: any = null
const transcript = ref('')
const recognitionSupported =
  typeof window !== 'undefined' &&
  ((window as any).webkitSpeechRecognition || (window as any).SpeechRecognition)

const goingToCount = computed(() => countPhrase(transcript.value, 'going to'))
const willCount = computed(
  () => countPhrase(transcript.value, 'will') + countPhrase(transcript.value, "'ll"),
)

// self-rating
const fluency = ref(3)
const pronunciation = ref(3)
const target = ref(3)

function formatTime(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

async function startRecording() {
  recError.value = ''
  transcript.value = ''
  audioUrl.value = null
  chunks = []
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data)
    }
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })
      audioUrl.value = URL.createObjectURL(blob)
      stream.getTracks().forEach((t) => t.stop())
    }
    mediaRecorder.start()

    // Auto-transcribe in parallel (best-effort)
    if (recognitionSupported) {
      const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognition = new SR()
      recognition.lang = 'en-US'
      recognition.continuous = true
      recognition.interimResults = false
      recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript.value += ' ' + event.results[i][0].transcript
          }
        }
      }
      recognition.onerror = () => {}
      try {
        recognition.start()
      } catch {
        // ignore
      }
    }

    phase.value = 'recording'
    remaining.value = duration.value
    timer = setInterval(() => {
      remaining.value--
      if (remaining.value <= 0) stopRecording()
    }, 1000)
  } catch {
    recError.value = 'Không truy cập được micro. Hãy cho phép quyền micro trong trình duyệt.'
  }
}

function stopRecording() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop()
  if (recognition) {
    try {
      recognition.stop()
    } catch {
      // ignore
    }
  }
  phase.value = 'review'
}

function saveAndFinish() {
  skills.recordSpeaking(selected.value.id, fluency.value, pronunciation.value, target.value)
  reset()
}

function reset() {
  phase.value = 'setup'
  audioUrl.value = null
  transcript.value = ''
  fluency.value = 3
  pronunciation.value = 3
  target.value = 3
}

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
  if (recognition) {
    try {
      recognition.stop()
    } catch {
      // ignore
    }
  }
})
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 lg:px-8 py-6">
    <button class="text-sm text-slate-500 hover:text-indigo-700 mb-3" @click="router.push('/skills')">
      ← Về Luyện kỹ năng
    </button>
    <h1 class="text-2xl font-bold mb-1">🎙️ Speaking Studio</h1>

    <!-- ===== SETUP ===== -->
    <div v-if="phase === 'setup'">
      <p class="text-sm text-slate-600 mb-3">Chọn đề, đọc gợi ý, rồi ghi âm 1 phút (rubber ducking).</p>

      <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Đề bài</label>
      <select
        v-model="selected"
        class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 focus:outline-none text-sm mb-4"
      >
        <optgroup label="Part 1">
          <option v-for="p in SPEAKING_PROMPTS.filter((x) => x.part === 1)" :key="p.id" :value="p">
            [{{ p.category }}] {{ p.question }}
          </option>
        </optgroup>
        <optgroup label="Part 2 (cue card)">
          <option v-for="p in SPEAKING_PROMPTS.filter((x) => x.part === 2)" :key="p.id" :value="p">
            {{ p.question.slice(0, 60) }}...
          </option>
        </optgroup>
      </select>

      <div class="rounded-2xl bg-white border border-slate-200 p-5 mb-4">
        <p class="text-[10px] uppercase tracking-widest font-bold text-indigo-600 mb-1">
          Part {{ selected.part }} · {{ selected.category }}
        </p>
        <p class="text-lg font-semibold text-slate-900 mb-3">{{ selected.question }}</p>

        <p class="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">🎯 Mục tiêu</p>
        <ul class="text-sm text-slate-700 mb-3 space-y-0.5">
          <li v-for="(t, i) in selected.targets" :key="i">• {{ t }}</li>
        </ul>

        <p class="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">💬 Cụm gợi ý</p>
        <div class="flex flex-wrap gap-1.5">
          <span v-for="(ph, i) in selected.phrases" :key="i" class="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
            {{ ph }}
          </span>
        </div>
      </div>

      <p v-if="!recognitionSupported" class="text-xs text-amber-600 mb-2">
        ⚠️ Trình duyệt này không hỗ trợ tự nhận diện giọng nói — bạn sẽ tự tick mục tiêu sau khi nghe lại. (Dùng Chrome/Edge để có auto-đếm.)
      </p>
      <p v-if="recError" class="text-xs text-rose-600 mb-2">{{ recError }}</p>

      <button class="w-full px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700" @click="startRecording">
        🔴 Bắt đầu ghi âm ({{ formatTime(duration) }})
      </button>
    </div>

    <!-- ===== RECORDING ===== -->
    <div v-else-if="phase === 'recording'" class="rounded-3xl bg-gradient-to-br from-rose-500 to-orange-500 text-white p-8 text-center shadow-lg">
      <div class="text-6xl font-black mb-2 tabular-nums">{{ formatTime(remaining) }}</div>
      <p class="text-sm opacity-90 mb-1">🔴 Đang ghi âm — nói liên tục!</p>
      <p class="text-xs opacity-80 mb-5">{{ selected.question }}</p>
      <div v-if="recognitionSupported" class="text-xs opacity-90 mb-5">
        going to: <b>{{ goingToCount }}</b> · will: <b>{{ willCount }}</b>
      </div>
      <button class="px-6 py-3 rounded-xl bg-white text-rose-600 font-bold hover:bg-rose-50" @click="stopRecording">
        ⏹ Dừng
      </button>
    </div>

    <!-- ===== REVIEW ===== -->
    <div v-else class="rounded-3xl bg-white border border-slate-200 shadow-lg p-6">
      <p class="text-sm font-semibold text-slate-900 mb-3">{{ selected.question }}</p>

      <div v-if="audioUrl" class="mb-4">
        <p class="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Nghe lại bản ghi</p>
        <audio :src="audioUrl" controls class="w-full"></audio>
      </div>

      <!-- Auto checklist -->
      <div class="mb-4">
        <p class="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">🎯 Mục tiêu</p>
        <div v-if="recognitionSupported" class="space-y-1 text-sm">
          <p :class="goingToCount >= 2 ? 'text-emerald-700' : 'text-slate-600'">
            {{ goingToCount >= 2 ? '✓' : '○' }} "going to" × {{ goingToCount }} (cần ≥2)
          </p>
          <p :class="willCount >= 1 ? 'text-emerald-700' : 'text-slate-600'">
            {{ willCount >= 1 ? '✓' : '○' }} "will/'ll" × {{ willCount }} (cần ≥1)
          </p>
          <details class="text-xs text-slate-500 mt-1">
            <summary class="cursor-pointer">Xem transcript tự động</summary>
            <p class="mt-1 italic">{{ transcript || '(không nhận được giọng nói)' }}</p>
          </details>
        </div>
        <ul v-else class="text-sm text-slate-700 space-y-0.5">
          <li v-for="(t, i) in selected.targets" :key="i">• {{ t }}</li>
        </ul>
      </div>

      <!-- Self-rate -->
      <div class="space-y-3 mb-5">
        <div v-for="r in [
          { label: 'Trôi chảy', model: 'fluency' },
          { label: 'Phát âm', model: 'pronunciation' },
          { label: 'Dùng đúng mục tiêu', model: 'target' },
        ]" :key="r.label">
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-700">{{ r.label }}</span>
            <span class="font-bold text-indigo-700">
              {{ r.model === 'fluency' ? fluency : r.model === 'pronunciation' ? pronunciation : target }}/5
            </span>
          </div>
          <input
            v-if="r.model === 'fluency'"
            v-model.number="fluency" type="range" min="1" max="5" class="w-full" />
          <input
            v-else-if="r.model === 'pronunciation'"
            v-model.number="pronunciation" type="range" min="1" max="5" class="w-full" />
          <input
            v-else
            v-model.number="target" type="range" min="1" max="5" class="w-full" />
        </div>
      </div>

      <div class="flex gap-2">
        <button class="flex-1 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700" @click="saveAndFinish">
          💾 Lưu & xong
        </button>
        <button class="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200" @click="reset">
          Làm lại
        </button>
      </div>
    </div>
  </div>
</template>
