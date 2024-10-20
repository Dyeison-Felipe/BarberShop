import { CreateOpeningHoursDto } from "./create-opening-hours.dto.js";

export class ReturnCreateOpeningHoursDto {
  weekdays: Weekdays[];
}

class Weekdays extends CreateOpeningHoursDto {
  id: string;
}