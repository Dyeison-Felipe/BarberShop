import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
} from '../../../shared/decorators/http/request-mapping.decorator.js';
import { CreateBarberServiceDto } from '../dtos/create-barber-service.dto.js';
import { ReturnCreateBarberServiceDto } from '../dtos/return-create-barber-service.dto.js';
import { ReturnUpdateBarberServiceDto } from '../dtos/return-update-barber-service.dto.js';
import { UpdateBarberServiceDto } from '../dtos/update-barber-service.dto.js';
import {
  BarberServiceOutput,
  BarberServiceService,
} from '../services/barber-service.service.js';

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

  @Post()
  async createBarberService(
    @Body() createBarberServiceDto: CreateBarberServiceDto,
  ): Promise<ReturnCreateBarberServiceDto> {
    const barberService = await this.barberServiceService.createBarberService(
      createBarberServiceDto,
    );

    return barberService;
  }

  @Put('/:id')
  async updateBarberService(
    @Param('id') id: string,
    @Body() updateBarberShopDto: UpdateBarberServiceDto,
  ): Promise<ReturnUpdateBarberServiceDto> {
    const barberShop = await this.barberServiceService.updateBarberService({
      id,
      ...updateBarberShopDto,
    });

    return barberShop;
  }
}
