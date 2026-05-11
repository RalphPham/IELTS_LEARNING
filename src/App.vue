<script setup lang="ts">
import { computed } from 'vue'
import { useVocabularyStore } from '@/stores/vocabulary'

const store = useVocabularyStore()
const dueCount = computed(() => store.dueCards.length)
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <nav class="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8 py-4">
        <RouterLink to="/" class="text-sm font-black uppercase tracking-[0.24em] text-indigo-700">
          📚 Vocab Notebook
        </RouterLink>
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
            to="/add"
            class="rounded-full px-4 py-1.5 transition hover:bg-white hover:text-fuchsia-700"
            active-class="bg-white text-fuchsia-700 shadow-sm"
          >
            + Thêm
          </RouterLink>
        </div>
      </div>
    </nav>

    <RouterView />
  </div>
</template>
