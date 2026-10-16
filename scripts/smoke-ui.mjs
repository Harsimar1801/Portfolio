import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'

const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: 'http://localhost/' })
dom.window.scrollTo = () => {}
const mediaCalls = { play: 0, pause: 0, load: 0 }
dom.window.HTMLMediaElement.prototype.play = function () { mediaCalls.play++; return Promise.resolve() }
dom.window.HTMLMediaElement.prototype.pause = function () { mediaCalls.pause++ }
dom.window.HTMLMediaElement.prototype.load = function () { mediaCalls.load++ }
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  HTMLElement: dom.window.HTMLElement,
  HTMLButtonElement: dom.window.HTMLButtonElement,
  IS_REACT_ACT_ENVIRONMENT: true,
  requestAnimationFrame: (callback) => setTimeout(callback, 0),
})

const React = await import('react')
const { createRoot } = await import('react-dom/client')
const { renderToString } = await import('react-dom/server')
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })

try {
  const { default: TitleScreen } = await vite.ssrLoadModule('/src/components/TitleScreen.jsx')
  const { default: App } = await vite.ssrLoadModule('/src/pages/App.jsx')
  const { default: GamePage } = await vite.ssrLoadModule('/src/pages/GamePage.jsx')
  const { default: PortfolioPage } = await vite.ssrLoadModule('/src/pages/PortfolioPage.jsx')
  const { default: TouchControls } = await vite.ssrLoadModule('/src/components/TouchControls.jsx')
  const { ProjectGallery, SkillGroups, AchievementList } = await vite.ssrLoadModule('/src/components/PortfolioCards.jsx')
  const { CRYSTALS } = await vite.ssrLoadModule('/src/game/townMap.js')
  const container = document.getElementById('root')
  const root = createRoot(container)
  const renderSection = async (id) => React.act(async () => root.render(React.createElement(PortfolioPage, { activeSection: id, onSelectSection() {}, onClose() {} })))
  await renderSection('about')
  await renderSection('skills')
  assert.ok(document.querySelector('.stage-out'), 'Outgoing content animates first')
  await renderSection('projects')
  await renderSection('contact')
  await React.act(async () => new Promise((resolve) => setTimeout(resolve, 270)))
  assert.match(document.querySelector('#portfolio-title').textContent, /Contact/, 'Rapid switching settles on latest section')
  assert.equal(document.querySelectorAll('.portfolio-stage').length, 1, 'Only one section stage exists')
  assert.ok(document.querySelector('.stage-idle'), 'Transition cleans up')
  const originalMatchMedia = window.matchMedia
  window.matchMedia = () => ({ matches: true })
  await renderSection('skills')
  assert.match(document.querySelector('#portfolio-title').textContent, /Developer Lab/, 'Reduced motion switches immediately')
  assert.ok(document.querySelector('.stage-idle'))
  window.matchMedia = originalMatchMedia
  await React.act(async () => root.render(null))
  const { default: ControlsGuide } = await vite.ssrLoadModule('/src/components/ControlsGuide.jsx')
  await React.act(async () => root.render(React.createElement(ControlsGuide)))
  assert.match(document.querySelector('.controls-guide').textContent, /World Clock/)
  await React.act(async () => document.querySelector('.controls-guide button').click())
  assert.equal(document.querySelector('#exploration-instructions'), null, 'Guide minimizes')
  await React.act(async () => root.render(null))
  await React.act(async () => root.render(React.createElement(ControlsGuide)))
  assert.equal(document.querySelector('.controls-guide button').getAttribute('aria-expanded'), 'false', 'Guide remembers preference during page session')
  await React.act(async () => root.render(null))
  const { default: DeveloperSecret } = await vite.ssrLoadModule('/src/components/DeveloperSecret.jsx')
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
  function SecretHarness({ blocked = false }) {
    const [open, onChange] = React.useState(false)
    return React.createElement(React.Fragment, null, React.createElement('input', { 'aria-label': 'Typing test' }), React.createElement(DeveloperSecret, { blocked, open, onChange }))
  }
  const enterCode = async (target = window) => {
    for (const key of konami) await React.act(async () => target.dispatchEvent(new window.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })))
  }
  await React.act(async () => root.render(React.createElement(SecretHarness, { blocked: true })))
  await enterCode()
  assert.equal(document.querySelector('.secret-terminal'), null, 'Other panels block the code')
  await React.act(async () => root.render(React.createElement(SecretHarness)))
  await enterCode(document.querySelector('input'))
  assert.equal(document.querySelector('.secret-terminal'), null, 'Typing cannot trigger the secret')
  await enterCode()
  assert.match(document.querySelector('.secret-terminal').textContent, /CHEAT CODE ACCEPTED/)
  assert.match(document.querySelector('.secret-fact').textContent, /VIT Vellore/)
  await enterCode()
  assert.equal(document.querySelectorAll('.secret-terminal').length, 1, 'Open secret cannot trigger duplicates')
  await React.act(async () => window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })))
  assert.equal(document.querySelector('.secret-terminal'), null, 'Escape closes the secret')
  await enterCode()
  await React.act(async () => window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true })))
  assert.equal(document.querySelector('.secret-terminal'), null, 'Enter closes the secret')
  await React.act(async () => root.render(null))
  const { default: BootIntro } = await vite.ssrLoadModule('/src/components/BootIntro.jsx')
  const originalImage = globalThis.Image
  const originalContext = dom.window.HTMLCanvasElement.prototype.getContext
  const bootImages = []
  globalThis.Image = class { constructor() { bootImages.push(this) } }
  dom.window.HTMLCanvasElement.prototype.getContext = () => ({ fillRect() {} })
  let bootExits = 0
  await React.act(async () => root.render(React.createElement(React.StrictMode, null, React.createElement(BootIntro, { onComplete: () => { bootExits++ } }))))
  assert.match(document.querySelector('.boot-status').textContent, /PREPARING TITLE ARTWORK/)
  assert.equal(document.querySelector('[role="progressbar"]').hasAttribute('aria-valuenow'), false, 'No invented progress percentage')
  assert.equal(bootImages[0].onload, null, 'StrictMode cleans up the first load callback')
  await React.act(async () => bootImages.at(-1).onerror())
  assert.match(document.querySelector('.boot-status').textContent, /WORLD READY/, 'Optional image failure does not block startup')
  await React.act(async () => new Promise((resolve) => setTimeout(resolve, 7200)))
  assert.equal(bootExits, 1, 'StrictMode completes the intro exactly once')
  await React.act(async () => root.render(null))
  function TestGame(props) {
    return React.createElement(GamePage, { ...props, CanvasComponent: () => React.createElement('div', { className: 'test-restored-town' }) })
  }
  const app = () => React.createElement(React.StrictMode, null, React.createElement(App, { GameComponent: TestGame }))
  const { projects: liveProjects } = await vite.ssrLoadModule('/src/data/projects.js')
  for (const hash of ['#contact', '#skills', `#projects/${liveProjects[1].id}`, '#town', '#title']) {
    await React.act(async () => root.render(null))
    dom.reconfigure({ url: `http://localhost/${hash}` })
    await React.act(async () => root.render(app()))
    assert.equal(document.querySelector('.boot-intro'), null, 'Restorable view skips intro')
    if (hash === '#title') assert.ok([...document.querySelectorAll('button')].some((button) => button.textContent.includes('New Game')))
    else assert.ok(document.querySelector('.test-restored-town'))
    if (hash === '#contact') assert.match(document.querySelector('#portfolio-title').textContent, /Contact/)
    if (hash === '#skills') assert.match(document.querySelector('#portfolio-title').textContent, /Developer Lab/)
    if (hash.startsWith('#projects/')) assert.equal(document.querySelector('.archive-project').dataset.projectId, liveProjects[1].id)
  }
  await React.act(async () => root.render(null))
  dom.reconfigure({ url: `http://localhost/#projects/${liveProjects[1].id}` })
  await React.act(async () => root.render(app()))
  await React.act(async () => document.querySelector('[aria-label="Next project"]').click())
  assert.equal(window.location.hash, `#projects/${liveProjects[2].id}`, 'Project browsing updates a stable URL')
  await React.act(async () => root.render(null))
  await React.act(async () => root.render(app()))
  assert.equal(document.querySelector('.archive-project').dataset.projectId, liveProjects[2].id, 'Reload restores the chosen project')
  await React.act(async () => root.render(null))
  window.sessionStorage.setItem('harsimar-exhibit-v1', JSON.stringify({ section: 'projects', id: `project:${liveProjects[1].id}` }))
  dom.reconfigure({ url: 'http://localhost/#town' })
  await React.act(async () => root.render(app()))
  assert.equal(document.querySelector('.archive-project').dataset.projectId, liveProjects[1].id, 'Room project inspection restores from current data')
  await React.act(async () => document.querySelector('[aria-label="Close exhibit"]').click())
  assert.equal(document.querySelector('.exhibit-panel'), null, 'Restored inspection closes normally')
  await React.act(async () => root.render(null))
  dom.reconfigure({ url: 'http://localhost/#contact' })
  await React.act(async () => root.render(app()))
  await React.act(async () => [...document.querySelectorAll('.portfolio-tabs button')].find((button) => button.textContent.includes('Developer Lab')).click())
  assert.equal(window.location.hash, '#skills')
  await React.act(async () => { window.history.back(); await new Promise((resolve) => setTimeout(resolve, 50)) })
  await React.act(async () => new Promise((resolve) => setTimeout(resolve, 270)))
  assert.match(document.querySelector('#portfolio-title').textContent, /Contact/, 'Back restores contact')
  await React.act(async () => { window.history.forward(); await new Promise((resolve) => setTimeout(resolve, 50)) })
  await React.act(async () => new Promise((resolve) => setTimeout(resolve, 270)))
  assert.match(document.querySelector('#portfolio-title').textContent, /Developer Lab/, 'Forward restores skills')
  await React.act(async () => root.render(null))
  window.sessionStorage.clear()
  dom.reconfigure({ url: 'http://localhost/' })
  globalThis.Image = originalImage
  dom.window.HTMLCanvasElement.prototype.getContext = originalContext
  const { default: PortfolioCat } = await vite.ssrLoadModule('/src/components/PortfolioCat.jsx')
  let catSection = null
  function CatHarness() {
    const [open, setOpen] = React.useState(false)
    return React.createElement(PortfolioCat, { open, onOpenChange: setOpen, onNavigate: (id) => { catSection = id } })
  }
  await React.act(async () => root.render(React.createElement(CatHarness)))
  assert.equal(document.querySelector('.milo-panel'), null, 'Cat does not open automatically')
  await React.act(async () => document.querySelector('.milo-launcher').click())
  await React.act(async () => [...document.querySelectorAll('.milo-suggestions button')][0].click())
  assert.ok(document.querySelector('.milo-typing'), 'Guide shows a typing indicator')
  await React.act(async () => new Promise((resolve) => setTimeout(resolve, 400)))
  assert.match(document.querySelector('.milo-log').textContent, /VIT Vellore/)
  await React.act(async () => document.querySelector('.milo-panel header button').click())
  await React.act(async () => document.querySelector('.milo-launcher').click())
  assert.match(document.querySelector('.milo-log').textContent, /VIT Vellore/, 'Closing retains conversation')
  await React.act(async () => document.querySelector('.milo-message button').click())
  assert.equal(catSection, 'about', 'Guide opens the relevant portfolio section')
  await React.act(async () => root.render(null))
  Object.assign(mediaCalls, { play: 0, pause: 0, load: 0 })
  const { default: MusicControls } = await vite.ssrLoadModule('/src/components/MusicControls.jsx')
  await React.act(async () => root.render(React.createElement(MusicControls)))
  const soundtrack = document.querySelector('audio')
  assert.equal(mediaCalls.play, 0, 'Music never autoplays')
  assert.equal(soundtrack.loop, true, 'Music loops')
  assert.equal(soundtrack.volume, 0.25, 'Music starts at a quiet volume')
  await React.act(async () => document.querySelector('[aria-label="Play background music"]').click())
  assert.equal(mediaCalls.play, 1)
  await React.act(async () => root.render(React.createElement(MusicControls)))
  assert.equal(document.querySelector('audio'), soundtrack, 'Renders reuse a single audio element')
  assert.equal(mediaCalls.play, 1, 'Renders do not restart music')
  await React.act(async () => document.querySelector('[aria-label="Stop background music"]').click())
  assert.equal(mediaCalls.pause, 1, 'Disabling music pauses it')
  assert.equal(soundtrack.currentTime, 0, 'Disabling music resets playback')
  await React.act(async () => root.render(null))
  assert.equal(mediaCalls.pause, 2, 'Unmount pauses music')
  assert.equal(mediaCalls.load, 1, 'Unmount releases media resources')
  assert.equal(soundtrack.hasAttribute('src'), false)
  const { default: ProjectArchive } = await vite.ssrLoadModule('/src/components/ProjectArchive.jsx')
  const archiveFixtures = [
    { id: 'qa-one', title: 'QA One', description: 'Test only', technologies: ['React'], status: 'Test', featured: true, github: 'https://example.com/repo', liveDemo: 'https://example.com/demo', image: '/missing-test-image.png' },
    { id: 'qa-two', title: 'QA Two', description: 'Test only', technologies: [], status: 'Test', featured: false },
  ]
  await React.act(async () => root.render(React.createElement(ProjectArchive, { projects: archiveFixtures })))
  assert.match(document.querySelector('.archive-counter').textContent, /Project 1 of 2/)
  assert.equal(document.querySelectorAll('.archive-links a').length, 2)
  assert.equal(document.querySelector('.archive-links a').href, 'https://example.com/repo')
  assert.equal(document.querySelectorAll('.archive-links a')[1].href, 'https://example.com/demo')
  await React.act(async () => document.querySelector('.archive-preview img').dispatchEvent(new window.Event('error')))
  assert.ok(document.querySelector('.archive-placeholder'), 'Failed image has a readable fallback')
  await React.act(async () => document.querySelector('[aria-label="Next project"]').click())
  assert.match(document.querySelector('h2').textContent, /QA Two/)
  assert.match(document.querySelector('.archive-navigation-summary').textContent, /2 OF 2.*QA Two.*loops to first/)
  assert.equal(document.querySelectorAll('.archive-links a').length, 0, 'Missing URLs hide buttons')
  await React.act(async () => window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })))
  assert.match(document.querySelector('h2').textContent, /QA One/, 'Right wraps to first project')
  await React.act(async () => window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })))
  assert.match(document.querySelector('h2').textContent, /QA Two/, 'Left wraps to last project')
  await React.act(async () => document.querySelector('[aria-label="Previous project"]').click())
  assert.match(document.querySelector('h2').textContent, /QA One/)
  await React.act(async () => [...document.querySelectorAll('.portfolio-filter button')][1].click())
  assert.match(document.querySelector('.archive-counter').textContent, /Project 1 of 1/)
  assert.ok(document.querySelector('[aria-label="Next project"]').disabled)
  let newGame = 0
  let portfolio = 0
  let toggles = 0
  const props = {
    onNewGame: () => { newGame++ },
    onPortfolio: () => { portfolio++ },
    onToggleSound: () => { toggles++ },
    soundEnabled: false,
  }

  await React.act(async () => root.render(React.createElement(TitleScreen, props)))
  const buttons = [...document.querySelectorAll('.title-menu button')]
  assert.deepEqual(buttons.map((button) => button.textContent.replace(/\d/g, '').replace('▶', '').trim()), ['New Game', 'View Portfolio', 'Settings'])
  await React.act(async () => buttons[0].click())
  assert.equal(newGame, 1, 'New Game button opens the game')
  await React.act(async () => buttons[1].click())
  assert.equal(portfolio, 1, 'View Portfolio button opens the portfolio')

  await React.act(async () => window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })))
  assert.equal(buttons[1].classList.contains('selected'), true, 'ArrowDown changes selection')
  await React.act(async () => window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })))
  assert.equal(buttons[0].classList.contains('selected'), true, 'ArrowUp changes selection')
  await React.act(async () => window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true })))
  assert.equal(newGame, 2, 'Enter activates selected menu item')

  await React.act(async () => buttons[2].click())
  const soundSwitch = document.querySelector('[role="switch"]')
  assert.ok(soundSwitch, 'Settings opens an accessible dialog')
  await React.act(async () => soundSwitch.click())
  assert.equal(toggles, 1, 'Sound switch calls the setting action')
  await React.act(async () => root.render(React.createElement(TitleScreen, { ...props, soundEnabled: true })))
  assert.equal(document.querySelector('[role="switch"]').getAttribute('aria-checked'), 'true')
  await React.act(async () => window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })))
  assert.equal(document.querySelector('[role="dialog"]'), null, 'Escape closes settings')

  const gameProps = { onTitle() {}, onPortfolio() {}, onSection() {}, onSelectSection() {}, onClosePortfolio() {}, selectedSection: 'about' }
  const gameMarkup = renderToString(React.createElement(GamePage, { ...gameProps, portfolioOpen: false }))
  assert.match(gameMarkup, /Interactive pixel town/)
  assert.match(gameMarkup, /PORTFOLIO ↗/)
  const overlayMarkup = renderToString(React.createElement(GamePage, { ...gameProps, portfolioOpen: true }))
  assert.match(overlayMarkup, /role="dialog"/)
  assert.match(overlayMarkup, /Interactive pixel town/)
  const sectionIds = ['about', 'skills', 'projects', 'achievements', 'contact']
  const sectionTitles = ['About Me', 'Developer Lab', 'PROJECT ARCHIVE', 'Hall of Fame', 'Contact Center']
  for (let index = 0; index < sectionIds.length; index++) {
    const portfolioMarkup = renderToString(React.createElement(PortfolioPage, { activeSection: sectionIds[index], onSelectSection() {}, onClose() {} }))
    assert.match(portfolioMarkup, new RegExp(`<h1 id="portfolio-title">${sectionTitles[index]}`), `Panel opens ${sectionTitles[index]}`)
    assert.equal((portfolioMarkup.match(/class="content-section"/g) ?? []).length, sectionIds[index] === 'projects' ? 0 : 1, 'Only the selected section is shown')
  }
  const hallMarkup = renderToString(React.createElement(AchievementList, { achievements: [] }))
  assert.match(hallMarkup, /collection-empty/, 'Empty Hall of Fame keeps the trophy collection framing')
  const contactMarkup = renderToString(React.createElement(PortfolioPage, { activeSection: 'contact', onSelectSection() {}, onClose() {} }))
  for (const label of ['Email', 'GitHub', 'LinkedIn', 'Résumé']) assert.ok(contactMarkup.includes(label), `Contact has ${label} space`)

  const testProjects = [
    { id: 'test-featured', title: 'Featured test', shortDescription: 'Short', detailedDescription: 'Long description', technologies: ['React'], category: 'Web', status: 'Complete', githubUrl: '', demoUrl: '', image: '/missing-test-image.png', featured: true },
    { id: 'test-other', title: 'Other test', shortDescription: 'Short', detailedDescription: 'Long description', technologies: [], category: 'Tools', status: 'In progress', githubUrl: '', demoUrl: '', image: '', featured: false },
  ]
  await React.act(async () => root.render(React.createElement(ProjectGallery, { projects: testProjects })))
  assert.equal(document.querySelectorAll('[data-project-id]').length, 2, 'Each project gets a card')
  assert.match(document.querySelector('[data-project-id="test-featured"]').textContent, /Complete/, 'Project status appears')
  assert.match(document.querySelector('[data-project-id="test-featured"]').textContent, /React/, 'Project technologies appear')
  assert.equal(document.querySelectorAll('.portfolio-card-links a').length, 0, 'Empty project URLs hide buttons')
  assert.equal(document.querySelectorAll('.portfolio-card-image').length, 1, 'Missing image values do not create an image')
  await React.act(async () => document.querySelector('.portfolio-card-image').dispatchEvent(new window.Event('error', { bubbles: true })))
  assert.equal(document.querySelectorAll('.portfolio-card-image').length, 0, 'Failed images leave a text card')
  await React.act(async () => [...document.querySelectorAll('.portfolio-filter button')].find((button) => button.textContent === 'Featured').click())
  assert.deepEqual([...document.querySelectorAll('[data-project-id]')].map((node) => node.dataset.projectId), ['test-featured'], 'Featured filter selects only flagged projects')

  const testSkills = [{ id: 'test-a', name: 'First test', category: 'Languages' }, { id: 'test-b', name: 'Second test', category: 'Tools' }, { id: 'test-c', name: 'Third test', category: 'Languages' }]
  const skillMarkup = renderToString(React.createElement(SkillGroups, { skills: testSkills }))
  assert.equal((skillMarkup.match(/class="skill-group"/g) ?? []).length, 2, 'Skills group by category')
  assert.match(skillMarkup, /First test/)
  assert.match(skillMarkup, /Third test/)
  assert.match(skillMarkup, /skill-token-mark/, 'Skills without icons use a consistent pixel item')
  const achievementMarkup = renderToString(React.createElement(AchievementList, { achievements: [{ id: 'test-award', title: 'Test award', description: 'Verification only' }] }))
  assert.match(achievementMarkup, /Test award/, 'Achievement data creates a card')
  assert.match(achievementMarkup, /achievement-emblem/, 'Achievements use the collection emblem')
  assert.doesNotMatch(achievementMarkup, /VIEW CREDENTIAL/, 'Empty credential URL hides its button')

  const heldDirections = new Set()
  let touchInteractions = 0
  await React.act(async () => root.render(React.createElement(TouchControls, {
    onDirectionChange: (direction, pressed) => { if (pressed) heldDirections.add(direction); else heldDirections.delete(direction) },
    onInteract: () => { touchInteractions++ },
  })))
  const upControl = document.querySelector('[aria-label="Move up"]')
  await React.act(async () => upControl.dispatchEvent(new window.Event('pointerdown', { bubbles: true, cancelable: true })))
  assert.equal(heldDirections.has('up'), true, 'Holding the touch D-pad starts movement')
  await React.act(async () => upControl.dispatchEvent(new window.Event('pointerup', { bubbles: true, cancelable: true })))
  assert.equal(heldDirections.has('up'), false, 'Releasing the touch D-pad stops movement')
  await React.act(async () => document.querySelector('[aria-label="Interact with nearby building"]').click())
  assert.equal(touchInteractions, 1, 'Touch interaction activates once')

  let mounts = 0
  let mainMenu = 0
  let nextBuilding = sectionIds[0]
  function TestCanvas({ onNavigate, onCollect, paused, virtualControls, interactSignal }) {
    React.useEffect(() => { mounts++ }, [])
    return React.createElement(React.Fragment, null,
      React.createElement('button', { type: 'button', className: 'test-canvas', 'data-paused': String(paused), 'data-interact': interactSignal, 'data-virtual': String(Boolean(virtualControls)), onClick: () => onNavigate(nextBuilding) }, 'Interactive pixel town'),
      React.createElement('button', { type: 'button', className: 'test-collect', onClick: () => onCollect(CRYSTALS[0].id) }, 'Collect test crystal'))
  }
  function GameHarness() {
    const [open, setOpen] = React.useState(false)
    const [section, setSection] = React.useState('about')
    const [sound, setSound] = React.useState(false)
    const openSection = (id) => { setSection(id); setOpen(true) }
    return React.createElement(GamePage, {
      CanvasComponent: TestCanvas, onTitle: () => { mainMenu++ }, onPortfolio: () => openSection('about'), onSection: openSection,
      portfolioOpen: open, selectedSection: section, onSelectSection: setSection, onClosePortfolio: () => setOpen(false),
      soundEnabled: sound, onToggleSound: () => setSound((enabled) => !enabled),
    })
  }
  await React.act(async () => root.render(React.createElement(GameHarness)))
  const canvasNode = document.querySelector('.test-canvas')
  await enterCode()
  assert.equal(canvasNode.dataset.paused, 'true', 'Secret pauses town movement')
  await React.act(async () => window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })))
  assert.equal(canvasNode.dataset.paused, 'false', 'Closing secret resumes town movement')
  assert.equal(document.querySelector('.test-canvas'), canvasNode, 'Secret preserves the same game canvas')
  await React.act(async () => document.querySelector('[aria-label="Interact with nearby building"]').click())
  assert.equal(canvasNode.dataset.interact, '1', 'Mobile interaction reaches the game canvas')
  await React.act(async () => document.querySelector('[aria-controls="town-quest"]').click())
  assert.equal(document.querySelector('[aria-label="Portfolio sections visited"]').value, 0, 'Quest starts at zero')
  assert.equal(canvasNode.dataset.paused, 'true', 'Game pauses while a tool is open')
  await React.act(async () => window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })))
  assert.equal(document.querySelector('#town-quest'), null, 'Escape closes the quest tracker')
  await React.act(async () => document.querySelector('[aria-controls="town-map"]').click())
  assert.equal(document.querySelectorAll('.town-map-marker').length, 5, 'Map shows five locations')
  await React.act(async () => document.querySelector('.town-map-marker').click())
  assert.ok(document.querySelector('[role="dialog"]'), 'Map opens a portfolio section without collecting')
  await React.act(async () => window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })))
  await React.act(async () => document.querySelector('.test-collect').click())
  await React.act(async () => document.querySelector('[aria-controls="town-inventory"]').click())
  assert.match(document.querySelector('#town-inventory').textContent, /West Path Crystal/, 'Collected crystal enters inventory')
  assert.match(document.querySelector('#town-inventory').textContent, /1 \/ 3/, 'Inventory counter updates')
  await React.act(async () => document.querySelector('[aria-label="Close INVENTORY"]').click())
  await React.act(async () => document.querySelector('[aria-label="Enable sound effects"]').click())
  assert.equal(document.querySelector('[aria-label="Mute sound effects"]').getAttribute('aria-pressed'), 'true', 'Sound can be enabled and muted from town')
  await React.act(async () => document.querySelector('[aria-label="Mute sound effects"]').click())
  assert.equal(document.querySelector('[aria-label="Enable sound effects"]').getAttribute('aria-pressed'), 'false')
  for (const id of sectionIds) {
    nextBuilding = id
    await React.act(async () => canvasNode.click())
    assert.equal(document.querySelector('[role="dialog"] h1')?.textContent.replace('_', ''), sectionTitles[sectionIds.indexOf(id)], `${id} opens its panel`)
    assert.equal(canvasNode.dataset.paused, 'true', 'Game pauses while a panel is open')
    if (id === 'about') {
      assert.ok(document.querySelector('[aria-label="Skip dialogue animation"]'), 'Dialogue has a skip control')
      await React.act(async () => document.querySelector('[aria-label="Skip dialogue animation"]').click())
      assert.match(document.querySelector('.rpg-dialogue p').textContent, /Meet the person behind this little town/, 'Skip reveals full dialogue')
      const projectTab = [...document.querySelectorAll('.portfolio-tabs button')].find((button) => button.textContent.includes('Project Center'))
      await React.act(async () => projectTab.click())
      await React.act(async () => new Promise((resolve) => setTimeout(resolve, 260)))
      assert.match(document.querySelector('[role="dialog"] h1').textContent, /PROJECT ARCHIVE/, 'Conventional navigation opens a section')
    }
    if (id === 'skills') await React.act(async () => document.querySelector('[aria-label="Close section and return to town"]').click())
    else await React.act(async () => window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })))
    assert.equal(document.querySelector('[role="dialog"]'), null, 'Panel closes')
    assert.equal(canvasNode.dataset.paused, 'false', 'Game resumes after closing')
    assert.equal(document.querySelector('.test-canvas'), canvasNode, 'Canvas stays mounted, preserving game position')
  }
  assert.ok(document.querySelector('.explore-guide-slot .controls-guide'), 'Single guide lives outside the canvas')
  assert.equal(document.querySelectorAll('.controls-guide').length, 1)
  const musicBeforeMore = document.querySelector('audio')
  await React.act(async () => document.querySelector('[aria-controls="mobile-secondary"]').click())
  assert.equal(document.querySelector('[aria-controls="mobile-secondary"]').getAttribute('aria-expanded'), 'true')
  assert.ok(document.querySelector('#mobile-secondary.is-open'), 'Secondary controls open')
  assert.equal(canvasNode.dataset.paused, 'true', 'Secondary menu pauses movement')
  await React.act(async () => window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })))
  assert.equal(document.querySelector('#mobile-secondary.is-open'), null, 'Escape closes secondary controls')
  assert.equal(canvasNode.dataset.paused, 'false', 'Movement resumes')
  assert.equal(document.querySelector('audio'), musicBeforeMore, 'Collapsing controls retains the audio player')
  assert.equal(mounts, 1, 'Game canvas mounts only once across all panels')
  const { roomExhibits } = await vite.ssrLoadModule('/src/game/interiors.js')
  const inspectionFixtures = [
    (await vite.ssrLoadModule('/src/data/resume.js')).resumeExhibit(),
    ...roomExhibits('projects', { projects: testProjects }),
    ...roomExhibits('skills', { skills: [{ id: 'qa-room-skill', name: 'Test technology', category: 'Test category', description: 'Test description' }] }),
    ...roomExhibits('achievements', { achievements: [{ id: 'qa-room-award', title: 'Test certificate', description: 'Test only' }] }),
    ...roomExhibits('about'), ...roomExhibits('contact'),
  ]
  for (const exhibit of inspectionFixtures) {
    nextBuilding = { exhibit }
    await React.act(async () => canvasNode.click())
    assert.equal(document.querySelector('#exhibit-title').textContent, exhibit.title, 'Selected frame opens the matching content')
    assert.equal(canvasNode.dataset.paused, 'true', 'Inspection pauses movement')
    if (exhibit.type === 'project') assert.equal(document.querySelector('[data-project-id]').dataset.projectId, exhibit.project.id)
    await React.act(async () => window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })))
    assert.equal(document.querySelector('.exhibit-panel'), null, 'Escape closes inspection')
    assert.equal(canvasNode.dataset.paused, 'false', 'Inspection resumes movement')
    assert.equal(document.querySelector('.test-canvas'), canvasNode, 'Inspection preserves the existing game instance')
  }
  await React.act(async () => document.querySelector('[aria-controls="town-quest"]').click())
  assert.equal(document.querySelector('[aria-label="Portfolio sections visited"]').value, 5, 'Quest tracks all five opened sections')
  await React.act(async () => document.querySelector('[aria-label="Close FIELD GUIDE"]').click())
  await React.act(async () => document.querySelector('[aria-label="Return to main menu"]').click())
  assert.equal(mainMenu, 1, 'Main menu control is available from town')
  for (const hash of ['', '#unknown', '#projects/missing-project']) {
    window.sessionStorage.clear()
    dom.reconfigure({ url: `http://localhost/${hash}` })
    const startupMarkup = renderToString(React.createElement(React.StrictMode, null, React.createElement(App)))
    assert.match(startupMarkup, /Harsimar.EXE opening intro/, `New or invalid view ${hash} starts intro`)
    assert.doesNotMatch(startupMarkup, /role="dialog"|Interactive pixel town/)
    assert.equal(window.location.hash, hash, 'Rendering does not mutate the hash')
  }

  await React.act(async () => root.unmount())
  process.stdout.write('UI smoke checks passed: portfolio panels, map, quest, crystal inventory, sound toggle, main menu, and game continuity.\n')
} finally {
  await vite.close()
  dom.window.close()
}


