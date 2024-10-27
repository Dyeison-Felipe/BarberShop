export class CreateOpeningHoursDto {
  weekday: string;
  start: string;
  end: string;
  barberShopId: string;
}

export class CreateOpeningHoursDtoArray {
  weekdays: CreateOpeningHoursDto[];
}