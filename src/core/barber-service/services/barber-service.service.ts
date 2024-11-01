import {
  PaginationInput,
  PaginationOutput,
} from '../../../shared/repositories/pagination.repository.js';
import { ServiceList } from '../repositories/barber-service.repository.js';

export type CreateBarberServiceInput = {
  name: string;
  price: number;
  duration: number;
  barberShopId: string;
};

export type BarberServiceOutput = {
  id: string;
  name: string;
  price: number;
  duration: number;
  barberShopId: string;
};

export interface BarberServiceService {
  getBarberShopServiceId(barberShopId: string): Promise<BarberServiceOutput[]>;
  createBarberService(
    createBarberServiceInput: CreateBarberServiceInput,
  ): Promise<BarberServiceOutput>;
}
