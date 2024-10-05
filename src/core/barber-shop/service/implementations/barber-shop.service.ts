import {
  PaginationInput,
  PaginationOutput,
} from '../../../../shared/repositories/pagination.repository.js';
import { BarberShop } from '../../entities/barber-shop.entity.js';
import {
  BarberShopRepository,
  BarberShopList,
} from '../../repositories/barber-shop.repository.js';
import {
  BarberShopService,
  CreateBarberShopInput,
  BarberShopOutput,
} from '../barber-shop.service.js';

export class BarberShopServiceImpl implements BarberShopService {
  constructor(private readonly barberShopRepository: BarberShopRepository) {}

  async getBarbersShop(
    pagination: PaginationInput,
  ): Promise<PaginationOutput<BarberShopList>> {
    const barbersShop = await this.barberShopRepository.getBarbersShop(
      pagination,
    );

    return barbersShop;
  }
  async createBarberShop(
    createbarberShopInput: CreateBarberShopInput,
  ): Promise<BarberShopOutput> {
    const barberShopEntity = BarberShop.createBarberShop(createbarberShopInput);
    const createdBarberShop = await this.barberShopRepository.createBarberShop(
      barberShopEntity,
    );

    if (!createdBarberShop) {
      throw new Error('Erro ao criar usuário');
    }

    const barberShopOutput: BarberShopOutput = {
      id: createdBarberShop.id,
      name: createdBarberShop.name,
      cnpj: createdBarberShop.cnpj,
      cep: createdBarberShop.cep,
      number: createdBarberShop.number,
      neighborhood: createdBarberShop.neighborhood,
      city: createdBarberShop.city,
      state: createdBarberShop.state,
      phone: createdBarberShop.phone,
      rating: createdBarberShop.rating,
    };

    return barberShopOutput;
  }
}
