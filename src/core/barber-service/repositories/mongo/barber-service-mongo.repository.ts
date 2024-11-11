import { Document } from 'mongoose';
import { NullableOptional } from '../../../../shared/utils/types.js';
import {
  BarberService,
  BarberServiceProps,
} from '../../entities/barber-service.entity.js';
import { BarberServiceSchema } from '../../schema/mongo/appointment.schema.js';
import { BarberServiceRepository } from '../barber-service.repository.js';

export class BarberServiceMongoRepository implements BarberServiceRepository {
  async getBarberShopServiceId(
    barberShopId: string,
  ): Promise<BarberService[] | null> {
    const documents = await BarberServiceSchema.find({ barberShopId });

    if (!documents) {
      return null;
    }

    const services: BarberService[] = documents.map((document) =>
      this.documentToEntity(document),
    );

    return services;
  }

  async getBarberServiceById(
    barberServiceId: string,
  ): Promise<BarberService | null> {
    const document = await BarberServiceSchema.findById(barberServiceId);

    if (!document) {
      return null;
    }

    const barberServiceEntity = this.documentToEntity(document);

    return barberServiceEntity;
  }

  async save(barberService: BarberService): Promise<BarberService | null> {
    try {
      const { id, ...json } = barberService.toObject();
      const barberServiceSchema = new BarberServiceSchema({ _id: id, ...json });
      await barberServiceSchema.save();
      return barberService;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateBarberService(
    barberService: BarberService,
  ): Promise<BarberService | null> {
    try {
      const { id, ...json } = barberService.toObject();
      const barberServiceSchema = new BarberServiceSchema({ _id: id, ...json });
      barberServiceSchema.isNew = false;
      await barberServiceSchema.save();
      return barberService;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteBarberService(barberServiceId: string): Promise<boolean> {
    try {
      const result = await BarberServiceSchema.deleteOne({
        _id: barberServiceId,
      });

      if (result.deletedCount === 0) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  private documentToEntity(
    document: Document & NullableOptional<BarberServiceProps>,
  ): BarberService {
    const barberServiceProps: BarberServiceProps = {
      id: document.id,
      barberShopId: document.barberShopId!,
      duration: document.duration!,
      name: document.name!,
      price: document.price!,
    };

    const barberServiceEntity = new BarberService(barberServiceProps);

    return barberServiceEntity;
  }
}
