// ============================================
// Deutsch Lernen — Shared TypeScript Types
// ============================================

export interface Word {
  id: string;
  german: string;
  english: string;
  article: string | null;
  exampleDE?: string;
  exampleEN?: string;
  difficulty: 1 | 2 | 3;
}

export interface VocabularyData {
  category: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  words: Word[];
}

export interface CardProgress {
  box: 1 | 2 | 3 | 4 | 5;
  lastReview: number;
  correct: number;
  wrong: number;
}

export interface QuizAttempt {
  score: number;
  total: number;
  date: number;
}

export interface StreakData {
  count: number;
  lastDate: string | null;
}

export interface ProgressData {
  flashcards: Record<string, CardProgress>;
  quizScores: Record<string, QuizAttempt[]>;
  lessonsCompleted: string[];
  streak: StreakData;
  settings: {
    darkMode: boolean;
  };
}

export interface OverallStats {
  totalWords: number;
  mastered: number;
  learning: number;
  newCards: number;
  accuracy: number;
  streak: number;
  quizzesTaken: number;
}

export interface QuizQuestion {
  german: string;
  article: string | null;
  correctAnswer: string;
  options: { text: string; correct: boolean }[];
}

export interface TopicConfig {
  id: string;
  icon: string;
  title: string;
  description: string;
  wordCount: number;
  level: 'A1' | 'A2' | 'B1';
  category: string;
  available: boolean;
}
