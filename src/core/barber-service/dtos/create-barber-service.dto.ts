import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateBarberServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  price: number;

  @IsInt()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsNotEmpty()
  barberShopId: string;
}
