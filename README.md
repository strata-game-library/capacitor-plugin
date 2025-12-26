# @strata/capacitor-plugin

[![npm version](https://img.shields.io/npm/v/@strata/capacitor-plugin.svg)](https://www.npmjs.com/package/@strata/capacitor-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Cross-platform input, device detection, and haptics for [Strata 3D](https://strata.game) games. Works with Capacitor for iOS/Android native apps, Electron for desktop, and pure web.

## 📚 Documentation

**Full documentation is available at [strata.game/mobile/capacitor](https://strata.game/mobile/capacitor/)**

---

## 🏢 Enterprise Context

**Strata** is the Games & Procedural division of the [jbcom enterprise](https://jbcom.github.io). This plugin is part of a coherent suite of specialized tools, sharing a unified design system and interconnected with sibling organizations like [Agentic](https://agentic.dev) and [Extended Data](https://extendeddata.dev).

## Features

- **Device Detection** - Platform, device type, input mode detection
- **Unified Input** - Touch, keyboard, and gamepad abstraction
- **Haptic Feedback** - Device vibration and gamepad rumble
- **Screen Orientation** - Lock/unlock orientation
- **Safe Area Insets** - Accurate safe area for notched screens
- **React Hooks** - Ready-to-use hooks for React/R3F integration

## Installation

```bash
pnpm install @strata/capacitor-plugin
npx cap sync
```

## Quick Start

```tsx
import { DeviceProvider, useDevice, useInput, useHaptics } from '@strata/capacitor-plugin/react';

function App() {
  return (
    <DeviceProvider>
      <Game />
    </DeviceProvider>
  );
}

function Game() {
  const device = useDevice();
  const { leftStick } = useInput();
  const { medium } = useHaptics();
  
  return <GameCanvas />;
}
```

## Platform Support

| Feature | Web | iOS | Android | Electron |
|---------|-----|-----|---------|----------|
| Device Detection | ✅ | ✅ | ✅ | ✅ |
| Touch Input | ✅ | ✅ | ✅ | ✅ |
| Keyboard Input | ✅ | ⚠️ | ⚠️ | ✅ |
| Gamepad Input | ✅ | ⚠️ | ⚠️ | ✅ |
| Device Haptics | ⚠️ | ✅ | ✅ | ❌ |
| Gamepad Haptics | ✅ | ❌ | ❌ | ✅ |

## Related

- [Strata Documentation](https://strata.game) - Full documentation
- [Strata Core](https://github.com/strata-game-library/core) - Main library
- [React Native Plugin](https://github.com/strata-game-library/react-native-plugin) - React Native version

## License

MIT © [Jon Bogaty](https://github.com/jbcom)
