import { useCallback, useMemo, useState } from 'react';
import { Strata } from '../index';
import type { StorageOptions, StorageResult } from '../definitions';

/**
 * React hook for using Strata's persistent storage API.
 * Provides a convenient interface for saving and loading game data.
 * 
 * @param namespace Optional namespace to isolate game data (default: 'strata')
 * @returns Storage utilities for get, set, remove, and clear operations
 * 
 * @example
 * ```tsx
 * function GameComponent() {
 *   const { saveGame, loadGame } = useStorage('mygame');
 *   
 *   const handleSave = async () => {
 *     await saveGame('progress', { level: 5, score: 1000 });
 *   };
 *   
 *   const handleLoad = async () => {
 *     const { value } = await loadGame<{ level: number; score: number }>('progress');
 *     if (value) {
 *       console.log(`Resuming at level ${value.level}`);
 *     }
 *   };
 * }
 * ```
 */
export function useStorage(namespace = 'strata') {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const options: StorageOptions = useMemo(() => ({ namespace }), [namespace]);

    /**
     * Save game data to persistent storage.
     */
    const saveGame = useCallback(async <T = unknown>(key: string, value: T): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await Strata.setItem(key, value, options);
        } catch (e) {
            setError(e instanceof Error ? e : new Error(String(e)));
            throw e;
        } finally {
            setLoading(false);
        }
    }, [options]);

    /**
     * Load game data from persistent storage.
     */
    const loadGame = useCallback(async <T = unknown>(key: string): Promise<StorageResult<T>> => {
        setLoading(true);
        setError(null);
        try {
            const result = await Strata.getItem<T>(key, options);
            return result;
        } catch (e) {
            setError(e instanceof Error ? e : new Error(String(e)));
            return { value: null, exists: false };
        } finally {
            setLoading(false);
        }
    }, [options]);

    /**
     * Delete a specific key from storage.
     */
    const deleteGame = useCallback(async (key: string): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await Strata.removeItem(key, options);
        } catch (e) {
            setError(e instanceof Error ? e : new Error(String(e)));
            throw e;
        } finally {
            setLoading(false);
        }
    }, [options]);

    /**
     * Get all save keys in the namespace.
     */
    const listSaves = useCallback(async (): Promise<string[]> => {
        setLoading(true);
        setError(null);
        try {
            const { keys } = await Strata.keys(options);
            return keys;
        } catch (e) {
            setError(e instanceof Error ? e : new Error(String(e)));
            return [];
        } finally {
            setLoading(false);
        }
    }, [options]);

    /**
     * Clear all game data in the namespace.
     */
    const clearAllSaves = useCallback(async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await Strata.clear(options);
        } catch (e) {
            setError(e instanceof Error ? e : new Error(String(e)));
            throw e;
        } finally {
            setLoading(false);
        }
    }, [options]);

    return {
        saveGame,
        loadGame,
        deleteGame,
        listSaves,
        clearAllSaves,
        loading,
        error,
    };
}
