<script setup lang="ts">
import { computed, ref } from 'vue'
import { useVocabularyStore } from '@/stores/vocabulary'
import { daysInWeek, weeksFrom, weekLabel, weekOfDay } from '@/utils/week'

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

// Days grouped under their week, in order
const weekGroups = computed(() =>
  weeksFrom(store.items).map((w) => ({
    week: w,
    label: weekLabel(w),
    days: daysInWeek(store.items, w),
    count: store.items.filter((it) => weekOfDay(it.day) === w).length,
  })),
)

// Collapsed weeks (collapsed by default to keep the sidebar short)
const collapsed = ref<Record<number, boolean>>({})
function toggleWeek(w: number) {
  collapsed.value[w] = !collapsed.value[w]
}
// A week starts expanded only if it contains the currently-selected day
function isOpen(w: number): boolean {
  if (collapsed.value[w] !== undefined) return !collapsed.value[w]
  return props.day !== null && weekOfDay(props.day) === w
}

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

      <div v-for="g in weekGroups" :key="g.week" class="mt-2">
        <button
          class="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition"
          @click="toggleWeek(g.week)"
        >
          <span class="text-amber-500 text-[10px]">{{ isOpen(g.week) ? '▼' : '▶' }}</span>
          <span class="text-[10px] font-bold uppercase tracking-widest text-amber-600">{{ g.label }}</span>
          <span class="text-[10px] text-slate-400 ml-auto">{{ g.count }} từ</span>
        </button>

        <template v-if="isOpen(g.week)">
          <button
            v-for="d in g.days"
            :key="d"
            class="w-full text-left pl-7 pr-3 py-2 rounded-lg text-sm font-medium transition mb-1 flex items-center justify-between"
            :class="props.day === d ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-100'"
            @click="selectDay(d)"
          >
            <span>{{ d }}</span>
            <span class="text-xs opacity-75">{{ countByDay[d] }}</span>
          </button>
          <RouterLink
            :to="`/week/${g.week}`"
            class="block ml-7 mr-0 mb-1 px-3 py-2 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition"
          >
            📅 Ôn tập {{ g.label }} — 4 kỹ năng
          </RouterLink>
        </template>
      </div>

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
