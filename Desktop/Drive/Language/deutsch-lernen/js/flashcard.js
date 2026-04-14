/* ============================================
   Flashcard Engine — Leitner Box System
   ============================================ */

const Flashcard = (() => {
  let words = [];
  let currentIndex = 0;
  let isFlipped = false;

  // DOM elements (set on init)
  let cardEl, frontWord, frontArticle, frontExample, frontHint;
  let backWord, backExample, counterEl, progressEl;
  let boxDots;

  async function init() {
    // Get category from URL: ?category=a1-greetings
    const category = App.getParam('category');
    if (!category) {
      document.querySelector('.flashcard-area').innerHTML =
        '<p class="text-center text-light">No category selected. <a href="index.html" style="color:var(--primary)">Go back</a></p>';
      return;
    }

    // Load vocabulary
    const data = await App.loadJSON(`data/vocabulary/${category}.json`);
    if (!data || !data.words || data.words.length === 0) {
      document.querySelector('.flashcard-area').innerHTML =
        '<p class="text-center text-light">No words found for this category.</p>';
      return;
    }

    // Filter for due cards first, then add remaining
    const dueWords = data.words.filter(w => Progress.isDueForReview(w.id));
    const otherWords = data.words.filter(w => !Progress.isDueForReview(w.id));
    words = [...dueWords, ...otherWords];

    // Update page title
    const titleEl = document.querySelector('.page-header h1');
    if (titleEl) titleEl.textContent = data.category || 'Flashcards';

    const levelEl = document.querySelector('.page-header .badge');
    if (levelEl) {
      levelEl.textContent = data.level || 'A1';
      levelEl.className = `badge badge-${(data.level || 'a1').toLowerCase()}`;
    }

    // Cache DOM elements
    cardEl = document.querySelector('.flashcard');
    frontWord = document.querySelector('.card-front .word');
    frontArticle = document.querySelector('.card-front .article');
    frontExample = document.querySelector('.card-front .example');
    frontHint = document.querySelector('.card-front .hint');
    backWord = document.querySelector('.card-back .word');
    backExample = document.querySelector('.card-back .example');
    counterEl = document.querySelector('.card-counter');
    progressEl = document.querySelector('.progress-bar-fill');
    boxDots = document.querySelectorAll('.box-dot');

    // Wire up events
    cardEl.addEventListener('click', flip);
    document.querySelector('.btn-forgot')?.addEventListener('click', () => rate(false));
    document.querySelector('.btn-hard')?.addEventListener('click', () => rate(true));
    document.querySelector('.btn-easy')?.addEventListener('click', () => rate(true));
    document.querySelector('.btn-prev')?.addEventListener('click', prev);
    document.querySelector('.btn-next')?.addEventListener('click', next);
    document.querySelector('.speak-front')?.addEventListener('click', (e) => {
      e.stopPropagation();
      speakCurrent('german');
    });
    document.querySelector('.speak-back')?.addEventListener('click', (e) => {
      e.stopPropagation();
      speakCurrent('english');
    });

    showCard();
  }

  function showCard() {
    if (words.length === 0) return;

    const word = words[currentIndex];
    isFlipped = false;
    cardEl.classList.remove('flipped');

    // Front (German)
    frontWord.textContent = word.german;
    frontArticle.textContent = word.article ? `(${word.article})` : '';
    frontExample.textContent = word.exampleDE || '';
    frontHint.textContent = 'Tap to reveal';

    // Back (English)
    backWord.textContent = word.english;
    backExample.textContent = word.exampleEN || '';

    // Counter & progress
    counterEl.textContent = `${currentIndex + 1} / ${words.length}`;
    const pct = ((currentIndex + 1) / words.length) * 100;
    progressEl.style.width = `${pct}%`;

    // Box indicator
    const cardProgress = Progress.getCardProgress(word.id);
    boxDots.forEach((dot, i) => {
      dot.classList.remove('active', 'filled');
      if (i + 1 === cardProgress.box) dot.classList.add('active');
      else if (i + 1 < cardProgress.box) dot.classList.add('filled');
    });
  }

  function flip() {
    isFlipped = !isFlipped;
    cardEl.classList.toggle('flipped');
    if (isFlipped) {
      // Auto-speak the German word on flip
      Audio.speak(words[currentIndex].german);
    }
  }

  function rate(wasCorrect) {
    const word = words[currentIndex];
    Progress.updateCard(word.id, wasCorrect);

    // Move to next card
    if (currentIndex < words.length - 1) {
      currentIndex++;
      showCard();
    } else {
      // Session complete
      showSessionComplete();
    }
  }

  function next() {
    if (currentIndex < words.length - 1) {
      currentIndex++;
      showCard();
    }
  }

  function prev() {
    if (currentIndex > 0) {
      currentIndex--;
      showCard();
    }
  }

  function speakCurrent(lang) {
    const word = words[currentIndex];
    if (lang === 'german') {
      Audio.speak(word.german);
    }
    // English TTS uses default browser voice
  }

  function showSessionComplete() {
    const area = document.querySelector('.flashcard-area');
    const stats = Progress.getStats();
    area.innerHTML = `
      <div class="quiz-results">
        <div class="score-circle">✓</div>
        <h2>Session Complete!</h2>
        <p>You've reviewed all ${words.length} cards in this set.</p>
        <p class="text-light">Words mastered: ${stats.mastered} · Accuracy: ${stats.accuracy}%</p>
        <div class="btn-group mt-2">
          <a href="flashcards.html?category=${App.getParam('category')}" class="btn btn-primary">Study Again</a>
          <a href="index.html" class="btn btn-outline">Back to Topics</a>
        </div>
      </div>
    `;
  }

  // Init on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init };
})();
