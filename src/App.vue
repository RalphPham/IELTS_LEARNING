<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useVocabularyStore } from '@/stores/vocabulary'
import { listEnglishVoices, setVoiceByName, getCurrentVoiceName, speak } from '@/utils/speech'

const store = useVocabularyStore()
const dueCount = computed(() => store.dueCards.length)

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
  // Trigger initial voice load
  speak(' ')
  setTimeout(refreshVoices, 200)
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <nav class="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8 py-3 gap-3">
        <RouterLink to="/" class="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-indigo-900 shrink-0">
          <img src="/logo.svg" alt="IELTS" class="h-10 w-10" />
          <span class="hidden sm:inline">IELTS Vocab</span>
        </RouterLink>
        <div class="flex items-center gap-1">
          <button
            class="rounded-full p-2 hover:bg-slate-100 text-slate-500 hover:text-indigo-700 transition"
            title="Chọn giọng đọc"
            @click="showVoicePicker = !showVoicePicker; refreshVoices()"
          >
            🎙️
          </button>
        <div class="flex items-center gap-1 rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-600">
          <RouterLink
            to="/"
            class="rounded-full px-4 py-1.5 transition hover:bg-white hover:text-indigo-700"
            active-class="bg-white text-indigo-700 shadow-sm"
          >
            Danh sách
          </RouterLink>
          <RouterLink
            to="/review"
            class="rounded-full px-4 py-1.5 transition hover:bg-white hover:text-emerald-700 relative"
            active-class="bg-white text-emerald-700 shadow-sm"
          >
            Ôn tập
            <span
              v-if="dueCount > 0"
              class="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white bg-rose-500 rounded-full"
            >
              {{ dueCount }}
            </span>
          </RouterLink>
          <RouterLink
            to="/grammar"
            class="rounded-full px-4 py-1.5 transition hover:bg-white hover:text-sky-700"
            active-class="bg-white text-sky-700 shadow-sm"
          >
            Ngữ pháp
          </RouterLink>
          <RouterLink
            to="/stats"
            class="rounded-full px-4 py-1.5 transition hover:bg-white hover:text-orange-700"
            active-class="bg-white text-orange-700 shadow-sm"
          >
            📊
          </RouterLink>
          <RouterLink
            to="/add"
            class="rounded-full px-4 py-1.5 transition hover:bg-white hover:text-fuchsia-700"
            active-class="bg-white text-fuchsia-700 shadow-sm"
          >
            + Thêm
          </RouterLink>
        </div>
        </div>
      </div>

      <!-- Voice picker drawer -->
      <div v-if="showVoicePicker" class="border-t border-slate-200 bg-slate-50">
        <div class="mx-auto max-w-7xl px-4 lg:px-8 py-3 flex items-center gap-3 flex-wrap">
          <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Giọng đọc:</label>
          <select
            :value="currentVoice"
            class="text-sm px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:border-indigo-500 focus:outline-none font-medium min-w-[260px]"
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
            🔊 Nghe thử
          </button>
          <span class="text-xs text-slate-500">
            Mẹo: trên Edge tìm giọng có chữ <b>(Natural)</b> nghe tự nhiên nhất.
          </span>
        </div>
      </div>
    </nav>

    <RouterView />
  </div>
</template>
