<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { findSpecialTopic } from '@/data/grammar/specialTopics'
import { questionsForTense } from '@/data/grammar/questions'
import { useGrammarStore } from '@/stores/grammar'
import { speak } from '@/utils/speech'
import type { TenseId } from '@/types/grammar'

const route = useRoute()
const store = useGrammarStore()

const topicId = computed(() => route.params.topicId as string)
const topic = computed(() => findSpecialTopic(topicId.value))

const seedCount = computed(() => (topic.value ? questionsForTense(topic.value.id).length : 0))
const userCount = computed(() =>
  topic.value ? store.userQuestions.filter((q) => q.tenseId === topic.value!.id).length : 0,
)
const total = computed(() => seedCount.value + userCount.value)
const progress = computed(() =>
  topic.value ? store.getForTense(topic.value.id as TenseId) : null,
)
</script>

<template>
  <div v-if="topic" class="mx-auto max-w-3xl px-4 lg:px-8 py-6">
    <RouterLink to="/grammar" class="text-sm text-slate-500 hover:text-indigo-700 mb-4 inline-block">
      ← Về danh sách thì
    </RouterLink>

    <header class="mb-5">
      <div class="flex items-center gap-3">
        <div class="text-4xl">{{ topic.emoji }}</div>
        <div>
          <h1 class="text-2xl font-bold text-slate-900">{{ topic.nameVi }}</h1>
          <p class="text-sm text-slate-500">{{ topic.name }}</p>
        </div>
      </div>
      <p class="text-sm text-slate-600 leading-relaxed mt-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
        {{ topic.intro }}
      </p>
    </header>

    <section
      v-for="rule in topic.rules"
      :key="rule.conjunction"
      class="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 mb-4"
    >
      <div class="flex items-baseline gap-2 mb-3 flex-wrap">
        <h2 class="text-base font-black text-indigo-700 uppercase tracking-wide">{{ rule.conjunction }}</h2>
        <span class="text-sm text-slate-500">— {{ rule.meaningVi }}</span>
      </div>
      <ol class="space-y-4">
        <li v-for="(p, i) in rule.patterns" :key="i" class="border-l-2 border-indigo-100 pl-3">
          <p class="text-sm font-semibold text-slate-800">{{ i + 1 }}. {{ p.situation }}</p>
          <p class="font-mono text-[12px] text-indigo-800 bg-indigo-50 rounded-lg px-3 py-2 mt-1.5">
            {{ p.pattern }}
          </p>
          <p class="text-sm text-slate-700 italic flex items-start gap-2 mt-1.5">
            <button class="text-indigo-500 hover:text-indigo-700 shrink-0 mt-0.5" @click="speak(p.example)" title="Phát âm">▶</button>
            <span>{{ p.example }}</span>
          </p>
        </li>
      </ol>
    </section>

    <section class="rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg p-5">
      <p class="text-xs uppercase tracking-widest font-bold opacity-80">Sẵn sàng luyện tập</p>
      <div class="flex items-end gap-2 mt-1">
        <span class="text-4xl font-black">{{ total }}</span>
        <span class="text-sm opacity-90 pb-1.5">câu</span>
      </div>
      <p v-if="userCount > 0" class="text-xs opacity-90 mt-1">Bao gồm {{ userCount }} câu bạn tự thêm</p>
      <p v-if="progress" class="text-xs opacity-90 mt-2">
        Đã làm {{ progress.attempts }} lượt · điểm gần nhất: {{ Math.round(progress.lastScore * 100) }}%
        · {{ progress.wrongIds.length }} câu cần ôn lại
      </p>
      <div class="flex flex-wrap gap-2 mt-4">
        <RouterLink
          :to="`/grammar/topic/${topic.id}/practice`"
          class="px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition"
        >
          Bắt đầu luyện
        </RouterLink>
        <RouterLink
          v-if="progress && progress.wrongIds.length > 0"
          :to="`/grammar/topic/${topic.id}/practice?wrong=1`"
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
    Không tìm thấy chủ đề này.
    <RouterLink to="/grammar" class="block mt-3 text-indigo-700 hover:underline">← Về danh sách thì</RouterLink>
  </div>
</template>
