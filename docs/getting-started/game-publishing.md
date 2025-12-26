# Publishing Strata Games to GitHub Pages

This guide explains how to publish your Strata-powered game to GitHub Pages, making it playable in any web browser with full localStorage support.

## Quick Start

### 1. Enable GitHub Pages

Go to your repository settings:
1. Navigate to **Settings** > **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save the settings

### 2. Add the Deployment Workflow

Copy the workflow template to your repository:

```yaml
# .github/workflows/deploy-pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v4
        with:
          version: 9
          
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: pnpm
          
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          VITE_BASE_URL: /${{ github.event.repository.name }}/
          
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### 3. Configure Vite Base Path

Update your `vite.config.ts` to support the GitHub Pages subdirectory:

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  // Use environment variable or default to root
  base: process.env.VITE_BASE_URL || '/',
  // ... rest of config
});
```

### 4. Push to Deploy

Push to `main` branch and the workflow will automatically:
1. Build your game
2. Deploy to `https://[org].github.io/[repo]/`

## Using Local Storage with Strata

Strata Capacitor Plugin provides cross-platform storage that works identically on web and mobile.

### Basic Usage

```typescript
// Save game state
function saveGame(state: GameState) {
  localStorage.setItem('game-save', JSON.stringify(state));
}

// Load game state
function loadGame(): GameState | null {
  const saved = localStorage.getItem('game-save');
  return saved ? JSON.parse(saved) : null;
}
```

### With React Hook

```typescript
import { useState, useEffect } from 'react';

export function useSavedGame<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}
```

### Auto-Save Pattern

```typescript
import { useEffect } from 'react';
import { useGameStore } from './stores/gameStore';

export function useAutoSave() {
  const gameState = useGameStore();

  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('auto-save', JSON.stringify({
        timestamp: Date.now(),
        state: gameState,
      }));
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [gameState]);
}
```

## Strata Integration Checklist

Before publishing, ensure your game:

- [ ] Uses Strata components (`AdvancedWater`, `ProceduralSky`, etc.)
- [ ] Handles localStorage for save games
- [ ] Works in mobile browsers (touch controls)
- [ ] Has proper error boundaries
- [ ] Includes loading screens
- [ ] Responds to window resize

## Example Games

These arcade-cabinet games are published using this workflow:

| Game | Repository | Live Demo |
|------|------------|-----------|
| Otter River Rush | [arcade-cabinet/otter-river-rush](https://github.com/arcade-cabinet/otter-river-rush) | Coming Soon |
| Rivermarsh | [arcade-cabinet/rivermarsh](https://github.com/arcade-cabinet/rivermarsh) | Coming Soon |
| Protocol: Silent Night | [arcade-cabinet/protocol-silent-night](https://github.com/arcade-cabinet/protocol-silent-night) | Coming Soon |

## Troubleshooting

### Assets Not Loading

If images/models don't load on GitHub Pages, check:
- All asset paths use relative paths
- Vite `base` is configured correctly
- No hardcoded `/` paths in code

### CORS Issues

If fetching external data fails:
- Use CORS proxies for development
- Host assets on the same domain
- Use relative paths for local assets

### Mobile Performance

For better mobile performance:
- Use `@jbcom/strata` LOD components
- Enable performance mode on low-end devices
- Reduce particle counts for mobile

```typescript
import { useDevice } from '@strata/capacitor-plugin/react';

function Game() {
  const { isMobile } = useDevice();
  
  return (
    <ParticleSystem 
      count={isMobile ? 100 : 1000} 
    />
  );
}
```

## Next Steps

- [Installation Guide](./installation.md)
- [Quick Start Tutorial](./quickstart.md)
- [API Reference](../api/README.md)
