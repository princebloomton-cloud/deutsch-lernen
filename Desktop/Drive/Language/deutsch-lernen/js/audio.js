/* ============================================
   Audio — Web Speech API for German Pronunciation
   ============================================ */

const Audio = (() => {
  let germanVoice = null;
  let ready = false;

  // Find the best German voice available
  function loadVoices() {
    const voices = speechSynthesis.getVoices();
    // Prefer Google German voice, fallback to any de-DE voice
    germanVoice = voices.find(v => v.lang === 'de-DE' && v.name.includes('Google'))
      || voices.find(v => v.lang === 'de-DE')
      || voices.find(v => v.lang.startsWith('de'));

    if (germanVoice) {
      ready = true;
      console.log('German voice loaded:', germanVoice.name);
    }
  }

  // Voices load async in Chrome
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
  }
  loadVoices();

  /**
   * Speak a German word or sentence
   * @param {string} text - German text to speak
   * @param {boolean} slow - Use slow rate for learners
   */
  function speak(text, slow = false) {
    if (!text) return;

    // Cancel any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = slow ? 0.6 : 0.85;
    utterance.pitch = 1;

    if (germanVoice) {
      utterance.voice = germanVoice;
    }

    speechSynthesis.speak(utterance);
  }

  /**
   * Check if speech synthesis is supported
   */
  function isSupported() {
    return 'speechSynthesis' in window;
  }

  return { speak, isSupported };
})();
