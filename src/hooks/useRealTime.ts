import { useEffect, useRef } from 'react';
import realTimeService, { EventListener } from '@/lib/realtime.service';
import { AUTH_CONFIG } from '@/constants/constants';

/**
 * A hook to facilitate using the real-time WebSocket service in components.
 * Uses a ref-based stable callback so the listener always invokes the latest
 * closure without causing stale-capture bugs or duplicate registrations.
 *
 * @param eventName The event name to listen for
 * @param callback The callback function to execute when the event occurs
 * @param deps Optional dependency array for the effect (e.g., station id)
 */
export function useRealTimeEvent<T>(
    eventName: string,
    callback: EventListener<T>,
    deps: React.DependencyList = [],
): void {
    // Always keep a ref to the latest callback so we never capture a stale closure
    const callbackRef = useRef<EventListener<T>>(callback);
    useEffect(() => {
        callbackRef.current = callback;
    });

    useEffect(() => {
        // Stable wrapper — registered once, always calls the latest callback
        const stableListener: EventListener<T> = (data: T) => {
            callbackRef.current(data);
        };

        realTimeService.addEventListener<T>(eventName, stableListener);

        // Clean up when the component unmounts or deps change
        return () => {
            realTimeService.removeEventListener<T>(eventName, stableListener);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventName, ...deps]);
}

/**
 * A hook to ensure WebSocket connection is established
 *
 * @param deps Optional dependency array for the effect
 */
export function useWebSocketConnection(deps: React.DependencyList = []): void {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const token = localStorage.getItem(AUTH_CONFIG.tokenKey);
        if (!token) {
            console.warn(
                'No authentication token found. Cannot connect to WebSocket.',
            );
            return;
        }

        // Ensure WebSocket is connected
        const connectToWebSocket = async () => {
            try {
                await realTimeService.connect(token);
                console.log('WebSocket connection established');
            } catch (err) {
                console.error('Failed to connect to WebSocket:', err);
            }
        };

        connectToWebSocket();
    }, [...deps]);
}
