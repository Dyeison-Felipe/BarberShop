import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateOpeningHoursDto {
  @IsString()
  @IsNotEmpty()
  weekday: string;

  @IsString()
  @IsNotEmpty()
  start: string;

  @IsString()
  @IsNotEmpty()
  end: string;

  @IsString()
  @IsNotEmpty()
  barberShopId: string;
}

export class DeleteOpeningHours {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class CreateOpeningHoursDtoArray {
  @IsArray()
  created: CreateOpeningHoursDto[];

  @IsArray()
  deleted: DeleteOpeningHours[];
}
