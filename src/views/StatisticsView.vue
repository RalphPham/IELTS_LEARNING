<script setup lang="ts">
import { computed, ref } from 'vue'
import { useVocabularyStore } from '@/stores/vocabulary'
import { useGrammarStore } from '@/stores/grammar'
import { useActivityStore } from '@/stores/activity'
import MasteryStats from '@/components/MasteryStats.vue'
import { TENSES } from '@/data/grammar/tenses'
import { questionsForTense } from '@/data/grammar/questions'
import { weeksFrom, weekLabel, itemsInWeek } from '@/utils/week'
import { countByMastery, MASTERY_META } from '@/utils/mastery'
import { buildBackupJson, restoreBackupJson, downloadJsonFile } from '@/utils/backup'
import { useSyncStore } from '@/stores/sync'

const vocab = useVocabularyStore()
const grammar = useGrammarStore()
const activity = useActivityStore()
const sync = useSyncStore()

// ===== Sync UI state =====
const tokenInput = ref('')
const showHelp = ref(false)
const probing = ref<{ gistId: string | null } | null>(null)
const conflictDialog = ref<{ token: string; gistId: string } | null>(null)

async function onConnect() {
  if (!tokenInput.value.trim()) return
  try {
    const r = await sync.probeToken(tokenInput.value)
    if (r.existingGistId) {
      // Ask user how to merge
      conflictDialog.value = { token: tokenInput.value, gistId: r.existingGistId }
    } else {
      await sync.commitConnect(tokenInput.value, null, 'create')
      tokenInput.value = ''
    }
  } catch {
    // error shown via sync.errorMessage
  }
}

async function resolveConflict(mode: 'pull' | 'push') {
  if (!conflictDialog.value) return
  const { token, gistId } = conflictDialog.value
  try {
    await sync.commitConnect(token, gistId, mode)
    tokenInput.value = ''
    conflictDialog.value = null
  } catch {
    // error shown
  }
}

function timeAgo(iso: string | null): string {
  if (!iso) return 'chưa bao giờ'
  const diff = Date.now() - new Date(iso).getTime()
  const sec = Math.round(diff / 1000)
  if (sec < 60) return `${sec}s trước`
  const min = Math.round(sec / 60)
  if (min < 60) return `${min} phút trước`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr} giờ trước`
  return new Date(iso).toLocaleString('vi-VN')
}

const PAT_URL = 'https://github.com/settings/tokens/new?description=IELTS%20Vocab%20Sync&scopes=gist'

const restoreMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null)

function exportAll() {
  const json = buildBackupJson(vocab, grammar, activity)
  const date = new Date().toISOString().slice(0, 10)
  downloadJsonFile(json, `ielts-vocab-backup-${date}.json`)
}

function onRestoreFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!confirm('Khôi phục sẽ THAY THẾ toàn bộ dữ liệu hiện tại. Tiếp tục?')) {
    ;(e.target as HTMLInputElement).value = ''
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const r = restoreBackupJson(reader.result as string, vocab, grammar, activity)
      restoreMessage.value = {
        type: 'success',
        text: `✓ Khôi phục thành công: ${r.vocabCount} từ, ${r.grammarUserCount} câu hỏi tự thêm, ${r.days} ngày học.`,
      }
    } catch (err) {
      restoreMessage.value = {
        type: 'error',
        text: 'File không hợp lệ. Vui lòng chọn file backup đã export từ app.',
      }
    }
  }
  reader.readAsText(file)
  ;(e.target as HTMLInputElement).value = ''
}

// Heatmap of last 30 days
const last30 = computed(() => activity.lastNDays(30))

// Grammar summary across all topics
const grammarSummary = computed(() => {
  const topics: { id: string; nameVi: string; emoji: string; attempts: number; accuracy: number; questionCount: number }[] = []
  for (const t of TENSES) {
    const p = grammar.getForTense(t.id)
    topics.push({
      id: t.id,
      nameVi: t.nameVi,
      emoji: t.emoji,
      attempts: p?.attempts ?? 0,
      accuracy: p?.lastScore ?? 0,
      questionCount: questionsForTense(t.id).length,
    })
  }
  // Sequencing
  const seq = grammar.getForTense('sequencing')
  topics.push({
    id: 'sequencing',
    nameVi: 'Sự phối thì',
    emoji: '🔗',
    attempts: seq?.attempts ?? 0,
    accuracy: seq?.lastScore ?? 0,
    questionCount: questionsForTense('sequencing').length,
  })
  return topics
})

const totalGrammarAttempts = computed(() =>
  grammarSummary.value.reduce((sum, t) => sum + t.attempts, 0),
)
const totalGrammarAnswered = computed(() =>
  Object.values(grammar.progress).reduce((sum, p) => sum + (p?.totalAnswered ?? 0), 0),
)
const totalGrammarCorrect = computed(() =>
  Object.values(grammar.progress).reduce((sum, p) => sum + (p?.totalCorrect ?? 0), 0),
)
const grammarAccuracy = computed(() =>
  totalGrammarAnswered.value === 0
    ? 0
    : Math.round((totalGrammarCorrect.value / totalGrammarAnswered.value) * 100),
)

// Weeks breakdown
const weeks = computed(() =>
  weeksFrom(vocab.items).map((w) => {
    const cards = itemsInWeek(vocab.items, w)
    const c = countByMastery(cards)
    return {
      week: w,
      label: weekLabel(w),
      total: cards.length,
      counts: c,
      masteryPct: cards.length === 0 ? 0 : Math.round(((c[5] + c[4]) / cards.length) * 100),
    }
  }),
)

const totalVocab = computed(() => vocab.items.length)
const counts = computed(() => countByMastery(vocab.items))
const masteryPct = computed(() =>
  totalVocab.value === 0 ? 0 : Math.round(((counts.value[5] + counts.value[4]) / totalVocab.value) * 100),
)

function streakEmoji(n: number): string {
  if (n >= 30) return '🔥🔥🔥'
  if (n >= 14) return '🔥🔥'
  if (n >= 3) return '🔥'
  return '✨'
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 lg:px-8 py-6">
    <h1 class="text-2xl font-bold mb-1">📊 Thống kê</h1>
    <p class="text-sm text-slate-500 mb-4">
      Hành trình học của bạn — tất cả lưu trong trình duyệt.
    </p>

    <!-- ===== Backup all ===== -->
    <section class="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-5 mb-5">
      <h2 class="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-1">
        🛡️ Sao lưu toàn bộ
      </h2>
      <p class="text-xs text-slate-600 mb-3 leading-relaxed">
        Gộp tất cả: từ vựng + SRS, câu ngữ pháp tự thêm, tiến trình ngữ pháp, lịch học (streak)
        — vào 1 file JSON. Lưu lên Drive/Zalo là an toàn dù máy có gì cũng khôi phục được.
      </p>
      <div class="flex flex-wrap gap-2">
        <button
          class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition"
          @click="exportAll"
        >
          ⬇ Tải file backup
        </button>
        <label class="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-700 font-bold text-sm hover:bg-emerald-50 cursor-pointer transition">
          ⬆ Khôi phục từ file
          <input type="file" accept="application/json" class="hidden" @change="onRestoreFile" />
        </label>
      </div>
      <p
        v-if="restoreMessage"
        class="mt-3 text-sm rounded-lg px-3 py-2 border"
        :class="restoreMessage.type === 'success'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
          : 'bg-rose-50 border-rose-200 text-rose-700'"
      >
        {{ restoreMessage.text }}
      </p>
    </section>

    <!-- ===== GitHub Gist Sync ===== -->
    <section class="rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-200 p-5 mb-5">
      <div class="flex items-center justify-between mb-1 flex-wrap gap-2">
        <h2 class="text-xs font-bold uppercase tracking-widest text-violet-700">
          🔄 Đồng bộ tự động (GitHub Gist)
        </h2>
        <span
          v-if="sync.isConnected"
          class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
          :class="sync.status === 'syncing'
            ? 'bg-amber-100 text-amber-700'
            : sync.status === 'error'
              ? 'bg-rose-100 text-rose-700'
              : 'bg-emerald-100 text-emerald-700'"
        >
          {{ sync.status === 'syncing' ? '⏳ Đang đồng bộ' : sync.status === 'error' ? '✗ Lỗi' : '✓ Đã kết nối' }}
        </span>
      </div>

      <!-- Not connected -->
      <div v-if="!sync.isConnected && !conflictDialog">
        <p class="text-xs text-slate-600 mb-3 leading-relaxed">
          Lưu dữ liệu lên 1 Gist riêng tư trên GitHub của bạn. Sau khi kết nối, app
          tự đẩy lên sau mỗi thay đổi và bạn kéo về ở thiết bị khác bằng cùng token.
          <button class="underline text-violet-700" @click="showHelp = !showHelp">
            {{ showHelp ? 'Ẩn hướng dẫn' : 'Xem hướng dẫn lấy token' }}
          </button>
        </p>

        <div
          v-if="showHelp"
          class="text-xs text-slate-700 bg-white border border-violet-200 rounded-lg p-3 mb-3 space-y-1"
        >
          <p><b>1.</b> Mở <a :href="PAT_URL" target="_blank" rel="noopener" class="text-violet-700 underline">trang tạo token này</a> (đã pre-fill tên + scope).</p>
          <p><b>2.</b> Chọn Expiration (nên 1 năm hoặc "No expiration"), giữ nguyên scope <code class="px-1 bg-slate-100 rounded">gist</code> đã tick sẵn.</p>
          <p><b>3.</b> Bấm <b>Generate token</b> → copy token bắt đầu bằng <code class="px-1 bg-slate-100 rounded">ghp_</code>.</p>
          <p><b>4.</b> Paste vào ô bên dưới và bấm Kết nối.</p>
          <p class="text-slate-500 pt-1">Token chỉ lưu trong trình duyệt máy bạn, không gửi đi đâu khác ngoài GitHub.</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-2">
          <input
            v-model="tokenInput"
            type="password"
            placeholder="ghp_..."
            class="flex-1 px-3 py-2 rounded-xl border border-slate-300 focus:border-violet-500 focus:outline-none font-mono text-sm"
            @keydown.enter.prevent="onConnect"
          />
          <button
            class="px-4 py-2 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 transition disabled:opacity-50"
            :disabled="!tokenInput.trim() || sync.status === 'connecting' || sync.status === 'syncing'"
            @click="onConnect"
          >
            {{ sync.status === 'connecting' ? 'Đang kết nối...' : 'Kết nối' }}
          </button>
        </div>
        <p v-if="sync.errorMessage" class="mt-2 text-xs text-rose-700">{{ sync.errorMessage }}</p>
      </div>

      <!-- Conflict dialog: existing gist found -->
      <div v-else-if="conflictDialog" class="bg-white border border-amber-300 rounded-xl p-3">
        <p class="text-sm font-semibold text-amber-800 mb-2">
          ⚠️ Đã có dữ liệu cloud trên Gist trước đó. Bạn muốn:
        </p>
        <div class="flex flex-col gap-2">
          <button
            class="px-3 py-2 rounded-lg bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700"
            :disabled="sync.status === 'syncing'"
            @click="resolveConflict('pull')"
          >
            ⬇ Kéo dữ liệu cloud về (thay thế local — dùng khi máy này mới)
          </button>
          <button
            class="px-3 py-2 rounded-lg bg-rose-600 text-white font-bold text-sm hover:bg-rose-700"
            :disabled="sync.status === 'syncing'"
            @click="resolveConflict('push')"
          >
            ⬆ Đẩy local lên (ghi đè cloud — dùng khi local là bản chuẩn)
          </button>
          <button
            class="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200"
            @click="conflictDialog = null"
          >
            Hủy
          </button>
        </div>
      </div>

      <!-- Connected -->
      <div v-else>
        <p class="text-sm text-slate-700 mb-2">
          Lần đồng bộ cuối:
          <span class="font-bold">{{ timeAgo(sync.lastSyncedAt) }}</span>
        </p>
        <p class="text-[11px] text-slate-500 mb-3">
          Tự động đẩy lên 3 giây sau khi bạn thay đổi gì đó. Mở app trên thiết bị khác, dùng cùng token, chọn "Kéo về" để đồng bộ ngược.
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            class="px-3 py-2 rounded-lg bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 disabled:opacity-50"
            :disabled="sync.status === 'syncing'"
            @click="sync.pushNow"
          >
            ⬆ Đẩy ngay
          </button>
          <button
            class="px-3 py-2 rounded-lg bg-white border border-violet-300 text-violet-700 font-bold text-sm hover:bg-violet-50 disabled:opacity-50"
            :disabled="sync.status === 'syncing'"
            @click="sync.pullNow"
          >
            ⬇ Kéo về
          </button>
          <button
            class="px-3 py-2 rounded-lg bg-white border border-rose-300 text-rose-700 font-bold text-sm hover:bg-rose-50"
            @click="sync.disconnect"
          >
            🔌 Ngắt kết nối
          </button>
        </div>
        <p
          v-if="sync.lastEvent"
          class="mt-3 text-xs rounded-lg px-3 py-2 border"
          :class="sync.lastEvent.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-rose-50 border-rose-200 text-rose-700'"
        >
          {{ sync.lastEvent.text }}
        </p>
      </div>
    </section>

    <!-- ===== STREAK + Totals ===== -->
    <section class="grid sm:grid-cols-3 gap-3 mb-5">
      <div class="rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-white p-5 shadow-md">
        <p class="text-[10px] uppercase tracking-widest font-bold opacity-80">Streak hiện tại</p>
        <div class="flex items-end gap-2 mt-1">
          <span class="text-4xl font-black">{{ activity.currentStreak }}</span>
          <span class="text-sm opacity-90 pb-1.5">ngày</span>
        </div>
        <p class="text-xs opacity-90 mt-1">{{ streakEmoji(activity.currentStreak) }} kỷ lục: {{ activity.longestStreak }} ngày</p>
      </div>

      <div class="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <p class="text-[10px] uppercase tracking-widest font-bold text-slate-500">Tổng số từ</p>
        <div class="flex items-end gap-2 mt-1">
          <span class="text-4xl font-black text-slate-900">{{ totalVocab }}</span>
          <span class="text-sm text-slate-500 pb-1.5">từ</span>
        </div>
        <p class="text-xs text-slate-500 mt-1">{{ masteryPct }}% đã ở mức Quen/Thành thạo</p>
      </div>

      <div class="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <p class="text-[10px] uppercase tracking-widest font-bold text-slate-500">Đã học</p>
        <div class="flex items-end gap-2 mt-1">
          <span class="text-4xl font-black text-slate-900">{{ activity.totalDays }}</span>
          <span class="text-sm text-slate-500 pb-1.5">ngày</span>
        </div>
        <p class="text-xs text-slate-500 mt-1">Tổng số buổi ôn / luyện</p>
      </div>
    </section>

    <!-- ===== Heatmap 30 days ===== -->
    <section class="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 mb-5">
      <h2 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
        30 ngày gần nhất
      </h2>
      <div class="flex flex-wrap gap-1">
        <div
          v-for="d in last30"
          :key="d.date"
          class="w-5 h-5 rounded-sm"
          :class="d.studied ? 'bg-emerald-500' : 'bg-slate-200'"
          :title="d.date + (d.studied ? ' · đã học' : ' · nghỉ')"
        ></div>
      </div>
      <p class="text-[11px] text-slate-400 mt-2">
        Ô xanh = ngày có ôn tập, ô xám = nghỉ. Hover để xem ngày cụ thể.
      </p>
    </section>

    <!-- ===== Vocab mastery overall ===== -->
    <section class="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 mb-5">
      <h2 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
        Mức độ thành thạo — toàn bộ kho từ
      </h2>
      <MasteryStats :cards="vocab.items" />
    </section>

    <!-- ===== Per week breakdown ===== -->
    <section v-if="weeks.length" class="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 mb-5">
      <h2 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Theo tuần</h2>
      <div class="space-y-3">
        <div v-for="w in weeks" :key="w.week">
          <div class="flex items-center justify-between text-sm mb-1.5">
            <span class="font-bold text-slate-800">{{ w.label }}</span>
            <span class="text-xs text-slate-500">{{ w.total }} từ · {{ w.masteryPct }}% Quen+</span>
          </div>
          <div class="flex h-2 rounded-full overflow-hidden bg-slate-100">
            <div
              v-for="lvl in [1, 2, 3, 4, 5] as const"
              :key="lvl"
              :class="MASTERY_META[lvl].barBg"
              :style="{ width: (w.total === 0 ? 0 : (w.counts[lvl] / w.total) * 100) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Grammar summary ===== -->
    <section class="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 mb-5">
      <h2 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Ngữ pháp</h2>
      <div class="grid grid-cols-3 gap-2 text-center mb-4">
        <div class="rounded-xl bg-indigo-50 border border-indigo-200 p-3">
          <div class="text-2xl font-black text-indigo-700">{{ totalGrammarAttempts }}</div>
          <div class="text-[10px] uppercase font-bold tracking-wider text-indigo-700">Lượt làm</div>
        </div>
        <div class="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
          <div class="text-2xl font-black text-emerald-700">{{ totalGrammarAnswered }}</div>
          <div class="text-[10px] uppercase font-bold tracking-wider text-emerald-700">Câu đã trả lời</div>
        </div>
        <div class="rounded-xl bg-amber-50 border border-amber-200 p-3">
          <div class="text-2xl font-black text-amber-700">{{ grammarAccuracy }}%</div>
          <div class="text-[10px] uppercase font-bold tracking-wider text-amber-700">Chính xác trung bình</div>
        </div>
      </div>

      <div class="space-y-1.5">
        <RouterLink
          v-for="t in grammarSummary"
          :key="t.id"
          :to="t.id === 'sequencing' ? '/grammar/sequencing' : `/grammar/${t.id}`"
          class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
        >
          <span class="text-lg">{{ t.emoji }}</span>
          <span class="text-sm font-semibold text-slate-800 flex-1 truncate">{{ t.nameVi }}</span>
          <span class="text-xs text-slate-500 shrink-0">{{ t.attempts }} lượt</span>
          <span
            v-if="t.attempts > 0"
            class="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
            :class="t.accuracy >= 0.8 ? 'bg-emerald-50 text-emerald-700' : t.accuracy >= 0.5 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'"
          >
            {{ Math.round(t.accuracy * 100) }}%
          </span>
          <span v-else class="text-xs text-slate-400 shrink-0">—</span>
        </RouterLink>
      </div>
    </section>

    <RouterLink to="/" class="block text-center text-sm text-slate-500 hover:text-indigo-700">
      ← Về danh sách
    </RouterLink>
  </div>
</template>
