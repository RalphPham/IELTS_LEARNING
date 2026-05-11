<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useVocabularyStore } from '@/stores/vocabulary'
import type { ReviewGrade, Vocabulary } from '@/types/vocabulary'
import { applyGrade } from '@/utils/srs'
import { speak } from '@/utils/speech'

const store = useVocabularyStore()
const flipped = ref(false)
const sessionCount = ref(0)
const sessionStart = ref(Date.now())
const selectedDay = ref<string | null>(null)

const queue = computed(() => {
  return store.dueCards.filter((it) =>
    selectedDay.value === null ? true : it.day === selectedDay.value,
  )
})

const current = computed<Vocabulary | null>(() => queue.value[0] ?? null)
const totalDue = ref(0)

watch(
  current,
  (val, old) => {
    flipped.value = false
    if (val && !old) totalDue.value = queue.value.length
    if (val && old && totalDue.value < queue.value.length + sessionCount.value) {
      totalDue.value = queue.value.length + sessionCount.value
    }
  },
  { immediate: true },
)

watch(selectedDay, () => {
  sessionCount.value = 0
  sessionStart.value = Date.now()
  totalDue.value = queue.value.length
})

const progressPct = computed(() => {
  const total = totalDue.value
  if (total === 0) return 0
  return Math.round(((total - queue.value.length) / total) * 100)
})

function formatInterval(days: number): string {
  if (days < 1) return '< 1d'
  if (days < 30) return `${days}d`
  if (days < 365) return `${Math.round(days / 30)}mo`
  return `${Math.round(days / 365)}y`
}

function previewInterval(g: ReviewGrade): string {
  if (!current.value) return ''
  const next = applyGrade(current.value, g)
  return formatInterval(next.interval)
}

function grade(g: ReviewGrade) {
  if (!current.value) return
  store.grade(current.value.id, g)
  sessionCount.value += 1
  flipped.value = false
}

function handleKey(e: KeyboardEvent) {
  if (!current.value) return
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
  <div class="mx-auto max-w-2xl px-4 lg:px-8 py-6">
    <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
      <div class="flex items-center gap-2">
        <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Buổi học:</label>
        <select
          v-model="selectedDay"
          class="text-sm px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:border-indigo-500 focus:outline-none"
        >
          <option :value="null">Tất cả</option>
          <option v-for="d in store.days" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>
      <div class="text-sm text-slate-600">
        Còn: <span class="font-bold text-indigo-700">{{ queue.length }}</span>
        · Đã ôn: <span class="font-bold text-emerald-700">{{ sessionCount }}</span>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-6">
      <div
        class="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
        :style="{ width: progressPct + '%' }"
      ></div>
    </div>

    <!-- Empty state -->
    <div v-if="!current" class="rounded-3xl bg-white border border-slate-200 p-14 text-center shadow-sm">
      <div class="text-6xl mb-4">🎉</div>
      <p class="text-xl font-bold text-slate-800">Đã hết thẻ đến hạn!</p>
      <p class="text-sm text-slate-500 mt-2">Quay lại sau để tiếp tục ôn tập.</p>
      <RouterLink to="/" class="inline-block mt-6 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
        Về danh sách
      </RouterLink>
    </div>

    <!-- Mochi-style card -->
    <div v-else class="space-y-4">
      <div
        class="rounded-3xl bg-white border border-slate-200 shadow-lg overflow-hidden min-h-[440px] flex flex-col cursor-pointer transition-transform"
        @click="flipped = !flipped"
      >
        <!-- meta strip -->
        <div class="flex items-center justify-between px-6 pt-5 text-[10px] uppercase font-bold tracking-widest text-slate-400">
          <span>{{ current.topic }}</span>
          <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 normal-case tracking-normal">
            {{ current.day }}
          </span>
        </div>

        <!-- Front: word -->
        <div v-if="!flipped" class="flex-1 flex flex-col items-center justify-center text-center px-6 py-10">
          <div class="flex items-center justify-center gap-3 flex-wrap">
            <h2 class="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">{{ current.word }}</h2>
            <button
              class="text-indigo-600 text-3xl hover:scale-110 transition"
              @click.stop="speak(current.word)"
              title="Phát âm"
            >
              🔊
            </button>
          </div>
          <p v-if="current.pronunciation" class="text-slate-500 font-mono mt-3 text-lg">
            {{ current.pronunciation }}
          </p>
          <span class="mt-3 text-xs uppercase tracking-widest text-indigo-700 font-bold">
            {{ current.partOfSpeech }}
          </span>
          <p class="mt-10 text-xs text-slate-400">Bấm thẻ hoặc Space để xem nghĩa</p>
        </div>

        <!-- Back: full info -->
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
              <li
                v-for="(ex, i) in current.examples"
                :key="i"
                class="text-sm italic text-slate-700 flex items-start gap-2"
              >
                <button class="text-indigo-500 shrink-0 mt-0.5" @click.stop="speak(ex)">▶</button>
                <span>{{ ex }}</span>
              </li>
            </ul>
          </div>

          <div v-if="current.collocations.length">
            <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Cụm hay đi kèm</p>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="(c, i) in current.collocations"
                :key="i"
                class="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200"
              >
                {{ c }}
              </span>
            </div>
          </div>

          <p v-if="current.notes" class="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            💡 {{ current.notes }}
          </p>
        </div>
      </div>

      <!-- Grading buttons (only after flip) -->
      <div v-if="flipped" class="grid grid-cols-4 gap-2">
        <button
          class="rounded-2xl bg-white border-2 border-rose-200 hover:border-rose-400 hover:bg-rose-50 py-4 text-rose-700 font-bold transition flex flex-col items-center"
          @click="grade('again')"
        >
          <span>Quên</span>
          <span class="text-[10px] opacity-70 font-medium mt-0.5">{{ previewInterval('again') }}</span>
          <span class="text-[10px] opacity-50 mt-0.5">1</span>
        </button>
        <button
          class="rounded-2xl bg-white border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 py-4 text-amber-700 font-bold transition flex flex-col items-center"
          @click="grade('hard')"
        >
          <span>Khó</span>
          <span class="text-[10px] opacity-70 font-medium mt-0.5">{{ previewInterval('hard') }}</span>
          <span class="text-[10px] opacity-50 mt-0.5">2</span>
        </button>
        <button
          class="rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-4 text-white font-bold transition flex flex-col items-center shadow-md"
          @click="grade('good')"
        >
          <span>Tốt</span>
          <span class="text-[10px] opacity-90 font-medium mt-0.5">{{ previewInterval('good') }}</span>
          <span class="text-[10px] opacity-70 mt-0.5">3 / space</span>
        </button>
        <button
          class="rounded-2xl bg-white border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50 py-4 text-sky-700 font-bold transition flex flex-col items-center"
          @click="grade('easy')"
        >
          <span>Dễ</span>
          <span class="text-[10px] opacity-70 font-medium mt-0.5">{{ previewInterval('easy') }}</span>
          <span class="text-[10px] opacity-50 mt-0.5">4</span>
        </button>
      </div>

      <p v-else class="text-center text-xs text-slate-400 pt-2">
        Phím tắt: <kbd class="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono">Space</kbd> để lật thẻ
      </p>
    </div>
  </div>
</template>
