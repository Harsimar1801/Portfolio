import Phaser from 'phaser'
import { BUILDINGS, CRYSTALS, PLAYER_START, WORLD } from './townMap.js'
import { movePlayer, nearbyBuilding } from './movement.js'
import { nearbyCrystal } from './collectibles.js'
import { cameraViewport } from './viewport.js'
import { drawTown, placeTownSigns, TOWN_ATLAS } from './townArt.js'
import { createRoom, moveInRoom, nearbyExhibit } from './interiors.js'
import { drawInterior } from './interiorArt.js'

export function createTownScene(onNavigate, onPrompt = () => {}, isPaused = () => false, onCollect = () => {}, getVirtualInput = () => ({}), getHudInsets = () => ({ top: 76, bottom: 64 }), onRoomChange = () => {}) {
  return class TownScene extends Phaser.Scene {
    constructor() {
      super('town')
      this.player = { ...PLAYER_START }
      this.facing = 'down'
      this.collectedCrystals = new Set()
      this.crystalSprites = new Map()
    }

    create() {
      this.cameras.main.setBackgroundColor('#172338')
      const art = drawTown(this)
      this.water = art.water
      this.signs = art.signs
      this.motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
      const updateMotion = () => { this.reducedMotion = this.motionQuery?.matches ?? false }
      updateMotion()
      this.motionQuery?.addEventListener('change', updateMotion)
      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.motionQuery?.removeEventListener('change', updateMotion))
      BUILDINGS.forEach((b) => {
        this.add.zone(b.x + b.w / 2, b.y + b.h - 10, b.w, b.h + 30).setInteractive({ useHandCursor: true }).on('pointerdown', () => {
          if (nearbyBuilding(this.player)?.id === b.id) this.interact()
          else this.showMessage('WALK TO THE DOOR TO EXPLORE')
        })
      })
      this.drawCrystals()
      this.avatar = this.add.image(this.player.x, this.player.y, TOWN_ATLAS, 'player-down-0').setOrigin(.5, 29 / 34)
      this.drawAvatar()
      this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height)
      this.cameras.main.startFollow(this.avatar, true, 0.13, 0.13)
      // Look slightly north of the player so the plaza and building entrances
      // stay in view on shorter desktop screens.
      this.cameras.main.setFollowOffset(0, 64)
      this.messageTimer = null
      this.refreshPrompt()
      this.handleResize(this.scale.gameSize)
      this.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this)
      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scale.off(Phaser.Scale.Events.RESIZE, this.handleResize, this))
      this.cursors = this.input.keyboard.createCursorKeys()
      this.keys = this.input.keyboard.addKeys('W,A,S,D,E,SPACE')
      this.input.keyboard.addCapture(['UP', 'DOWN', 'LEFT', 'RIGHT', 'SPACE'])
      this.input.keyboard.on('keydown-E', (event) => { if (!event.repeat) this.interact() })
      this.input.keyboard.on('keydown-SPACE', (event) => { if (!event.repeat) this.interact() })
      this.input.keyboard.on('keydown-ESC', (event) => { if (!event.repeat && !isPaused()) this.exitRoom() })
    }

    enterRoom(section) {
      if (this.room) return
      this.townPosition = { ...this.player }
      this.townObjects = this.children.list.filter((object) => object !== this.avatar).map((object) => ({ object, visible: object.visible }))
      this.townObjects.forEach(({ object }) => object.setVisible(false))
      this.room = createRoom(section)
      this.roomArt = drawInterior(this, this.room)
      this.player = { ...this.room.spawn }
      this.avatar.setPosition(this.player.x,this.player.y)
      this.input.keyboard.resetKeys()
      this.messageTimer?.remove(); this.messageTimer=null
      this.cameras.main.setFollowOffset(0,0)
      this.handleResize(this.scale.gameSize)
      if (!this.reducedMotion) this.cameras.main.fadeIn(180,10,18,30)
      onRoomChange({ id: section, title: this.room.title })
      this.refreshPrompt()
    }

    exitRoom() {
      if (!this.room || isPaused()) return
      this.roomArt.objects.forEach((object) => object.destroy())
      this.roomArt=null; this.room=null
      this.townObjects.forEach(({object,visible}) => object.setVisible(visible))
      this.townObjects=null
      this.player={ ...this.townPosition }
      this.avatar.setPosition(this.player.x,this.player.y)
      this.input.keyboard.resetKeys()
      this.messageTimer?.remove(); this.messageTimer=null
      this.cameras.main.setFollowOffset(0,64)
      this.handleResize(this.scale.gameSize)
      if (!this.reducedMotion) this.cameras.main.fadeIn(180,10,18,30)
      onRoomChange(null)
      this.refreshPrompt()
    }

    drawCrystals() {
      for (const crystal of CRYSTALS) {
        const sprite = this.add.image(crystal.x, crystal.y, TOWN_ATLAS, 'crystal').setOrigin(.5, 18 / 23).setDepth(crystal.y)
        this.crystalSprites.set(crystal.id, sprite)
      }
    }

    collectCrystal() {
      const crystal = nearbyCrystal(this.player, this.collectedCrystals)
      if (!crystal) return
      this.collectedCrystals.add(crystal.id)
      this.crystalSprites.get(crystal.id)?.destroy()
      this.crystalSprites.delete(crystal.id)
      onCollect(crystal.id)
      this.showMessage(`FOUND ${crystal.name.toUpperCase()}`)
    }

    drawAvatar(step = 0) {
      this.avatar.setFrame(`player-${this.facing}-${step}`).setDepth(this.player.y + 5)
    }

    showMessage(message) {
      this.setPrompt(message)
      if (this.messageTimer) this.messageTimer.remove()
      this.messageTimer = this.time.delayedCall(1300, () => { this.messageTimer = null; this.refreshPrompt() })
    }

    setPrompt(message) {
      if (this.lastPrompt === message) return
      this.lastPrompt = message
      onPrompt(message)
    }

    refreshPrompt() {
      if (this.messageTimer) return
      if (this.room) {
        const exhibit=nearbyExhibit(this.room,this.player)
        const atExit=Math.hypot(this.player.x-this.room.exit.x,this.player.y-this.room.exit.y)<32
        this.setPrompt(exhibit ? `E · INSPECT · ${exhibit.title}` : atExit ? 'E · EXIT TO TOWN' : `${this.room.title} · EXPLORE DISPLAYS · ESC TO EXIT`)
        this.roomArt.frames.forEach(({exhibit:entry,outline})=>outline.setVisible(entry.id===exhibit?.id))
        return
      }
      const nearby = nearbyBuilding(this.player)
      this.setPrompt(nearby ? `E / TAP INTERACT  ·  ${nearby.name}` : 'MOVE · WASD / ARROWS / D-PAD')
    }

    interact() {
      if (isPaused()) return
      if (this.room) {
        const exhibit=nearbyExhibit(this.room,this.player)
        if (exhibit) onNavigate({ exhibit })
        else if(Math.hypot(this.player.x-this.room.exit.x,this.player.y-this.room.exit.y)<32)this.exitRoom()
        else this.showMessage('APPROACH A WALL DISPLAY · E TO INSPECT')
        return
      }
      const nearby = nearbyBuilding(this.player)
      if (nearby) this.enterRoom(nearby.id)
      else this.showMessage('MOVE CLOSER TO A BUILDING DOOR')
    }

    update(time, delta) {
      if (!this.room) placeTownSigns(this, this.signs, this.hudInsets)
      const waterFrame = this.reducedMotion ? 0 : Math.floor(time / 350) % 4
      if (waterFrame !== this.waterFrame) {
        this.water.setFrame(`water-${waterFrame}`)
        this.waterFrame = waterFrame
      }
      if (isPaused()) {
        this.input.keyboard.resetKeys()
        return
      }
      const virtual = getVirtualInput()
      const left = this.cursors.left.isDown || this.keys.A.isDown || Boolean(virtual.left)
      const right = this.cursors.right.isDown || this.keys.D.isDown || Boolean(virtual.right)
      const up = this.cursors.up.isDown || this.keys.W.isDown || Boolean(virtual.up)
      const down = this.cursors.down.isDown || this.keys.S.isDown || Boolean(virtual.down)
      const speed = Math.min(delta, 32) * 0.11
      let dx = 0, dy = 0
      if (left !== right) { dx = left ? -speed : speed; this.facing = left ? 'left' : 'right' }
      else if (up !== down) { dy = up ? -speed : speed; this.facing = up ? 'up' : 'down' }
      if (dx || dy) {
        const next = this.room ? moveInRoom(this.room,this.player,dx,dy) : movePlayer(this.player, dx, dy)
        const moving = next.x !== this.player.x || next.y !== this.player.y
        if (moving) {
          this.player = next
          this.avatar.setPosition(next.x, next.y)
        }
        this.drawAvatar(moving && !this.reducedMotion ? Math.floor(time / 160) % 2 : 0)
        this.refreshPrompt()
        if (!this.room) this.collectCrystal()
      } else this.drawAvatar()
    }

    handleResize(gameSize) {
      const width = Math.max(1, gameSize.width)
      const height = Math.max(1, gameSize.height)
      const viewport = cameraViewport(width, height)
      if (this.room) {
        viewport.width=Math.min(width,this.room.width*viewport.zoom)
        viewport.height=Math.min(height,this.room.height*viewport.zoom)
        viewport.x=Math.floor((width-viewport.width)/2)
        viewport.y=Math.floor((height-viewport.height)/2)
      }
      this.hudInsets = getHudInsets()
      this.hudInsets.controls = (this.hudInsets.controls ?? []).map((rect) => ({ left: rect.left - viewport.x, right: rect.right - viewport.x, top: rect.top - viewport.y, bottom: rect.bottom - viewport.y }))
      this.cameras.main.setViewport(viewport.x, viewport.y, viewport.width, viewport.height)
      this.cameras.main.setZoom(viewport.zoom)
      this.cameras.main.setBounds(0, 0, this.room?.width ?? WORLD.width, this.room?.height ?? WORLD.height)
      this.cameras.main.centerOn(this.player.x, this.player.y - (this.room ? 0 : 64))
    }
  }
}
