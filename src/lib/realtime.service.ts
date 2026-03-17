import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { WEBSOCKET_CONFIG, AUTH_CONFIG, API_CONFIG } from '@/constants/constants';

// Event types
export interface StationStatusChangeEvent {
    stationId: string;
    status: string;
    timestamp: string;
}

export interface ConnectorStatusChangeEvent {
    stationId: string;
    connectorId: number;
    status: string;
    timestamp: string;
}

export interface TransactionEvent {
    id: string;
    stationId: string;
    connectorId: number;
    tagId?: string;
    meterStart?: number;
    meterStop?: number;
    startTime?: string;
    stopTime?: string;
    status: string;
    timestamp: string;
}

export interface MeterValue {
    timestamp: string;
    value: number | string;
    context?: string;
    format?: string;
    measurand?: string;
    phase?: string;
    unit?: string;
}

export interface MeterValuesEvent {
    stationId: string;
    connectorId: number;
    transactionId?: string;
    meterValues: MeterValue[];
    timestamp: string;
}

export type EventListener<T> = (data: T) => void;

// Singleton class for WebSocket real-time events
class RealTimeService {
    private static instance: RealTimeService;
    private socket: Socket | null = null;
    private listeners = new Map<string, Set<EventListener<any>>>();
    private reconnectCount = 0;
    private connecting: Promise<void> | null = null;
    private readonly MAX_RECONNECT_ATTEMPTS = 5;
    private readonly RECONNECT_DELAY = 3000; // 3 seconds

    // Private constructor (Singleton pattern)
    private constructor() { }

    // Get the singleton instance
    public static getInstance(): RealTimeService {
        if (!RealTimeService.instance) {
            RealTimeService.instance = new RealTimeService();
        }
        return RealTimeService.instance;
    }

    // Check if socket is connected
    public isConnected(): boolean {
        return !!this.socket && this.socket.connected;
    }

    // Connect to the WebSocket server
    public connect(token: string): Promise<void> {
        console.log('Connecting to WebSocket server');

        // If already connecting, return the existing promise
        if (this.connecting) {
            return this.connecting;
        }

        // If already connected, resolve immediately
        if (this.socket && this.socket.connected) {
            console.log('Already connected to WebSocket server');
            return Promise.resolve();
        }

        // Create new connection promise
        this.connecting = new Promise((resolve, reject) => {
            try {
                const wsUrl = API_CONFIG.baseUrl;

                // Clean up any existing socket
                if (this.socket) {
                    this.socket.disconnect();
                    this.socket = null;
                }

                this.socket = io(`${wsUrl}/events`, {
                    auth: {
                        token: token,
                    },
                    reconnection: true,
                    reconnectionDelay: this.RECONNECT_DELAY,
                    reconnectionAttempts: this.MAX_RECONNECT_ATTEMPTS,
                });

                this.setupSocketEventHandlers(resolve, reject);
            } catch (error) {
                console.error('Socket connection error:', error);
                this.connecting = null;
                reject(error);
            }
        });

        // Clear the connecting promise when done
        this.connecting
            .catch(() => { })
            .finally(() => {
                this.connecting = null;
            });

        return this.connecting;
    }

    // Disconnect from the WebSocket server
    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.reconnectCount = 0;
            console.log('Disconnected from WebSocket server');
        }
    }

    // Add event listener
    public addEventListener<T>(
        eventName: string,
        callback: EventListener<T>,
    ): void {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, new Set());
        }
        this.listeners.get(eventName)?.add(callback as EventListener<any>);
    }

    // Remove event listener
    public removeEventListener<T>(
        eventName: string,
        callback: EventListener<T>,
    ): void {
        if (this.listeners.has(eventName)) {
            this.listeners.get(eventName)?.delete(callback as EventListener<any>);
        }
    }

    // Remove all listeners for an event
    public removeAllListeners(eventName: string): void {
        this.listeners.delete(eventName);
    }

    // Private method to set up socket event handlers
    private setupSocketEventHandlers(
        resolve: () => void,
        reject: (reason?: unknown) => void,
    ): void {
        if (!this.socket) return;

        // Connection events
        this.socket.on('connect', () => {
            console.log('Connected to WebSocket server');
            this.reconnectCount = 0;
            resolve();
        });

        this.socket.on('disconnect', (reason) => {
            console.log(`Disconnected from WebSocket server: ${reason}`);

            // If disconnected because of transport close, attempt to reconnect
            if (reason === 'transport close' || reason === 'ping timeout') {
                console.log('Connection lost, will attempt to reconnect automatically');
                toast.warning('Connection Lost', {
                    description: 'Attempting to reconnect to real-time updates server...',
                });
            }
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            this.reconnectCount++;

            if (this.reconnectCount === 1) {
                // Only show toast on first error to avoid spamming
                toast.error('Connection Error', {
                    description: 'Unable to connect to real-time updates server. Retrying...',
                });
            }

            if (this.reconnectCount >= this.MAX_RECONNECT_ATTEMPTS) {
                toast.error('Connection Failed', {
                    description: `Failed to connect after ${this.MAX_RECONNECT_ATTEMPTS} attempts. Please refresh the page.`,
                });
                reject(error);
            }
        });

        // When reconnected successfully
        this.socket.on('reconnect', (attemptNumber: number) => {
            console.log(`Reconnected successfully after ${attemptNumber} attempts`);
            toast.success('Reconnected', {
                description: 'Successfully reconnected to real-time updates',
            });
        });

        // Domain-specific events
        this.registerDomainEvents();
    }

    // Register domain-specific event handlers
    private registerDomainEvents(): void {
        if (!this.socket) return;

        // Station status change events
        this.socket.on(
            'station-status-change',
            (data: StationStatusChangeEvent) => {
                console.log(
                    `Received 'station-status-change' event: Station ${data.stationId} -> ${data.status}`,
                );
                this.notifyListeners('station-status-change', data);
            },
        );

        // Connector status change events
        this.socket.on(
            'connector-status-change',
            (data: ConnectorStatusChangeEvent) => {
                console.log(
                    `Received 'connector-status-change' event: Station ${data.stationId}, Connector ${data.connectorId} -> ${data.status}`,
                );
                this.notifyListeners('connector-status-change', data);
            },
        );

        // Transaction events
        this.socket.on('transaction-start', (data: TransactionEvent) => {
            console.log(
                `Received 'transaction-start' event: Station ${data.stationId}, Connector ${data.connectorId}`,
            );
            this.notifyListeners('transaction-start', data);
        });

        this.socket.on('transaction-stop', (data: TransactionEvent) => {
            console.log(
                `Received 'transaction-stop' event: Station ${data.stationId}, Connector ${data.connectorId}`,
            );
            this.notifyListeners('transaction-stop', data);
        });

        // Meter values events
        this.socket.on('meter-values', (data: MeterValuesEvent) => {
            console.log(
                `Received 'meter-values' event: Station ${data.stationId}, Connector ${data.connectorId}`,
            );
            this.notifyListeners('meter-values', data);
        });

        // Error handling for all events
        this.socket.on('error', (error: Error | string | unknown) => {
            console.error('WebSocket error event:', error);
            toast.error('WebSocket Error', {
                description: 'Error in real-time connection. Some updates may be delayed.',
            });
        });
    }

    // Notify all listeners for a specific event
    private notifyListeners<T>(eventName: string, data: T): void {
        if (this.listeners.has(eventName)) {
            this.listeners.get(eventName)?.forEach((callback) => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${eventName} listener:`, error);
                }
            });
        }
    }
}

export default RealTimeService.getInstance();
