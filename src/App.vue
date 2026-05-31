<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useVocabularyStore } from '@/stores/vocabulary'
import { listEnglishVoices, setVoiceByName, getCurrentVoiceName, speak } from '@/utils/speech'

const store = useVocabularyStore()
const route = useRoute()
const dueCount = computed(() => store.dueCards.length)

// Page title for the slim mobile top bar
const pageTitle = computed(() => {
  const p = route.path
  if (p === '/' || p.startsWith('/day')) return 'Danh sách'
  if (p.startsWith('/review') || p.startsWith('/quiz')) return 'Ôn tập'
  if (p.startsWith('/grammar')) return 'Ngữ pháp'
  if (p.startsWith('/skills/dictation')) return 'Dictation Studio'
  if (p.startsWith('/skills/speaking')) return 'Speaking Studio'
  if (p.startsWith('/skills')) return 'Kỹ năng'
  if (p.startsWith('/stats')) return 'Thống kê'
  if (p.startsWith('/add')) return 'Thêm từ'
  return ''
})

const showVoicePicker = ref(false)
const voices = ref<SpeechSynthesisVoice[]>([])
const currentVoice = ref('')

function refreshVoices() {
  voices.value = listEnglishVoices()
  currentVoice.value = getCurrentVoiceName()
}

function onPickVoice(e: Event) {
  const name = (e.target as HTMLSelectElement).value
  setVoiceByName(name)
  currentVoice.value = name
  speak('Hello, this is a test of the voice.')
}

onMounted(() => {
  refreshVoices()
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.addEventListener('voiceschanged', refreshVoices)
  }
  speak(' ')
  setTimeout(refreshVoices, 200)
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <!-- ========== TOP BAR (always fixed) ========== -->
    <nav class="fixed top-0 inset-x-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-4 lg:px-8 py-2.5 gap-2">
        <RouterLink to="/" class="flex items-center gap-2 shrink-0">
          <img src="/logo.svg" alt="IELTS" class="h-9 w-9" />
          <span class="hidden sm:inline text-sm font-black uppercase tracking-[0.18em] text-indigo-900">IELTS Vocab</span>
        </RouterLink>

        <!-- Mobile: page title in the middle -->
        <span class="sm:hidden flex-1 text-sm font-bold text-slate-700 text-center truncate px-2">
          {{ pageTitle }}
        </span>

        <!-- Desktop: pill nav -->
        <div class="hidden sm:flex items-center gap-1 rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-600">
          <RouterLink to="/" class="rounded-full px-4 py-1.5 transition hover:bg-white hover:text-indigo-700" exact-active-class="bg-white text-indigo-700 shadow-sm">
            Danh sách
          </RouterLink>
          <RouterLink to="/review" class="rounded-full px-4 py-1.5 transition hover:bg-white hover:text-emerald-700 relative" active-class="bg-white text-emerald-700 shadow-sm">
            Ôn tập
            <span v-if="dueCount > 0" class="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white bg-rose-500 rounded-full">
              {{ dueCount }}
            </span>
          </RouterLink>
          <RouterLink to="/grammar" class="rounded-full px-4 py-1.5 transition hover:bg-white hover:text-sky-700" active-class="bg-white text-sky-700 shadow-sm">
            Ngữ pháp
          </RouterLink>
          <RouterLink to="/skills" class="rounded-full px-4 py-1.5 transition hover:bg-white hover:text-rose-700" active-class="bg-white text-rose-700 shadow-sm">
            Kỹ năng
          </RouterLink>
          <RouterLink to="/stats" class="rounded-full px-4 py-1.5 transition hover:bg-white hover:text-orange-700" active-class="bg-white text-orange-700 shadow-sm">
            📊
          </RouterLink>
          <RouterLink to="/add" class="rounded-full px-4 py-1.5 transition hover:bg-white hover:text-fuchsia-700" active-class="bg-white text-fuchsia-700 shadow-sm">
            + Thêm
          </RouterLink>
        </div>

        <!-- Right-side controls -->
        <div class="flex items-center gap-1 shrink-0">
          <button
            class="rounded-full p-2 hover:bg-slate-100 text-slate-500 hover:text-indigo-700 transition"
            title="Chọn giọng đọc"
            @click="showVoicePicker = !showVoicePicker; refreshVoices()"
          >
            🎙️
          </button>
          <!-- Mobile: + Thêm as a chip -->
          <RouterLink
            to="/add"
            class="sm:hidden rounded-full px-3 py-1.5 bg-fuchsia-100 text-fuchsia-700 font-bold text-xs"
            active-class="bg-fuchsia-200"
          >
            + Thêm
          </RouterLink>
        </div>
      </div>

      <!-- Voice picker drawer -->
      <div v-if="showVoicePicker" class="border-t border-slate-200 bg-slate-50">
        <div class="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 py-3 flex items-center gap-2 flex-wrap">
          <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Giọng:</label>
          <select
            :value="currentVoice"
            class="text-sm px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:border-indigo-500 focus:outline-none font-medium flex-1 min-w-[200px]"
            @change="onPickVoice"
          >
            <option value="">— Tự động chọn —</option>
            <option v-for="v in voices" :key="v.name" :value="v.name">
              {{ v.name }} ({{ v.lang }})
            </option>
          </select>
          <button
            class="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100"
            @click="speak('Hello, this is a test of the voice.')"
          >
            🔊 Thử
          </button>
        </div>
      </div>
    </nav>

    <!-- ========== MAIN — padded for fixed top & bottom bars ========== -->
    <main class="pt-[60px] pb-[84px] sm:pb-6">
      <RouterView />
    </main>

    <!-- ========== MOBILE BOTTOM TAB BAR (fixed) ========== -->
    <nav
      class="sm:hidden fixed bottom-0 inset-x-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl"
      style="padding-bottom: env(safe-area-inset-bottom);"
    >
      <div class="grid grid-cols-5">
        <RouterLink
          to="/"
          class="flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-bold text-slate-500"
          exact-active-class="text-indigo-700"
        >
          <span class="text-xl leading-none">📋</span>
          <span>Danh sách</span>
        </RouterLink>
        <RouterLink
          to="/review"
          class="flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-bold text-slate-500 relative"
          active-class="text-emerald-700"
        >
          <span class="text-xl leading-none">🔁</span>
          <span>Ôn tập</span>
          <span
            v-if="dueCount > 0"
            class="absolute top-1 right-3 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[9px] font-bold text-white bg-rose-500 rounded-full"
          >
            {{ dueCount }}
          </span>
        </RouterLink>
        <RouterLink
          to="/grammar"
          class="flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-bold text-slate-500"
          active-class="text-sky-700"
        >
          <span class="text-xl leading-none">📘</span>
          <span>Ngữ pháp</span>
        </RouterLink>
        <RouterLink
          to="/skills"
          class="flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-bold text-slate-500"
          active-class="text-rose-700"
        >
          <span class="text-xl leading-none">🎧</span>
          <span>Kỹ năng</span>
        </RouterLink>
        <RouterLink
          to="/stats"
          class="flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-bold text-slate-500"
          active-class="text-orange-700"
        >
          <span class="text-xl leading-none">📊</span>
          <span>Thống kê</span>
        </RouterLink>
      </div>
    </nav>
  </div>
</template>
