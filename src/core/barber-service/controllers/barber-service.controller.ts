import { Response } from 'express';
import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Middleware,
  Valid,
} from '../../../shared/decorators/http/request-mapping.decorator.js';
import { CreateBarberServiceDto } from '../dtos/create-barber-service.dto.js';
import { ReturnCreateBarberServiceDto } from '../dtos/return-create-barber-service.dto.js';
import { ReturnUpdateBarberServiceDto } from '../dtos/return-update-barber-service.dto.js';
import { UpdateBarberServiceDto } from '../dtos/update-barber-service.dto.js';
import {
  BarberServiceOutput,
  BarberServiceService,
} from '../services/barber-service.service.js';
import { Param } from '../../../shared/decorators/http/route-param.decorator.js';

@Controller('/api/barber-service/v1')
export class BarberServiceController {
  constructor(private readonly barberServiceService: BarberServiceService) {}

  @Get('/barber-shop/:barberShopId')
  async getBarberShopService(
    @Param('barberShopId') barberShopId: string,
  ): Promise<BarberServiceOutput[]> {
    const barberService =
      await this.barberServiceService.getBarberShopServiceId(barberShopId);

    return barberService;
  }

  @Middleware('AuthMiddleware')
  @Post()
  async createBarberService(
    @Valid(CreateBarberServiceDto)
    @Body()
    createBarberServiceDto: CreateBarberServiceDto,
  ): Promise<ReturnCreateBarberServiceDto> {
    const barberService = await this.barberServiceService.createBarberService(
      createBarberServiceDto,
    );

    return barberService;
  }

  @Middleware('AuthMiddleware')
  @Put('/:id')
  async updateBarberService(
    @Param('id') id: string,
    @Valid(UpdateBarberServiceDto)
    @Body()
    updateBarberShopDto: UpdateBarberServiceDto,
  ): Promise<ReturnUpdateBarberServiceDto> {
    const barberShop = await this.barberServiceService.updateBarberService({
      id,
      ...updateBarberShopDto,
    });

    return barberShop;
  }

  @Middleware('AuthMiddleware')
  @Delete('/:id')
  async deleteBarberShop(
    @Param('id') id: string,
    res: Response,
  ): Promise<void> {
    try {
      await this.barberServiceService.deleteBarberService(id);
      res.status(200).send();
    } catch (error) {
      res.status(404).json({ message: 'Erro ao deletar' });
    }
  }
}
