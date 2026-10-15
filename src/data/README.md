# Edit portfolio content

All visitor-facing facts live in this directory. The town only opens section IDs; adding a project, skill, or achievement requires **no game or component changes**. Empty lists show a placeholder. Do not publish the templates below as real entries: replace their values with verified facts.

## Profile

Edit `profile.js` for name, role, education, introduction, about text, and `interests` (an array of strings). Fill `contact.email`, `contact.github`, `contact.linkedin`, and `contact.resume` when ready. Empty contact values show “Coming soon.” Put a PDF in `public/` and use `resume: '/resume.pdf'`, or use a public `https://` URL.

## Add a project

Add an object inside `defineProjects([ ... ])` in `projects.js`. This **template is not portfolio data**:

```js
{
  id: 'replace-with-unique-project-id',
  title: 'Replace with verified title',
  shortDescription: 'One sentence for the card.',
  detailedDescription: 'A fuller account of the work.',
  technologies: ['Replace with technology'],
  category: 'Replace with category',
  status: 'Replace with current development status',
  githubUrl: '', // Optional https:// URL.
  demoUrl: '',   // Optional https:// URL.
  image: '',     // Optional public URL or /path under public/.
  featured: false,
},
```

Every project automatically gets a card. The **Featured** filter shows entries with `featured: true`. Empty URLs hide their buttons, and an absent or failed image leaves a clean text card. Visitors can expand “More details” to read the detailed description.

## Add a skill

Add an object inside `defineSkills([ ... ])` in `skills.js`:

```js
{
  id: 'replace-with-unique-skill-id',
  name: 'Replace with verified skill',
  category: 'Replace with category',
  icon: '',        // Optional emoji, public URL, or /path under public/.
  description: '', // Optional short explanation.
},
```

Skills with the same `category` appear together automatically. Categories appear in the order of their first skill.

## Add an achievement

Add an object inside `defineAchievements([ ... ])` in `achievements.js`:

```js
{
  id: 'replace-with-unique-achievement-id',
  title: 'Replace with verified milestone',
  description: 'What happened and why it matters.',
  date: '',          // Optional date text.
  image: '',         // Optional public URL or /path under public/.
  credentialUrl: '', // Optional https:// credential URL.
},
```

Each entry automatically appears in the Hall of Fame. Missing dates, images, and credential URLs are simply omitted.

## Validation and navigation

Required fields must be non-empty strings. IDs must be unique within each list. `technologies` must be a string array, `featured` a boolean, and supplied URLs must be valid HTTP(S) links or allowed local image/résumé paths. Invalid entries fail clearly during development and build. Run `npm test`, `npm run test:ui`, and `npm run build` after editing.

`navigation.js` controls the five existing section labels and menu order. Keep its IDs aligned with the five buildings in `src/game/townMap.js`; ordinary content additions never require editing navigation or the game.

## Extended profile fields

Optional `educationRecords` and `experience` arrays accept unique `id`, `title`, and `description` strings. They render as individual About Me exhibits and conventional profile records. `learningPriorities` is an optional string array. `contact.phone` is an optional display string used in a `tel:` link. Leave unavailable GitHub, resume, project URL, and image fields empty; never substitute fictional links.
