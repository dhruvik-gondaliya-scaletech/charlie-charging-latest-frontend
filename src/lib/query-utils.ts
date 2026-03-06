import { QueryClient, QueryKey } from '@tanstack/react-query';

// Map to store pending invalidations
const pendingInvalidations = new Map<string, NodeJS.Timeout>();

/**
 * Debounces query invalidation to prevent "storms" of API calls when multiple
 * real-time events arrive in a short window.
 * 
 * @param queryClient The TanStack Query client
 * @param queryKey The query key to invalidate
 * @param delay The debounce delay in milliseconds (default: 500ms)
 */
export function invalidateQueriesDebounced(
    queryClient: QueryClient,
    queryKey: QueryKey,
    delay: number = 500
): void {
    const keyString = JSON.stringify(queryKey);

    // Clear existing timeout for this key if it exists
    if (pendingInvalidations.has(keyString)) {
        clearTimeout(pendingInvalidations.get(keyString)!);
    }

    // Set a new timeout
    const timeout = setTimeout(() => {
        console.log(`Executing debounced invalidation for query key: ${keyString}`);
        queryClient.invalidateQueries({ queryKey });
        pendingInvalidations.delete(keyString);
    }, delay);

    pendingInvalidations.set(keyString, timeout);
}

/**
 * Optimistically updates a station in the stations list cache.
 */
export function updateStationInListCache(
    queryClient: QueryClient,
    stationId: string,
    update: Partial<any>
): void {
    queryClient.setQueriesData({ queryKey: ['stations'] }, (oldData: any) => {
        if (!oldData) return oldData;

        return oldData.map((station: any) =>
            station.id === stationId ? { ...station, ...update } : station
        );
    });
}

/**
 * Optimistically updates a specific station's detail cache.
 */
export function updateStationDetailCache(
    queryClient: QueryClient,
    stationId: string,
    update: Partial<any>
): void {
    queryClient.setQueryData(['station', stationId], (oldData: any) => {
        if (!oldData) return oldData;
        return { ...oldData, ...update };
    });
}
