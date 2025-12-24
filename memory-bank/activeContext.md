# Active Context - 2025-12-24

## Current Focus
- Fixed Issue #2: Added integration tests with @jbcom/strata.
- Verified plugin compatibility with main strata package in a test project.

## Recent Changes
- Updated `example/src/integration.test.ts` with comprehensive tests for:
    - iOS simulator device detection (including safe area insets).
    - Android emulator device detection (including tablet and gamepad support).
    - Haptics API preset intensities and custom durations.
    - Complex gamepad input snapshots and controller selection.
- Fixed `example/vitest.config.ts` to correctly resolve `@capacitor/core` and React.

## Next Steps
- Implement native iOS/Android code if not already complete.
- Add more examples for specific game genres (FPS, Top-down).
