import { PaginationInput, PaginationOutput } from "../../../shared/repositories/pagination.repository";
import { BarberShopService } from "../service/barber-shop.service";
import { ReturnBarberShopDto } from "./dto/return-barber-shop.dto";

export class BarberShopController {
  
  constructor(private readonly barberShopService: BarberShopService) {}

  async getBarberShop(pagination: PaginationInput): Promise<PaginationOutput<ReturnBarberShopDto>> {
    return await this.barberShopService.getBarbersShop(pagination);
  }
}