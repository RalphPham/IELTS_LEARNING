<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Vocabulary } from '@/types/vocabulary'
import { speak } from '@/utils/speech'
import { MASTERY_META, classify, renderStars } from '@/utils/mastery'

const props = defineProps<{ card: Vocabulary }>()
defineEmits<{ (e: 'edit', id: string): void; (e: 'delete', id: string): void }>()

const open = ref(false)
const level = computed(() => classify(props.card))
const meta = computed(() => MASTERY_META[level.value])
</script>

<template>
  <div class="border-b border-slate-100 last:border-b-0">
    <button
      class="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition flex items-center gap-3"
      @click="open = !open"
    >
      <span class="text-slate-400 text-xs w-3 shrink-0">{{ open ? '▼' : '▶' }}</span>
      <span
        class="text-[10px] font-bold tracking-tighter shrink-0 w-12 text-center"
        :class="meta.color"
        :title="meta.label"
      >{{ renderStars(level) }}</span>
      <span class="font-semibold text-slate-900 truncate flex-1 min-w-0">{{ card.word }}</span>
      <span v-if="card.pronunciation" class="hidden sm:inline text-xs text-slate-500 font-mono truncate max-w-[140px]">
        {{ card.pronunciation }}
      </span>
      <span class="hidden md:inline text-[10px] uppercase tracking-wider text-indigo-700 font-bold w-20 shrink-0">
        {{ card.partOfSpeech }}
      </span>
      <span class="text-sm text-slate-600 truncate flex-1 hidden md:inline min-w-0">{{ card.meaningVi }}</span>
      <span class="text-sm text-slate-600 truncate md:hidden">— {{ card.meaningVi }}</span>
      <button class="text-indigo-600 hover:text-indigo-800 shrink-0" @click.stop="speak(card.word)" title="Phát âm">🔊</button>
    </button>

    <div v-if="open" class="px-9 pb-4 pt-1 bg-slate-50/50 space-y-3">
      <p v-if="card.meaningEn" class="text-sm text-slate-600 leading-relaxed">
        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">EN</span>
        {{ card.meaningEn }}
      </p>

      <div v-if="card.examples.length">
        <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Ví dụ</p>
        <ul class="space-y-1">
          <li v-for="(ex, i) in card.examples" :key="i" class="text-sm italic text-slate-700 flex items-start gap-2">
            <button class="text-indigo-500 shrink-0 mt-0.5" @click="speak(ex)">▶</button>
            <span>{{ ex }}</span>
          </li>
        </ul>
      </div>

      <div v-if="card.collocations.length">
        <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Cụm hay đi kèm</p>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="(c, i) in card.collocations"
            :key="i"
            class="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200"
          >
            {{ c }}
          </span>
        </div>
      </div>

      <p v-if="card.notes" class="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        💡 {{ card.notes }}
      </p>

      <div class="flex gap-2 pt-1">
        <button class="text-xs px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50" @click="$emit('edit', card.id)">
          Sửa
        </button>
        <button class="text-xs px-3 py-1 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50" @click="$emit('delete', card.id)">
          Xóa
        </button>
        <span class="ml-auto text-[10px] text-slate-400 self-center">
          {{ card.day }} · Ôn {{ card.repetitions }}× · Tiếp {{ new Date(card.nextReviewDate).toLocaleDateString('vi-VN') }}
        </span>
      </div>
    </div>
  </div>
</template>
