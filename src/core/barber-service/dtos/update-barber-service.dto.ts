import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateBarberServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  price: number;

  @IsInt()
  @IsNotEmpty()
  duration: number;
}
