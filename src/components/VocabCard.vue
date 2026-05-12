<script setup lang="ts">
import { computed } from 'vue'
import type { Vocabulary } from '@/types/vocabulary'
import { speak } from '@/utils/speech'
import { MASTERY_META, classify, renderStars } from '@/utils/mastery'

const props = defineProps<{ card: Vocabulary }>()
defineEmits<{ (e: 'edit', id: string): void; (e: 'delete', id: string): void }>()

const level = computed(() => classify(props.card))
const meta = computed(() => MASTERY_META[level.value])
</script>

<template>
  <article class="rounded-2xl bg-white shadow-sm border border-slate-200 p-5 hover:shadow-md transition">
    <header class="flex items-start justify-between gap-3 mb-2">
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline gap-2 flex-wrap">
          <h3 class="text-xl font-bold text-slate-900">{{ card.word }}</h3>
          <button
            class="text-indigo-600 hover:text-indigo-800"
            title="Phát âm"
            @click="speak(card.word)"
          >
            🔊
          </button>
          <span class="text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
            {{ card.partOfSpeech }}
          </span>
        </div>
        <p v-if="card.pronunciation" class="text-sm text-slate-500 mt-0.5 font-mono">
          {{ card.pronunciation }}
        </p>
      </div>
      <div class="flex gap-1">
        <button
          class="text-xs px-2 py-1 rounded text-slate-600 hover:bg-slate-100"
          @click="$emit('edit', card.id)"
        >
          Sửa
        </button>
        <button
          class="text-xs px-2 py-1 rounded text-rose-600 hover:bg-rose-50"
          @click="$emit('delete', card.id)"
        >
          Xóa
        </button>
      </div>
    </header>

    <p class="text-slate-900 font-semibold">{{ card.meaningVi }}</p>
    <p v-if="card.meaningEn" class="text-sm text-slate-600 mt-1 leading-relaxed">
      <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">EN</span>
      {{ card.meaningEn }}
    </p>

    <div v-if="card.examples.length" class="mt-3">
      <p class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Ví dụ</p>
      <ul class="space-y-1">
        <li
          v-for="(ex, i) in card.examples"
          :key="i"
          class="text-sm text-slate-700 italic flex items-start gap-2"
        >
          <button class="text-indigo-500 hover:text-indigo-700 shrink-0 mt-0.5" @click="speak(ex)">▶</button>
          <span>{{ ex }}</span>
        </li>
      </ul>
    </div>

    <div v-if="card.collocations.length" class="mt-3">
      <p class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Cụm hay đi kèm</p>
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="(c, i) in card.collocations"
          :key="i"
          class="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200"
        >
          {{ c }}
        </span>
      </div>
    </div>

    <p v-if="card.notes" class="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
      💡 {{ card.notes }}
    </p>

    <footer class="mt-3 pt-3 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500 flex-wrap">
      <span
        class="px-2 py-0.5 rounded-full font-bold border"
        :class="[meta.bg, meta.color, meta.border]"
        :title="meta.label"
      >
        {{ renderStars(level) }} {{ meta.label }}
      </span>
      <span class="px-1.5 py-0.5 rounded bg-slate-100 font-medium">{{ card.day }}</span>
      <span>Ôn: {{ card.repetitions }}</span>
      <span class="ml-auto">Tiếp: {{ new Date(card.nextReviewDate).toLocaleDateString('vi-VN') }}</span>
    </footer>
  </article>
</template>
