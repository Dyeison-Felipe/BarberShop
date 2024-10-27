import { CreateOpeningHoursDto } from "./create-opening-hours.dto.js";

export class UpdateOpeningHoursDto extends CreateOpeningHoursDto{
  id: string
}

export class UpdateOpeningHoursArrayDto {
  weekdays: UpdateOpeningHoursDto[];
}