import { IsInt, IsString } from "class-validator";

export class CreateClientDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsInt()
  phoneNumber: string;
}