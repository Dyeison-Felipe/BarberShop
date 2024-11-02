import { Response } from 'express';
import {
  PaginationInput,
  PaginationOutput,
} from '../../../../shared/repositories/pagination.repository.js';
import { ImageService } from '../../../../shared/services/image/image.service.js';
import { BarberShop } from '../../entities/barber-shop.entity.js';
import {
  BarberShopRepository,
  BarberShopList,
} from '../../repositories/barber-shop.repository.js';
import {
  BarberShopService,
  CreateBarberShopInput,
  BarberShopOutput,
  UpdateBarberShopInput,
  BarberShopProfileInput,
} from '../barber-shop.service.js';

export class BarberShopServiceImpl implements BarberShopService {
  constructor(
    private readonly barberShopRepository: BarberShopRepository,
    private readonly imageService: ImageService,
  ) {}

  async getBarbersShopProfile({
    id,
  }: BarberShopProfileInput): Promise<BarberShopOutput> {
    const barberShop = await this.barberShopRepository.getBarberShopById(id);

    if (!barberShop) {
      throw new Error('Barbearia não encontrada');
    }

    const barberShopOutput = barberShop.toObject();

    return barberShopOutput;
  }

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
    const findCnpj = await this.barberShopRepository.getBarberShopByCnpj(
      createbarberShopInput.cnpj,
    );

    if (findCnpj) {
      throw new Error(`CNPJ ${createbarberShopInput.cnpj} já esta em uso`);
    }

    const barberShopEntity = BarberShop.createBarberShop({
      ...createbarberShopInput,
      // TODO Colocar o ID do cliente logado
      clientId: '',
    });
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
      street: createdBarberShop.street,
      neighborhood: createdBarberShop.neighborhood,
      city: createdBarberShop.city,
      state: createdBarberShop.state,
      phone: createdBarberShop.phone,
      rating: createdBarberShop.rating,
      clientId: createdBarberShop.clientId,
    };

    return barberShopOutput;
  }

  async updateBarberShop(
    updateBarberShopInput: UpdateBarberShopInput,
  ): Promise<BarberShopOutput> {
    const foundBarberShop = await this.barberShopRepository.getBarberShopById(
      updateBarberShopInput.id,
    );

    if (!foundBarberShop) {
      throw new Error('Cliente não encontrado');
    }

    let photoUrl: string | undefined = foundBarberShop.photoUrl ?? '';

    console.log(
      '🚀 ~ BarberShopServiceImpl ~ updateBarberShopInput.photo:',
      updateBarberShopInput.photo,
    );
    if (updateBarberShopInput.photo) {
      const url = foundBarberShop.photoUrl;

      const currentFileName =
        url?.split('barber-shop%2F')[1]?.split('?')[0] ?? null;

      photoUrl = await this.imageService.uploadImage(
        updateBarberShopInput.photo,
        currentFileName,
        'barber-shop',
      );
      console.log('🚀 ~ BarberShopServiceImpl ~ photoUrl:', photoUrl);
    }

    foundBarberShop.updateBarberShop({ ...updateBarberShopInput, photoUrl });
    const updatedBarberShop = await this.barberShopRepository.update(
      foundBarberShop,
    );

    if (!updatedBarberShop) {
      throw new Error('Erro ao atualizar cliente');
    }

    const updateBarberShopOutput: BarberShopOutput = {
      id: updatedBarberShop.id,
      name: updatedBarberShop.name,
      cnpj: updatedBarberShop.cnpj,
      cep: updatedBarberShop.cep,
      street: updatedBarberShop.street,
      number: updatedBarberShop.number,
      neighborhood: updatedBarberShop.neighborhood,
      city: updatedBarberShop.city,
      state: updatedBarberShop.state,
      phone: updatedBarberShop.phone,
      rating: updatedBarberShop.rating,
      clientId: updatedBarberShop.clientId,
      photoUrl: updatedBarberShop.photoUrl,
    };

    return updateBarberShopOutput;
  }

  async deleteBarberShop(id: string): Promise<void> {
    const barberShop = await this.barberShopRepository.getBarberShopById(id);

    if (!barberShop) {
      throw new Error(`Barbeiro com o ID ${id} não foi encontrado`);
    }

    await this.barberShopRepository.deleteBarberShop(id);
  }
}
