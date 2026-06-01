<script setup lang="ts">
import { computed, ref } from 'vue'
import WordPopover from './WordPopover.vue'

const props = defineProps<{
  text: string
  /** Show a subtle dotted underline on each clickable word as a hint. */
  hint?: boolean
}>()

// Split text into tokens: words (a-z'-) vs everything else (kept verbatim as separators)
type Token = { type: 'word' | 'sep'; text: string }
const tokens = computed<Token[]>(() => {
  const out: Token[] = []
  const re = /([A-Za-z][A-Za-z'-]*)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(props.text)) !== null) {
    if (m.index > last) out.push({ type: 'sep', text: props.text.slice(last, m.index) })
    out.push({ type: 'word', text: m[0] })
    last = m.index + m[0].length
  }
  if (last < props.text.length) out.push({ type: 'sep', text: props.text.slice(last) })
  return out
})

const active = ref<{ word: string; x: number; y: number } | null>(null)

function onWordClick(e: MouseEvent, word: string) {
  e.stopPropagation()
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  active.value = {
    word,
    x: rect.left + rect.width / 2,
    y: rect.top,
  }
}
</script>

<template>
  <span class="clickable-text">
    <template v-for="(t, i) in tokens" :key="i">
      <span
        v-if="t.type === 'word'"
        class="cursor-pointer hover:bg-yellow-100 rounded px-0.5 transition"
        :class="hint ? 'decoration-dotted decoration-slate-300 underline-offset-2 underline' : ''"
        @click="onWordClick($event, t.text)"
      >{{ t.text }}</span><template v-else>{{ t.text }}</template>
    </template>

    <Teleport to="body">
      <WordPopover
        v-if="active"
        :word="active.word"
        :context="text"
        :x="active.x"
        :y="active.y"
        @close="active = null"
      />
    </Teleport>
  </span>
</template>
