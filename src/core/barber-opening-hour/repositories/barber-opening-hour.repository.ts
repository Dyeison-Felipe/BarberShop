import { OpeningHours } from "../entities/barber-opening-hour.entity.js";

export type GetAllBarberOpeningHours = {
  id: string;
  weekday: string;
  start: string;
  end: string;
  barberShopId: string;
};

export interface BarberOpeningHoursRepository {
  getAllByBarberShopId(
    barberShopId: string,
  ): Promise<GetAllBarberOpeningHours[]>;
  createOpeningHours(openingHours: OpeningHours): Promise<OpeningHours | null>;
}
