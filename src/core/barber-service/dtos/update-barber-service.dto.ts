import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class UpdateBarberServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPositive()
  @IsNotEmpty()
  price: number;

  @IsPositive()
  @IsNotEmpty()
  duration: number;
}
