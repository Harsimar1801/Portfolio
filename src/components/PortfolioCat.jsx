import { useEffect, useRef, useState } from 'react'
import { answerPortfolioQuestion, suggestedQuestions } from '../data/portfolioGuide.js'
import { navigation } from '../data/navigation.js'

function CatSprite() {
  return <svg className="milo-sprite" viewBox="0 0 32 32" shapeRendering="crispEdges" aria-hidden="true">
    <g className="milo-tail" fill="#a99ac3"><path d="M24 24h4V14h3v13h-7z" /></g>
    <path fill="#222338" d="M5 3h6v4h10V3h6v20h-3v6H8v-6H5z" />
    <path fill="#a99ac3" d="M7 5h3v5h12V5h3v16h-3v6H10v-6H7z" />
    <path fill="#e1b1ba" d="M8 7h2v4H8zm14 0h2v4h-2z" />
    <path fill="#d4c9dc" d="M11 20h10v7H11zM8 27h6v3H8zm12 0h6v3h-6z" />
    <g className="milo-eyes" fill="#f4d48b"><path d="M9 14h4v4H9zm10 0h4v4h-4z" /></g>
    <path fill="#273042" d="M11 14h1v3h-1zm9 0h1v3h-1z" /><path fill="#e6a6aa" d="M15 19h3v2h-3z" />
    <path fill="#6caeae" d="M10 23h12v2H10z" /><path fill="#f2cd81" d="M15 24h3v3h-3z" />
  </svg>
}

export default function PortfolioCat({ open, onOpenChange, onNavigate }) {
  const [messages, setMessages] = useState([{ role: 'guide', text: 'Hello, I’m Milo! Ask me about this portfolio. I use local matching and published portfolio data, not an AI model.' }])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const input = useRef(null), launcher = useRef(null), log = useRef(null), timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => { if (open) input.current?.focus() }, [open])
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight }, [messages, typing, open])
  function close() { onOpenChange(false); requestAnimationFrame(() => launcher.current?.focus()) }
  function send(question) {
    const text = question.trim()
    if (!text || typing) return
    setMessages((current) => [...current, { role: 'visitor', text }])
    setDraft(''); setTyping(true)
    timer.current = setTimeout(() => {
      setMessages((current) => [...current, { role: 'guide', ...answerPortfolioQuestion(text) }])
      setTyping(false)
    }, 350)
  }
  function handleKey(event) {
    event.stopPropagation()
    if (event.key === 'Escape') { event.preventDefault(); close() }
    if (event.key === 'Tab') {
      const buttons = [...event.currentTarget.querySelectorAll('button:not(:disabled), textarea, a[href]')]
      const first = buttons[0], last = buttons.at(-1)
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
  }
  return <>
    {!open && <button className="milo-launcher" ref={launcher} aria-label="Chat with Milo, portfolio guide" onClick={() => onOpenChange(true)}><span className="milo-bubble">Need help exploring?</span><CatSprite /></button>}
    {open && <div className="milo-backdrop" onClick={(event) => { if (event.target === event.currentTarget) close() }}>
      <section className="milo-panel" role="dialog" aria-modal="true" aria-labelledby="milo-title" onKeyDown={handleKey} onKeyUp={(event) => event.stopPropagation()}>
        <header><CatSprite /><div><h2 id="milo-title">Milo, your portfolio guide</h2><small>LOCAL GUIDE · NO MESSAGES LEAVE THIS PAGE</small></div><button onClick={close} aria-label="Close Milo chat">×</button></header>
        <div className="milo-log" role="log" aria-live="polite" aria-label="Conversation with Milo" ref={log}>
          {messages.map((message, index) => <div key={index} className={`milo-message ${message.role}`}><strong>{message.role === 'visitor' ? 'You' : 'Milo'}</strong><p>{message.text}</p>
            {message.links?.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}
            {message.section && <button onClick={() => { onOpenChange(false); onNavigate(message.section) }}>Open {navigation.find((entry) => entry.id === message.section)?.label} →</button>}
          </div>)}
          {typing && <p role="status" className="milo-typing">Milo is checking the portfolio…</p>}
        </div>
        <div className="milo-suggestions" aria-label="Suggested questions">{suggestedQuestions.map((question) => <button key={question} disabled={typing} onClick={() => send(question)}>{question}</button>)}</div>
        <form onSubmit={(event) => { event.preventDefault(); send(draft) }}><label className="milo-input-label" htmlFor="milo-question">Ask about the portfolio</label><div><textarea id="milo-question" ref={input} rows="2" maxLength="600" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(draft) } }} placeholder="Ask Milo…" /><button type="submit" disabled={typing || !draft.trim()}>Send</button></div></form>
      </section>
    </div>}
  </>
}
