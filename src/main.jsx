import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './pages/App.jsx'
import './styles/main.css'
import './styles/screens.css'
import './styles/fullscreen.css'
import './styles/portfolio-polish.css'
import './styles/game-tools.css'
import './styles/mobile-controls.css'
import './styles/project-archive.css'
import './styles/game-viewport.css'
import './styles/portfolio-cat.css'
import './styles/boot-intro.css'
import './styles/developer-secret.css'
import './styles/interiors.css'
import './styles/navigation-polish.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

import './styles/mobile-refinement.css'
