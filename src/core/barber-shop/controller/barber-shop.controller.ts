import {
  PaginationInput,
  PaginationOutput,
} from '../../../shared/repositories/pagination.repository.js';
import { BarberShopService } from '../service/barber-shop.service.js';
import { ReturnBarberShopDto } from './dto/return-barber-shop.dto.js';

export class BarberShopController {
  constructor(private readonly barberShopService: BarberShopService) {}

  async getBarberShop(
    pagination: PaginationInput,
  ): Promise<PaginationOutput<ReturnBarberShopDto>> {
    return await this.barberShopService.getBarbersShop(pagination);
  }
}
