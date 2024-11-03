import {
  PaginationInput,
  PaginationOutput,
} from '../../../shared/repositories/pagination.repository.js';
import { Image } from '../../../shared/services/image/image.service.js';
import { BarberShopList } from '../repositories/barber-shop.repository.js';

export type BarberShopInput = {
  name: string;
  cnpj: string;
  cep: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  phone: string;
  street: string;
};

export type CreateBarberShopInput = BarberShopInput;

export type UpdateBarberShopInput = Partial<BarberShopInput> & {
  id: string;
  photo?: Image | null;
};

export type BarberShopOutput = {
  id: string;
  name: string;
  cnpj: string;
  cep: string;
  number: string;
  neighborhood: string;
  city: string;
  street: string;
  state: string;
  phone: string;
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
    search?: string,
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
