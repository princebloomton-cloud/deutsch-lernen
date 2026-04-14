'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getStreak, updateStreak, getCategoryProgress, getCardProgress } from '@/lib/progress';
import type { TopicConfig } from '@/types';

const A1_TOPICS: TopicConfig[] = [
  {
    id: 'a1-greetings',
    icon: '👋',
    title: 'Greetings',
    description: 'Hallo, Guten Tag, Tschüss — essential first words',
    wordCount: 15,
    level: 'A1',
    category: 'a1-greetings',
    available: true,
  },
  {
    id: 'a1-numbers',
    icon: '🔢',
    title: 'Numbers',
    description: 'Eins, zwei, drei — count from 1 to 20',
    wordCount: 20,
    level: 'A1',
    category: 'a1-numbers',
    available: true,
  },
  {
    id: 'a1-colors',
    icon: '🎨',
    title: 'Colors',
    description: 'Rot, blau, grün — learn all the colors',
    wordCount: 12,
    level: 'A1',
    category: 'a1-colors',
    available: true,
  },
];

const A2_TOPICS: TopicConfig[] = [
  {
    id: 'a2-food',
    icon: '🍕',
    title: 'Food & Drink',
    description: 'Brot, Kaffee, Wasser — ordering and groceries',
    wordCount: 0,
    level: 'A1',
    category: 'a2-food',
    available: false,
  },
  {
    id: 'a2-family',
    icon: '👨‍👩‍👧‍👦',
    title: 'Family',
    description: 'Mutter, Vater, Bruder — family members',
    wordCount: 0,
    level: 'A1',
    category: 'a2-family',
    available: false,
  },
  {
    id: 'a2-dates',
    icon: '📅',
    title: 'Days & Months',
    description: 'Montag, Januar — time and dates',
    wordCount: 0,
    level: 'A1',
    category: 'a2-dates',
    available: false,
  },
];

// Word IDs per category for progress tracking
const CATEGORY_IDS: Record<string, string[]> = {
  'a1-greetings': Array.from({ length: 15 }, (_, i) => `greet-${String(i + 1).padStart(3, '0')}`),
  'a1-numbers': Array.from({ length: 20 }, (_, i) => `num-${String(i + 1).padStart(3, '0')}`),
  'a1-colors': Array.from({ length: 12 }, (_, i) => `color-${String(i + 1).padStart(3, '0')}`),
};

function LevelBadge({ level, variant = 'primary' }: { level: string; variant?: 'primary' | 'accent' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide ${
        variant === 'primary'
          ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light'
          : 'bg-accent/15 dark:bg-accent/20 text-accent dark:text-accent-light'
      }`}
    >
      {level}
    </span>
  );
}

function TopicCard({ topic }: { topic: TopicConfig }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (topic.available && CATEGORY_IDS[topic.category]) {
      setProgress(getCategoryProgress(CATEGORY_IDS[topic.category]));
    }
  }, [topic]);

  if (!topic.available) {
    return (
      <div className="relative rounded-2xl p-5 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 opacity-60 select-none">
        <div className="absolute top-3 right-3">
          <span className="text-xs text-gray-400 dark:text-gray-600 font-medium bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
            Coming soon
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-2xl mb-3">
          {topic.icon}
        </div>
        <h3 className="font-semibold text-gray-500 dark:text-gray-500 mb-1">{topic.title}</h3>
        <p className="text-xs text-gray-400 dark:text-gray-600">{topic.description}</p>
      </div>
    );
  }

  return (
    <div className="group relative rounded-2xl p-5 border border-gray-100 dark:border-gray-800 bg-white dark:bg-card-dark shadow-card dark:shadow-card-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
      {/* Progress indicator */}
      {progress > 0 && (
        <div className="absolute top-4 right-4">
          <div className="relative w-9 h-9">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-100 dark:text-gray-800" />
              <circle
                cx="18" cy="18" r="14" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeDasharray={`${(progress / 100) * 87.96} 87.96`}
                strokeLinecap="round"
                className="progress-ring-circle text-primary dark:text-primary-light"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-primary dark:text-primary-light">
              {progress}%
            </span>
          </div>
        </div>
      )}

      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform duration-200">
        {topic.icon}
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{topic.title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">{topic.description}</p>

      <div className="text-xs text-gray-400 dark:text-gray-500 mb-3 font-medium">
        {topic.wordCount} words
      </div>

      {/* Progress bar */}
      {progress > 0 && (
        <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full mb-3 overflow-hidden">
          <div
            className="h-full bg-primary dark:bg-primary-light rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2 mt-auto">
        <Link
          href={`/flashcards?category=${topic.category}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark active:scale-95 transition-all duration-150 no-tap-highlight"
        >
          <span>🃏</span> Flashcards
        </Link>
        <Link
          href={`/quiz?category=${topic.category}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border-2 border-primary text-primary dark:text-primary-light text-sm font-semibold hover:bg-primary hover:text-white active:scale-95 transition-all duration-150 no-tap-highlight"
        >
          <span>✏️</span> Quiz
        </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const s = updateStreak();
    setStreak(s);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">

      {/* Hero */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
          <span>🇩🇪</span> Free German Learning
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 leading-tight">
          <span className="gradient-text">Learn German</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">
          Pick a topic to start studying with flashcards and quizzes
        </p>

        {/* Streak banner */}
        {streak > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 bg-accent/15 dark:bg-accent/20 text-accent dark:text-accent-light font-semibold text-sm px-5 py-2 rounded-full animate-scale-in">
            <span className="text-base">🔥</span>
            {streak} day streak — keep it going!
          </div>
        )}
      </div>

      {/* A1 Section */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <LevelBadge level="A1" variant="primary" />
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Beginner</h2>
          <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
          <span className="text-sm text-gray-400 dark:text-gray-500">{A1_TOPICS.length} topics</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {A1_TOPICS.map(topic => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>

      {/* A2 Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <LevelBadge level="A2" variant="accent" />
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Elementary</h2>
          <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
          <span className="text-sm text-gray-400 dark:text-gray-500">Coming soon</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {A2_TOPICS.map(topic => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>

      {/* Footer tip */}
      <div className="mt-12 text-center text-sm text-gray-400 dark:text-gray-600">
        💡 Tip: Study flashcards daily to build your streak and reinforce memory
      </div>
    </div>
  );
}
