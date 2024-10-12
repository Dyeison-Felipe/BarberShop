import { BarberService } from '../entities/barber-service.entity.js';

export interface BarberServiceRepository {
  save(barberService: BarberService): Promise<BarberService | null>;
}
