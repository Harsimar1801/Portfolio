import { profile } from '../src/data/profile.js'
import { projects } from '../src/data/projects.js'
import { skills } from '../src/data/skills.js'
import { achievements } from '../src/data/achievements.js'
import { navigation } from '../src/data/navigation.js'

process.stdout.write(`Data valid for ${profile.name}: ${projects.length} projects, ${skills.length} skills, ${achievements.length} achievements, ${navigation.length} sections.\n`)
