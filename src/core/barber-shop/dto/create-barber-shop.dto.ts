import { IsInt, IsString } from 'class-validator';

export class CreateBarberShopDto {
  @IsString()
  name: string;

  @IsString()
  cnpj: string;

  @IsString()
  cep: string;

  @IsString()
  number: string;

  @IsString()
  neighborhood: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  phone: string;

  @IsString()
  street: string;
}
