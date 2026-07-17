/**
 * @module coordinator/reservation
 * @description Reservation manager for critical system resources.
 */
import { ExecutionReservation } from './interfaces.js';
export declare class ExecutionReservationManager {
    private reservations;
    reserve(type: 'worker' | 'token' | 'provider' | 'tool' | 'memory' | 'cost', capacity: number, durationMs: number): ExecutionReservation;
    allocate(id: string, amount: number): void;
    release(id: string): void;
    getReservations(): ExecutionReservation[];
    clear(): void;
}
//# sourceMappingURL=reservation.d.ts.map