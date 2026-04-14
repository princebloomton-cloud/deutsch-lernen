/* ============================================
   Quiz Engine — Multiple Choice from Vocabulary
   ============================================ */

const Quiz = (() => {
  let questions = [];
  let currentQ = 0;
  let score = 0;
  let answered = false;
  let quizId = '';

  async function init() {
    const category = App.getParam('category');
    if (!category) {
      document.querySelector('.quiz-area').innerHTML =
        '<p class="text-center text-light">No category selected. <a href="index.html" style="color:var(--primary)">Go back</a></p>';
      return;
    }

    quizId = `quiz-${category}`;

    const data = await App.loadJSON(`data/vocabulary/${category}.json`);
    if (!data || !data.words || data.words.length < 4) {
      document.querySelector('.quiz-area').innerHTML =
        '<p class="text-center text-light">Not enough words for a quiz (need at least 4).</p>';
      return;
    }

    // Update page title
    const titleEl = document.querySelector('.page-header h1');
    if (titleEl) titleEl.textContent = `${data.category} Quiz`;

    // Generate questions from vocabulary
    questions = generateQuestions(data.words, 10);
    currentQ = 0;
    score = 0;

    showQuestion();
  }

  function generateQuestions(words, count) {
    const shuffled = App.shuffle(words);
    const questionCount = Math.min(count, shuffled.length);
    const result = [];

    for (let i = 0; i < questionCount; i++) {
      const correct = shuffled[i];

      // Pick 3 random wrong answers
      const others = words.filter(w => w.id !== correct.id);
      const distractors = App.shuffle(others).slice(0, 3);

      // Build options and shuffle
      const options = App.shuffle([
        { text: correct.english, correct: true },
        ...distractors.map(d => ({ text: d.english, correct: false }))
      ]);

      result.push({
        german: correct.german,
        article: correct.article,
        correctAnswer: correct.english,
        options
      });
    }

    return result;
  }

  function showQuestion() {
    if (currentQ >= questions.length) {
      showResults();
      return;
    }

    answered = false;
    const q = questions[currentQ];

    // Update counter & progress
    document.querySelector('.question-count').textContent =
      `Question ${currentQ + 1} of ${questions.length}`;
    document.querySelector('.progress-bar-fill').style.width =
      `${((currentQ) / questions.length) * 100}%`;

    // Show word
    document.querySelector('.german-word').textContent =
      q.article ? `${q.article} ${q.german}` : q.german;

    // Render options
    const optionsEl = document.querySelector('.answer-options');
    const letters = ['A', 'B', 'C', 'D'];
    optionsEl.innerHTML = q.options.map((opt, i) => `
      <button class="answer-btn" data-index="${i}" data-correct="${opt.correct}">
        <span class="option-letter">${letters[i]}</span>
        <span>${opt.text}</span>
      </button>
    `).join('');

    // Wire up click events
    optionsEl.querySelectorAll('.answer-btn').forEach(btn => {
      btn.addEventListener('click', () => handleAnswer(btn));
    });

    // Hide feedback
    const feedback = document.querySelector('.quiz-feedback');
    feedback.classList.remove('show', 'correct', 'wrong');

    // Speak the word
    Audio.speak(q.german);
  }

  function handleAnswer(btn) {
    if (answered) return;
    answered = true;

    const isCorrect = btn.dataset.correct === 'true';
    const feedback = document.querySelector('.quiz-feedback');
    const allBtns = document.querySelectorAll('.answer-btn');

    // Disable all buttons
    allBtns.forEach(b => b.disabled = true);

    // Highlight correct and wrong
    allBtns.forEach(b => {
      if (b.dataset.correct === 'true') b.classList.add('correct');
    });

    if (isCorrect) {
      score++;
      feedback.textContent = 'Correct! Sehr gut! 🎉';
      feedback.classList.add('show', 'correct');
    } else {
      btn.classList.add('wrong');
      feedback.textContent = `Not quite — the answer is "${questions[currentQ].correctAnswer}"`;
      feedback.classList.add('show', 'wrong');
    }

    // Auto-advance after 1.8 seconds
    setTimeout(() => {
      currentQ++;
      showQuestion();
    }, 1800);
  }

  function showResults() {
    const pct = Math.round((score / questions.length) * 100);
    Progress.saveQuizScore(quizId, score, questions.length);

    let message = '';
    if (pct === 100) message = 'Perfekt! Outstanding work!';
    else if (pct >= 80) message = 'Sehr gut! Great job!';
    else if (pct >= 60) message = 'Gut gemacht! Keep practicing!';
    else message = 'Keep learning — you\'ll get there!';

    const area = document.querySelector('.quiz-area');
    area.innerHTML = `
      <div class="quiz-results">
        <div class="score-circle">${pct}%</div>
        <h2>${message}</h2>
        <p>You scored ${score} out of ${questions.length}</p>
        <div class="btn-group">
          <a href="quiz.html?category=${App.getParam('category')}" class="btn btn-primary">Try Again</a>
          <a href="flashcards.html?category=${App.getParam('category')}" class="btn btn-outline">Study Flashcards</a>
          <a href="index.html" class="btn btn-outline">All Topics</a>
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
