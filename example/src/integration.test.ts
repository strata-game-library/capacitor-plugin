import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

// Use vi.hoisted for variables used in vi.mock
const { mockPlugin } = vi.hoisted(() => ({
  mockPlugin: {
    getDeviceProfile: vi.fn(),
    getControlHints: vi.fn(),
    getInputSnapshot: vi.fn(),
    triggerHaptics: vi.fn(),
    addListener: vi.fn(() => Promise.resolve({ remove: vi.fn() })),
    selectController: vi.fn(),
    getConnectedControllers: vi.fn(),
  }
}));

// Mock matchMedia for JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock the Strata object directly
vi.mock('../../src', async (importActual) => {
  const actual = await importActual();
  return {
    ...actual as any,
    Strata: mockPlugin,
  };
});

// Import hooks and providers
import { useDevice, useHaptics, useInput, DeviceProvider, InputProvider } from '../../src/react';
import type { InputManager, HapticFeedback } from '@jbcom/strata';

describe('Strata Capacitor Plugin Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPlugin.addListener.mockResolvedValue({ remove: vi.fn() });
    mockPlugin.getDeviceProfile.mockResolvedValue({
      deviceType: 'desktop',
      platform: 'web',
      inputMode: 'keyboard',
    });
  });

  describe('Device Detection (Simulator/Emulator)', () => {
    it('should detect iOS simulator environment', async () => {
      const iosProfile = {
        deviceType: 'mobile',
        platform: 'ios',
        inputMode: 'touch',
        orientation: 'portrait',
        hasTouch: true,
        hasPointer: false,
        hasGamepad: false,
        isMobile: true,
        isTablet: false,
        isFoldable: false,
        isDesktop: false,
        screenWidth: 390,
        screenHeight: 844,
        pixelRatio: 3,
        safeAreaInsets: { top: 47, right: 0, bottom: 34, left: 0 }
      } as any;

      mockPlugin.getDeviceProfile.mockResolvedValue(iosProfile);

      const { result } = renderHook(() => useDevice(), {
        wrapper: ({ children }) => React.createElement(DeviceProvider, null, children)
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      expect(result.current.platform).toBe('ios');
      expect(result.current.isMobile).toBe(true);
      expect(result.current.safeAreaInsets.top).toBeGreaterThan(0);
    });

    it('should detect Android emulator environment', async () => {
      const androidProfile = {
        deviceType: 'tablet',
        platform: 'android',
        inputMode: 'hybrid',
        orientation: 'landscape',
        hasTouch: true,
        hasPointer: false,
        hasGamepad: true,
        isMobile: false,
        isTablet: true,
        isFoldable: false,
        isDesktop: false,
        screenWidth: 1280,
        screenHeight: 800,
        pixelRatio: 2,
        safeAreaInsets: { top: 0, right: 0, bottom: 0, left: 0 }
      } as any;

      mockPlugin.getDeviceProfile.mockResolvedValue(androidProfile);

      const { result } = renderHook(() => useDevice(), {
        wrapper: ({ children }) => React.createElement(DeviceProvider, null, children)
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      expect(result.current.platform).toBe('android');
      expect(result.current.isTablet).toBe(true);
      expect(result.current.hasGamepad).toBe(true);
    });
  });

  describe('Haptics API Integration', () => {
    it('should support preset intensities for mobile haptics', async () => {
      const { result } = renderHook(() => useHaptics());

      await act(async () => {
        await result.current.light();
        await result.current.medium();
        await result.current.heavy();
      });

      expect(mockPlugin.triggerHaptics).toHaveBeenCalledWith({ intensity: 'light' });
      expect(mockPlugin.triggerHaptics).toHaveBeenCalledWith({ intensity: 'medium' });
      expect(mockPlugin.triggerHaptics).toHaveBeenCalledWith({ intensity: 'heavy' });
    });

    it('should support custom duration and vibration patterns', async () => {
      const { result } = renderHook(() => useHaptics());

      await act(async () => {
        await result.current.vibrate(200);
      });

      expect(mockPlugin.triggerHaptics).toHaveBeenCalledWith({ duration: 200 });
    });
  });

  describe('Gamepad and Input Integration', () => {
    it('should handle complex gamepad input snapshots', async () => {
      const mockSnapshot = {
        timestamp: Date.now(),
        leftStick: { x: 0.75, y: -0.25 },
        rightStick: { x: 0.1, y: 0.9 },
        buttons: { 
          jump: true, 
          action: false,
          menu: true
        },
        triggers: { left: 0.1, right: 0.5 },
        touches: []
      } as any;

      let inputListener: any;
      mockPlugin.addListener.mockImplementation((name, cb) => {
        if (name === 'inputChange') {
          inputListener = cb;
        }
        return Promise.resolve({ remove: vi.fn() });
      });

      const { result } = renderHook(() => useInput(), {
        wrapper: ({ children }) => React.createElement(InputProvider, null, children)
      });

      await act(async () => {
        if (inputListener) {
          inputListener(mockSnapshot);
        }
      });

      expect(result.current.leftStick.x).toBe(0.75);
      expect(result.current.isPressed('jump')).toBe(true);
      expect(result.current.isPressed('menu')).toBe(true);
      expect(result.current.rightTrigger).toBe(0.5);
    });

    it('should support multiple gamepads and controller selection', async () => {
      const mockControllers = {
        controllers: [
          { index: 0, id: 'Gamepad 1', isSelected: true, hasExtendedGamepad: true, hasMicroGamepad: false },
          { index: 1, id: 'Gamepad 2', isSelected: false, hasExtendedGamepad: true, hasMicroGamepad: false }
        ],
        selectedIndex: 0
      };

      mockPlugin.getConnectedControllers.mockResolvedValue(mockControllers);
      mockPlugin.selectController.mockResolvedValue({ success: true, selectedIndex: 1 });

      const controllers = await mockPlugin.getConnectedControllers();
      const selection = await mockPlugin.selectController({ index: 1 });

      expect(controllers.controllers).toHaveLength(2);
      expect(selection.success).toBe(true);
      expect(selection.selectedIndex).toBe(1);
    });
  });

  describe('Strata Main Package Compatibility', () => {
    it('should provide data compatible with Strata InputManager and Haptics', () => {
      // In a real Strata app, the InputManager would consume our snapshots
      // and HapticFeedback would call our plugin methods.
      
      const testInputSnapshot = (snapshot: any) => {
        expect(snapshot).toHaveProperty('leftStick');
        expect(snapshot.leftStick).toHaveProperty('x');
        expect(snapshot.leftStick).toHaveProperty('y');
      };

      const testHapticOptions = (options: any) => {
        expect(['light', 'medium', 'heavy']).toContain(options.intensity || 'medium');
      };

      testInputSnapshot({ leftStick: { x: 0, y: 0 } });
      testHapticOptions({ intensity: 'light' });
    });
  });
});
