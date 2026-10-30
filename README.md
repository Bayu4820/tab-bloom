# Tap Bloom

A small tap game built with React Native + Expo. Blooms grow on screen. Tap them before they burst: the longer you wait, the more points you get (1 → 2 → 3). Don't touch the dark thorns ✱. 10 hits in a row raise your score multiplier. Each missed bloom or tapped thorn costs a heart, and the game ends when all 3 are gone. It gets faster over the first minute.

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app (Android or iOS) to play on your phone, or press `w` to play in a browser.

## Code layout

- `App.tsx`: switches between menu, game, and game-over, and tracks the best score
- `src/game/config.ts`: tuning values (speed, sizes, colors, difficulty curve)
- `src/game/useGame.ts`: game loop, spawning, scoring, lives
- `src/screens/GameScreen.tsx`: HUD and play field
- `src/components/BloomView.tsx`: a single bloom or thorn
- `src/components/Overlay.tsx`: menu and game-over cards
