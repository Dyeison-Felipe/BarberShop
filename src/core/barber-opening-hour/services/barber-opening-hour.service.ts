export type OpeningHourOutput = {
  id: string;
  start: string;
  end: string;
};

type WeekdayOutput = {
  name: string;
  openingHours: OpeningHourOutput[];
};

export type CreateOpeningHoursInput = UpsertOpeningHours;

export type UpdateOpeningHours = UpsertOpeningHours & { id: string };

export type UpsertOpeningHours = {
  weekday: string;
  start: string;
  end: string;
  barberShopId: string;
};

export type UpsertOpeningHoursOutput = {
  weekdays: (CreateOpeningHoursInput & { id: string })[];
};

export type ReturnGetBarberOpeningHoursOutput = {
  weekdays: WeekdayOutput[];
};

export interface BarberOpeningHoursService {
  getBarberOpeningHours(
    barberShopId: string
  ): Promise<ReturnGetBarberOpeningHoursOutput>;
  createOpeningHours(
    createOpeningHoursInput: CreateOpeningHoursInput[]
  ): Promise<UpsertOpeningHoursOutput>;
  updateOpeningHours(
    updateOpeningHours: UpdateOpeningHours[]
  ): Promise<UpsertOpeningHoursOutput>;
  deleteOpeningHours(id: string): Promise<void>;
}
