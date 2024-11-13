import { Document } from 'mongoose';
import { NullableOptional } from '../../../../shared/utils/types.js';
import {
  OpeningHours,
  OpeningHoursProps,
} from '../../entities/barber-opening-hour.entity.js';
import { BarberOpeningHoursSchema } from '../../schema/mongo/barber-opening-hours.schema.js';
import { BarberOpeningHoursRepository } from '../barber-opening-hour.repository.js';

export class BarberOpeningHoursMongoRepository
  implements BarberOpeningHoursRepository
{
  async getAllByBarberShopId(barberShopId: string): Promise<OpeningHours[]> {
    const documents = await BarberOpeningHoursSchema.find({ barberShopId });

    const openingHours: OpeningHours[] = documents.map((document) =>
      this.documentToEntity(document),
    );

    return openingHours;
  }

  async getOpeningHourById(
    openingHourId: string,
  ): Promise<OpeningHours | null> {
    const document = await BarberOpeningHoursSchema.findById(openingHourId);

    if (!document) {
      return null;
    }

    const opeOpeningHoursEntity = this.documentToEntity(document);

    return opeOpeningHoursEntity;
  }

  async createOpeningHours(
    openingHours: OpeningHours,
  ): Promise<OpeningHours | null> {
    try {
      const { id, ...json } = openingHours.toObject();
      const openingHoursSchema = new BarberOpeningHoursSchema({
        _id: id,
        ...json,
      });
      await openingHoursSchema.save();
      return openingHours;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateManyOpeningHours(
    updateOpeningHours: OpeningHours[],
  ): Promise<OpeningHours[] | null> {
    try {
      await Promise.all(
        updateOpeningHours.map((updateOpeningHour) => {
          const { id, ...openingHoursData } = updateOpeningHour.toObject();
          const openingHoursSchema = new BarberOpeningHoursSchema({
            _id: id,
            ...openingHoursData,
          });
          return openingHoursSchema.save();
        }),
      );

      return updateOpeningHours;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteOpeningHours(id: string): Promise<boolean> {
    try {
      const result = await BarberOpeningHoursSchema.deleteOne({
        _id: id,
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
    document: Document & NullableOptional<OpeningHoursProps>,
  ): OpeningHours {
    const openingHoursProps: OpeningHoursProps = {
      id: document.id,
      barberShopId: document.barberShopId!,
      end: document.end!,
      start: document.start!,
      weekday: document.weekday!,
    };

    const openingHoursEntity = new OpeningHours(openingHoursProps);

    return openingHoursEntity;
  }
}
