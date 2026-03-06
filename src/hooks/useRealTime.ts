import { useEffect } from 'react';
import realTimeService, { EventListener } from '@/lib/realtime.service';
import { AUTH_CONFIG } from '@/constants/constants';

/**
 * A hook to facilitate using the real-time WebSocket service in components.
 *
 * @param eventName The event name to listen for
 * @param callback The callback function to execute when the event occurs
 * @param deps Optional dependency array for the effect
 */
export function useRealTimeEvent<T>(
    eventName: string,
    callback: EventListener<T>,
    deps: React.DependencyList = [],
): void {
    useEffect(() => {
        // Register the event listener
        realTimeService.addEventListener<T>(eventName, callback);

        // Clean up when the component unmounts or deps change
        return () => {
            realTimeService.removeEventListener<T>(eventName, callback);
        };
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
