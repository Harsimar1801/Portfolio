The title landscape SVG and all town artwork are original to this project. No Pokémon sprites, maps, or music are used.

`src/game/townArt.js` authors a shared pixel-art atlas at native pixel resolution: grass tiles, cobblestones, four water frames, layered tree canopies, flowers, lanterns, crystals, a clock plaza, five building sprites, and directional character frames. Its bitmap sign alphabet is drawn from a local 5×7 glyph definition. No external images or fonts are needed to render the town.

The atlas is built once per Phaser game and reused by individual scene sprites. `TownScene.js` handles interaction and movement; `townMap.js` remains the source of world coordinates and collision footprints. Edit the artwork without changing portfolio data or gameplay. Water and walking animation respect reduced-motion preferences.
