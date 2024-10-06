import { IsInt, IsString } from "class-validator";

export class CreateClientDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsInt()
  phoneNumber: number;
}