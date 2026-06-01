<script setup lang="ts">
import { ref, watch } from 'vue'
import { lookupWord, addLookupToVocab, type DictLookup } from '@/utils/dictionary'
import { speak } from '@/utils/speech'

const props = defineProps<{
  word: string
  /** Optional surrounding sentence, saved as an example when user adds to vocab */
  context?: string
  /** Anchor position in viewport coordinates (px from top-left). */
  x: number
  y: number
}>()

const emit = defineEmits<{ close: [] }>()

const loading = ref(false)
const result = ref<DictLookup | null>(null)
const error = ref('')
const added = ref(false)

watch(
  () => props.word,
  async (w) => {
    if (!w) return
    loading.value = true
    error.value = ''
    result.value = null
    added.value = false
    try {
      const r = await lookupWord(w)
      if (!r) {
        error.value = 'Không tra được từ này (offline hoặc giới hạn API).'
      } else {
        result.value = r
        // If already in vocab, mark as "added" so the button is disabled
        if (r.source === 'vocab') added.value = true
      }
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)

function onPlay() {
  if (result.value) speak(result.value.word)
}

function onAdd() {
  if (!result.value || added.value) return
  addLookupToVocab(result.value, props.context)
  added.value = true
}
</script>

<template>
  <div
    class="fixed z-[60] -translate-x-1/2 -translate-y-full rounded-2xl bg-white border border-slate-200 shadow-xl p-3 w-64 max-w-[calc(100vw-16px)]"
    :style="{ left: x + 'px', top: y - 8 + 'px' }"
    @click.stop
  >
    <div class="flex items-start justify-between gap-2 mb-1.5">
      <div class="min-w-0 flex-1">
        <div class="text-base font-bold text-slate-900 truncate">{{ result?.word ?? word }}</div>
        <div v-if="result?.pronunciation" class="text-xs text-slate-500 font-mono">
          {{ result.pronunciation }}
        </div>
      </div>
      <button
        class="rounded-full p-1.5 hover:bg-slate-100 text-slate-500 shrink-0"
        @click="onPlay"
        title="Phát âm"
      >
        🔊
      </button>
      <button
        class="rounded-full p-1.5 hover:bg-slate-100 text-slate-400 shrink-0"
        @click="emit('close')"
        title="Đóng"
      >
        ✕
      </button>
    </div>

    <div v-if="loading" class="text-xs text-slate-500 italic py-1">Đang tra...</div>
    <div v-else-if="error" class="text-xs text-rose-600 py-1">{{ error }}</div>
    <div v-else-if="result" class="text-sm text-slate-800 leading-snug py-0.5">
      {{ result.meaningVi }}
    </div>

    <div v-if="result" class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
      <span class="text-[10px] uppercase tracking-wider font-bold"
        :class="{
          'text-emerald-600': result.source === 'vocab',
          'text-indigo-500': result.source === 'api',
          'text-slate-400': result.source === 'cache',
        }">
        <template v-if="result.source === 'vocab'">✓ Trong kho</template>
        <template v-else-if="result.source === 'cache'">Cache</template>
        <template v-else>Tra online</template>
      </span>
      <button
        v-if="result.source !== 'vocab'"
        class="text-xs px-2.5 py-1 rounded-lg bg-fuchsia-100 text-fuchsia-700 font-bold hover:bg-fuchsia-200 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="added"
        @click="onAdd"
      >
        {{ added ? '✓ Đã thêm' : '+ Vào kho' }}
      </button>
    </div>
  </div>

  <!-- Click-away backdrop -->
  <div class="fixed inset-0 z-[55]" @click="emit('close')"></div>
</template>
