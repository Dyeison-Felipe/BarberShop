import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  barberServiceId: string;

  @IsString()
  @IsNotEmpty()
  barberShopId: string;

  @IsDate()
  @IsNotEmpty()
  date: Date;
}
