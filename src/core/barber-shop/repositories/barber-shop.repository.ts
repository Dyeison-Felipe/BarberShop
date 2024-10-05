import { PaginationInput, PaginationOutput } from "../../../shared/repositories/pagination.repository";
import { BarberShop } from "../entities/barber-shop.entity";

export type BarberShopList = {
  id: string;
  name: string;
  rating: number;
  photoUrl: string
}

export interface BarberShopRepository {
  getBarbersShop(pagination: PaginationInput): Promise<PaginationOutput<BarberShopList>>
  createBarberShop(barberShop: BarberShop): Promise<BarberShop | null>
}