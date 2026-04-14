// ============================================
// Progress — localStorage Manager & Stats
// ============================================

import type { CardProgress, ProgressData, OverallStats, QuizAttempt } from '@/types';

const STORAGE_KEY = 'deutsch_lernen_v2';

const BOX_INTERVALS: Record<number, number> = { 1: 0, 2: 3, 3: 5, 4: 7, 5: 14 };

function getDefaultData(): ProgressData {
  return {
    flashcards: {},
    quizScores: {},
    lessonsCompleted: [],
    streak: { count: 0, lastDate: null },
    settings: { darkMode: false },
  };
}

function load(): ProgressData {
  if (typeof window === 'undefined') return getDefaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    return { ...getDefaultData(), ...JSON.parse(raw) };
  } catch {
    return getDefaultData();
  }
}

function save(data: ProgressData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn('Failed to save progress');
  }
}

// ---- Flashcard Progress (Leitner System) ----

export function getCardProgress(wordId: string): CardProgress {
  const data = load();
  return data.flashcards[wordId] || { box: 1, lastReview: 0, correct: 0, wrong: 0 };
}

export function updateCard(wordId: string, wasCorrect: boolean): CardProgress {
  const data = load();
  const card = data.flashcards[wordId] || { box: 1, lastReview: 0, correct: 0, wrong: 0 };

  if (wasCorrect) {
    card.box = Math.min(card.box + 1, 5) as CardProgress['box'];
    card.correct++;
  } else {
    card.box = 1;
    card.wrong++;
  }
  card.lastReview = Date.now();

  data.flashcards[wordId] = card;
  save(data);
  return card;
}

export function isDueForReview(wordId: string): boolean {
  const card = getCardProgress(wordId);
  if (card.box === 1 && card.lastReview === 0) return true;
  const daysSinceReview = (Date.now() - card.lastReview) / (1000 * 60 * 60 * 24);
  return daysSinceReview >= BOX_INTERVALS[card.box];
}

export function getCategoryProgress(wordIds: string[]): number {
  if (wordIds.length === 0) return 0;
  const mastered = wordIds.filter(id => getCardProgress(id).box >= 4).length;
  return Math.round((mastered / wordIds.length) * 100);
}

// ---- Quiz Scores ----

export function saveQuizScore(quizId: string, score: number, total: number): void {
  const data = load();
  if (!data.quizScores[quizId]) data.quizScores[quizId] = [];
  data.quizScores[quizId].push({ score, total, date: Date.now() });
  save(data);
}

export function getQuizScores(quizId: string): QuizAttempt[] {
  return load().quizScores[quizId] || [];
}

export function getBestScore(quizId: string): QuizAttempt | null {
  const scores = getQuizScores(quizId);
  if (scores.length === 0) return null;
  return scores.reduce((best, s) =>
    s.score / s.total > best.score / best.total ? s : best
  );
}

// ---- Streak ----

export function updateStreak(): number {
  const data = load();
  const today = new Date().toDateString();

  if (data.streak.lastDate === today) return data.streak.count;

  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (data.streak.lastDate === yesterday) {
    data.streak.count++;
  } else if (data.streak.lastDate !== today) {
    data.streak.count = 1;
  }

  data.streak.lastDate = today;
  save(data);
  return data.streak.count;
}

export function getStreak(): number {
  return load().streak.count;
}

// ---- Overall Stats ----

export function getStats(): OverallStats {
  const data = load();
  const cards = Object.values(data.flashcards);
  const mastered = cards.filter(c => c.box >= 4).length;
  const learning = cards.filter(c => c.box >= 2 && c.box < 4).length;
  const newCards = cards.filter(c => c.box === 1).length;
  const totalCorrect = cards.reduce((sum, c) => sum + c.correct, 0);
  const totalWrong = cards.reduce((sum, c) => sum + c.wrong, 0);
  const accuracy =
    totalCorrect + totalWrong > 0
      ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100)
      : 0;

  return {
    totalWords: cards.length,
    mastered,
    learning,
    newCards,
    accuracy,
    streak: data.streak.count,
    quizzesTaken: Object.values(data.quizScores).reduce(
      (sum, arr) => sum + arr.length,
      0
    ),
  };
}

// ---- Settings ----

export function getSetting<K extends keyof ProgressData['settings']>(
  key: K
): ProgressData['settings'][K] {
  return load().settings[key];
}

export function setSetting<K extends keyof ProgressData['settings']>(
  key: K,
  value: ProgressData['settings'][K]
): void {
  const data = load();
  data.settings[key] = value;
  save(data);
}

// ---- Reset ----

export function resetAll(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
