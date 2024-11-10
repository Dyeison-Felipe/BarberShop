import { Document } from 'mongoose';
import {
  PaginationInput,
  PaginationOutput,
} from '../../../../shared/repositories/pagination.repository.js';
import {
  BarberShop,
  BarberShopProps,
} from '../../entities/barber-shop.entity.js';
import { BarberShopSchema } from '../../schema/mongo/barber-shop.schema.js';
import {
  BarberShopList,
  BarberShopRepository,
} from '../barber-shop.repository.js';
import { MongoPagination } from '../../../../shared/repositories/mongo/pagination.js';

export type NullableOptional<T> = {
  [P in keyof T]?: T[P] | null;
};

export class BarberShopMongoRepository implements BarberShopRepository {
  async getBarbersShop(
    pagination: PaginationInput,
    search?: string,
  ): Promise<PaginationOutput<BarberShopList>> {
    const filter = search
      ? { name: { $regex: search, $options: 'i' } } // Assuming `name` field for the search
      : {};
    const query = BarberShopSchema.find(filter);

    const { documents, meta } = await MongoPagination.paginate(
      query,
      pagination,
    );

    const barberShopList: BarberShopList[] = documents.map((document) => ({
      id: document.id,
      name: document.name,
      photoUrl: document.photoUrl,
      rating: document.rating,
    }));

    return {
      data: barberShopList,
      meta,
    };
  }

  async getBarberShopByClientId(clientId: string): Promise<BarberShop | null> {
    const document = await BarberShopSchema.findOne({ clientId });

    if (!document) {
      return null;
    }

    const barberShopEntity = this.documentToEntity(document);

    return barberShopEntity;
  }

  async getBarberShopById(id: string): Promise<BarberShop | null> {
    const document = await BarberShopSchema.findById(id);

    if (!document) {
      return null;
    }

    const barberShopEntity = this.documentToEntity(document);

    return barberShopEntity;
  }

  async getBarberShopByCnpj(cnpj: string): Promise<BarberShop | null> {
    const document = await BarberShopSchema.findOne({ cnpj });

    if (!document) {
      return null;
    }

    const barberShopEntity = this.documentToEntity(document);

    return barberShopEntity;
  }

  async createBarberShop(barberShop: BarberShop): Promise<BarberShop | null> {
    try {
      const { id, ...json } = barberShop.toObject();
      const barberShopSchema = new BarberShopSchema({ _id: id, ...json });
      await barberShopSchema.save();
      return barberShop;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async update(barberShop: BarberShop): Promise<BarberShop | null> {
    try {
      const { id, ...json } = barberShop.toObject();
      const barberShopSchema = new BarberShopSchema({ _id: id, ...json });
      barberShopSchema.isNew = false;
      await barberShopSchema.save();
      return barberShop;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteBarberShop(id: string): Promise<boolean> {
    try {
      const result = await BarberShopSchema.deleteOne({ _id: id });

      if (result.deletedCount === 0) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  private documentToEntity(
    document: Document & NullableOptional<BarberShopProps>,
  ): BarberShop {
    const barberShopProps: BarberShopProps = {
      id: document.id,
      name: document.name!,
      cnpj: document.cnpj!,
      cep: document.cep!,
      number: document.number!,
      neighborhood: document.neighborhood!,
      city: document.city!,
      street: document.street!,
      state: document.state!,
      phone: document.phone!,
      rating: document.rating!,
      clientId: document.clientId!,
    };

    const barberShopEntity = new BarberShop(barberShopProps);

    return barberShopEntity;
  }
}
