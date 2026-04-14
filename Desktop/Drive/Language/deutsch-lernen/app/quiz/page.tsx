import { Suspense } from 'react';
import QuizClient from './QuizClient';

export default function QuizPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  return (
    <Suspense fallback={<LoadingState />}>
      <QuizClient category={searchParams.category || ''} />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
      <p className="text-gray-400">Loading quiz…</p>
    </div>
  );
}
