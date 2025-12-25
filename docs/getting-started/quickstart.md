# Quickstart

This guide will help you get started with `@jbcom/strata-capacitor-plugin`.

## Basic Usage

### Using the Plugin directly

```typescript
import { Strata } from '@jbcom/strata-capacitor-plugin';

async function setupGame() {
  // Get device info
  const info = await Strata.getDeviceInfo();
  console.log(`Running on ${info.platform}`);

  // Configure touch handling for games
  await Strata.configureTouchHandling({
    preventScrolling: true,
    preventZooming: true
  });

  // Trigger haptic feedback
  await Strata.haptics({ type: 'impact', style: 'medium' });
}
```

### Using with React

```tsx
import { useStrata } from '@jbcom/strata-capacitor-plugin/react';

export function GameUI() {
  const { deviceInfo, triggerHaptic } = useStrata();

  return (
    <div>
      <p>Platform: {deviceInfo?.platform}</p>
      <button onClick={() => triggerHaptic('impact', 'heavy')}>
        Vibrate
      </button>
    </div>
  );
}
```

## Next Steps

- Check out the [API Reference](../README.md) for detailed documentation.
- See [Contributing](../development/contributing.md) to help improve this project.
