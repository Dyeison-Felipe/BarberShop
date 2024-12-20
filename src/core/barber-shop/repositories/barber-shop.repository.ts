import {
  PaginationInput,
  PaginationOutput,
} from '../../../shared/repositories/pagination.repository.js';
import { BarberShop } from '../entities/barber-shop.entity.js';

export type BarberShopList = {
  id: string;
  name: string;
  rating: number;
  photoUrl: string;
};

export interface BarberShopRepository {
  getBarbersShop(
    pagination: PaginationInput,
    search?: string,
    clientId?: string,
  ): Promise<PaginationOutput<BarberShopList>>;

  getBarberShopByClientId(id: string): Promise<BarberShop | null>;

  getBarberShopById(clientId: string): Promise<BarberShop | null>;

  getBarberShopByCnpj(cnpj: string): Promise<BarberShop | null>;

  createBarberShop(barberShop: BarberShop): Promise<BarberShop | null>;

  update(barberShop: BarberShop): Promise<BarberShop | null>;

  deleteBarberShop(id: string): Promise<boolean>;
}
