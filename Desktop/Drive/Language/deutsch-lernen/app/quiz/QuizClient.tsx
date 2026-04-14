'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { VocabularyData, Word, QuizQuestion } from '@/types';
import { saveQuizScore, getBestScore } from '@/lib/progress';
import { speak } from '@/lib/audio';

interface Props {
  category: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(words: Word[], count = 10): QuizQuestion[] {
  const shuffled = shuffle(words);
  const total = Math.min(count, shuffled.length);
  return shuffled.slice(0, total).map(correct => {
    const distractors = shuffle(words.filter(w => w.id !== correct.id)).slice(0, 3);
    return {
      german: correct.german,
      article: correct.article,
      correctAnswer: correct.english,
      options: shuffle([
        { text: correct.english, correct: true },
        ...distractors.map(d => ({ text: d.english, correct: false })),
      ]),
    };
  });
}

const RESULT_MESSAGES: [number, string][] = [
  [100, '🏆 Perfekt! Absolutely outstanding!'],
  [80, '⭐ Sehr gut! Great work!'],
  [60, '👍 Gut gemacht! Keep practicing!'],
  [0, '💪 Keep going — you\'ll get there!'],
];

export default function QuizClient({ category }: Props) {
  const [data, setData] = useState<VocabularyData | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (!category) return;
    fetch(`/data/vocabulary/${category}.json`)
      .then(r => r.json())
      .then((d: VocabularyData) => {
        setData(d);
        const q = generateQuestions(d.words, 10);
        setQuestions(q);
        setLoading(false);
        setTimerActive(true);
        speak(d.words[0]?.german || '');
      })
      .catch(() => setLoading(false));
  }, [category]);

  // Timer
  useEffect(() => {
    if (!timerActive || answered || done) return;
    if (timeLeft <= 0) {
      handleAnswer(null);
      return;
    }
    const t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, timerActive, answered, done]);

  const handleAnswer = useCallback((index: number | null) => {
    if (answered) return;
    setAnswered(true);
    setTimerActive(false);
    setSelectedIndex(index);

    const isCorrect = index !== null && questions[currentQ]?.options[index]?.correct;
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback({ correct: true, message: 'Richtig! Sehr gut! 🎉' });
    } else {
      setFeedback({
        correct: false,
        message: `Nicht ganz — the answer is "${questions[currentQ]?.correctAnswer}"`,
      });
    }

    setTimeout(() => {
      if (currentQ + 1 >= questions.length) {
        const finalScore = isCorrect ? score + 1 : score;
        saveQuizScore(`quiz-${category}`, finalScore, questions.length);
        setScore(finalScore);
        setDone(true);
      } else {
        setCurrentQ(q => q + 1);
        setAnswered(false);
        setSelectedIndex(null);
        setFeedback(null);
        setTimeLeft(15);
        setTimerActive(true);
        speak(questions[currentQ + 1]?.german || '');
      }
    }, 1800);
  }, [answered, currentQ, questions, score, category]);

  function restart() {
    if (!data) return;
    const q = generateQuestions(data.words, 10);
    setQuestions(q);
    setCurrentQ(0);
    setScore(0);
    setAnswered(false);
    setSelectedIndex(null);
    setFeedback(null);
    setDone(false);
    setTimeLeft(15);
    setTimerActive(true);
    speak(q[0]?.german || '');
  }

  if (!category) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="text-5xl mb-4">✏️</div>
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No category selected</h2>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors">
          ← Back to Topics
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading quiz…</p>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const message = (RESULT_MESSAGES.find(([threshold]) => pct >= threshold) || RESULT_MESSAGES[RESULT_MESSAGES.length - 1])[1];
    const best = getBestScore(`quiz-${category}`);
    const scoreColor = pct >= 80 ? 'text-green-500' : pct >= 60 ? 'text-yellow-500' : 'text-red-400';

    return (
      <div className="max-w-lg mx-auto px-4 py-10 animate-scale-in">
        <div className="rounded-2xl bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 shadow-card dark:shadow-card-dark p-8 text-center">
          <div className="relative w-28 h-28 mx-auto mb-5">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-100 dark:text-gray-800" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke="currentColor" strokeWidth="6"
                strokeDasharray={`${(pct / 100) * 263.9} 263.9`}
                strokeLinecap="round"
                className={`progress-ring-circle ${scoreColor}`}
              />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center text-3xl font-black ${scoreColor}`}>
              {pct}%
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{message}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            {score} out of {questions.length} correct
          </p>
          {best && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
              Your best: {Math.round((best.score / best.total) * 100)}%
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={restart}
              className="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark active:scale-95 transition-all duration-150"
            >
              Try Again
            </button>
            <Link
              href={`/flashcards?category=${category}`}
              className="flex-1 py-3 px-4 rounded-xl border-2 border-primary text-primary dark:text-primary-light font-semibold hover:bg-primary hover:text-white active:scale-95 transition-all duration-150 text-center"
            >
              Study Flashcards
            </Link>
            <Link
              href="/"
              className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all duration-150 text-center"
            >
              All Topics
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  if (!q) return null;

  const progressPct = (currentQ / questions.length) * 100;
  const timerPct = (timeLeft / 15) * 100;
  const timerColor = timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-yellow-500' : 'bg-primary';

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
          ← Topics
        </Link>
        <div className="text-center">
          <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">
            {data?.category} Quiz
          </h1>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{score}</span>
          <span className="text-xs text-gray-400">pts</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mb-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Timer bar */}
      <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full mb-5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${timerColor}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      <div className="flex items-center justify-between mb-5">
        <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">
          Question {currentQ + 1} of {questions.length}
        </span>
        <span className={`text-sm font-bold ${timerColor.replace('bg-', 'text-')}`}>
          ⏱ {timeLeft}s
        </span>
      </div>

      {/* Question card */}
      <div className="rounded-2xl bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 shadow-card dark:shadow-card-dark p-6 sm:p-8 mb-5 text-center">
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
          What does this mean?
        </div>
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-gray-100">
            {q.article ? `${q.article} ` : ''}{q.german}
          </span>
          <button
            onClick={() => speak(q.german)}
            className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light hover:bg-primary hover:text-white transition-all duration-150 text-base"
          >
            🔊
          </button>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-5">
        {q.options.map((opt, i) => {
          const letter = ['A', 'B', 'C', 'D'][i];
          let extraClass = '';
          if (answered) {
            if (opt.correct) extraClass = 'correct';
            else if (selectedIndex === i && !opt.correct) extraClass = 'wrong';
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={answered}
              className={`answer-btn ${extraClass}`}
            >
              <span className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg text-xs font-bold ${
                answered && opt.correct
                  ? 'bg-green-500 text-white'
                  : answered && selectedIndex === i && !opt.correct
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              }`}>
                {letter}
              </span>
              <span className="text-gray-800 dark:text-gray-200">{opt.text}</span>
              {answered && opt.correct && <span className="ml-auto">✓</span>}
              {answered && selectedIndex === i && !opt.correct && <span className="ml-auto">✗</span>}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`rounded-xl px-4 py-3 text-sm font-semibold text-center animate-slide-up ${
          feedback.correct
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
        }`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
}
