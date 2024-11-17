import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { CreateOpeningHoursDto } from './create-opening-hours.dto.js';

export class UpdateOpeningHoursDto extends CreateOpeningHoursDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class UpdateOpeningHoursArrayDto {
  @IsArray()
  weekdays: UpdateOpeningHoursDto[];
}
