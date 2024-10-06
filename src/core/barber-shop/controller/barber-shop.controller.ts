import { Request, Response } from 'express';
import { Get } from '../../../shared/decorators/http/request-mapping.decorator.js';
import {
  PaginationInput,
  PaginationOutput,
} from '../../../shared/repositories/pagination.repository.js';
import { BarberShopService } from '../service/barber-shop.service.js';
import { ReturnBarberShopDto } from './dto/return-barber-shop.dto.js';

export class BarberShopController {
  constructor(private readonly barberShopService: BarberShopService) {}

  @Get('/api/barber-shop/v1')
  async getBarberShop(
    req: Request,
    res: Response,
    // pagination: PaginationInput,
  ): Promise<PaginationOutput<ReturnBarberShopDto>> {
    const pagination: PaginationInput = {
      limit: +(req.query.limit ?? 24),
      page: +(req.query.page ?? 1),
    };
    const result = await this.barberShopService.getBarbersShop(pagination);
    console.log('🚀 ~ app.get ~ result:', result);
    res.status(200).json(result);
    return result;
  }
}
