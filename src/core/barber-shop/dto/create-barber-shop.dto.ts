import { IsInt, IsString } from "class-validator";

// TODO Adicionar rua
export class CreateBarberShopDto{
  @IsString()
  name: string;

  @IsInt()
  cnpj: number;

  @IsInt()
  cep: number;

  @IsInt()
  number: number;

  @IsString()
  neighborhood: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsInt()
  phone: number;
}
