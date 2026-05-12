<script setup lang="ts">
import { computed } from 'vue'
import type { Vocabulary } from '@/types/vocabulary'
import { MASTERY_LEVELS, MASTERY_META, countByMastery, renderStars } from '@/utils/mastery'

const props = defineProps<{ cards: Vocabulary[] }>()

const counts = computed(() => countByMastery(props.cards))
const total = computed(() => props.cards.length)

function pct(n: number) {
  if (total.value === 0) return 0
  return (n / total.value) * 100
}
</script>

<template>
  <div>
    <!-- Stacked progress bar -->
    <div class="flex h-2.5 rounded-full overflow-hidden bg-slate-100 mb-3">
      <div
        v-for="lvl in MASTERY_LEVELS"
        :key="lvl"
        :class="MASTERY_META[lvl].barBg"
        :style="{ width: pct(counts[lvl]) + '%' }"
        class="transition-all"
      ></div>
    </div>

    <!-- 5 level columns -->
    <div class="grid grid-cols-5 gap-1.5 sm:gap-2">
      <div
        v-for="lvl in MASTERY_LEVELS"
        :key="lvl"
        class="rounded-xl border p-2 sm:p-3 text-center"
        :class="[MASTERY_META[lvl].bg, MASTERY_META[lvl].border]"
      >
        <div class="text-[10px] sm:text-xs font-bold tracking-wide" :class="MASTERY_META[lvl].color">
          {{ renderStars(lvl) }}
        </div>
        <div class="text-xl sm:text-2xl font-bold mt-0.5" :class="MASTERY_META[lvl].color">
          {{ counts[lvl] }}
        </div>
        <div class="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold mt-0.5" :class="MASTERY_META[lvl].color">
          {{ MASTERY_META[lvl].label }}
        </div>
      </div>
    </div>
  </div>
</template>
