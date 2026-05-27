import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useVocabularyStore } from './vocabulary'
import { useGrammarStore } from './grammar'
import { useActivityStore } from './activity'
import { buildBackupJson, restoreBackupJson } from '@/utils/backup'

const STORAGE_KEY = 'sync.v1'
const GIST_DESCRIPTION = 'ielts-vocab-sync-v1'
const FILENAME = 'backup.json'
const PUSH_DEBOUNCE_MS = 3000

export type SyncStatus = 'disabled' | 'connecting' | 'connected' | 'syncing' | 'error'

interface SyncConfig {
  token: string
  gistId: string
  lastSyncedAt: string | null
}

function loadConfig(): SyncConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed.token === 'string' && typeof parsed.gistId === 'string') {
      return parsed
    }
    return null
  } catch {
    return null
  }
}

function saveConfig(cfg: SyncConfig | null) {
  if (cfg) localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg))
  else localStorage.removeItem(STORAGE_KEY)
}

function simpleHash(s: string): string {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return String(h)
}

async function ghFetch(path: string, token: string, init?: RequestInit) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...(init ?? {}),
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json',
    },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`GitHub API ${res.status}: ${body.slice(0, 200)}`)
  }
  return res.json()
}

export const useSyncStore = defineStore('sync', () => {
  const config = ref<SyncConfig | null>(loadConfig())
  const status = ref<SyncStatus>(config.value ? 'connected' : 'disabled')
  const errorMessage = ref<string>('')
  const lastEvent = ref<{ type: 'success' | 'error'; text: string; at: string } | null>(null)

  let pushTimer: ReturnType<typeof setTimeout> | null = null
  let applyingRemote = false
  let lastPushedHash = ''
  let watchersInstalled = false

  const isConnected = computed(() => config.value !== null)
  const lastSyncedAt = computed(() => config.value?.lastSyncedAt ?? null)

  function getLocalSnapshot(): string {
    const vocab = useVocabularyStore()
    const grammar = useGrammarStore()
    const activity = useActivityStore()
    return buildBackupJson(vocab, grammar, activity)
  }

  function applySnapshot(json: string) {
    const vocab = useVocabularyStore()
    const grammar = useGrammarStore()
    const activity = useActivityStore()
    applyingRemote = true
    restoreBackupJson(json, vocab, grammar, activity)
    // Settle then update hash and unlock
    setTimeout(() => {
      lastPushedHash = simpleHash(getLocalSnapshot())
      applyingRemote = false
    }, 200)
  }

  async function findExistingGist(token: string): Promise<string | null> {
    const list = await ghFetch('/gists?per_page=100', token)
    const found = (list as Array<{ id: string; description: string | null }>).find(
      (g) => g.description === GIST_DESCRIPTION,
    )
    return found ? found.id : null
  }

  async function createNewGist(token: string, content: string): Promise<string> {
    const data = await ghFetch('/gists', token, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: GIST_DESCRIPTION,
        public: false,
        files: { [FILENAME]: { content } },
      }),
    })
    return (data as { id: string }).id
  }

  async function readGistContent(): Promise<string | null> {
    if (!config.value) return null
    const data = await ghFetch(`/gists/${config.value.gistId}`, config.value.token)
    const file = (data as { files: Record<string, { content: string } | undefined> }).files?.[FILENAME]
    return file?.content ?? null
  }

  async function writeGistContent(content: string): Promise<void> {
    if (!config.value) return
    await ghFetch(`/gists/${config.value.gistId}`, config.value.token, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        files: { [FILENAME]: { content } },
      }),
    })
  }

  /**
   * Step 1 of connect: validate token, look for existing sync gist.
   * Returns `{ existing: gistId | null }` so the caller can decide
   * whether to pull from cloud or push local up when both sides have data.
   */
  async function probeToken(token: string): Promise<{ existingGistId: string | null }> {
    if (!token.trim()) throw new Error('Vui lòng nhập token')
    status.value = 'connecting'
    errorMessage.value = ''
    try {
      const gistId = await findExistingGist(token.trim())
      return { existingGistId: gistId }
    } catch (e) {
      status.value = 'error'
      errorMessage.value = e instanceof Error ? e.message : 'Lỗi kết nối'
      throw e
    }
  }

  /**
   * Step 2 of connect: commit to a token + gist + sync direction.
   *   mode = 'pull'   → gist content overwrites local
   *   mode = 'push'   → local overwrites gist content
   *   mode = 'create' → no existing gist; create one with local data
   */
  async function commitConnect(
    token: string,
    existingGistId: string | null,
    mode: 'pull' | 'push' | 'create',
  ) {
    status.value = 'syncing'
    errorMessage.value = ''
    try {
      let gistId = existingGistId
      if (mode === 'create') {
        const content = getLocalSnapshot()
        gistId = await createNewGist(token.trim(), content)
        config.value = {
          token: token.trim(),
          gistId,
          lastSyncedAt: new Date().toISOString(),
        }
        lastPushedHash = simpleHash(content)
      } else if (gistId) {
        config.value = { token: token.trim(), gistId, lastSyncedAt: null }
        if (mode === 'pull') {
          const remote = await readGistContent()
          if (remote) applySnapshot(remote)
        } else {
          await writeGistContent(getLocalSnapshot())
          lastPushedHash = simpleHash(getLocalSnapshot())
        }
        config.value.lastSyncedAt = new Date().toISOString()
      } else {
        throw new Error('Không có gistId')
      }
      saveConfig(config.value)
      status.value = 'connected'
      lastEvent.value = {
        type: 'success',
        text:
          mode === 'create'
            ? '✓ Đã tạo gist mới và đẩy dữ liệu lên.'
            : mode === 'pull'
              ? '✓ Đã kéo dữ liệu từ cloud về.'
              : '✓ Đã đẩy dữ liệu local lên cloud.',
        at: new Date().toISOString(),
      }
      installWatchers()
    } catch (e) {
      status.value = 'error'
      errorMessage.value = e instanceof Error ? e.message : 'Lỗi kết nối'
      config.value = null
      saveConfig(null)
      throw e
    }
  }

  function disconnect() {
    if (pushTimer !== null) {
      clearTimeout(pushTimer)
      pushTimer = null
    }
    config.value = null
    saveConfig(null)
    status.value = 'disabled'
    errorMessage.value = ''
    lastEvent.value = null
  }

  async function pushNow() {
    if (!config.value) return
    status.value = 'syncing'
    errorMessage.value = ''
    try {
      const content = getLocalSnapshot()
      await writeGistContent(content)
      config.value.lastSyncedAt = new Date().toISOString()
      saveConfig(config.value)
      lastPushedHash = simpleHash(content)
      status.value = 'connected'
      lastEvent.value = { type: 'success', text: '✓ Đã đẩy lên cloud.', at: new Date().toISOString() }
    } catch (e) {
      status.value = 'error'
      errorMessage.value = e instanceof Error ? e.message : 'Lỗi push'
      lastEvent.value = {
        type: 'error',
        text: '✗ Không đẩy được: ' + errorMessage.value,
        at: new Date().toISOString(),
      }
    }
  }

  async function pullNow() {
    if (!config.value) return
    status.value = 'syncing'
    errorMessage.value = ''
    try {
      const content = await readGistContent()
      if (content) applySnapshot(content)
      config.value.lastSyncedAt = new Date().toISOString()
      saveConfig(config.value)
      status.value = 'connected'
      lastEvent.value = { type: 'success', text: '✓ Đã kéo về từ cloud.', at: new Date().toISOString() }
    } catch (e) {
      status.value = 'error'
      errorMessage.value = e instanceof Error ? e.message : 'Lỗi pull'
      lastEvent.value = {
        type: 'error',
        text: '✗ Không kéo được: ' + errorMessage.value,
        at: new Date().toISOString(),
      }
    }
  }

  function schedulePush() {
    if (!config.value || applyingRemote) return
    if (pushTimer !== null) clearTimeout(pushTimer)
    pushTimer = setTimeout(async () => {
      pushTimer = null
      if (!config.value || applyingRemote) return
      const snapshot = getLocalSnapshot()
      if (simpleHash(snapshot) === lastPushedHash) return
      await pushNow()
    }, PUSH_DEBOUNCE_MS)
  }

  function installWatchers() {
    if (watchersInstalled) return
    watchersInstalled = true
    const vocab = useVocabularyStore()
    const grammar = useGrammarStore()
    const activity = useActivityStore()
    watch(() => vocab.items, schedulePush, { deep: true })
    watch(() => grammar.progress, schedulePush, { deep: true })
    watch(() => grammar.userQuestions, schedulePush, { deep: true })
    watch(() => activity.data, schedulePush, { deep: true })
  }

  // Initialize: if already connected from a previous session, install watchers.
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      if (config.value) {
        lastPushedHash = simpleHash(getLocalSnapshot())
        installWatchers()
      }
    }, 300)
  }

  return {
    config,
    status,
    errorMessage,
    lastEvent,
    isConnected,
    lastSyncedAt,
    probeToken,
    commitConnect,
    disconnect,
    pushNow,
    pullNow,
  }
})
