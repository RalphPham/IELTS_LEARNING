<script setup lang="ts">
import { useSkillsStore } from '@/stores/skills'

const skills = useSkillsStore()
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 lg:px-8 py-6">
    <h1 class="text-2xl font-bold mb-1">🗣️ Luyện kỹ năng</h1>
    <p class="text-sm text-slate-500 mb-5">Nghe & Nói ở mức câu — dùng audio thật và micro của bạn.</p>

    <div class="grid sm:grid-cols-2 gap-4">
      <RouterLink
        to="/skills/dictation"
        class="block rounded-2xl bg-white border border-slate-200 p-6 hover:border-indigo-400 hover:shadow-md transition"
      >
        <div class="text-4xl mb-2">🎧</div>
        <h2 class="font-bold text-slate-900">Dictation Studio</h2>
        <p class="text-xs text-slate-500 mt-1 leading-relaxed">
          Dán transcript (vd từ YouTube), nghe → chép → app bôi đỏ chỗ sót (âm nối, đuôi từ).
        </p>
        <p class="text-[10px] uppercase tracking-wider text-indigo-500 font-bold mt-3">
          {{ skills.dictationCount }} bài đã làm
          <span v-if="skills.dictationCount > 0">· TB {{ Math.round(skills.avgDictationAccuracy * 100) }}%</span>
        </p>
      </RouterLink>

      <RouterLink
        to="/skills/speaking"
        class="block rounded-2xl bg-white border border-slate-200 p-6 hover:border-indigo-400 hover:shadow-md transition"
      >
        <div class="text-4xl mb-2">🎙️</div>
        <h2 class="font-bold text-slate-900">Speaking Studio</h2>
        <p class="text-xs text-slate-500 mt-1 leading-relaxed">
          Đề IELTS Part 1/2 · timer 1 phút · ghi âm · tự đếm "will/going to" · nghe lại & tự chấm.
        </p>
        <p class="text-[10px] uppercase tracking-wider text-indigo-500 font-bold mt-3">
          {{ skills.speakingCount }} phiên nói
        </p>
      </RouterLink>
    </div>

    <!-- Missed words summary -->
    <section v-if="skills.topMissedWords.length" class="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 mt-5">
      <h2 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Âm/từ bạn hay sót khi nghe</h2>
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="m in skills.topMissedWords"
          :key="m.word"
          class="text-xs px-2 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200"
        >
          {{ m.word }} <span class="opacity-60">×{{ m.count }}</span>
        </span>
      </div>
    </section>

    <RouterLink to="/" class="block text-center text-sm text-slate-500 hover:text-indigo-700 mt-5">
      ← Về danh sách
    </RouterLink>
  </div>
</template>
