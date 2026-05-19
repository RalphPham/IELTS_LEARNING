<script setup lang="ts">
import { computed } from 'vue'
import { TENSES } from '@/data/grammar/tenses'
import { QUESTIONS, questionsForTense } from '@/data/grammar/questions'
import { useGrammarStore } from '@/stores/grammar'
import type { TenseGroup } from '@/types/grammar'

const store = useGrammarStore()

const groups: { id: TenseGroup; label: string; color: string }[] = [
  { id: 'present', label: 'Hiện tại', color: 'from-indigo-500 to-violet-600' },
  { id: 'past', label: 'Quá khứ', color: 'from-rose-500 to-orange-500' },
  { id: 'future', label: 'Tương lai', color: 'from-emerald-500 to-teal-600' },
]

const tensesByGroup = computed(() => {
  return groups.map((g) => ({
    ...g,
    items: TENSES.filter((t) => t.group === g.id),
  }))
})

function stats(tenseId: string) {
  const p = store.getForTense(tenseId as never)
  const seedCount = questionsForTense(tenseId).length
  const userCount = store.userQuestions.filter((q) => q.tenseId === tenseId).length
  return { progress: p, count: seedCount + userCount, userCount }
}

function formatPct(n: number): string {
  return Math.round(n * 100) + '%'
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 lg:px-8 py-6">
    <div class="flex items-center justify-between mb-5 flex-wrap gap-3">
      <div>
        <h1 class="text-2xl font-bold">📐 Ngữ pháp — 12 thì</h1>
        <p class="text-sm text-slate-500 mt-1">
          Công thức · cách dùng · ví dụ đời thường · {{ QUESTIONS.length }} câu luyện tập
        </p>
      </div>
      <div class="flex gap-2 flex-wrap">
        <RouterLink
          to="/grammar/import"
          class="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition text-sm"
        >
          📥 Nhập câu hỏi
          <span v-if="store.userQuestionCount > 0" class="ml-1 text-xs text-indigo-600">
            ({{ store.userQuestionCount }})
          </span>
        </RouterLink>
        <RouterLink
          to="/grammar/mixed"
          class="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition text-sm"
        >
          🎯 Test tổng hợp
        </RouterLink>
      </div>
    </div>

    <div v-for="group in tensesByGroup" :key="group.id" class="mb-6">
      <div class="flex items-center gap-2 mb-3">
        <div class="h-1.5 w-10 rounded-full bg-gradient-to-r" :class="group.color"></div>
        <h2 class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ group.label }}</h2>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <RouterLink
          v-for="t in group.items"
          :key="t.id"
          :to="`/grammar/${t.id}`"
          class="block rounded-2xl bg-white border border-slate-200 p-4 hover:border-indigo-400 hover:shadow-md transition"
        >
          <div class="flex items-start justify-between gap-2 mb-2">
            <div class="text-2xl">{{ t.emoji }}</div>
            <span
              v-if="stats(t.id).progress"
              class="text-[10px] font-bold px-2 py-0.5 rounded-full"
              :class="
                stats(t.id).progress!.lastScore >= 0.8
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : stats(t.id).progress!.lastScore >= 0.5
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
              "
            >
              {{ formatPct(stats(t.id).progress!.lastScore) }}
            </span>
          </div>
          <h3 class="font-bold text-slate-900 leading-tight">{{ t.nameVi }}</h3>
          <p class="text-xs text-slate-500 mt-0.5">{{ t.name }}</p>
          <p class="font-mono text-[11px] text-slate-600 mt-3 leading-relaxed line-clamp-2">
            {{ t.formula.affirmative }}
          </p>
          <p class="text-[10px] text-slate-400 mt-2 uppercase tracking-wider">
            {{ stats(t.id).count }} câu
            <span v-if="stats(t.id).userCount > 0" class="text-indigo-500">
              (+{{ stats(t.id).userCount }} tự thêm)
            </span>
            <span v-if="stats(t.id).progress">· {{ stats(t.id).progress!.attempts }} lượt</span>
          </p>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
