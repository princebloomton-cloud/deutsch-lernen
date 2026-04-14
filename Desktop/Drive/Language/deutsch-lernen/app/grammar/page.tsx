'use client';

import { useState } from 'react';

const GRAMMAR_TOPICS = [
  {
    id: 'articles',
    icon: '📌',
    title: 'Articles (der, die, das)',
    level: 'A1',
    description: 'German nouns have three genders: masculine, feminine, and neuter.',
    sections: [
      {
        heading: 'The Three Genders',
        content: `Every German noun has a gender — masculine (der), feminine (die), or neuter (das). Unlike English, German gender must be learned with each word.`,
        table: {
          headers: ['Gender', 'Definite', 'Indefinite', 'Example'],
          rows: [
            ['Masculine', 'der', 'ein', 'der Mann (the man)'],
            ['Feminine', 'die', 'eine', 'die Frau (the woman)'],
            ['Neuter', 'das', 'ein', 'das Kind (the child)'],
            ['Plural (all)', 'die', 'keine', 'die Kinder (the children)'],
          ],
        },
      },
      {
        heading: '💡 Tips for Remembering Gender',
        content: `• Words ending in -ung, -heit, -keit, -schaft are usually feminine (die)\n• Words ending in -chen, -lein are neuter (das)\n• Words ending in -er (agent) are usually masculine (der)\n• Always learn the article together with the noun!`,
        table: null,
      },
    ],
  },
  {
    id: 'nominative',
    icon: '1️⃣',
    title: 'Nominative Case',
    level: 'A1',
    description: 'The subject of the sentence — who or what is doing the action.',
    sections: [
      {
        heading: 'When to Use Nominative',
        content: `The nominative case is used for the subject of the sentence — the person or thing performing the action. It's the "basic" form of a noun.`,
        table: {
          headers: ['', 'Masculine', 'Feminine', 'Neuter', 'Plural'],
          rows: [
            ['Definite', 'der', 'die', 'das', 'die'],
            ['Indefinite', 'ein', 'eine', 'ein', '—'],
          ],
        },
      },
      {
        heading: '📖 Examples',
        content: `• **Der Hund** ist groß. (The dog is big.)\n• **Eine Katze** schläft. (A cat is sleeping.)\n• **Das Buch** ist neu. (The book is new.)`,
        table: null,
      },
    ],
  },
  {
    id: 'accusative',
    icon: '2️⃣',
    title: 'Accusative Case',
    level: 'A1',
    description: 'The direct object — what or whom the action is directed at.',
    sections: [
      {
        heading: 'When to Use Accusative',
        content: `The accusative case marks the direct object of the verb. Only the masculine article changes (der → den, ein → einen). Feminine, neuter, and plural stay the same as nominative.`,
        table: {
          headers: ['', 'Masculine', 'Feminine', 'Neuter', 'Plural'],
          rows: [
            ['Definite', 'den ⚡', 'die', 'das', 'die'],
            ['Indefinite', 'einen ⚡', 'eine', 'ein', '—'],
          ],
        },
      },
      {
        heading: '📖 Examples',
        content: `• Ich sehe **den Mann**. (I see the man.)\n• Er kauft **einen Apfel**. (He buys an apple.)\n• Sie liebt **die Musik**. (She loves the music.)`,
        table: null,
      },
    ],
  },
  {
    id: 'dative',
    icon: '3️⃣',
    title: 'Dative Case',
    level: 'A2',
    description: 'The indirect object — to whom or for whom the action is done.',
    sections: [
      {
        heading: 'When to Use Dative',
        content: `The dative case marks the indirect object. It's also used after certain prepositions: mit, nach, bei, von, seit, aus, zu, gegenüber.`,
        table: {
          headers: ['', 'Masculine', 'Feminine', 'Neuter', 'Plural'],
          rows: [
            ['Definite', 'dem', 'der', 'dem', 'den (+n)'],
            ['Indefinite', 'einem', 'einer', 'einem', '—'],
          ],
        },
      },
      {
        heading: '📖 Examples',
        content: `• Ich gebe **dem Mann** das Buch. (I give the man the book.)\n• Sie hilft **ihrer Mutter**. (She helps her mother.)\n• Er fährt **mit dem Bus**. (He travels by bus.)`,
        table: null,
      },
    ],
  },
  {
    id: 'genitive',
    icon: '4️⃣',
    title: 'Genitive Case',
    level: 'B1',
    description: 'Possession and belonging — whose something is.',
    sections: [
      {
        heading: 'When to Use Genitive',
        content: `The genitive expresses possession or belonging. In spoken German, "von + dative" is often used instead. Masculine and neuter nouns add -s or -es.`,
        table: {
          headers: ['', 'Masculine', 'Feminine', 'Neuter', 'Plural'],
          rows: [
            ['Definite', 'des (+s)', 'der', 'des (+s)', 'der'],
            ['Indefinite', 'eines (+s)', 'einer', 'eines (+s)', '—'],
          ],
        },
      },
      {
        heading: '📖 Examples',
        content: `• Das Auto **des Mannes** (The man's car)\n• Die Tasche **der Frau** (The woman's bag)\n• Das Spielzeug **des Kindes** (The child's toy)`,
        table: null,
      },
    ],
  },
  {
    id: 'verb-conjugation',
    icon: '🔄',
    title: 'Verb Conjugation (Present)',
    level: 'A1',
    description: 'How to conjugate regular verbs in the present tense.',
    sections: [
      {
        heading: 'Regular Verbs (-en ending)',
        content: `German verbs change their ending depending on the subject. The stem is found by removing -en from the infinitive. For example: spielen → spiel-`,
        table: {
          headers: ['Person', 'Ending', 'spielen (play)', 'lernen (learn)'],
          rows: [
            ['ich (I)', '-e', 'spiele', 'lerne'],
            ['du (you inf.)', '-st', 'spielst', 'lernst'],
            ['er/sie/es', '-t', 'spielt', 'lernt'],
            ['wir (we)', '-en', 'spielen', 'lernen'],
            ['ihr (you pl.)', '-t', 'spielt', 'lernt'],
            ['Sie/sie', '-en', 'spielen', 'lernen'],
          ],
        },
      },
      {
        heading: '🔑 Common Irregular Verbs',
        content: `Some verbs are irregular and must be memorised:`,
        table: {
          headers: ['Infinitive', 'ich', 'du', 'er/sie/es', 'wir'],
          rows: [
            ['sein (be)', 'bin', 'bist', 'ist', 'sind'],
            ['haben (have)', 'habe', 'hast', 'hat', 'haben'],
            ['werden (become)', 'werde', 'wirst', 'wird', 'werden'],
            ['können (can)', 'kann', 'kannst', 'kann', 'können'],
            ['wollen (want)', 'will', 'willst', 'will', 'wollen'],
          ],
        },
      },
    ],
  },
  {
    id: 'modal-verbs',
    icon: '💬',
    title: 'Modal Verbs',
    level: 'A2',
    description: 'können, müssen, wollen, dürfen, sollen, mögen.',
    sections: [
      {
        heading: 'The Six Modal Verbs',
        content: `Modal verbs modify the meaning of the main verb. In a sentence, the modal is conjugated and the main verb goes to the end in infinitive form.\n\n**Ich muss lernen.** (I must learn.) — muss is conjugated, lernen stays infinite at the end.`,
        table: {
          headers: ['Modal', 'Meaning', 'ich', 'du', 'er/sie/es', 'wir'],
          rows: [
            ['können', 'can / be able to', 'kann', 'kannst', 'kann', 'können'],
            ['müssen', 'must / have to', 'muss', 'musst', 'muss', 'müssen'],
            ['wollen', 'want to', 'will', 'willst', 'will', 'wollen'],
            ['dürfen', 'may / be allowed', 'darf', 'darfst', 'darf', 'dürfen'],
            ['sollen', 'should / shall', 'soll', 'sollst', 'soll', 'sollen'],
            ['mögen', 'like to', 'mag', 'magst', 'mag', 'mögen'],
          ],
        },
      },
      {
        heading: '📖 Examples',
        content: `• Ich **kann** Deutsch **sprechen**. (I can speak German.)\n• Du **musst** das **lernen**. (You must learn this.)\n• Er **will** nach Berlin **fahren**. (He wants to go to Berlin.)`,
        table: null,
      },
    ],
  },
  {
    id: 'perfect-tense',
    icon: '⏮️',
    title: 'Perfect Tense (Perfekt)',
    level: 'A2',
    description: 'Talking about completed past actions in spoken German.',
    sections: [
      {
        heading: 'Structure: haben/sein + Partizip II',
        content: `The Perfekt is the most common past tense in spoken German. It uses an auxiliary verb (haben or sein) + the past participle (Partizip II).\n\n**Most verbs use haben.** Verbs of motion or change of state use **sein**.`,
        table: {
          headers: ['Verb', 'Partizip II', 'Auxiliary', 'Example'],
          rows: [
            ['machen', 'gemacht', 'haben', 'Ich habe gemacht'],
            ['spielen', 'gespielt', 'haben', 'Er hat gespielt'],
            ['fahren', 'gefahren', 'sein', 'Ich bin gefahren'],
            ['gehen', 'gegangen', 'sein', 'Sie ist gegangen'],
            ['schreiben', 'geschrieben', 'haben', 'Wir haben geschrieben'],
          ],
        },
      },
      {
        heading: 'Forming Partizip II',
        content: `• Regular verbs: ge- + stem + -t (machen → gemacht)\n• Verbs with -ieren: no ge- prefix (studieren → studiert)\n• Strong (irregular) verbs: ge- + changed stem + -en (fahren → gefahren)`,
        table: null,
      },
    ],
  },
  {
    id: 'adjective-endings',
    icon: '🎨',
    title: 'Adjective Endings',
    level: 'B1',
    description: 'How adjectives change depending on case, gender, and article.',
    sections: [
      {
        heading: 'After Definite Articles (der/die/das)',
        content: `When an adjective follows a definite article, it uses "weak" endings:`,
        table: {
          headers: ['Case', 'Masculine', 'Feminine', 'Neuter', 'Plural'],
          rows: [
            ['Nominative', 'der alte Mann', 'die alte Frau', 'das alte Kind', 'die alten Kinder'],
            ['Accusative', 'den alten Mann', 'die alte Frau', 'das alte Kind', 'die alten Kinder'],
            ['Dative', 'dem alten Mann', 'der alten Frau', 'dem alten Kind', 'den alten Kindern'],
          ],
        },
      },
      {
        heading: 'Quick Rule',
        content: `• After definite articles: mostly **-e** (nom/acc neut/fem) or **-en** (everywhere else)\n• After indefinite articles: the adjective carries more information → stronger endings\n• Without any article: the adjective does all the work (strong declension)`,
        table: null,
      },
    ],
  },
];

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light',
  A2: 'bg-accent/15 dark:bg-accent/20 text-accent dark:text-accent-light',
  B1: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
};

function parseContent(text: string) {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    // Bold
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} className="text-gray-600 dark:text-gray-400 leading-relaxed mb-1">
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j} className="text-gray-800 dark:text-gray-200">{part}</strong> : part
        )}
      </p>
    );
  });
}

export default function GrammarPage() {
  const [activeId, setActiveId] = useState<string>(GRAMMAR_TOPICS[0].id);

  const activeTopic = GRAMMAR_TOPICS.find(t => t.id === activeId) || GRAMMAR_TOPICS[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Grammar</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Cases, conjugation, articles — from A1 to B1
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <nav className="flex flex-col gap-1 sticky top-24">
            {GRAMMAR_TOPICS.map(topic => (
              <button
                key={topic.id}
                onClick={() => setActiveId(topic.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  activeId === topic.id
                    ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className="text-xl">{topic.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{topic.title}</div>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${LEVEL_COLORS[topic.level]}`}>
                    {topic.level}
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 animate-fade-in" key={activeId}>
          <div className="rounded-2xl bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 shadow-card dark:shadow-card-dark p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-3xl flex-shrink-0">
                {activeTopic.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {activeTopic.title}
                  </h2>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[activeTopic.level]}`}>
                    {activeTopic.level}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{activeTopic.description}</p>
              </div>
            </div>

            <div className="space-y-8">
              {activeTopic.sections.map((section, si) => (
                <div key={si}>
                  <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-3">
                    {section.heading}
                  </h3>
                  <div className="mb-4">{parseContent(section.content)}</div>

                  {section.table && (
                    <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-900/50">
                            {section.table.headers.map((h, i) => (
                              <th
                                key={i}
                                className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.table.rows.map((row, ri) => (
                            <tr
                              key={ri}
                              className="border-b border-gray-50 dark:border-gray-800/50 last:border-0 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
                            >
                              {row.map((cell, ci) => (
                                <td
                                  key={ci}
                                  className={`px-4 py-3 ${
                                    ci === 0
                                      ? 'font-semibold text-gray-700 dark:text-gray-300'
                                      : cell.includes('⚡')
                                      ? 'text-primary dark:text-primary-light font-semibold'
                                      : 'text-gray-600 dark:text-gray-400'
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Navigation between topics */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
              {(() => {
                const idx = GRAMMAR_TOPICS.findIndex(t => t.id === activeId);
                const prev = GRAMMAR_TOPICS[idx - 1];
                const next = GRAMMAR_TOPICS[idx + 1];
                return (
                  <>
                    {prev ? (
                      <button
                        onClick={() => setActiveId(prev.id)}
                        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors"
                      >
                        ← {prev.title}
                      </button>
                    ) : <div />}
                    {next ? (
                      <button
                        onClick={() => setActiveId(next.id)}
                        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors"
                      >
                        {next.title} →
                      </button>
                    ) : <div />}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
