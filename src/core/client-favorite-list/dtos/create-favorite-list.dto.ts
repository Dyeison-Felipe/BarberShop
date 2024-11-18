import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFavoriteListDto {
  @IsString()
  @IsNotEmpty()
  barberShopId: string;
}
