# 🇩🇪 Deutsch Lernen — Learn German

A simple, free German vocabulary learning website built with vanilla HTML, CSS, and JavaScript. No frameworks, no server, no cost.

## Features

- **Flashcards** — 3D flip cards with German pronunciation via Web Speech API
- **Spaced Repetition** — Leitner box system tracks what you know and shows hard words more often
- **Quizzes** — Multiple-choice quizzes auto-generated from vocabulary data
- **Progress Tracking** — Streak counter, accuracy stats, and mastery levels (stored in localStorage)
- **Dark Mode** — Toggle between light and dark themes
- **Mobile Responsive** — Fully usable on phones and tablets

## Quick Start

1. Open the project in VS Code
2. Install the **Live Server** extension
3. Right-click `index.html` → "Open with Live Server"
4. Start learning!

> **Note:** You need a local server (like Live Server) because the site loads JSON data via `fetch()`, which doesn't work with `file://` URLs.

Alternatively, run from terminal:
```bash
cd deutsch-lernen
python -m http.server 8000
# Then open http://localhost:8000
```

## Project Structure

```
deutsch-lernen/
├── index.html          ← Home page (topic grid)
├── flashcards.html     ← Flashcard study mode
├── quiz.html           ← Multiple choice quiz
├── progress.html       ← Stats dashboard
├── css/
│   ├── main.css        ← Global styles, nav, typography
│   ├── flashcard.css   ← 3D flip card animations
│   └── quiz.css        ← Quiz-specific styles
├── js/
│   ├── app.js          ← Shared utilities, theme, nav
│   ├── flashcard.js    ← Flashcard engine + Leitner logic
│   ├── quiz.js         ← Quiz engine, scoring
│   ├── audio.js        ← Web Speech API pronunciation
│   └── progress.js     ← localStorage manager, stats
├── data/
│   └── vocabulary/     ← JSON word lists by topic
│       ├── a1-greetings.json
│       ├── a1-numbers.json
│       └── a1-colors.json
└── images/
```

## Adding New Vocabulary

Create a new JSON file in `data/vocabulary/` following this format:

```json
{
  "category": "Food",
  "level": "A2",
  "words": [
    {
      "id": "food-001",
      "german": "Brot",
      "english": "Bread",
      "article": "das",
      "exampleDE": "Ich kaufe Brot.",
      "exampleEN": "I buy bread.",
      "difficulty": 1
    }
  ]
}
```

Then add a topic card to `index.html` linking to your new file.

## Deploy to GitHub Pages

1. Create a GitHub repository
2. Push this folder to the repo
3. Go to Settings → Pages → Select branch → Save
4. Your site is live at `username.github.io/deutsch-lernen`

## Tech Stack

- HTML5, CSS3, JavaScript (ES6+)
- Web Speech API (German pronunciation)
- localStorage (progress persistence)
- Google Fonts (Inter)

## License

Free to use and modify.
