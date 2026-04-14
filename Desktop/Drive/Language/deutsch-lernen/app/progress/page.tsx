'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStats, getQuizScores, resetAll } from '@/lib/progress';
import type { OverallStats } from '@/types';

const QUIZ_IDS = ['quiz-a1-greetings', 'quiz-a1-numbers', 'quiz-a1-colors'];
const QUIZ_LABELS: Record<string, string> = {
  'quiz-a1-greetings': '👋 Greetings',
  'quiz-a1-numbers': '🔢 Numbers',
  'quiz-a1-colors': '🎨 Colors',
};

function StatCard({
  value,
  label,
  icon,
  color,
}: {
  value: string | number;
  label: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 shadow-card dark:shadow-card-dark p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-black text-gray-900 dark:text-gray-100">{value}</div>
        <div className="text-sm text-gray-400 dark:text-gray-500 font-medium">{label}</div>
      </div>
    </div>
  );
}

function CircularProgress({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const pct = max > 0 ? (value / max) * 100 : 0;
  const dash = (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="7" className="text-gray-100 dark:text-gray-800" />
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke="currentColor" strokeWidth="7"
            strokeDasharray={`${dash} ${circumference}`}
            strokeLinecap="round"
            className={`progress-ring-circle ${color}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xl font-black ${color.replace('text-', 'text-')}`}>{value}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">{max > 0 ? `/${max}` : ''}</span>
        </div>
      </div>
      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  );
}

export default function ProgressPage() {
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [quizHistory, setQuizHistory] = useState<Record<string, { score: number; total: number; date: number }[]>>({});
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setStats(getStats());
    const history: typeof quizHistory = {};
    QUIZ_IDS.forEach(id => {
      history[id] = getQuizScores(id).slice(-5).reverse();
    });
    setQuizHistory(history);
  }, []);

  function handleReset() {
    resetAll();
    setStats(getStats());
    setQuizHistory({});
    setConfirmReset(false);
    window.location.reload();
  }

  if (!stats) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto" />
      </div>
    );
  }

  const hasData = stats.totalWords > 0 || stats.quizzesTaken > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Your Progress</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Track your learning streak and mastery across all topics
        </p>
      </div>

      {/* Streak banner */}
      <div className={`rounded-2xl p-5 mb-6 flex items-center gap-4 ${
        stats.streak > 0
          ? 'bg-gradient-to-r from-accent/20 to-accent/5 dark:from-accent/15 dark:to-transparent border border-accent/20'
          : 'bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800'
      }`}>
        <span className="text-4xl">{stats.streak > 0 ? '🔥' : '💤'}</span>
        <div>
          <div className="text-2xl font-black text-gray-900 dark:text-gray-100">
            {stats.streak > 0 ? `${stats.streak} Day Streak!` : 'No streak yet'}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {stats.streak > 0
              ? 'Keep coming back daily to maintain your streak'
              : 'Study today to start your streak'}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard value={stats.totalWords} label="Words Studied" icon="📚" color="bg-primary/10 dark:bg-primary/20" />
        <StatCard value={`${stats.accuracy}%`} label="Accuracy" icon="🎯" color="bg-accent/15 dark:bg-accent/20" />
        <StatCard value={stats.quizzesTaken} label="Quizzes Taken" icon="✏️" color="bg-purple-50 dark:bg-purple-900/20" />
        <StatCard value={stats.streak} label="Day Streak" icon="🔥" color="bg-orange-50 dark:bg-orange-900/20" />
      </div>

      {/* Mastery breakdown */}
      {hasData && (
        <div className="rounded-2xl bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 shadow-card dark:shadow-card-dark p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-5">Word Mastery</h2>
          <div className="flex justify-around">
            <CircularProgress
              value={stats.mastered}
              max={stats.totalWords}
              color="text-green-500"
              label="Mastered"
            />
            <CircularProgress
              value={stats.learning}
              max={stats.totalWords}
              color="text-yellow-500"
              label="Learning"
            />
            <CircularProgress
              value={stats.newCards}
              max={stats.totalWords}
              color="text-gray-400"
              label="New"
            />
          </div>
          <div className="mt-4 text-center text-sm text-gray-400 dark:text-gray-500">
            {stats.mastered} mastered · {stats.learning} in progress · {stats.newCards} unseen
          </div>
        </div>
      )}

      {/* Quiz history */}
      <div className="rounded-2xl bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 shadow-card dark:shadow-card-dark p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Quiz History</h2>
        {QUIZ_IDS.map(id => {
          const attempts = quizHistory[id] || [];
          const best = attempts.length > 0
            ? Math.round((Math.max(...attempts.map(a => a.score / a.total)) * 100))
            : null;
          return (
            <div key={id} className="mb-4 last:mb-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {QUIZ_LABELS[id]}
                </span>
                {best !== null && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    best >= 80
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : best >= 60
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400'
                  }`}>
                    Best: {best}%
                  </span>
                )}
              </div>
              {attempts.length > 0 ? (
                <div className="flex gap-1.5">
                  {attempts.slice(0, 5).map((a, i) => {
                    const pct = Math.round((a.score / a.total) * 100);
                    return (
                      <div
                        key={i}
                        className="flex-1 relative group"
                        title={`${pct}% — ${new Date(a.date).toLocaleDateString()}`}
                      >
                        <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-400'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="text-center text-xs text-gray-400 mt-0.5">{pct}%</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-600">
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full" />
                  <span>Not attempted</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {!hasData && (
        <div className="rounded-2xl bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 p-8 text-center mb-6">
          <div className="text-5xl mb-3">🌱</div>
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">Your journey starts here</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-5">
            Complete your first flashcard session to see your progress here
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-all duration-150"
          >
            Start Learning →
          </Link>
        </div>
      )}

      {/* Reset */}
      <div className="text-center">
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="text-sm text-gray-400 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-500 transition-colors"
          >
            Reset all progress
          </button>
        ) : (
          <div className="inline-flex flex-col items-center gap-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Are you sure? This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Yes, reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
