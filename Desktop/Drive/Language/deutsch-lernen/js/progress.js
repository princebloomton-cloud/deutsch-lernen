/* ============================================
   Progress — localStorage Manager & Stats
   ============================================ */

const Progress = (() => {
  const STORAGE_KEY = 'deutsch_lernen';

  // Default data shape
  function getDefaultData() {
    return {
      flashcards: {},     // { "word-id": { box: 1, lastReview: timestamp, correct: 0, wrong: 0 } }
      quizScores: {},     // { "quiz-id": [{ score: 8, total: 10, date: timestamp }] }
      lessonsCompleted: [],
      streak: { count: 0, lastDate: null },
      settings: { darkMode: false }
    };
  }

  // Load all data
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return getDefaultData();
      return { ...getDefaultData(), ...JSON.parse(raw) };
    } catch (e) {
      console.warn('Failed to load progress:', e);
      return getDefaultData();
    }
  }

  // Save all data
  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save progress:', e);
    }
  }

  // ---- Flashcard Progress (Leitner System) ----

  // Box intervals in days
  const BOX_INTERVALS = { 1: 0, 2: 3, 3: 5, 4: 7, 5: 14 };

  function getCardProgress(wordId) {
    const data = load();
    return data.flashcards[wordId] || { box: 1, lastReview: 0, correct: 0, wrong: 0 };
  }

  function updateCard(wordId, wasCorrect) {
    const data = load();
    const card = data.flashcards[wordId] || { box: 1, lastReview: 0, correct: 0, wrong: 0 };

    if (wasCorrect) {
      card.box = Math.min(card.box + 1, 5);
      card.correct++;
    } else {
      card.box = 1; // Back to box 1 on wrong
      card.wrong++;
    }
    card.lastReview = Date.now();

    data.flashcards[wordId] = card;
    save(data);
    return card;
  }

  function isDueForReview(wordId) {
    const card = getCardProgress(wordId);
    if (card.box === 1 && card.lastReview === 0) return true; // Never reviewed
    const daysSinceReview = (Date.now() - card.lastReview) / (1000 * 60 * 60 * 24);
    return daysSinceReview >= BOX_INTERVALS[card.box];
  }

  // ---- Quiz Scores ----

  function saveQuizScore(quizId, score, total) {
    const data = load();
    if (!data.quizScores[quizId]) data.quizScores[quizId] = [];
    data.quizScores[quizId].push({ score, total, date: Date.now() });
    save(data);
  }

  function getQuizScores(quizId) {
    const data = load();
    return data.quizScores[quizId] || [];
  }

  function getBestScore(quizId) {
    const scores = getQuizScores(quizId);
    if (scores.length === 0) return null;
    return scores.reduce((best, s) => (s.score / s.total) > (best.score / best.total) ? s : best);
  }

  // ---- Streak ----

  function updateStreak() {
    const data = load();
    const today = new Date().toDateString();

    if (data.streak.lastDate === today) return data.streak.count; // Already counted today

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (data.streak.lastDate === yesterday) {
      data.streak.count++;
    } else if (data.streak.lastDate !== today) {
      data.streak.count = 1; // Reset streak
    }

    data.streak.lastDate = today;
    save(data);
    return data.streak.count;
  }

  function getStreak() {
    return load().streak.count;
  }

  // ---- Overall Stats ----

  function getStats() {
    const data = load();
    const cards = Object.values(data.flashcards);
    const mastered = cards.filter(c => c.box >= 4).length;
    const learning = cards.filter(c => c.box >= 2 && c.box < 4).length;
    const newCards = cards.filter(c => c.box === 1).length;
    const totalCorrect = cards.reduce((sum, c) => sum + c.correct, 0);
    const totalWrong = cards.reduce((sum, c) => sum + c.wrong, 0);
    const accuracy = totalCorrect + totalWrong > 0
      ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100)
      : 0;

    return {
      totalWords: cards.length,
      mastered,
      learning,
      newCards,
      accuracy,
      streak: data.streak.count,
      quizzesTaken: Object.values(data.quizScores).reduce((sum, arr) => sum + arr.length, 0)
    };
  }

  // ---- Settings ----

  function getSetting(key) {
    return load().settings[key];
  }

  function setSetting(key, value) {
    const data = load();
    data.settings[key] = value;
    save(data);
  }

  // ---- Reset ----

  function resetAll() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    getCardProgress, updateCard, isDueForReview,
    saveQuizScore, getQuizScores, getBestScore,
    updateStreak, getStreak, getStats,
    getSetting, setSetting, resetAll
  };
})();
