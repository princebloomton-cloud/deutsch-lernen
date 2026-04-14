// ============================================
// Audio — Web Speech API for German Pronunciation
// ============================================

let germanVoice: SpeechSynthesisVoice | null = null;

function loadVoices(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const voices = speechSynthesis.getVoices();
  germanVoice =
    voices.find(v => v.lang === 'de-DE' && v.name.toLowerCase().includes('google')) ||
    voices.find(v => v.lang === 'de-DE') ||
    voices.find(v => v.lang.startsWith('de')) ||
    null;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}

export function speak(text: string, slow = false): void {
  if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  utterance.rate = slow ? 0.6 : 0.85;
  utterance.pitch = 1;

  if (germanVoice) utterance.voice = germanVoice;
  speechSynthesis.speak(utterance);
}

export function isSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
