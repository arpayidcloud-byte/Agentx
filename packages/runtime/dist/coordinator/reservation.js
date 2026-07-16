/**
 * @module coordinator/reservation
 * @description Reservation manager for critical system resources.
 */
import { CoordinatorReservationError } from './errors.js';
export class ExecutionReservationManager {
    reservations = new Map();
    reserve(type, capacity, durationMs) {
        const expiresAt = new Date(Date.now() + durationMs);
        const reservation = {
            id: `reserve-${type}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
            type,
            capacity,
            used: 0,
            expiresAt,
        };
        this.reservations.set(reservation.id, reservation);
        return reservation;
    }
    allocate(id, amount) {
        const res = this.reservations.get(id);
        if (!res) {
            throw new CoordinatorReservationError('Reservation not found', 'reservation');
        }
        if (res.expiresAt.getTime() < Date.now()) {
            throw new CoordinatorReservationError('Reservation expired', 'reservation');
        }
        if (res.used + amount > res.capacity) {
            throw new CoordinatorReservationError('Exceeds reservation capacity', 'reservation');
        }
        res.used += amount;
    }
    release(id) {
        this.reservations.delete(id);
    }
    getReservations() {
        // Expire old reservations
        const now = Date.now();
        for (const [id, res] of this.reservations.entries()) {
            if (res.expiresAt.getTime() < now) {
                this.reservations.delete(id);
            }
        }
        return Array.from(this.reservations.values());
    }
    clear() {
        this.reservations.clear();
    }
}
//# sourceMappingURL=reservation.js.map