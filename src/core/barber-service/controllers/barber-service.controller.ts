import {
  Controller,
  Post,
  Body,
} from '../../../shared/decorators/http/request-mapping.decorator.js';
import { CreateBarberServiceDto } from '../dtos/create-barber-service.dto.js';
import { ReturnCreateBarberServiceDto } from '../dtos/return-create-barber-service.dto.js';
import { BarberServiceService } from '../services/barber-service.service.js';

@Controller('/api/barber-service/v1')
export class BarberServiceController {
  constructor(private readonly barberServiceService: BarberServiceService) {}

  @Post()
  async createBarberService(
    @Body() createBarberServiceDto: CreateBarberServiceDto,
  ): Promise<ReturnCreateBarberServiceDto> {
    const barberService = await this.barberServiceService.createBarberService(
      createBarberServiceDto,
    );

    return barberService;
  }
}
