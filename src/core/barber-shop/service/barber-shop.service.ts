import {
  PaginationInput,
  PaginationOutput,
} from '../../../shared/repositories/pagination.repository.js';
import { Image } from '../../../shared/services/image/image.service.js';
import { BarberShopList } from '../repositories/barber-shop.repository.js';

export type BarberShopInput = {
  name: string;
  cnpj: number;
  cep: number;
  number: number;
  neighborhood: string;
  city: string;
  state: string;
  phone: number;
};

export type CreateBarberShopInput = BarberShopInput;

export type UpdateBarberShopInput = Partial<BarberShopInput> & {
  id: string;
  photo?: Image | null;
};

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
  clientId: string;
  photoUrl?: string | null;
};

export type BarberShopProfileInput = {
  id: string;
};

export interface BarberShopService {
  getBarbersShop(
    pagination: PaginationInput,
  ): Promise<PaginationOutput<BarberShopList>>;
  getBarbersShopProfile({
    id,
  }: BarberShopProfileInput): Promise<BarberShopOutput>;
  createBarberShop(
    createBarberShopInput: CreateBarberShopInput,
  ): Promise<BarberShopOutput>;
  updateBarberShop(
    updateBarberShopInput: UpdateBarberShopInput,
  ): Promise<BarberShopOutput>;
  deleteBarberShop(id: string): Promise<void>;
}
