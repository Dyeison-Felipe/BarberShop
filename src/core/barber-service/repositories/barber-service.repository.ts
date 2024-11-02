import {
  PaginationInput,
  PaginationOutput,
} from '../../../shared/repositories/pagination.repository.js';
import { BarberService } from '../entities/barber-service.entity.js';

export type ServiceList = {
  id: string;
  baberShopId: string;
  name: string;
  price: string;
  duration: string;
};

export interface BarberServiceRepository {
  getBarberShopServiceId(barberShopId: string): Promise<BarberService[] | null>;

  save(barberService: BarberService): Promise<BarberService | null>;

  getBarberServiceById(barberServiceId: string): Promise<BarberService | null>;

  updateBarberService(
    barberService: BarberService,
  ): Promise<BarberService | null>;
}
