import { defineNavigation } from './validate.js'

export const navigation = defineNavigation([
  { id: 'about', label: 'About Me', number: '01', dialogue: 'Meet the person behind this little town.' },
  { id: 'skills', label: 'Developer Lab', number: '02', dialogue: 'Browse the toolkit, sorted by category.' },
  { id: 'projects', label: 'Project Center', number: '03', dialogue: 'Open a project file to read the details.' },
  { id: 'achievements', label: 'Hall of Fame', number: '04', dialogue: 'A collection of milestones and credentials.' },
  { id: 'contact', label: 'Contact Center', number: '05', dialogue: 'Connect with Harsimar by email, phone, or LinkedIn.' },
])
