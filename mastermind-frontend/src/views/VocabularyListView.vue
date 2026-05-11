<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useVocabularyStore } from '@/stores/vocabulary'
import TopicSidebar from '@/components/TopicSidebar.vue'
import VocabCard from '@/components/VocabCard.vue'
import VocabRow from '@/components/VocabRow.vue'

const store = useVocabularyStore()
const router = useRouter()

const selectedDay = ref<string | null>(null)
const selectedTopic = ref<string | null>(null)
const search = ref('')
const viewMode = ref<'compact' | 'detailed'>('compact')
const collapsedTopics = ref<Record<string, boolean>>({})

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return store.items
    .filter((it) => (selectedDay.value === null ? true : it.day === selectedDay.value))
    .filter((it) => (selectedTopic.value === null ? true : it.topic === selectedTopic.value))
    .filter((it) => {
      if (!q) return true
      return (
        it.word.toLowerCase().includes(q) ||
        it.meaningVi.toLowerCase().includes(q) ||
        it.meaningEn.toLowerCase().includes(q) ||
        it.collocations.some((c) => c.toLowerCase().includes(q))
      )
    })
    .sort((a, b) => a.word.localeCompare(b.word))
})

const grouped = computed(() => {
  const map: Record<string, typeof filtered.value> = {}
  filtered.value.forEach((it) => {
    ;(map[it.topic] ??= []).push(it)
  })
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
})

function toggleGroup(topic: string) {
  collapsedTopics.value[topic] = !collapsedTopics.value[topic]
}

function collapseAll() {
  grouped.value.forEach(([t]) => (collapsedTopics.value[t] = true))
}
function expandAll() {
  collapsedTopics.value = {}
}

function onEdit(id: string) {
  router.push({ name: 'edit', params: { id } })
}

function onDelete(id: string) {
  if (confirm('Xóa từ này khỏi danh sách?')) store.remove(id)
}

function exportData() {
  const blob = new Blob([store.exportJson()], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `vocabulary-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importData(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      store.importJson(reader.result as string)
      alert('Nhập dữ liệu thành công.')
    } catch {
      alert('File không hợp lệ.')
    }
  }
  reader.readAsText(file)
}

function resetData() {
  if (confirm('Reset toàn bộ về dữ liệu gốc? Mọi tiến trình ôn tập sẽ bị mất.')) {
    store.resetToSeed()
  }
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 lg:px-8 py-6">
    <div class="flex flex-col lg:flex-row gap-6">
      <TopicSidebar v-model:day="selectedDay" v-model:topic="selectedTopic" />

      <main class="flex-1 min-w-0">
        <div class="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            v-model="search"
            type="text"
            placeholder="Tìm từ, nghĩa, collocation..."
            class="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <RouterLink
            to="/add"
            class="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 text-center"
          >
            + Thêm từ
          </RouterLink>
        </div>

        <div class="flex flex-wrap items-center gap-2 mb-4 text-xs">
          <!-- View mode toggle -->
          <div class="flex rounded-lg bg-slate-100 p-0.5 font-semibold">
            <button
              class="px-3 py-1.5 rounded-md transition"
              :class="viewMode === 'compact' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
              @click="viewMode = 'compact'"
            >
              ☰ Gọn
            </button>
            <button
              class="px-3 py-1.5 rounded-md transition"
              :class="viewMode === 'detailed' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
              @click="viewMode = 'detailed'"
            >
              ▦ Đầy đủ
            </button>
          </div>

          <button class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50" @click="collapseAll">
            Thu gọn nhóm
          </button>
          <button class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50" @click="expandAll">
            Mở nhóm
          </button>

          <span class="mx-1 text-slate-300">|</span>

          <button class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50" @click="exportData">
            ⬇ Export
          </button>
          <label class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer">
            ⬆ Import
            <input type="file" accept="application/json" class="hidden" @change="importData" />
          </label>
          <button class="px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50" @click="resetData">
            ↺ Reset
          </button>
          <span class="ml-auto px-3 py-1.5 text-slate-500 font-medium">
            {{ filtered.length }} / {{ store.items.length }} từ
          </span>
        </div>

        <div v-if="filtered.length === 0" class="text-center py-16 text-slate-500">
          Không có từ nào. Thêm từ mới để bắt đầu.
        </div>

        <!-- Grouped by topic -->
        <div v-else class="space-y-4">
          <section
            v-for="[topicName, cards] in grouped"
            :key="topicName"
            class="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden"
          >
            <button
              class="w-full px-4 py-3 flex items-center gap-3 bg-slate-50 hover:bg-slate-100 border-b border-slate-200 transition text-left"
              @click="toggleGroup(topicName)"
            >
              <span class="text-slate-400 text-xs">{{ collapsedTopics[topicName] ? '▶' : '▼' }}</span>
              <h3 class="font-bold text-slate-800 flex-1 truncate">{{ topicName }}</h3>
              <span class="text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full">
                {{ cards.length }}
              </span>
            </button>

            <div v-if="!collapsedTopics[topicName]">
              <!-- Compact rows -->
              <div v-if="viewMode === 'compact'">
                <VocabRow
                  v-for="card in cards"
                  :key="card.id"
                  :card="card"
                  @edit="onEdit"
                  @delete="onDelete"
                />
              </div>
              <!-- Detailed grid -->
              <div v-else class="grid gap-3 md:grid-cols-2 p-3">
                <VocabCard
                  v-for="card in cards"
                  :key="card.id"
                  :card="card"
                  @edit="onEdit"
                  @delete="onDelete"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>
