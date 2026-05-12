let cachedVoice: SpeechSynthesisVoice | null = null
let voicesLoaded = false

function pickBestVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null
  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) return null

  const enVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('en'))
  if (enVoices.length === 0) return voices[0] ?? null

  // Saved preference?
  const saved = localStorage.getItem('vocab.voice')
  if (saved) {
    const m = enVoices.find((v) => v.name === saved)
    if (m) return m
  }

  // Priority: Microsoft Natural/Neural > Google > anything English
  const naturalPatterns = [
    /Natural/i,
    /Neural/i,
    /\(Natural\)/i,
    /Aria/i,
    /Jenny/i,
    /Guy/i,
    /Ana/i,
    /Sonia/i,
    /Ryan/i,
    /Libby/i,
    /Emma/i,
  ]
  for (const pat of naturalPatterns) {
    const found = enVoices.find((v) => pat.test(v.name))
    if (found) return found
  }
  const google = enVoices.find((v) => /Google/i.test(v.name))
  if (google) return google
  const usuk = enVoices.find((v) => /en-US|en-GB/i.test(v.lang))
  return usuk ?? enVoices[0] ?? null
}

function ensureVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice
  cachedVoice = pickBestVoice()
  if (!cachedVoice && !voicesLoaded && typeof window !== 'undefined') {
    voicesLoaded = true
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      cachedVoice = pickBestVoice()
    })
  }
  return cachedVoice
}

export function speak(text: string, lang = 'en-US') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const synth = window.speechSynthesis
  synth.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  const voice = ensureVoice()
  if (voice) utter.voice = voice
  utter.lang = voice?.lang ?? lang
  utter.rate = 0.95
  utter.pitch = 1.0
  synth.speak(utter)
}

export function listEnglishVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return []
  return window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('en'))
}

export function setVoiceByName(name: string) {
  const v = listEnglishVoices().find((x) => x.name === name)
  if (v) {
    cachedVoice = v
    localStorage.setItem('vocab.voice', name)
  }
}

export function getCurrentVoiceName(): string {
  return cachedVoice?.name ?? ''
}
