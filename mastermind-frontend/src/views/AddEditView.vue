<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVocabularyStore } from '@/stores/vocabulary'
import type { PartOfSpeech } from '@/types/vocabulary'

const route = useRoute()
const router = useRouter()
const store = useVocabularyStore()

const editingId = computed(() => (route.params.id as string) || null)
const isEdit = computed(() => editingId.value !== null)

const word = ref('')
const pronunciation = ref('')
const partOfSpeech = ref<PartOfSpeech>('noun')
const meaningVi = ref('')
const meaningEn = ref('')
const day = ref('')
const newDay = ref('')
const topic = ref('')
const newTopic = ref('')
const examplesText = ref('')
const collocationsText = ref('')
const notes = ref('')
const audioUrl = ref('')

const partsOfSpeech: PartOfSpeech[] = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'phrase',
  'phrasal verb',
  'collocation',
  'idiom',
  'other',
]

function suggestNextDay(): string {
  if (store.days.length === 0) return 'Day 1'
  const nums = store.days.map((d) => parseInt(d.replace(/\D/g, ''), 10) || 0)
  return `Day ${Math.max(...nums) + 1}`
}

onMounted(() => {
  if (editingId.value) {
    const c = store.getById(editingId.value)
    if (c) {
      word.value = c.word
      pronunciation.value = c.pronunciation
      partOfSpeech.value = c.partOfSpeech
      meaningVi.value = c.meaningVi
      meaningEn.value = c.meaningEn
      day.value = c.day
      topic.value = c.topic
      examplesText.value = c.examples.join('\n')
      collocationsText.value = c.collocations.join('\n')
      notes.value = c.notes
      audioUrl.value = c.audioUrl
    }
  } else {
    day.value = store.days.length > 0 ? (store.days[store.days.length - 1] ?? '') : 'Day 1'
    if (store.topics.length > 0) topic.value = store.topics[0] ?? ''
  }
})

function save() {
  const finalDay = (newDay.value.trim() || day.value).trim()
  const finalTopic = (newTopic.value.trim() || topic.value).trim()
  if (!word.value.trim() || !meaningVi.value.trim() || !finalTopic || !finalDay) {
    alert('Vui lòng nhập từ, nghĩa, buổi học và chủ đề.')
    return
  }
  const payload = {
    word: word.value,
    pronunciation: pronunciation.value,
    partOfSpeech: partOfSpeech.value,
    meaningVi: meaningVi.value,
    meaningEn: meaningEn.value,
    day: finalDay,
    topic: finalTopic,
    examples: examplesText.value.split('\n').map((s) => s.trim()).filter(Boolean),
    collocations: collocationsText.value.split('\n').map((s) => s.trim()).filter(Boolean),
    notes: notes.value,
    audioUrl: audioUrl.value,
  }
  if (isEdit.value && editingId.value) {
    store.update(editingId.value, payload)
  } else {
    store.add(payload)
  }
  router.push('/')
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 lg:px-8 py-6">
    <h1 class="text-2xl font-bold mb-6">{{ isEdit ? 'Sửa từ vựng' : 'Thêm từ vựng' }}</h1>

    <div class="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 space-y-4">
      <div class="grid sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Từ *</label>
          <input v-model="word" type="text" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Phiên âm (IPA)</label>
          <input v-model="pronunciation" type="text" placeholder="/ˈeksɑːmpl/" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none font-mono" />
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Loại từ</label>
          <select v-model="partOfSpeech" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none">
            <option v-for="p in partsOfSpeech" :key="p" :value="p">{{ p }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Audio URL (tùy chọn)</label>
          <input v-model="audioUrl" type="text" placeholder="https://..." class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none" />
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Nghĩa tiếng Việt *</label>
        <input v-model="meaningVi" type="text" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none" />
      </div>

      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Định nghĩa tiếng Anh</label>
        <textarea v-model="meaningEn" rows="2" placeholder="An English definition of the word..." class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none"></textarea>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Buổi học có sẵn *</label>
          <select v-model="day" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none">
            <option v-for="d in store.days" :key="d" :value="d">{{ d }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Hoặc tạo buổi mới
            <button type="button" class="ml-2 text-indigo-600 hover:underline" @click="newDay = suggestNextDay()">gợi ý</button>
          </label>
          <input v-model="newDay" type="text" :placeholder="suggestNextDay()" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none" />
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Chủ đề có sẵn</label>
          <select v-model="topic" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none">
            <option v-for="t in store.topics" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Hoặc tạo chủ đề mới</label>
          <input v-model="newTopic" type="text" placeholder="Tên chủ đề mới..." class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none" />
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Ví dụ (mỗi dòng 1 câu)</label>
        <textarea v-model="examplesText" rows="5" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none"></textarea>
      </div>

      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Cụm/Collocations (mỗi dòng 1 cụm)</label>
        <textarea v-model="collocationsText" rows="4" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none"></textarea>
      </div>

      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Ghi chú</label>
        <textarea v-model="notes" rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none"></textarea>
      </div>

      <div class="flex gap-2 pt-2">
        <button class="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700" @click="save">
          {{ isEdit ? 'Cập nhật' : 'Lưu' }}
        </button>
        <RouterLink to="/" class="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200">
          Hủy
        </RouterLink>
      </div>
    </div>
  </div>
</template>
