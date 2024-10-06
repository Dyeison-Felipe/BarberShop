import { Request, Response } from 'express';
import {
  Controller,
  Get,
} from '../../../shared/decorators/http/request-mapping.decorator.js';
import {
  PaginationInput,
  PaginationOutput,
} from '../../../shared/repositories/pagination.repository.js';
import { BarberShopService } from '../service/barber-shop.service.js';
import { ReturnBarberShopDto } from './dto/return-barber-shop.dto.js';
import { Query } from '../../../shared/decorators/http/route-param.decorator.js';

@Controller('/api/barber-shop/v1')
export class BarberShopController {
  constructor(private readonly barberShopService: BarberShopService) {}

  @Get()
  async getBarberShop(
    // req: Request,
    // res: Response,
    @Query('limit') limit: string,
    @Query('page') page: string,
    // pagination: PaginationInput,
  ): Promise<PaginationOutput<ReturnBarberShopDto>> {
    console.log('🚀 ~ BarberShopController ~ limit:', limit);
    console.log('🚀 ~ BarberShopController ~ page:', page);
    const pagination: PaginationInput = {
      limit: +(limit ?? 24),
      page: +(page ?? 1),
      // limit: +(req.query.limit ?? 24),
      // page: +(req.query.page ?? 1),
    };
    const result = await this.barberShopService.getBarbersShop(pagination);
    // res.status(200).send(result);
    return result;
  }
}
