'use client';

import { useState } from 'react';
import { speak } from '@/lib/audio';

interface WordToken {
  word: string;
  translation?: string;
  isHighlight?: boolean;
}

interface ReadingText {
  id: string;
  title: string;
  level: 'A1' | 'A2' | 'B1';
  topic: string;
  readingTime: number; // minutes
  tokens: (WordToken | string)[];
  vocabulary: { german: string; english: string; example: string }[];
  questions: { question: string; options: string[]; answer: number }[];
}

const TEXTS: ReadingText[] = [
  {
    id: 'r-a1-1',
    title: 'Mein Name ist Anna',
    level: 'A1',
    topic: 'Introductions',
    readingTime: 2,
    tokens: [
      { word: 'Hallo', translation: 'Hello', isHighlight: true },
      '! Mein ',
      { word: 'Name', translation: 'name', isHighlight: true },
      ' ist Anna. Ich komme aus ',
      { word: 'Deutschland', translation: 'Germany', isHighlight: true },
      '. Ich bin ',
      { word: 'zwanzig', translation: 'twenty', isHighlight: true },
      ' Jahre alt. Ich lerne gerne ',
      { word: 'Sprachen', translation: 'languages', isHighlight: true },
      '. Deutsch ist ',
      { word: 'schön', translation: 'beautiful', isHighlight: true },
      '. Wie heißen Sie? ',
      { word: 'Woher', translation: 'Where from', isHighlight: true },
      ' kommen Sie? Ich ',
      { word: 'freue', translation: 'am pleased', isHighlight: true },
      ' mich, Sie ',
      { word: 'kennenzulernen', translation: 'to meet you', isHighlight: true },
      '.',
    ],
    vocabulary: [
      { german: 'der Name', english: 'the name', example: 'Mein Name ist Anna.' },
      { german: 'kommen aus', english: 'to come from', example: 'Ich komme aus Deutschland.' },
      { german: 'Jahre alt', english: 'years old', example: 'Ich bin zwanzig Jahre alt.' },
      { german: 'gerne', english: 'gladly / enjoy', example: 'Ich lerne gerne Deutsch.' },
      { german: 'schön', english: 'beautiful / nice', example: 'Deutsch ist schön.' },
      { german: 'woher', english: 'where from', example: 'Woher kommen Sie?' },
    ],
    questions: [
      {
        question: 'How old is Anna?',
        options: ['15', '18', '20', '25'],
        answer: 2,
      },
      {
        question: 'Where does Anna come from?',
        options: ['Austria', 'Switzerland', 'Germany', 'France'],
        answer: 2,
      },
      {
        question: 'What does Anna enjoy learning?',
        options: ['Music', 'Languages', 'Sports', 'Cooking'],
        answer: 1,
      },
    ],
  },
  {
    id: 'r-a1-2',
    title: 'Ein Tag in Berlin',
    level: 'A1',
    topic: 'Daily Life',
    readingTime: 3,
    tokens: [
      'Es ist ',
      { word: 'Montag', translation: 'Monday', isHighlight: true },
      ', der erste Tag meiner ',
      { word: 'Reise', translation: 'journey/trip', isHighlight: true },
      ' nach Berlin. Das ',
      { word: 'Wetter', translation: 'weather', isHighlight: true },
      ' ist ',
      { word: 'sonnig', translation: 'sunny', isHighlight: true },
      ' und ',
      { word: 'warm', translation: 'warm', isHighlight: true },
      '. Ich gehe zum ',
      { word: 'Brandenburger Tor', translation: 'Brandenburg Gate', isHighlight: true },
      '. Es ist sehr ',
      { word: 'groß', translation: 'big', isHighlight: true },
      ' und ',
      { word: 'beeindruckend', translation: 'impressive', isHighlight: true },
      '. Ich mache viele ',
      { word: 'Fotos', translation: 'photos', isHighlight: true },
      '. Am ',
      { word: 'Abend', translation: 'evening', isHighlight: true },
      ' esse ich in einem ',
      { word: 'Restaurant', translation: 'restaurant', isHighlight: true },
      '. Ich bestelle ',
      { word: 'Schnitzel', translation: 'schnitzel (breaded meat)', isHighlight: true },
      ' — es ist ',
      { word: 'lecker', translation: 'delicious', isHighlight: true },
      '!',
    ],
    vocabulary: [
      { german: 'die Reise', english: 'the journey / trip', example: 'Ich mache eine Reise nach Berlin.' },
      { german: 'das Wetter', english: 'the weather', example: 'Das Wetter ist schön heute.' },
      { german: 'sonnig', english: 'sunny', example: 'Es ist sonnig und warm.' },
      { german: 'groß', english: 'big / large', example: 'Das Brandenburger Tor ist sehr groß.' },
      { german: 'beeindruckend', english: 'impressive', example: 'Die Stadt ist beeindruckend.' },
      { german: 'lecker', english: 'delicious / tasty', example: 'Das Schnitzel ist lecker!' },
    ],
    questions: [
      {
        question: 'What day of the week is it?',
        options: ['Sunday', 'Monday', 'Tuesday', 'Friday'],
        answer: 1,
      },
      {
        question: 'What is the weather like?',
        options: ['Rainy and cold', 'Cloudy', 'Sunny and warm', 'Windy'],
        answer: 2,
      },
      {
        question: 'What does the narrator eat in the evening?',
        options: ['Bratwurst', 'Pizza', 'Schnitzel', 'Döner'],
        answer: 2,
      },
    ],
  },
  {
    id: 'r-a2-1',
    title: 'Meine Familie',
    level: 'A2',
    topic: 'Family',
    readingTime: 3,
    tokens: [
      'Ich habe eine ',
      { word: 'große', translation: 'large', isHighlight: true },
      ' Familie. Mein ',
      { word: 'Vater', translation: 'father', isHighlight: true },
      ' heißt Klaus und ist ',
      { word: 'Ingenieur', translation: 'engineer', isHighlight: true },
      ' von ',
      { word: 'Beruf', translation: 'profession', isHighlight: true },
      '. Meine ',
      { word: 'Mutter', translation: 'mother', isHighlight: true },
      ' heißt Maria und arbeitet als ',
      { word: 'Lehrerin', translation: 'teacher (f.)', isHighlight: true },
      ' an einer ',
      { word: 'Grundschule', translation: 'primary school', isHighlight: true },
      '. Ich habe zwei ',
      { word: 'Geschwister', translation: 'siblings', isHighlight: true },
      ': einen älteren ',
      { word: 'Bruder', translation: 'brother', isHighlight: true },
      ' und eine jüngere ',
      { word: 'Schwester', translation: 'sister', isHighlight: true },
      '. Mein Bruder studiert ',
      { word: 'Medizin', translation: 'medicine', isHighlight: true },
      ' in München. Meine Schwester ist noch in der ',
      { word: 'Schule', translation: 'school', isHighlight: true },
      '. Wir ',
      { word: 'treffen', translation: 'meet', isHighlight: true },
      ' uns jeden Sonntag zum ',
      { word: 'Mittagessen', translation: 'lunch', isHighlight: true },
      ' bei den ',
      { word: 'Großeltern', translation: 'grandparents', isHighlight: true },
      '.',
    ],
    vocabulary: [
      { german: 'der Vater', english: 'the father', example: 'Mein Vater ist Ingenieur.' },
      { german: 'die Mutter', english: 'the mother', example: 'Meine Mutter ist Lehrerin.' },
      { german: 'die Geschwister', english: 'the siblings', example: 'Ich habe zwei Geschwister.' },
      { german: 'der Bruder', english: 'the brother', example: 'Mein Bruder studiert Medizin.' },
      { german: 'die Schwester', english: 'the sister', example: 'Meine Schwester ist jung.' },
      { german: 'die Großeltern', english: 'the grandparents', example: 'Wir besuchen die Großeltern.' },
    ],
    questions: [
      {
        question: "What is the narrator's father's job?",
        options: ['Doctor', 'Engineer', 'Teacher', 'Chef'],
        answer: 1,
      },
      {
        question: 'Where does the brother study?',
        options: ['Berlin', 'Hamburg', 'Munich', 'Frankfurt'],
        answer: 2,
      },
      {
        question: 'When does the family meet?',
        options: ['Every Saturday', 'Every Sunday', 'Every Friday', 'Every holiday'],
        answer: 1,
      },
    ],
  },
  {
    id: 'r-b1-1',
    title: 'Das deutsche Schulsystem',
    level: 'B1',
    topic: 'Education',
    readingTime: 4,
    tokens: [
      'Das deutsche ',
      { word: 'Schulsystem', translation: 'school system', isHighlight: true },
      ' ist anders als in vielen anderen ',
      { word: 'Ländern', translation: 'countries', isHighlight: true },
      '. Kinder beginnen mit der ',
      { word: 'Grundschule', translation: 'primary school', isHighlight: true },
      ' im Alter von sechs Jahren, die vier Jahre ',
      { word: 'dauert', translation: 'lasts', isHighlight: true },
      '. Danach ',
      { word: 'wechseln', translation: 'switch / transfer', isHighlight: true },
      ' sie in eine ',
      { word: 'weiterführende Schule', translation: 'secondary school', isHighlight: true },
      '. Es gibt ',
      { word: 'verschiedene', translation: 'various / different', isHighlight: true },
      ' Schultypen: das ',
      { word: 'Gymnasium', translation: 'grammar school (leads to Abitur)', isHighlight: true },
      ', die ',
      { word: 'Realschule', translation: 'intermediate school', isHighlight: true },
      ' und die ',
      { word: 'Hauptschule', translation: 'lower secondary school', isHighlight: true },
      '. Das Gymnasium ',
      { word: 'endet', translation: 'ends', isHighlight: true },
      ' mit dem ',
      { word: 'Abitur', translation: 'A-levels / university entrance exam', isHighlight: true },
      ', das für ein ',
      { word: 'Studium', translation: 'university degree', isHighlight: true },
      ' an der ',
      { word: 'Universität', translation: 'university', isHighlight: true },
      ' ',
      { word: 'notwendig', translation: 'necessary', isHighlight: true },
      ' ist.',
    ],
    vocabulary: [
      { german: 'dauern', english: 'to last / take (time)', example: 'Die Grundschule dauert vier Jahre.' },
      { german: 'wechseln', english: 'to switch / change', example: 'Kinder wechseln die Schule nach der 4. Klasse.' },
      { german: 'verschiedene', english: 'various / different', example: 'Es gibt verschiedene Schultypen.' },
      { german: 'das Abitur', english: 'German school-leaving exam (A-levels)', example: 'Das Abitur öffnet die Tür zur Universität.' },
      { german: 'notwendig', english: 'necessary / required', example: 'Das Abitur ist für ein Studium notwendig.' },
      { german: 'die Universität', english: 'university', example: 'Er studiert an der Universität Berlin.' },
    ],
    questions: [
      {
        question: 'At what age do German children start school?',
        options: ['4', '5', '6', '7'],
        answer: 2,
      },
      {
        question: 'How many years does the Grundschule last?',
        options: ['3', '4', '5', '6'],
        answer: 1,
      },
      {
        question: 'Which school type leads to the Abitur?',
        options: ['Hauptschule', 'Realschule', 'Gymnasium', 'Grundschule'],
        answer: 2,
      },
    ],
  },
];

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light',
  A2: 'bg-accent/15 dark:bg-accent/20 text-accent dark:text-accent-light',
  B1: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
};

function ReadingView({ text, onBack }: { text: ReadingText; onBack: () => void }) {
  const [tooltip, setTooltip] = useState<{ word: string; translation: string } | null>(null);
  const [showVocab, setShowVocab] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [qScore, setQScore] = useState(0);
  const [qDone, setQDone] = useState(false);

  function handleAnswer(idx: number) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === text.questions[qIndex].answer) setQScore(s => s + 1);
    setTimeout(() => {
      if (qIndex + 1 >= text.questions.length) {
        setQDone(true);
      } else {
        setQIndex(q => q + 1);
        setSelected(null);
        setAnswered(false);
      }
    }, 1500);
  }

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors mb-6"
      >
        ← All Texts
      </button>

      {/* Header */}
      <div className="rounded-2xl bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 shadow-card dark:shadow-card-dark p-6 mb-5">
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${LEVEL_COLORS[text.level]}`}>
            {text.level}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{text.topic}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">· {text.readingTime} min read</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{text.title}</h2>

        {/* Tip */}
        <div className="bg-primary/5 dark:bg-primary/10 rounded-xl px-4 py-2.5 text-sm text-primary dark:text-primary-light font-medium mb-4">
          💡 Tap highlighted words to see their translation
        </div>

        {/* Text */}
        <div className="text-lg leading-9 text-gray-700 dark:text-gray-300 relative">
          {text.tokens.map((token, i) => {
            if (typeof token === 'string') {
              return <span key={i}>{token}</span>;
            }
            if (!token.isHighlight) {
              return <span key={i}>{token.word}</span>;
            }
            const isActive = tooltip?.word === token.word;
            return (
              <span
                key={i}
                className="relative inline-block"
              >
                <button
                  onClick={() => {
                    if (isActive) {
                      setTooltip(null);
                    } else {
                      setTooltip({ word: token.word, translation: token.translation || '' });
                      speak(token.word);
                    }
                  }}
                  className={`font-semibold underline decoration-dotted underline-offset-4 transition-colors cursor-pointer no-tap-highlight ${
                    isActive
                      ? 'text-primary dark:text-primary-light decoration-primary bg-primary/10 dark:bg-primary/20 rounded px-0.5'
                      : 'text-primary dark:text-primary-light decoration-primary/40 hover:decoration-primary'
                  }`}
                >
                  {token.word}
                </button>
                {isActive && (
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg animate-scale-in">
                    {token.translation}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900 dark:border-t-gray-700" />
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => { setShowVocab(v => !v); setShowQuiz(false); }}
          className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all duration-150 ${
            showVocab
              ? 'border-primary bg-primary text-white'
              : 'border-primary text-primary dark:text-primary-light hover:bg-primary hover:text-white'
          }`}
        >
          📝 Vocabulary ({text.vocabulary.length})
        </button>
        <button
          onClick={() => { setShowQuiz(v => !v); setShowVocab(false); setQIndex(0); setQDone(false); setQScore(0); setAnswered(false); setSelected(null); }}
          className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all duration-150 ${
            showQuiz
              ? 'border-accent bg-accent text-white'
              : 'border-accent text-accent dark:text-accent-light hover:bg-accent hover:text-white'
          }`}
        >
          ✏️ Comprehension Quiz
        </button>
      </div>

      {/* Vocabulary */}
      {showVocab && (
        <div className="rounded-2xl bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 shadow-card dark:shadow-card-dark p-6 animate-slide-up mb-5">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Key Vocabulary</h3>
          <div className="space-y-3">
            {text.vocabulary.map((v, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <button
                  onClick={() => speak(v.german)}
                  className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light hover:bg-primary hover:text-white transition-colors text-sm mt-0.5"
                >
                  🔊
                </button>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-gray-900 dark:text-gray-100">{v.german}</span>
                    <span className="text-gray-400 dark:text-gray-500">—</span>
                    <span className="text-primary dark:text-primary-light font-medium">{v.english}</span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 italic">{v.example}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz */}
      {showQuiz && (
        <div className="rounded-2xl bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 shadow-card dark:shadow-card-dark p-6 animate-slide-up">
          {qDone ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-3">{qScore === text.questions.length ? '🏆' : qScore >= 2 ? '⭐' : '📚'}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {qScore}/{text.questions.length} Correct
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {qScore === text.questions.length ? 'Perfect comprehension!' : 'Read again to improve!'}
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-gray-100">Comprehension Check</h3>
                <span className="text-sm text-gray-400 dark:text-gray-500">{qIndex + 1}/{text.questions.length}</span>
              </div>
              <p className="text-gray-800 dark:text-gray-200 font-medium mb-4">{text.questions[qIndex].question}</p>
              <div className="space-y-2">
                {text.questions[qIndex].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={answered}
                    className={`answer-btn ${
                      answered && i === text.questions[qIndex].answer
                        ? 'correct'
                        : answered && selected === i && i !== text.questions[qIndex].answer
                        ? 'wrong'
                        : ''
                    }`}
                  >
                    <span className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded text-xs font-bold ${
                      answered && i === text.questions[qIndex].answer
                        ? 'bg-green-500 text-white'
                        : answered && selected === i
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                    }`}>
                      {['A','B','C','D'][i]}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReadingPage() {
  const [selectedText, setSelectedText] = useState<ReadingText | null>(null);
  const [filterLevel, setFilterLevel] = useState<'All' | 'A1' | 'A2' | 'B1'>('All');

  const filtered = filterLevel === 'All' ? TEXTS : TEXTS.filter(t => t.level === filterLevel);

  if (selectedText) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <ReadingView text={selectedText} onBack={() => setSelectedText(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Reading</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Read German texts with interactive vocabulary — A1 to B1
        </p>
      </div>

      {/* Level filter */}
      <div className="flex gap-2 mb-6">
        {(['All', 'A1', 'A2', 'B1'] as const).map(l => (
          <button
            key={l}
            onClick={() => setFilterLevel(l)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
              filterLevel === l
                ? 'bg-primary text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(text => (
          <button
            key={text.id}
            onClick={() => setSelectedText(text)}
            className="w-full text-left rounded-2xl bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 shadow-card dark:shadow-card-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover hover:border-primary/40 dark:hover:border-primary/40 p-5 transition-all duration-200 hover:-translate-y-0.5 group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${LEVEL_COLORS[text.level]}`}>
                    {text.level}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{text.topic}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                  {text.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                  <span>⏱ {text.readingTime} min</span>
                  <span>📝 {text.vocabulary.length} vocabulary words</span>
                  <span>✏️ {text.questions.length} quiz questions</span>
                </div>
              </div>
              <span className="text-primary dark:text-primary-light text-xl opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
