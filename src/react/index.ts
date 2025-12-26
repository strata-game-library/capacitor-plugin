import { useEffect, useState } from 'react';
import { Strata } from '../index';
import type { DeviceInfo, SafeAreaInsets } from '../definitions';

export { useDevice, DeviceProvider, DeviceContext } from './useDevice';
export { useInput, InputProvider, InputContext } from './useInput';
export { useHaptics } from './useHaptics';
export { useControlHints } from './useControlHints';
export { useStorage } from './useStorage';

export function useStrata() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [safeArea, setSafeArea] = useState<SafeAreaInsets | null>(null);

  useEffect(() => {
    Strata.getDeviceInfo()
      .then(setDeviceInfo)
      .catch(error => console.error('Failed to get device info:', error));
    
    Strata.getSafeAreaInsets()
      .then(setSafeArea)
      .catch(error => console.error('Failed to get safe area insets:', error));
  }, []);

  const triggerHaptic = (type: 'impact' | 'notification' | 'selection', style?: 'light' | 'medium' | 'heavy') => {
    Strata.haptics({ type, style }).catch(error => console.error('Failed to trigger haptic:', error));
  };

  return {
    deviceInfo,
    safeArea,
    triggerHaptic,
  };
}
