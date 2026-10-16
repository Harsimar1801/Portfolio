import { navigation } from './navigation.js'
import { projects } from './projects.js'

export const VISIT_KEY = 'harsimar-visit-v1'
export const GAME_KEY = 'harsimar-town-v1'
export function readSession(key) {
  try { return JSON.parse(window.sessionStorage.getItem(key)) } catch { return null }
}
export function saveSession(key, value) {
  try { window.sessionStorage.setItem(key, JSON.stringify(value)) } catch { /* Optional storage. */ }
}
export function parseRoute(hash) {
  if (hash === '#title') return { screen: 'title', section: null, project: null }
  if (hash === '#town') return { screen: 'game', section: null, project: null }
  const [section, encodedProject, ...extra] = hash.replace(/^#/, '').split('/')
  if (!navigation.some((item) => item.id === section) || extra.length) return null
  let project = null
  if (encodedProject) {
    try { project = decodeURIComponent(encodedProject) } catch { return null }
    if (section !== 'projects' || !projects.some((item) => item.id === project)) return null
  }
  return { screen: 'game', section, project }
}
export function restoreVisit(hash) {
  const route = parseRoute(hash)
  if (route) return route
  const saved = readSession(VISIT_KEY)
  // An invalid explicit URL must not reopen an unrelated stored panel.
  return !hash && typeof saved?.route === 'string' ? parseRoute(saved.route) : null
}
