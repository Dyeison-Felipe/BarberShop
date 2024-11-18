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
import { StorageRequestService } from '../../../../shared/storage-request-service/storage-request-service.js';
import { ClientProps } from '../../../client/entities/client.entity.js';
import { Constants } from '../../../../shared/utils/constants.js';
import { ResourceNotFoundError } from '../../../../shared/errors/resource-not-found-error.js';
import { ResourceAlreadyInUseError } from '../../../../shared/errors/resource-already-in-use-error.js';
import { InternalServerError } from '../../../../shared/errors/internal-server-error.js';

// Classe que implementa a interface a fim de realizar a inversão de dependência
export class BarberShopServiceImpl implements BarberShopService {
  constructor(
    private readonly barberShopRepository: BarberShopRepository,
    private readonly imageService: ImageService,
    private readonly storageRequestService: StorageRequestService,
  ) {}

  async getBarberShopByClientId(): Promise<BarberShopOutput | null> {
    const loggedUser = this.storageRequestService.get<ClientProps>(
      Constants.loggedUser,
    );
    console.log(
      '🚀 ~ BarberShopServiceImpl ~ getBarberShopByClientId ~ loggedUser:',
      loggedUser,
    );

    const barberShop = await this.barberShopRepository.getBarberShopByClientId(
      loggedUser!.id,
    );
    console.log(
      '🚀 ~ BarberShopServiceImpl ~ getBarberShopByClientId ~ barberShop:',
      barberShop,
    );

    if (!barberShop) {
      return null;
    }

    const barberShopOutput = barberShop.toJSON();
    return barberShopOutput;
  }

  async getBarbersShopProfile({
    id,
  }: BarberShopProfileInput): Promise<BarberShopOutput> {
    const barberShop = await this.barberShopRepository.getBarberShopById(id);

    if (!barberShop) {
      throw new ResourceNotFoundError('Barbearia não encontrada');
    }

    const barberShopOutput = barberShop.toJSON();

    return barberShopOutput;
  }

  async getBarbersShop(
    pagination: PaginationInput,
    search?: string,
  ): Promise<PaginationOutput<BarberShopList>> {
    const client = this.storageRequestService.get<ClientProps>(
      Constants.loggedUser,
    );

    const barbersShop = await this.barberShopRepository.getBarbersShop(
      pagination,
      search,
      client?.id,
    );

    return barbersShop;
  }

  async createBarberShop(
    createBarberShopInput: CreateBarberShopInput,
  ): Promise<BarberShopOutput> {
    const findCnpj = await this.barberShopRepository.getBarberShopByCnpj(
      createBarberShopInput.cnpj,
    );

    if (findCnpj) {
      throw new ResourceAlreadyInUseError(
        `CNPJ ${createBarberShopInput.cnpj} já esta em uso`,
      );
    }

    const client = this.storageRequestService.get<ClientProps>(
      Constants.loggedUser,
    );

    const barberShopEntity = BarberShop.createBarberShop({
      ...createBarberShopInput,
      clientId: client!.id,
    });
    const createdBarberShop = await this.barberShopRepository.createBarberShop(
      barberShopEntity,
    );

    if (!createdBarberShop) {
      throw new InternalServerError('Erro ao criar usuário');
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
      throw new ResourceNotFoundError('Cliente não encontrado');
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
      throw new InternalServerError('Erro ao atualizar cliente');
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
      throw new ResourceNotFoundError(
        `Barbeiro com o ID ${id} não foi encontrado`,
      );
    }

    await this.barberShopRepository.deleteBarberShop(id);
  }
}
