
export type OpeningHourOutput = {
  id: string;
  start: string;
  end: string;
};

type WeekdayOutput = {
  name: string;
  openingHours: OpeningHourOutput[];
};

export type CreateOpeningHoursInput = {
  weekday: string;
  start: string;
  end: string;
  barberShopId: string;
};

export type CreateOpeningHoursOutput = {
  weekdays: (CreateOpeningHoursInput & {id: string})[];
}

export type ReturnGetBarberOpeningHoursOutput = {
  weekdays: WeekdayOutput[];
};

export interface BarberOpeningHoursService {
  getBarberOpeningHours(
    barberShopId: string
  ): Promise<ReturnGetBarberOpeningHoursOutput>;
  createOpeningHours(createOpeningHoursInput: CreateOpeningHoursInput[]): Promise<CreateOpeningHoursOutput>;
}
