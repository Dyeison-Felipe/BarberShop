import { Request, Response } from 'express';
import {
  Body,
  Controller,
  Get,
  Post,
} from '../../../shared/decorators/http/request-mapping.decorator.js';
import {
  PaginationInput,
  PaginationOutput,
} from '../../../shared/repositories/pagination.repository.js';
import { BarberShopService } from '../service/barber-shop.service.js';
import { ReturnGetBarberShopDto } from './dto/return-get-barber-shop.dto.js';
import { Query } from '../../../shared/decorators/http/route-param.decorator.js';
import { CreateBarberShopDto } from './dto/create-barber-shop.dto.js';
import { ReturnCreateBarberShopDto } from './dto/return-create-barber-shop.dto.js';

@Controller('/api/barber-shop/v1')
export class BarberShopController {
  constructor(private readonly barberShopService: BarberShopService) {}

  @Get()
  async getBarberShop(
    @Query('limit') limit: string,
    @Query('page') page: string,
  ): Promise<PaginationOutput<ReturnGetBarberShopDto>> {
    const pagination: PaginationInput = {
      limit: +(limit ?? 24),
      page: +(page ?? 1),
    };
    const result = await this.barberShopService.getBarbersShop(pagination);
    return result;
  }

  @Post()
  async createBarberShop(
    @Body() createBarberShopDto: CreateBarberShopDto,
  ): Promise<ReturnCreateBarberShopDto | null> {
    const barberShop = await this.barberShopService.createBarberShop(
      createBarberShopDto,
    );

    return barberShop;
  }
}
