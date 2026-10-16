// Native 5×7 glyphs, one-pixel border, and integer scaling on phones.
const mobileNames = { projects: 'PROJECTS', contact: 'CONTACT' }
export function phoneSign(building) {
  const text = mobileNames[building.id] ?? building.name
  return { text, width: text.length * 6 + 5, height: 11 }
}
