class OpeningHourDto {
  start: string;
  end: string;
}

class WeekdayDto {
  name: string;
  openingHours: OpeningHourDto[];
}

export class ReturnGetBarberOpeningHoursDto {
  weekdays: WeekdayDto[];
}
