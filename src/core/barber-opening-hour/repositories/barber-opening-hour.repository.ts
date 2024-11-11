import { OpeningHours } from '../entities/barber-opening-hour.entity.js';

export type GetAllBarberOpeningHours = {
  id: string;
  weekday: string;
  start: string;
  end: string;
  barberShopId: string;
};

export interface BarberOpeningHoursRepository {
  getAllByBarberShopId(barberShopId: string): Promise<OpeningHours[]>;

  getOpeningHourById(openingHourId: string): Promise<OpeningHours | null>;

  createOpeningHours(openingHours: OpeningHours): Promise<OpeningHours | null>;

  updateManyOpeningHours(
    updateOpeningHours: OpeningHours[],
  ): Promise<OpeningHours[] | null>;

  deleteOpeningHours(id: string): Promise<boolean>;
}
