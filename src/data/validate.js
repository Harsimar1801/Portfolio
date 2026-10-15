function fail(type, index, message) {
  throw new Error(`${type}[${index}]: ${message}`)
}

function requiredText(value, type, index, field) {
  if (typeof value !== 'string' || !value.trim()) fail(type, index, `"${field}" must be a non-empty string`)
}

function optionalText(value, type, index, field) {
  if (value !== undefined && (typeof value !== 'string')) fail(type, index, `"${field}" must be a string`)
}

function textList(value, type, index, field) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || !item.trim())) fail(type, index, `"${field}" must be an array of non-empty strings`)
}

function optionalUrl(value, type, index, field, allowLocal = false) {
  optionalText(value, type, index, field)
  if (!value) return
  if (allowLocal && value.startsWith('/') && !value.startsWith('//')) return
  try {
    const url = new URL(value)
    if (url.protocol === 'https:' || url.protocol === 'http:') return
  } catch { /* The error below identifies the field. */ }
  fail(type, index, `"${field}" must be an http(s) URL${allowLocal ? ' or a local /path' : ''}`)
}

function validateEntries(type, entries, required, optional, extra) {
  if (!Array.isArray(entries)) throw new Error(`${type} must be an array`)
  const ids = new Set()
  entries.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) fail(type, index, 'entry must be an object')
    for (const field of required) requiredText(entry[field], type, index, field)
    for (const field of optional) optionalText(entry[field], type, index, field)
    const id = entry.id.trim()
    if (ids.has(id)) fail(type, index, `duplicate id "${id}"`)
    ids.add(id)
    extra?.(entry, index)
  })
  return entries
}

export function defineProjects(entries) {
  return validateEntries('projects', entries,
    ['id', 'title', 'status'],
    ['description', 'shortDescription', 'detailedDescription', 'category', 'image', 'github', 'liveDemo', 'githubUrl', 'demoUrl'],
    (project, index) => {
      textList(project.technologies, 'projects', index, 'technologies')
      requiredText(project.description ?? project.detailedDescription ?? project.shortDescription, 'projects', index, 'description')
      if (typeof project.featured !== 'boolean') fail('projects', index, '"featured" must be a boolean')
      optionalUrl(project.image, 'projects', index, 'image', true)
      optionalUrl(project.githubUrl, 'projects', index, 'githubUrl')
      optionalUrl(project.demoUrl, 'projects', index, 'demoUrl')
      optionalUrl(project.github, 'projects', index, 'github')
      optionalUrl(project.liveDemo, 'projects', index, 'liveDemo')
    }).map((project) => ({
      ...project,
      description: project.description ?? project.detailedDescription ?? project.shortDescription,
      shortDescription: project.shortDescription ?? project.description ?? project.detailedDescription,
      detailedDescription: project.detailedDescription ?? project.description ?? project.shortDescription,
      category: project.category ?? '',
      github: project.github ?? project.githubUrl ?? '',
      liveDemo: project.liveDemo ?? project.demoUrl ?? '',
      githubUrl: project.github ?? project.githubUrl ?? '',
      demoUrl: project.liveDemo ?? project.demoUrl ?? '',
    }))
}

export function defineSkills(entries) {
  return validateEntries('skills', entries, ['id', 'name', 'category'], ['icon', 'description'])
}

export function defineAchievements(entries) {
  return validateEntries('achievements', entries, ['id', 'title', 'description'], ['date', 'image', 'credentialUrl'], (achievement, index) => {
    optionalUrl(achievement.image, 'achievements', index, 'image', true)
    optionalUrl(achievement.credentialUrl, 'achievements', index, 'credentialUrl')
  })
}

export function defineNavigation(entries) {
  return validateEntries('navigation', entries, ['id', 'label', 'number', 'dialogue'], [])
}

export function defineProfile(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('profile must be an object')
  for (const field of ['name', 'role', 'education', 'introduction', 'about']) requiredText(value[field], 'profile', 0, field)
  textList(value.interests, 'profile', 0, 'interests')
  if (value.learningPriorities !== undefined) textList(value.learningPriorities, 'profile', 0, 'learningPriorities')
  for (const field of ['educationRecords', 'experience']) {
    if (value[field] !== undefined) validateEntries(field, value[field], ['id', 'title', 'description'], [])
  }
  if (!value.contact || typeof value.contact !== 'object') fail('profile', 0, '"contact" must be an object')
  optionalText(value.contact.email, 'profile', 0, 'contact.email')
  optionalText(value.contact.phone, 'profile', 0, 'contact.phone')
  for (const field of ['github', 'linkedin', 'resume']) optionalUrl(value.contact[field], 'profile', 0, `contact.${field}`, field === 'resume')
  return value
}
