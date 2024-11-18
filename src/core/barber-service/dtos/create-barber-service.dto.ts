import { IsString, IsNotEmpty, IsInt, IsPositive } from 'class-validator';

export class CreateBarberServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPositive()
  @IsNotEmpty()
  price: number;

  @IsPositive()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsNotEmpty()
  barberShopId: string;
}
