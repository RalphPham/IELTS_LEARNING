<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { TENSES } from '@/data/grammar/tenses'
import { useGrammarStore } from '@/stores/grammar'
import type { GrammarQuestion, QuestionType, TenseId } from '@/types/grammar'

const router = useRouter()
const store = useGrammarStore()

interface DraftQuestion {
  prompt: string
  type: QuestionType
  baseForm: string
  options: string[]
  answer: string
  explanation: string
}

const rawInput = ref('')
const targetTense = ref<TenseId>('present_simple')
const drafts = ref<DraftQuestion[]>([])
const saved = ref<number | null>(null)

function emptyDraft(): DraftQuestion {
  return {
    prompt: '',
    type: 'fill',
    baseForm: '',
    options: ['', '', '', ''],
    answer: '',
    explanation: '',
  }
}

// Parse a pasted exercise block.
// Recognizes patterns like:
//   Question 1 : The earth_____(go) around the sun.
//   Question 2: She_____anymore.
//   A. isn't raining   B. rains   C. has rained   D. has been raining
function parseInput() {
  const text = rawInput.value.trim()
  if (!text) {
    drafts.value = []
    return
  }

  // Split on "Question N :" markers
  const chunks = text
    .split(/(?=\bQuestion\s+\d+\s*[:.])/i)
    .map((s) => s.trim())
    .filter(Boolean)

  const list: DraftQuestion[] = []
  for (const chunk of chunks) {
    // Remove the leading "Question N :" prefix
    const body = chunk.replace(/^Question\s+\d+\s*[:.]\s*/i, '').trim()
    if (!body) continue

    // Look for option lines: "A. ... B. ... C. ... D. ..."
    // Options may be on one line or multiple lines
    const optionRegex = /\b([ABCD])\.\s+([^\n]+?)(?=\s+[ABCD]\.\s+|$)/g
    const optionMatches = [...body.matchAll(optionRegex)]

    let prompt = body
    let options: string[] = ['', '', '', '']
    let type: QuestionType = 'fill'

    if (optionMatches.length >= 2) {
      // It's MCQ — cut prompt before first option
      const firstOptIdx = body.search(/\b[ABCD]\.\s+/)
      if (firstOptIdx > 0) {
        prompt = body.slice(0, firstOptIdx).trim()
        type = 'mcq'
        options = ['', '', '', '']
        optionMatches.forEach((m) => {
          const letter = m[1]
          const value = (m[2] ?? '').trim()
          if (letter === 'A') options[0] = value
          else if (letter === 'B') options[1] = value
          else if (letter === 'C') options[2] = value
          else if (letter === 'D') options[3] = value
        })
      }
    }

    // Normalize blank markers: "_____" → "___"
    prompt = prompt.replace(/_{2,}/g, '___')
    // Strip trailing dashes/whitespace
    prompt = prompt.replace(/[-–—]+$/, '').trim()

    // Try to extract base form from "(go)" or similar after the blank
    let baseForm = ''
    const baseMatch = prompt.match(/\(([^)]+)\)/)
    if (baseMatch && type === 'fill') baseForm = baseMatch[1] ?? ''

    list.push({
      prompt,
      type,
      baseForm,
      options,
      answer: '',
      explanation: '',
    })
  }

  drafts.value = list
  saved.value = null
}

function clearAll() {
  drafts.value = []
  rawInput.value = ''
  saved.value = null
}

function addManual() {
  drafts.value.push(emptyDraft())
}

function removeDraft(i: number) {
  drafts.value.splice(i, 1)
}

function canSave(d: DraftQuestion): boolean {
  if (!d.prompt.trim() || !d.answer.trim()) return false
  if (d.type === 'mcq') {
    const validOpts = d.options.filter((o) => o.trim().length > 0)
    if (validOpts.length < 2) return false
    if (!validOpts.includes(d.answer.trim())) return false
  }
  return true
}

const savableCount = computed(() => drafts.value.filter(canSave).length)

function saveAll() {
  const toSave: Array<Omit<GrammarQuestion, 'id'>> = []
  for (const d of drafts.value) {
    if (!canSave(d)) continue
    const base: Omit<GrammarQuestion, 'id'> = {
      tenseId: targetTense.value,
      type: d.type,
      prompt: d.prompt.trim(),
      answer: d.answer.trim(),
      explanation: d.explanation.trim() || 'Đáp án dựa theo dấu hiệu/cấu trúc của thì đã chọn.',
    }
    if (d.baseForm.trim()) base.baseForm = d.baseForm.trim()
    if (d.type === 'mcq') {
      base.options = d.options.map((o) => o.trim()).filter(Boolean)
    }
    toSave.push(base)
  }
  if (toSave.length === 0) return
  store.addUserQuestions(toSave)
  saved.value = toSave.length
  drafts.value = []
  rawInput.value = ''
}

function exportJson() {
  const blob = new Blob([store.exportUserQuestionsJson()], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `grammar-questions-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importJson(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      store.importUserQuestionsJson(reader.result as string)
      alert('Nhập dữ liệu thành công.')
    } catch {
      alert('File không hợp lệ.')
    }
  }
  reader.readAsText(file)
}
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 lg:px-8 py-6">
    <RouterLink to="/grammar" class="text-sm text-slate-500 hover:text-indigo-700 mb-3 inline-block">
      ← Về danh sách thì
    </RouterLink>

    <h1 class="text-2xl font-bold mb-1">📥 Thêm câu hỏi từ tài liệu của bạn</h1>
    <p class="text-sm text-slate-500 mb-5">
      Paste cả đoạn bài tập từ giáo trình/PDF của bạn. App sẽ tự tách thành từng câu để
      bạn điền đáp án + lý do. Câu hỏi được lưu trong trình duyệt — không nằm trong source code.
      Có <strong>{{ store.userQuestionCount }}</strong> câu hỏi tự thêm.
    </p>

    <!-- Tense selector + paste area -->
    <section class="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 mb-4">
      <div class="flex flex-col sm:flex-row gap-3 mb-3">
        <div class="flex-1">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Thì cho lô câu hỏi này
          </label>
          <select
            v-model="targetTense"
            class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none font-medium"
          >
            <option v-for="t in TENSES" :key="t.id" :value="t.id">
              {{ t.emoji }} {{ t.nameVi }} ({{ t.name }})
            </option>
          </select>
        </div>
      </div>

      <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
        Dán nội dung bài tập
      </label>
      <textarea
        v-model="rawInput"
        rows="10"
        placeholder="Ví dụ:&#10;Question 1 : The earth___(go) around the sun.&#10;Question 2 : Angela usually___(leave) for work at 8:00 A.M.&#10;...&#10;&#10;Hoặc dạng MCQ:&#10;Question 1 : We can go out now. It___ anymore.&#10;A. isn't raining   B. rains   C. has rained   D. has been raining"
        class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none font-mono text-sm"
      ></textarea>

      <div class="flex flex-wrap gap-2 mt-3">
        <button
          class="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          @click="parseInput"
        >
          ⚙️ Tách câu hỏi
        </button>
        <button
          class="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          @click="addManual"
        >
          + Thêm 1 câu tay
        </button>
        <button
          class="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          @click="clearAll"
        >
          Xoá hết
        </button>
        <span class="ml-auto flex items-center gap-2 text-xs">
          <button
            class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50"
            @click="exportJson"
          >
            ⬇ Export JSON
          </button>
          <label class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer">
            ⬆ Import JSON
            <input type="file" accept="application/json" class="hidden" @change="importJson" />
          </label>
        </span>
      </div>

      <p v-if="saved !== null" class="mt-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
        ✓ Đã lưu {{ saved }} câu vào ngân hàng của bạn.
        <RouterLink :to="`/grammar/${targetTense}`" class="font-bold underline">Đi tới luyện</RouterLink>
      </p>
    </section>

    <!-- Drafts -->
    <div v-if="drafts.length === 0" class="text-center text-slate-400 py-12">
      Chưa có câu nào. Paste nội dung ở trên rồi bấm <b>Tách câu hỏi</b>.
    </div>

    <div v-else>
      <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
        <p class="text-sm font-semibold text-slate-700">
          {{ drafts.length }} câu — sẵn sàng lưu: <span class="text-emerald-700">{{ savableCount }}</span>
        </p>
        <button
          class="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition disabled:opacity-50"
          :disabled="savableCount === 0"
          @click="saveAll"
        >
          💾 Lưu {{ savableCount }} câu
        </button>
      </div>

      <div class="space-y-3">
        <article
          v-for="(d, i) in drafts"
          :key="i"
          class="rounded-2xl bg-white border border-slate-200 p-4"
          :class="canSave(d) ? 'border-emerald-200' : ''"
        >
          <div class="flex items-center justify-between mb-2 text-xs">
            <span class="font-bold text-slate-500">Câu {{ i + 1 }}</span>
            <div class="flex items-center gap-2">
              <label class="flex items-center gap-1">
                <input type="radio" :value="'fill'" v-model="d.type" />
                <span>Điền</span>
              </label>
              <label class="flex items-center gap-1">
                <input type="radio" :value="'mcq'" v-model="d.type" />
                <span>MCQ</span>
              </label>
              <button class="text-rose-600 hover:underline" @click="removeDraft(i)">Xoá</button>
            </div>
          </div>

          <textarea
            v-model="d.prompt"
            rows="2"
            placeholder="Câu hỏi (dùng ___ cho chỗ trống)"
            class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none text-sm mb-2"
          ></textarea>

          <div v-if="d.type === 'fill'" class="grid sm:grid-cols-2 gap-2 mb-2">
            <input
              v-model="d.baseForm"
              type="text"
              placeholder="Dạng cơ sở (go, leave,...)"
              class="px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none text-sm font-mono"
            />
            <input
              v-model="d.answer"
              type="text"
              placeholder="Đáp án (vd: goes)"
              class="px-3 py-2 rounded-lg border-2 border-emerald-300 focus:border-emerald-500 focus:outline-none text-sm font-mono"
            />
          </div>

          <div v-else class="space-y-1.5 mb-2">
            <div v-for="(_, j) in d.options" :key="j" class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-500 w-5">{{ String.fromCharCode(65 + j) }}.</span>
              <input
                v-model="d.options[j]"
                type="text"
                placeholder="Đáp án..."
                class="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none text-sm"
              />
            </div>
            <div class="flex items-center gap-2 pt-1">
              <span class="text-xs font-bold text-emerald-600 w-5">✓</span>
              <select
                v-model="d.answer"
                class="flex-1 px-3 py-1.5 rounded-lg border-2 border-emerald-300 focus:border-emerald-500 focus:outline-none text-sm"
              >
                <option value="">— Chọn đáp án đúng —</option>
                <option v-for="(opt, k) in d.options.filter((o) => o.trim())" :key="k" :value="opt">
                  {{ String.fromCharCode(65 + k) }}. {{ opt }}
                </option>
              </select>
            </div>
          </div>

          <textarea
            v-model="d.explanation"
            rows="2"
            placeholder="Lý do/Giải thích (sẽ hiện khi trả lời sai)"
            class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none text-sm"
          ></textarea>
        </article>
      </div>
    </div>
  </div>
</template>
