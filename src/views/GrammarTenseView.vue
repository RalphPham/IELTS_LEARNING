<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { findTense } from '@/data/grammar/tenses'
import { questionsForTense } from '@/data/grammar/questions'
import { useGrammarStore } from '@/stores/grammar'
import { speak } from '@/utils/speech'

const route = useRoute()
const store = useGrammarStore()

const tense = computed(() => {
  const id = route.params.id as string
  return findTense(id) ?? null
})

const seedCount = computed(() =>
  tense.value ? questionsForTense(tense.value.id).length : 0,
)
const userCount = computed(() =>
  tense.value ? store.userQuestions.filter((q) => q.tenseId === tense.value!.id).length : 0,
)
const questionCount = computed(() => seedCount.value + userCount.value)

const progress = computed(() => (tense.value ? store.getForTense(tense.value.id) : null))
</script>

<template>
  <div v-if="tense" class="mx-auto max-w-3xl px-4 lg:px-8 py-6">
    <RouterLink to="/grammar" class="text-sm text-slate-500 hover:text-indigo-700 mb-4 inline-block">
      ← Về danh sách thì
    </RouterLink>

    <header class="mb-6">
      <div class="flex items-center gap-3">
        <div class="text-4xl">{{ tense.emoji }}</div>
        <div>
          <h1 class="text-2xl font-bold text-slate-900">{{ tense.nameVi }}</h1>
          <p class="text-sm text-slate-500">{{ tense.name }}</p>
        </div>
      </div>
    </header>

    <!-- Công thức -->
    <section class="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 mb-5">
      <h2 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Công thức</h2>
      <div class="space-y-2.5">
        <div class="flex items-start gap-3">
          <span class="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-bold">+</span>
          <p class="font-mono text-sm text-slate-800 mt-1">{{ tense.formula.affirmative }}</p>
        </div>
        <div class="flex items-start gap-3">
          <span class="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-lg bg-rose-100 text-rose-700 font-bold">−</span>
          <p class="font-mono text-sm text-slate-800 mt-1">{{ tense.formula.negative }}</p>
        </div>
        <div class="flex items-start gap-3">
          <span class="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-lg bg-sky-100 text-sky-700 font-bold">?</span>
          <p class="font-mono text-sm text-slate-800 mt-1">{{ tense.formula.question }}</p>
        </div>
      </div>
    </section>

    <!-- Signal words -->
    <section v-if="tense.signalWords.length" class="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 mb-5">
      <h2 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Dấu hiệu nhận biết</h2>
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="w in tense.signalWords"
          :key="w"
          class="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 font-medium"
        >
          {{ w }}
        </span>
      </div>
    </section>

    <!-- Cách dùng + ví dụ -->
    <section class="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 mb-5">
      <h2 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Cách dùng</h2>
      <ol class="space-y-5">
        <li v-for="(u, i) in tense.usages" :key="i">
          <div class="flex items-start gap-3 mb-2">
            <span class="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold">{{ i + 1 }}</span>
            <p class="font-semibold text-slate-800 leading-relaxed">{{ u.description }}</p>
          </div>
          <ul class="space-y-1.5 ml-10">
            <li
              v-for="(ex, j) in u.examples"
              :key="j"
              class="text-sm text-slate-700 italic flex items-start gap-2"
            >
              <button class="text-indigo-500 hover:text-indigo-700 shrink-0 mt-0.5" @click="speak(ex)" title="Phát âm">▶</button>
              <span>{{ ex }}</span>
            </li>
          </ul>
        </li>
      </ol>
    </section>

    <p v-if="tense.notes" class="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 mb-5">
      💡 <span class="font-semibold">Lưu ý:</span> {{ tense.notes }}
    </p>

    <!-- Stats + CTA -->
    <section class="rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg p-5">
      <p class="text-xs uppercase tracking-widest font-bold opacity-80">Sẵn sàng luyện tập</p>
      <div class="flex items-end gap-2 mt-1">
        <span class="text-4xl font-black">{{ questionCount }}</span>
        <span class="text-sm opacity-90 pb-1.5">câu</span>
      </div>
      <p v-if="userCount > 0" class="text-xs opacity-90 mt-1">
        Bao gồm <strong>{{ userCount }}</strong> câu bạn tự thêm
      </p>
      <p v-if="progress" class="text-xs opacity-90 mt-2">
        Đã làm {{ progress.attempts }} lượt · điểm gần nhất: {{ Math.round(progress.lastScore * 100) }}%
        · {{ progress.wrongIds.length }} câu cần ôn lại
      </p>
      <div class="flex flex-wrap gap-2 mt-4">
        <RouterLink
          :to="`/grammar/${tense.id}/practice`"
          class="px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition"
        >
          Bắt đầu luyện
        </RouterLink>
        <RouterLink
          v-if="progress && progress.wrongIds.length > 0"
          :to="`/grammar/${tense.id}/practice?wrong=1`"
          class="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 font-bold transition"
        >
          Làm lại câu sai ({{ progress.wrongIds.length }})
        </RouterLink>
        <RouterLink
          to="/grammar/import"
          class="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 font-bold transition"
        >
          + Thêm câu hỏi
        </RouterLink>
      </div>
    </section>
  </div>

  <div v-else class="mx-auto max-w-2xl px-4 py-12 text-center text-slate-500">
    Không tìm thấy thì này.
    <RouterLink to="/grammar" class="block mt-3 text-indigo-700 hover:underline">← Về danh sách thì</RouterLink>
  </div>
</template>
