import { useEffect, useRef } from 'react'

export default function GameCanvas({ onNavigate, onPrompt, onCollect, onRoomChange, exitRoomSignal = 0, virtualControls, interactSignal = 0, paused = false }) {
  const container = useRef(null)
  const gameInstance = useRef(null)
  const lastInteractSignal = useRef(0)
  const navigate = useRef(onNavigate)
  const prompt = useRef(onPrompt)
  const collect = useRef(onCollect)
  const isPaused = useRef(paused)
  const touchInput = useRef(virtualControls)
  const roomChange = useRef(onRoomChange)
  roomChange.current = onRoomChange
  navigate.current = onNavigate
  prompt.current = onPrompt
  collect.current = onCollect
  isPaused.current = paused
  touchInput.current = virtualControls

  useEffect(() => {
    if (exitRoomSignal && !paused) gameInstance.current?.scene.getScene('town')?.exitRoom()
  }, [exitRoomSignal])

  useEffect(() => {
    if (!interactSignal || interactSignal === lastInteractSignal.current) return
    lastInteractSignal.current = interactSignal
    if (paused) return
    const game = gameInstance.current
    if (game?.scene.isActive('town')) game.scene.getScene('town').interact()
  }, [interactSignal, paused])

  useEffect(() => {
    if (!container.current) return undefined
    let cancelled = false
    let game
    let observer
    Promise.all([import('phaser'), import('../game/TownScene.js')]).then(([{ default: Phaser }, { createTownScene }]) => {
      if (cancelled) return
      const width = Math.max(1, container.current.clientWidth)
      const height = Math.max(1, container.current.clientHeight)
      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: container.current,
        width,
        height,
        backgroundColor: '#111f27',
        pixelArt: true,
        render: { antialias: false, roundPixels: true },
        scale: { mode: Phaser.Scale.RESIZE, width, height },
        scene: createTownScene((id) => navigate.current(id), (message) => prompt.current?.(message), () => isPaused.current, (id) => collect.current?.(id), () => touchInput.current?.current ?? {}, () => {
          const page = container.current?.parentElement
          const bounds = container.current?.getBoundingClientRect()
          const controls = [...(page?.querySelectorAll('.touch-dpad, .touch-interact') ?? [])].map((element) => element.getBoundingClientRect()).filter((rect) => rect.width > 0).map((rect) => ({ left: rect.left - bounds.left, top: rect.top - bounds.top, right: rect.right - bounds.left, bottom: rect.bottom - bounds.top }))
          return { top: 0, bottom: 0, controls }
        }, (room) => roomChange.current?.(room)),
      })
      gameInstance.current = game
      if (typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(([entry]) => {
          const nextWidth = Math.round(entry.contentRect.width)
          const nextHeight = Math.round(entry.contentRect.height)
          if (nextWidth > 0 && nextHeight > 0 && (game.scale.width !== nextWidth || game.scale.height !== nextHeight)) game.scale.resize(nextWidth, nextHeight)
        })
        observer.observe(container.current)
      }
    })

    return () => { cancelled = true; observer?.disconnect(); gameInstance.current = null; game?.destroy(true) }
  }, [])

  return <div className="game-canvas" ref={container} role="application" tabIndex={0} aria-label="Interactive pixel town: use arrow keys or WASD, or the touch directional controls, to move; use E, Space, or the Interact button near a building door" />
}
