<script setup lang="ts">
import { computed } from 'vue'
import { useVocabularyStore } from '@/stores/vocabulary'

const props = defineProps<{ day: string | null; topic: string | null }>()
const emit = defineEmits<{
  (e: 'update:day', v: string | null): void
  (e: 'update:topic', v: string | null): void
}>()

const store = useVocabularyStore()

const countByDay = computed(() => {
  const map: Record<string, number> = {}
  store.items.forEach((it) => (map[it.day] = (map[it.day] ?? 0) + 1))
  return map
})

const countByTopic = computed(() => {
  const map: Record<string, number> = {}
  store.items
    .filter((it) => (props.day === null ? true : it.day === props.day))
    .forEach((it) => (map[it.topic] = (map[it.topic] ?? 0) + 1))
  return map
})

const topicsInDay = computed(() => store.topicsForDay(props.day))

function selectDay(d: string | null) {
  emit('update:day', d)
  emit('update:topic', null)
}

function selectTopic(t: string | null) {
  emit('update:topic', t)
}
</script>

<template>
  <aside class="w-full lg:w-72 shrink-0">
    <div class="rounded-2xl bg-white shadow-sm border border-slate-200 p-4 sticky top-20">
      <h2 class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Buổi học</h2>
      <button
        class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition mb-1 flex items-center justify-between"
        :class="props.day === null ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-100'"
        @click="selectDay(null)"
      >
        <span>Tất cả buổi</span>
        <span class="text-xs opacity-75">{{ store.items.length }}</span>
      </button>
      <button
        v-for="d in store.days"
        :key="d"
        class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition mb-1 flex items-center justify-between"
        :class="props.day === d ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-100'"
        @click="selectDay(d)"
      >
        <span>{{ d }}</span>
        <span class="text-xs opacity-75">{{ countByDay[d] }}</span>
      </button>

      <div class="border-t border-slate-200 mt-4 pt-3">
        <h2 class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
          Chủ đề{{ props.day ? ` trong ${props.day}` : '' }}
        </h2>
        <button
          class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition mb-1 flex items-center justify-between"
          :class="props.topic === null ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'"
          @click="selectTopic(null)"
        >
          <span>Tất cả chủ đề</span>
        </button>
        <button
          v-for="t in topicsInDay"
          :key="t"
          class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition mb-1 flex items-start justify-between gap-2"
          :class="props.topic === t ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'"
          @click="selectTopic(t)"
        >
          <span class="line-clamp-2">{{ t }}</span>
          <span class="text-xs opacity-75 shrink-0">{{ countByTopic[t] }}</span>
        </button>
      </div>
    </div>
  </aside>
</template>
