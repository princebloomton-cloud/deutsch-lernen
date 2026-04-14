'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { VocabularyData, Word } from '@/types';
import { getCardProgress, updateCard, isDueForReview } from '@/lib/progress';
import { speak } from '@/lib/audio';

interface Props {
  category: string;
}

export default function FlashcardsClient({ category }: Props) {
  const [data, setData] = useState<VocabularyData | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionDone, setSessionDone] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0 });

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    fetch(`/data/vocabulary/${category}.json`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((d: VocabularyData) => {
        setData(d);
        // Prioritise due cards
        const due = d.words.filter(w => isDueForReview(w.id));
        const other = d.words.filter(w => !isDueForReview(w.id));
        setWords([...due, ...other]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  const currentWord = words[currentIndex];

  const flip = useCallback(() => {
    if (!flipped) speak(currentWord?.german || '');
    setFlipped(v => !v);
  }, [flipped, currentWord]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [flip]);

  function rate(wasCorrect: boolean) {
    if (!currentWord) return;
    updateCard(currentWord.id, wasCorrect);
    setSessionStats(s => wasCorrect ? { ...s, correct: s.correct + 1 } : { ...s, wrong: s.wrong + 1 });
    if (currentIndex < words.length - 1) {
      setCurrentIndex(i => i + 1);
      setFlipped(false);
    } else {
      setSessionDone(true);
    }
  }

  function next() {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(i => i + 1);
      setFlipped(false);
    }
  }

  function prev() {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setFlipped(false);
    }
  }

  function restart() {
    setCurrentIndex(0);
    setFlipped(false);
    setSessionDone(false);
    setSessionStats({ correct: 0, wrong: 0 });
  }

  if (!category) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="text-5xl mb-4">🃏</div>
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No category selected</h2>
        <p className="text-gray-500 mb-6">Go back and choose a topic to study.</p>
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
        <p className="text-gray-400">Loading flashcards…</p>
      </div>
    );
  }

  if (!data || words.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No cards found</h2>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors">
          ← Back to Topics
        </Link>
      </div>
    );
  }

  if (sessionDone) {
    const total = sessionStats.correct + sessionStats.wrong;
    const pct = total > 0 ? Math.round((sessionStats.correct / total) * 100) : 0;
    return (
      <div className="max-w-lg mx-auto px-4 py-12 animate-scale-in">
        <div className="rounded-2xl bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 shadow-card dark:shadow-card-dark p-8 text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-primary/10 dark:bg-primary/20 animate-pulse-ring" />
            <div className="relative w-full h-full rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              ✓
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Session Complete!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You reviewed all {words.length} cards in <strong>{data.category}</strong>
          </p>
          <div className="flex justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">{sessionStats.correct}</div>
              <div className="text-sm text-gray-400 mt-1">Correct</div>
            </div>
            <div className="w-px bg-gray-100 dark:bg-gray-800" />
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{sessionStats.wrong}</div>
              <div className="text-sm text-gray-400 mt-1">Missed</div>
            </div>
            <div className="w-px bg-gray-100 dark:bg-gray-800" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary dark:text-primary-light">{pct}%</div>
              <div className="text-sm text-gray-400 mt-1">Accuracy</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={restart}
              className="flex-1 py-3 px-5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark active:scale-95 transition-all duration-150"
            >
              Study Again
            </button>
            <Link
              href={`/quiz?category=${category}`}
              className="flex-1 py-3 px-5 rounded-xl border-2 border-primary text-primary dark:text-primary-light font-semibold hover:bg-primary hover:text-white active:scale-95 transition-all duration-150 text-center"
            >
              Take Quiz
            </Link>
            <Link
              href="/"
              className="flex-1 py-3 px-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all duration-150 text-center"
            >
              All Topics
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const cardProgress = getCardProgress(currentWord?.id || '');
  const progressPct = ((currentIndex + 1) / words.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors no-tap-highlight"
        >
          ← Topics
        </Link>
        <div className="text-center">
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">{data.category}</h1>
          <span className="text-xs font-semibold bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light px-2 py-0.5 rounded-full">
            {data.level}
          </span>
        </div>
        <div className="text-sm font-semibold text-gray-400 dark:text-gray-500">
          {currentIndex + 1}<span className="text-gray-300 dark:text-gray-700">/</span>{words.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Leitner box indicator */}
      <div className="flex items-center justify-center gap-2 mb-5">
        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Box</span>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map(box => (
            <div
              key={box}
              className={`box-dot ${
                box < cardProgress.box
                  ? 'filled'
                  : box === cardProgress.box
                  ? 'active'
                  : 'empty'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {cardProgress.box === 5 ? '⭐ Mastered' : `Level ${cardProgress.box}`}
        </span>
      </div>

      {/* Flashcard */}
      <div className="flashcard-scene mb-5" onClick={flip}>
        <div className={`flashcard ${flipped ? 'flipped' : ''}`}>
          {/* Front — German */}
          <div className="flashcard-face flashcard-front">
            <button
              onClick={e => { e.stopPropagation(); speak(currentWord.german); }}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light hover:bg-primary hover:text-white transition-all duration-150 text-base"
              title="Listen"
            >
              🔊
            </button>
            <div className="space-y-2">
              {currentWord.article && (
                <div className="text-primary/60 dark:text-primary-light/60 text-sm font-medium tracking-wide uppercase">
                  {currentWord.article}
                </div>
              )}
              <div className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                {currentWord.german}
              </div>
              {currentWord.exampleDE && (
                <div className="text-sm text-gray-400 dark:text-gray-500 italic mt-3 max-w-xs mx-auto">
                  &ldquo;{currentWord.exampleDE}&rdquo;
                </div>
              )}
            </div>
            <div className="absolute bottom-4 text-xs text-gray-300 dark:text-gray-700 font-medium flex items-center gap-1">
              <span>👆</span> Tap to reveal
            </div>
          </div>

          {/* Back — English */}
          <div className="flashcard-face flashcard-back">
            <div className="space-y-2">
              <div className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
                Translation
              </div>
              <div className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                {currentWord.english}
              </div>
              {currentWord.exampleEN && (
                <div className="text-sm text-white/70 italic mt-3 max-w-xs mx-auto">
                  &ldquo;{currentWord.exampleEN}&rdquo;
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rate buttons (only when flipped) */}
      <div className={`transition-all duration-300 ${flipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mb-3 font-medium">How well did you know this?</p>
        <div className="flex gap-3">
          <button
            onClick={() => rate(false)}
            className="flex-1 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-100 dark:hover:bg-red-900/40 active:scale-95 transition-all duration-150"
          >
            😕 Forgot
          </button>
          <button
            onClick={() => rate(true)}
            className="flex-1 py-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400 font-semibold text-sm hover:bg-yellow-100 dark:hover:bg-yellow-900/40 active:scale-95 transition-all duration-150"
          >
            🤔 Hard
          </button>
          <button
            onClick={() => rate(true)}
            className="flex-1 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 font-semibold text-sm hover:bg-green-100 dark:hover:bg-green-900/40 active:scale-95 transition-all duration-150"
          >
            😊 Easy
          </button>
        </div>
      </div>

      {/* Nav arrows */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 no-tap-highlight"
        >
          ◀
        </button>
        <p className="text-xs text-gray-400 dark:text-gray-600 hidden sm:block">
          Space to flip · ← → to navigate
        </p>
        <button
          onClick={next}
          disabled={currentIndex === words.length - 1}
          className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 no-tap-highlight"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
