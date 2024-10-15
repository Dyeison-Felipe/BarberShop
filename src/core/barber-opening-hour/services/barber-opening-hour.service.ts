export type OpeningHourOutput = {
  id: string;
  start: string;
  end: string;
};

type WeekdayOutput = {
  name: string;
  openingHours: OpeningHourOutput[];
};

export type ReturnGetBarberOpeningHoursOutput = {
  weekdays: WeekdayOutput[];
};

export interface BarberOpeningHoursService {
  getBarberOpeningHours(
    barberShopId: string,
  ): Promise<ReturnGetBarberOpeningHoursOutput>;
}
