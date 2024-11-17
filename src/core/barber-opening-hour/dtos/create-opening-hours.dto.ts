export class CreateOpeningHoursDto {
  weekday: string;
  start: string;
  end: string;
  barberShopId: string;
}

export class DeleteOpeningHours {
  id: string;
}

export class CreateOpeningHoursDtoArray {
  created: CreateOpeningHoursDto[];
  deleted: DeleteOpeningHours[];
}
