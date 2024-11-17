import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Regex } from '../../../shared/utils/regex.js';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  @Matches(Regex.email, { message: 'Invalid email' })
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(Regex.letterUpperCase)
  @Matches(Regex.number)
  @Matches(Regex.specialCharacter)
  password: string;
}
