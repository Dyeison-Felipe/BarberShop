import { bucket } from '../../../../shared/repositories/firebase/config.js';
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
  UpdateBarberShopInput,
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
    const barberShopEntity = BarberShop.createBarberShop({
      ...createbarberShopInput,
      // TODO Colocar o ID do cliente logado
      clientId: '',
    });
    console.log(
      '🚀 ~ BarberShopServiceImpl ~ barberShopEntity:',
      barberShopEntity,
    );
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
    console.log(
      '🚀 ~ ClientServiceImpl ~ updateClient ~ foundBarberShop:',
      foundBarberShop,
    );

    if (!foundBarberShop) {
      throw new Error('Cliente não encontrado');
    }

    let photoUrl: string | undefined = undefined;

    console.log(
      '🚀 ~ BarberShopServiceImpl ~ updateBarberShopInput.photo:',
      updateBarberShopInput.photo,
    );
    if (updateBarberShopInput.photo) {
      const url = foundBarberShop.photoUrl;
      console.log('🚀 ~ BarberShopServiceImpl ~ url:', url);

      const currentFileName = url?.split('barber-shop%2F')[1] ?? null;

      photoUrl = await this.uploadBarberShopPhoto(
        updateBarberShopInput.photo,
        currentFileName,
      );
    }
    console.log('🚀 ~ BarberShopServiceImpl ~ photoUrl:', photoUrl);

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

  private async uploadBarberShopPhoto(
    photo: Express.Multer.File,
    currentName: string | null,
  ) {
    console.log('🚀 ~ BarberShopServiceImpl ~ currentName:', currentName);
    const fileName = currentName ?? `${Date.now()}_${photo.originalname}`;
    const filePath = `barber-shop/${fileName}`;
    const file = bucket.file(`barber-shop/${fileName}`);
    await file.save(photo.buffer, {
      metadata: {
        contentType: photo.mimetype,
      },
    });

    await file.makePublic();
    const url = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(filePath)}?alt=media`;

    return url;
  }
}
