# Harsimar Singh portfolio

A React, Vite, JavaScript, and Phaser 3 portfolio. The title menu opens a small pixel town, while **View Portfolio** and the in-game **Sections** menu provide direct access to all five sections. Portfolio content is kept in `src/data/`; the town uses an original pixel-art atlas authored in `src/game/townArt.js`.

## Set up and run

Use Node.js `^20.19.0` or `>=22.12.0` (the version range required by the installed Vite release). From the repository root:

```sh
npm ci
npm run dev
```

Open the Local URL printed by Vite, normally `http://localhost:5173/`. To validate changes:

```sh
npm test
npm run test:ui
npm run build
npm run preview
```

`npm test` checks data validation, movement, collisions, door reachability, and viewport zoom. `npm run test:ui` checks React menus, panels, data-driven cards, touch controls, and game continuity with a test canvas. `npm run build` validates the data and writes the production site to `dist/`. `npm run preview` serves that built output locally.

## Controls

| Screen | Desktop | Phone or tablet |
| --- | --- | --- |
| Title | Up/Down selects; Enter opens | Tap New Game, View Portfolio, or Settings |
| Town | WASD or arrow keys move; E or Space interacts | Hold a D-pad direction; tap Interact near a door |
| Interiors | Move with the same controls; E inspects a nearby exhibit; Escape exits to town | D-pad and Interact; Exit Room returns to town |
| Panels | Escape closes | Tap × to close; swipe to scroll |

Use **Portfolio/Sections** in town to open all sections without walking. The panel tabs switch sections directly. **Map** also opens any location, **Quest** tracks sections visited this session, and **Bag/Inventory** shows collected crystals. **Main Menu** returns to the title. Sound effects are optional, start off on a first visit, and can be changed with **SFX** or title Settings. The choice is stored in browser local storage; audio does not autoplay.

## Project structure

| Path | Purpose |
| --- | --- |
| `src/pages/` | Title/game flow and portfolio overlay composition |
| `src/components/` | Reusable cards, panels, menus, and touch controls |
| `src/game/` | Phaser town, authored map, movement/collisions, sound, and game tests |
| `src/data/` | Profile, projects, skills, achievements, navigation, and validation |
| `src/styles/` | Full-screen, portfolio, game, and mobile CSS |
| `src/assets/` | Original title landscape and asset notes |
| `scripts/` | Data check and UI smoke check |

The town atlas contains reusable terrain tiles, animated water, trees, flowers, building and character sprites. Signs use a local bitmap alphabet and stay clear of the HUD. Artwork is separate from the collision map and portfolio data. See [asset notes](src/assets/README.md) for the art pipeline; reduced-motion preferences disable water and walking animation.

## Edit portfolio content

### Current professional content

The portfolio contains nine supplied projects, categorized skills, five achievement/involvement records, and genuine profile/contact information. Project statuses distinguish development, concepts, frontend work, and exploratory work. Repository URLs, live demos, screenshots, résumé, and GitHub profile are unavailable and remain empty. LogSage AI is a documented future idea and is not included in the current nine-project collection.

`profile.js` also supports optional `educationRecords` and `experience` arrays (`id`, `title`, `description`), `learningPriorities` strings, and `contact.phone`. These create About Me exhibits and conventional profile sections automatically. Phone actions use `tel:`; email uses `mailto:`. Edit these files directly to update content. Demo mockup assets are unused and are not evidence of real projects.

Add only verified personal work. Edit `src/data/profile.js` for your introduction, education, interests, and contact details. Empty contact values display “Coming soon.” Add a résumé PDF under `public/` and set `resume: '/resume.pdf'`, or use a public HTTP(S) URL.

To add a project, edit **only** the array in `src/data/projects.js`. Replace this illustrative template with real details:

```js
export const projects = defineProjects([
  {
    id: 'unique-project-id',
    title: 'Verified project title',
    description: 'Describe the project and your contribution.',
    detailedDescription: 'A fuller description of the work.',
    technologies: ['Technology name'],
    category: 'Category name',
    status: 'Current status',
    github: '', // Optional HTTP(S) URL
    liveDemo: '',   // Optional HTTP(S) URL
    image: '',     // Optional HTTP(S) URL or /path under public/
    featured: false,
  },
])
```

Each entry automatically gets a Project Center card. `featured: true` puts it in the Featured filter. Empty URLs hide their buttons; missing or failed images leave a text card.

To add a skill, edit **only** the array in `src/data/skills.js`:

```js
export const skills = defineSkills([
  {
    id: 'unique-skill-id',
    name: 'Verified skill name',
    category: 'Category name',
    icon: '',        // Optional glyph, HTTP(S) image URL, or /path under public/
    description: '', // Optional explanation
  },
])
```

Skills sharing a category group automatically in the Developer Lab. Add achievements the same way in `src/data/achievements.js` inside `defineAchievements([ ... ])`; each needs a unique `id`, `title`, and `description`, with optional `date`, `image`, and `credentialUrl`. They appear automatically in the Hall of Fame. See [the data guide](src/data/README.md) for its full example.

The validators reject missing required fields, duplicate IDs within a list, and invalid URL values. Ordinary content edits do not require a component or game-engine change. Refresh the browser after saving data files, then run the test and build commands above.

## Deploy

This is a static Vite site. On a static host, set the install command to `npm ci`, the build command to `npm run build`, and the publish/output directory to `dist`. Uploading the contents of `dist/` after a successful build also works. The app uses URL hashes such as `#projects` for section links, so no server-side route rewrite is needed for those links.

The default Vite base path is `/`, suitable for a domain root. If hosting under a subpath such as `/portfolio/`, set Vite's `base` to that path in `vite.config.js` before building. No deployment credentials or personal links are required to run locally.


### Project Archive

Entering Project Center opens a walkable gallery. Approach a wall display and press E to inspect its project in a large exhibition panel. Escape closes inspection at the same room position; a second Escape exits to the original town position. The conventional Portfolio/Sections menu still opens the complete archive directly. In that archive, browse with Previous/Next, Left/Right keys, or a horizontal swipe, and filter All/Featured. Mobile preview and details scroll together.

Add entries only to `src/data/projects.js`. Required fields are `id`, `title`, `description`, `technologies` (array), `status`, and `featured` (boolean). Optional fields: `category`, `image`, `github`, and `liveDemo`. Empty links are hidden; absent or failed images show a placeholder. Local image paths start with `/` and refer to files in `public/`. IDs must be unique. Legacy `shortDescription`, `detailedDescription`, `githubUrl`, and `demoUrl` remain supported. The archive uses `description` when provided.

`npm run test:ui` includes test-only archive fixtures for navigation, wrapping, featured filtering, missing links, failed images, and game continuity. These fixtures are not portfolio content.

Camera scaling: the authored town stays 672x512 world pixels with 16px tiles. Desktop uses integer 2x zoom (32px tiles, 68px avatar); compact views use 1x with 2x signs. The camera follows within world bounds and centers the town in larger canvases instead of magnifying it. HUD rows reserve space outside the canvas. ResizeObserver updates Phaser's canvas and camera viewport without changing movement or collision coordinates.

### Optional background music

The original 48-second `Moonlit Commit` loop lives at `public/assets/audio/moonlit-commit.wav`. Its composition, generation instructions and CC0 license are documented alongside the file. Regenerate it with `python scripts/generate-town-music.py`.

Use the HUD's music button to start or stop it. Music is off on every new visit to the world; it is never started by page load or saved preferences. The volume slider starts at 25%; 0% mutes music. SFX remains independently controlled. Opening portfolio panels keeps the same audio element and playback position. Returning to the title screen or unmounting the game pauses and releases the media; reentering starts with music off. Playback errors show a retry message. The file is only loaded after pressing Play.

### Milo portfolio guide

Milo is an original SVG pixel cat with CSS blinking and tail motion, respecting reduced-motion preferences. The bottom-right button opens an accessible local chat. Enter sends; Shift+Enter adds a line; Escape closes. The world and touch controls pause while chatting, and the conversation stays in React memory across closing and screen transitions (a reload clears it).

`src/data/portfolioGuide.js` reads profile, projects, skills, and achievements directly and returns `{ text, section, links }`. It uses deterministic matching/search, not an AI model, and makes no network requests. Adding validated portfolio entries automatically updates its knowledge. Unknown facts and empty links are explicitly unavailable. `src/components/PortfolioCat.jsx` handles presentation separately; any future server-side AI integration should preserve this response contract and keep API keys off the frontend.

### Opening intro

`BootIntro.jsx` paints an original 480×270 pixel landscape once, enlarged with nearest-neighbor rendering. CSS handles the scan reveal, stars, mist, meteor and fade; reduced motion disables these effects. It prepares only the existing title SVG, with a clearly labeled cinematic boot bar. The sequence lasts approximately 7 seconds including the 450ms exit; WORLD READY reflects resource readiness independently of the animation. Reduced-motion visitors get a brief 150ms ready state. Optional image failure or a 2.5-second timeout cannot trap visitors. All timers and image handlers are cleaned up under Strict Mode.

Flow: fresh visit → intro → existing title menu → New Game → normal Phaser initialization. Recognized section hashes bypass the intro. Returning to the menu does not replay it. No Phaser scene, world data, audio behavior or title-menu buttons are replaced.

### Explorable building interiors

All five buildings use the existing Phaser instance and player controls. Project Center is a project gallery, Developer Lab groups skills by category, About Me is a furnished personal office, Hall of Fame displays achievements, and Contact Center contains a communication exhibit. Walls, desks, bookshelves, plants, and the office chair have collisions. Rooms add horizontal gallery bays automatically after every three exhibits; the bounded camera follows the player through them.

- `src/game/interiors.js`: data-to-exhibit mapping, stable IDs, layout, furniture bounds, and room collision helpers.
- `src/game/interiorArt.js`: original pixel furniture, tiled floors, framed displays, lamps, rugs, plants, and exit artwork.
- `src/game/TownScene.js`: enter/exit, preserved town position, exhibit proximity, and camera bounds.
- `src/components/ExhibitInspection.jsx`: reusable inspection presentation using the existing project, skill, and achievement renderers.
- `src/styles/interiors.css`: responsive exhibition framing.

Add real entries to the existing data files and refresh to create their physical displays automatically. If a collection is emptied, it shows an explicitly labeled information exhibit. No fictional sample projects or achievements are published. Project screenshots and valid links appear in inspection. Blank URLs are omitted. The room palettes and furniture themes can be adjusted independently in `ROOM_THEMES` and `interiorArt.js` without changing portfolio data.

E/Space near the entrance mat or the HUD's Exit Room button returns to town. Escape first closes an inspection, then exits the room. Inspecting a display updates the existing exploration tracker. Opening conventional sections or Milo pauses movement; closing them keeps the same room and player position. Music retains the same audio instance across transitions. Reduced motion skips the brief room fade.

Interior tests cover reachable exhibits/exits, wall and furniture collisions, data-generated exhibits and expanded layouts. UI smoke checks exercise inspection pause/resume and canvas continuity with test-only fixture data; these complement manual testing of the actual Phaser game.

#   P o r t f o l i o  
 