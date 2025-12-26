# Arcade Cabinet Games - Triage and Merge Order

This document outlines the current status of all arcade-cabinet TypeScript games and their recommended merge order for Strata integration.

## Executive Summary

| Metric | Count |
|--------|-------|
| Total TypeScript Games | 6 |
| Games with Strata PRs | 4 |
| PRs Ready to Merge | 2 |
| PRs Needing Fixes | 4 |
| Games Needing Strata PR | 2 |

## Recommended Merge Order

### Priority 1: Immediate Merge
These PRs are ready or nearly ready to merge.

1. **strata-game-library/core #119** - API improvements (auto-merge enabled)
   - Fixes ESM import issues
   - Adds GyroscopeCamera, VirtualJoystick components
   - CI: ✅ Passing

2. **arcade-cabinet/realm-walker #22** - Ready
   - Tests passing
   - Auto-merge enabled

### Priority 2: Minor Fixes Needed
These PRs need small changes before merge.

3. **arcade-cabinet/otter-river-rush #54** - Strata Water/Sky
   - Status: Changes Requested
   - Fix: Remove unused imports (suggested in PR comment)
   - Blocking: E2E test timing (infrastructure, not code)

4. **arcade-cabinet/protocol-silent-night #14** - Audio/Character
   - Status: E2E Failing
   - Fix: Test infrastructure, re-run CI
   - Core changes: ✅ Approved by Codex/Gemini

### Priority 3: CI/Config Fixes
These need CI configuration updates.

5. **arcade-cabinet/ebb-and-bloom #19** - Claude Workflow
   - Status: CI Failing
   - Fix: Add pnpm version to package.json or workflow
   - Note: No Strata integration PR exists yet

6. **arcade-cabinet/rivermarsh #86** - Strata Character/Camera
   - Status: Build Failing
   - Fix: Add `deps.inline` to vitest config (comment added)
   - Waiting on: strata-game-library/core #119 merge

### Priority 4: New PRs Needed

7. **arcade-cabinet/ebb-and-bloom** - Strata Integration
   - No Strata integration PR exists
   - Needs: Water, Sky, Capacitor Plugin integration

8. **arcade-cabinet/rivermarsh-legacy** - Assess for archival
   - Only dependabot/renovate PRs
   - Consider: Archive or modernize?

## Per-Repository Triage

### arcade-cabinet/otter-river-rush (7 PRs)

| PR | Type | Priority | Action |
|----|------|----------|--------|
| #54 | Strata Integration | HIGH | Apply suggested fixes |
| #55 | Copilot Sub-PR | LOW | Close after #54 merges |
| #51 | @takram/three-clouds | MEDIUM | Merge after #54 |
| #50 | zod 4.x | LOW | Breaking change, review |
| #48 | @vitejs/plugin-react | LOW | Auto-merge candidate |
| #47 | @ai-sdk/openai | LOW | Auto-merge candidate |
| #46 | ora 9.x | LOW | ESM-only, test first |

### arcade-cabinet/rivermarsh (10 PRs)

| PR | Type | Priority | Action |
|----|------|----------|--------|
| #86 | Strata Integration | HIGH | Fix vitest config |
| #87 | Copilot Sub-PR | LOW | Close after #86 merges |
| #85 | eslint 9.x | MEDIUM | Breaking change, review |
| #84 | actions/configure-pages | LOW | Auto-merge candidate |
| #75 | actions/checkout | LOW | Auto-merge candidate |
| #74 | fast-check | LOW | Auto-merge candidate |
| #73 | upload-pages-artifact | LOW | Auto-merge candidate |
| #71 | actions/setup-node | LOW | Auto-merge candidate |
| #67 | Game Showcase | MEDIUM | Has conflicts, rebase |
| #64 | Boss Battle | MEDIUM | Has conflicts, rebase |

### arcade-cabinet/realm-walker (9 PRs)

| PR | Type | Priority | Action |
|----|------|----------|--------|
| #22 | Memory Bank | HIGH | Merge now |
| #30 | js-yaml security | HIGH | Merge after #22 |
| #27 | ts-jest | MEDIUM | Test update |
| #26 | Node 24 | LOW | Major update, review |
| #25 | Three.js deps | MEDIUM | Merge with #22 |
| #24 | Minor deps | LOW | Auto-merge candidate |
| #23 | AI SDK | LOW | Auto-merge candidate |
| #21 | Jest 30 | MEDIUM | Major update, review |
| #20 | pnpm 10 | LOW | Auto-merge candidate |

### arcade-cabinet/protocol-silent-night (2 PRs)

| PR | Type | Priority | Action |
|----|------|----------|--------|
| #14 | Audio/Character | HIGH | Re-run CI |
| #15 | Copilot Sub-PR | LOW | Close after #14 merges |

### arcade-cabinet/ebb-and-bloom (2 PRs)

| PR | Type | Priority | Action |
|----|------|----------|--------|
| #22 | js-yaml security | HIGH | Merge after CI fixed |
| #19 | Claude Workflow | MEDIUM | Fix pnpm version |

### arcade-cabinet/rivermarsh-legacy (6 PRs)

All dependabot/renovate PRs for dependencies. Consider:
- Bulk merge dependency updates
- Or archive repository if not actively developed

## GitHub Pages Deployment Status

| Game | Pages Enabled | Deployment Status |
|------|---------------|-------------------|
| otter-river-rush | ❌ No | Pending |
| rivermarsh | ❌ No | Pending |
| protocol-silent-night | ❌ No | Pending |
| ebb-and-bloom | ❌ No | Pending |
| realm-walker | ❌ No | Pending |

### To Enable GitHub Pages

1. Go to Repository Settings > Pages
2. Set Source to "GitHub Actions"
3. Add the deployment workflow from `gh-pages-template.yml`

## Strata Capacitor Plugin Integration

All games should integrate the Strata Capacitor Plugin for:

- **Device Detection**: Mobile vs desktop, touch capability
- **Input Handling**: Unified keyboard/gamepad/touch input
- **Haptics**: Cross-platform vibration feedback
- **Local Storage**: Save game progress

```typescript
// Example integration
import { DeviceProvider, InputProvider } from '@strata/capacitor-plugin/react';

function App() {
  return (
    <DeviceProvider>
      <InputProvider>
        <Game />
      </InputProvider>
    </DeviceProvider>
  );
}
```

## Next Steps

1. ✅ Merge strata-game-library/core #119
2. ✅ Merge realm-walker #22
3. ⏳ Apply fixes to otter-river-rush #54
4. ⏳ Apply fixes to rivermarsh #86
5. ⏳ Re-run CI on protocol-silent-night #14
6. ⏳ Fix pnpm version in ebb-and-bloom #19
7. 📝 Create Strata integration PR for ebb-and-bloom
8. 🚀 Enable GitHub Pages on all games
9. 🎮 Verify playable status on all games
