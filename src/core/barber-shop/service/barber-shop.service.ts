import { PaginationInput, PaginationOutput } from "../../../shared/repositories/pagination.repository";
import { BarberShop } from "../entities/barber-shop.entity";
import { BarberShopList, BarberShopRepository } from "../repositories/barber-shop.repository";

export type BarberShopInput = {
  name: string;
  cnpj: number;
  cep: number;
  number: number;
  neighborhood: string;
  city: string;
  state: string;
  phone: number;
}

export type CreateBarberShopInput = BarberShopInput;

export type UpdateBarberShopInput = BarberShopInput & {id: number};

export type BarberShopOutput = {
  id: string;
  name: string;
  cnpj: number;
  cep: number;
  number: number;
  neighborhood: string;
  city: string;
  state: string;
  phone: number;
  rating: number;
}

export interface BarberShopService {
  getBarbersShop(pagination: PaginationInput): Promise<PaginationOutput<BarberShopList>>;
  createBarberShop(barberShop: BarberShop): Promise<BarberShopOutput>;
}
